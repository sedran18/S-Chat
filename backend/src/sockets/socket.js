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
    socket.on('login', async ({nome}) => {
        const nomeLower = nome.toLowerCase();
      try {
        const user = await User.findOne({nome: nomeLower});
        if (!user) return socket.emit('erro', {evento: 'login', mensagem: 'Usuário não existente. Crie um usuário no banco primeiro'});
        //Não é possível fazer login duas vezes por motivos de segurança
        if (user.socketId) return socket.emit('erro', {evento: 'login', mensagem: 'Não é possível fazer login novamente!'})

        user.socketId = socket.id;
        await user.save();

        socket.userNome = user.nome;

        socket.emit('login', user.toJSON());
        io.emit('usuariosOnline', total);
      } catch (err) { 
        console.error("Erro no login:", err.message);
        socket.emit('erro', {evento: 'login', mensagem: err.message});
      }
    });

    // MENSAGEM PARA SALAS
    socket.on('sendMensagemParaSalas', async ({mensagem, sala }) => {
      //vem criptografada do lado do cliente

        if (!socket.userNome) throw new Error('Autetifique-se primeiro');
        if (!sala || !mensagem) throw new Error('Argumentos incorretos');
        const nomeSala = sala.toLowerCase() === 'publica'? 'publica': sala;
      try {
        await salvaNoBancoPublico({ user: socket.userNome, mensagem, sala: nomeSala });

        io.to(nomeSala).emit('sendMensagemParaSalas', { user: socket.userNome, mensagem});
      } catch (err) {
        console.error("Erro msg sala:", err.message);
        socket.emit('erro', {evento: 'sendMensagemParaSalas', mensagem: err.message});
      }
    });

    // MENSAGEM PRIVADA
    socket.on('sendMensagemPrivada', async ({ toName, mensagem }) => {
      //vem criptografada do lado do cliente
      try {
        const userFromName = socket.userNome;
        if (!userFromName) return socket.emit('erro', {evento: 'sendMensagemPrivada', mensagem: 'Usuário remetente não existe'});

        const userTo = await User.findOne({ nome: toName });
        if (!userTo) return socket.emit('erro', {evento: 'sendMensagemPrivada', mensagem: 'Usuário destinatário não existe'});

        await salvarNoBancoPrivado({ remetente: userFromName, destinatario: toName, mensagem});


        socket.to(userTo.socketId).emit('sendMensagemPrivada', { de: userFromName, mensagem});
      } catch (err) {
                console.error("Erro msg privada:", err.message);
        socket.emit('erro', {evento: 'sendMensagemPrivada', mensagem: err.message});
      }
    });

    // PEGAR MENSAGENS PRIVADAS
    socket.on('pegarMensagensPrivadas', async ({ destinatario}) => {
      try {
        if (!socket.userNome) throw new Error('Autetifique-se primeiro');
        const usuario = await User.findOne({nome: socket.userNome});
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
        if (!socket.userNome) throw new Error('Autetifique-se primeiro');
          if (!sala) throw new Error('Está faltando o nome da sala');
          const pular = skip || 0;
          const limite = limit || 20; 

          const salaDoc = await Sala.findOne(
            {nome: sala},  
            {mensagens: {$slice: [pular, limite] } }
          );

          //caso não tiver conversa
          if (!salaDoc) {
            return socket.emit('pegarMensagensPublicas', { sala: sala, mensagens: [] });
          }

          const mensagens = salaDoc.mensagens;

          socket.emit('pegarMensagensPublicas', { sala: sala, mensagens });
            } catch (err) {
                console.error("Erro pegar msg publica:", err.message);
                socket.emit('erro', {evento: 'pegarMensagensPublicas', mensagem: err.message});
            }
    })

    // ENTRAR NA SALA
    socket.on('entrarNaSala', ({ sala }) => {
        try {
        if (!socket.userNome) throw new Error('Autetifique-se primeiro');
        } catch (err) {
            socket.emit('erro', {evento: 'entrarNaSala', mensagem: err.message});
        }

      socket.join(sala);
      socket.emit('entrarNaSala', 'tudo certo');
    });


    //CONTAR USUÀRIOS ONLINE
    socket.on('usuariosOnline', () => {
      socket.emit('usuariosOnline', total)
    });

        // DESCONECTAR
        socket.on('disconnect', async () => {
            io.emit('usuarioDesconectou', socket.userNome);
            io.emit('usuariosOnline', total);
            await User.deleteOne({ nome: socket.userNome });
            total -= 1;
        });

    });
}

module.exports = initSocket;
