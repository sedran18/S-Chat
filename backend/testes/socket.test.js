const request = require('supertest');
const { io: Client } = require('socket.io-client');
const { server, app } = require('../src/index.js');
const { connect, closeDatabase, clearDatabase } = require('./setup');
const User = require('../src/models/users.js');
const Sala = require('../src/models/sala.js');

let clientSocket1, clientSocket2;
let port;

// Helper para criar usuários rapidamente
const createUser = async (nome) => {
    await request(app).post('/api/users').send({ nome });
};

// Helper para login de socket (aguarda o evento 'login' ou 'erro')
const loginSocket = (socket, nome) => {
    return new Promise((resolve, reject) => {
        socket.emit('login', { nome });
        socket.once('login', (data) => resolve(data));
        socket.once('erro', (err) => reject(err));
    });
};


beforeAll(async () => {
    await connect();
    // Pega a porta em que o servidor está rodando
    port = server.address().port; 
});

beforeEach(async () => {
    // Garante que os usuários existem no DB em memória antes dos sockets conectarem
    await createUser('user1');
    await createUser('user2');

    const socketUrl = `http://localhost:${port}`;
    // Opções para forçar a criação de novas conexões em vez de reutilizar as antigas
    const options = {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
    };

    clientSocket1 = Client(socketUrl, options);
    clientSocket2 = Client(socketUrl, options);
});

afterEach(async () => {
    // Desconecta os sockets e limpa o banco
    if (clientSocket1.connected) clientSocket1.disconnect();
    if (clientSocket2.connected) clientSocket2.disconnect();
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
});


describe('Testes de WebSocket', () => {

    it('deve fazer login com sucesso e atualizar o socketId no DB', async () => {
        const user = await loginSocket(clientSocket1, 'user1');
        
        expect(user.nome).toBe('user1');
        expect(user.socketId).toBe(clientSocket1.id);

        const userInDb = await User.findOne({ nome: 'user1' });
        expect(userInDb.socketId).toBe(clientSocket1.id);
    });

    it('deve falhar o login se o usuário não existir', async () => {
        await expect(loginSocket(clientSocket1, 'naoexiste'))
            .rejects
            .toStrictEqual({ evento: 'login', mensagem: 'Usuário não existente. Crie um usuário no banco primeiro' });
    });

    it('deve falhar o login se o usuário já estiver logado (login duplo)', async () => {
        await loginSocket(clientSocket1, 'user1'); // Login user1 no socket 1
        
        // Tenta logar user1 no socket 2
        await expect(loginSocket(clientSocket2, 'user1'))
            .rejects
            .toStrictEqual({ evento: 'login', mensagem: 'Não é possível fazer login novamente!' });
    });

    it('deve enviar e receber mensagem na sala pública', (done) => {
        // O Jest falhará se o 'done' não for chamado após 5s
        
        Promise.all([
            loginSocket(clientSocket1, 'user1'),
            loginSocket(clientSocket2, 'user2')
        ]).then(() => {
            
            // user2 escuta a mensagem
            clientSocket2.on('sendMensagemParaSalas', (data) => {
                expect(data.user).toBe('user1');
                expect(data.mensagem).toBe('Olá a todos!');
                done(); // Teste concluído com sucesso
            });

            // user1 envia a mensagem
            clientSocket1.emit('sendMensagemParaSalas', {
                mensagem: 'Olá a todos!',
                sala: 'publica'
            });
        });
    });

    it('deve salvar a mensagem pública no banco de dados', async () => {
        await loginSocket(clientSocket1, 'user1');
        
        clientSocket1.emit('sendMensagemParaSalas', {
            mensagem: 'Mensagem salva',
            sala: 'testesala'
        });

        // Pequena espera para o DB atualizar
        await new Promise(r => setTimeout(r, 100)); 

        const sala = await Sala.findOne({ nome: 'testesala' });
        expect(sala).toBeDefined();
        expect(sala.mensagens.length).toBe(1);
        expect(sala.mensagens[0].user).toBe('user1');
        expect(sala.mensagens[0].mensagem).toBe('Mensagem salva');
    });


    it('deve enviar e receber mensagem privada', (done) => {
        Promise.all([
            loginSocket(clientSocket1, 'user1'),
            loginSocket(clientSocket2, 'user2')
        ]).then(() => {

            // user2 escuta a mensagem privada
            clientSocket2.on('sendMensagemPrivada', (data) => {
                expect(data.de).toBe('user1');
                expect(data.mensagem).toBe('Oi, user2');
                done();
            });

            // user1 envia a mensagem para user2
            clientSocket1.emit('sendMensagemPrivada', {
                toName: 'user2',
                mensagem: 'Oi, user2'
            });
        });
    });

    it('deve salvar a mensagem privada para ambos os usuários no DB', async () => {
        const [user1, user2] = await Promise.all([
            loginSocket(clientSocket1, 'user1'),
            loginSocket(clientSocket2, 'user2')
        ]);
        
        clientSocket1.emit('sendMensagemPrivada', {
            toName: 'user2',
            mensagem: 'Mensagem privada salva'
        });

        // Pequena espera para o DB atualizar
        await new Promise(r => setTimeout(r, 100));

        const user1InDb = await User.findOne({ nome: 'user1' });
        const user2InDb = await User.findOne({ nome: 'user2' });

        // Verifica user1
        const conversa1 = user1InDb.conversas.find(c => c.nome === 'user2');
        expect(conversa1).toBeDefined();
        expect(conversa1.mensagens.length).toBe(1);
        expect(conversa1.mensagens[0].mensagem).toBe('Mensagem privada salva');

        // Verifica user2
        const conversa2 = user2InDb.conversas.find(c => c.nome === 'user1');
        expect(conversa2).toBeDefined();
        expect(conversa2.mensagens.length).toBe(1);
        expect(conversa2.mensagens[0].mensagem).toBe('Mensagem privada salva');
    });


   it('deve DELETAR o usuário ao desconectar (como proposital)', (done) => {
    Promise.all([
      loginSocket(clientSocket1, 'user1'),
      loginSocket(clientSocket2, 'user2')
    ]).then(async () => {

            // 1. Garante que o usuário existe ANTES de desconectar
      const userAntes = await User.findOne({ nome: 'user1' });
      expect(userAntes).not.toBeNull(); 
      expect(userAntes.socketId).toBe(clientSocket1.id);

      // 2. user2 escuta o evento de desconexão
      clientSocket2.on('usuarioDesconectou', async (nomeUsuario) => {
        expect(nomeUsuario).toBe('user1');

        // 3. Verifica o DB *após* a desconexão
        const userDepois = await User.findOne({ nome: 'user1' });
                
                // 4. A VERIFICAÇÃO CORRETA: O usuário deve ser nulo
        expect(userDepois).toBeNull(); 
        
        done(); // Teste concluído com sucesso
      });

      // 5. Força a desconexão do user1
      clientSocket1.disconnect();
    });
  });
});