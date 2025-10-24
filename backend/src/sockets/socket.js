const { Server } = require('socket.io');
const {salvarNoBancoPrivado, salvaNoBancoPublico} = require('../controllers/socketController.js');
const User = require('../models/users.js');
const path = require('path');
const Sala = require(path.join(__dirname, '..', 'models', 'sala.js'));

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  let total = 0;

  io.on('connection', (socket) => {
    total += 1;
    socket.join('publica');

    // LOGIN
    socket.on('login', async ({ nome }) => {
      try {
        const user = await User.findOne({ nome });
        if (!user) return socket.emit('erro', {evento: 'login', mensagem: 'Usuário não existente. Crie um usuário no banco primeiro'});

        user.socketId = socket.id;
        await user.save();

        socket.userNome = user.nome;

        socket.emit('loginSucesso', user.toJSON());
      } catch (err) { 
        console.error("Erro no login:", err.message);
        socket.emit('erro', 'Erro ao logar. Tente novamente.');
      }
    });

    // MENSAGEM PARA SALAS
    socket.on('sendMensagemParaSalas', async ({ user, msg, sala }) => {
      //vem criptografada do lado do cliente
      const nomeSala = sala || 'publica'; 
      try {
        await salvaNoBancoPublico({ user, msg, sala: nomeSala });
        io.to(nomeSala).emit('sendMensagemParaSalas', { user, msg});
      } catch (err) {
        console.error("Erro msg sala:", err.message);
        socket.emit('erro', {evento: 'sendMensagemParaSalas', mensagem: err.message});
      }
    });

    // MENSAGEM PRIVADA
    socket.on('sendMensagemPrivada', async ({ toName, msg }) => {
      //vem criptografada do lado do cliente
      try {
        const userFromName = socket.userNome;
        if (!userFromName) return socket.emit('erro', {evento: 'sendMensagemPrivada', mensagem: 'Usuário remetente não existe'});

        const userTo = await User.findOne({ nome: toName });
        if (!userTo) return socket.emit('erro', {evento: 'sendMensagemPrivada', mensagem: 'Usuário destinatário não existe'});

        await salvarNoBancoPrivado({ remetente: userFromName, destinatario: toName, msg});


        socket.to(userTo.socketId).emit('sendMensagemPrivada', { de: userFromName, mensagem: msg });
      } catch (err) {
                console.error("Erro msg privada:", err.message);
        socket.emit('erro', {evento: 'sendMensagemPrivada', mensagem: err.message});
      }
    });

    // PEGAR MENSAGENS PRIVADAS
    socket.on('pegarMensagensPrivadas', async ({ destinatario}) => {
      try {
        const usuario = await User.findOne({ socketId: socket.id });
        if (!usuario) return socket.emit('pegarMensagensPrivadas', { sala: destinatario, mensagens: [] })
        
        const conversasFoco = usuario.conversas.find(c => c.nome === destinatario);
        if (!conversasFoco) return socket.emit('pegarMensagensPrivadas', { sala: destinatario, mensagens: [] });
        
        const mensagens = conversasFoco.mensagens || [];

        socket.emit('pegarMensagensPrivadas', { sala: destinatario, mensagens });
      } catch (err) {
        console.error("Erro pegar msg privada:", err.message);
        socket.emit('erro', {evento: 'pegarMensagensPrivadas', mensagem: err.message});
      }
    });

    // PEGAR MENSAGENS PÚBLICAS
    socket.on('pegarMensagensPublicas', async ({limit, skip, sala}) => {
      try {
          const nome = sala || 'publica';
          const pular = skip || 0;
          const limite = limit || 20; 

          const salaDoc = await Sala.findOne(
            {nome: nome},  
            {mensagens: {$slice: [pular, limite] } }
          );

          //caso não tiver conversa
          if (!salaDoc) {
            return socket.emit('pegarMensagensPublicas', { sala: nome, mensagens: [] });
          }

          const mensagens = salaDoc.mensagens;

          socket.emit('pegarMensagensPublicas', { sala: nome, mensagens });
            } catch (err) {
                console.error("Erro pegar msg publica:", err.message);
                socket.emit('erro', {evento: 'pegarMensagensPublicas', mensagem: err.message});
            }
    })

    // ENTRAR NA SALA
    socket.on('entrarNaSala', ({ sala }) => {
      socket.join(sala);
    });


    //CONTAR USUÀRIOS ONLINE
    socket.on('usuariosOnline', () => {
      socket.emit('usuariosOnline', total)
    });

        // DESCONECTAR
        socket.on('disconnect', async () => {
            io.emit('usuarioDesconectou', socket.userNome)
            await User.deleteOne({ nome: socket.userNome });
            total -= 1;
        });

    });
}

module.exports = initSocket;
