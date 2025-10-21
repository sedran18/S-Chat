const { Server } = require('socket.io');
const socketCntrl = require('../controllers/socketController.js');
const User = require('../models/users.js');

function initSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    let total = 0;

    io.on('connection', (socket) => {
        total += 1;
        socket.join('Pública');
        socket.join('Networking');

        // LOGIN
        socket.on('login', async ({ nome }) => {
            try {
                const user = await User.findOne({ nome });
                if (!user) return socket.emit('erro', 'Usuário não encontrado');

                user.socketId = socket.id;
                await user.save();
                socket.emit('loginSucesso', user.toJSON());
            } catch {
                socket.emit('erro', 'Erro ao logar. Tente novamente.');
            }
        });

        // MENSAGEM PARA SALAS
        socket.on('mensagemParaSalas', async ({ user, msg, sala }) => {
            try {
                const nomeSala = sala || 'Pública';
                await socketCntrl.salvarNoBanco({ socketId: socket.id, user, msg, sala: nomeSala });
                io.to(nomeSala).emit('mensagem', { user, msg });
            } catch {
                socket.emit('erro', 'Erro ao enviar mensagem.');
            }
        });

        // MENSAGEM PRIVADA
        socket.on('mensagemPrivada', async ({ toName, msg }) => {
            try {
                const userFrom = await User.findOne({ socketId: socket.id });
                if (!userFrom) return socket.emit('erro', 'Usuário remetente não encontrado');

                const userTo = await User.findOne({ nome: toName });
                if (!userTo) return socket.emit('erro', 'Usuário destinatário não encontrado');

                await socketCntrl.salvarNoBanco({ socketId: socket.id, user: userFrom.nome, msg, sala: userTo.nome });
                await socketCntrl.salvarNoBanco({ socketId: userTo.socketId, user: userFrom.nome, msg, sala: userFrom.nome });

                socket.to(userTo.socketId).emit('mensagemPrivada', { de: userFrom.nome, mensagem: msg });
            } catch {
                socket.emit('erro', 'Erro ao enviar mensagem privada.');
            }
        });

        // PEGAR MENSAGENS
        socket.on('pegarMensagens', async ({ sala, skip = 0, limit = 20 }) => {
            try {
                const nomeSala = sala || 'Pública';
                const usuario = await User.findOne({ socketId: socket.id });
                if (!usuario) return socket.emit('mensagens', { sala: nomeSala, mensagens: [] });

                const conversa = usuario.conversas.find(c => c.nome === nomeSala);
                const mensagens = conversa ? conversa.mensagens.slice(skip, skip + limit) : [];

                socket.emit('mensagens', { sala: nomeSala, mensagens });
            } catch {
                socket.emit('erro', 'Erro ao buscar mensagens.');
            }
        });

        // ENTRAR NA SALA
        socket.on('entrarNaSala', ({ sala }) => {
            socket.join(sala);
        });

        
        //CONTAR USUÀRIOS ONLINE
        socket.on('usuariosOnline', () => {
            socket.enmit('usuariosOnline', total)
        });


        // DESCONECTAR
        socket.on('disconnect', async () => {
            total -= 1;
            try {
                const resultado = await User.deleteOne({ socketId: socket.id });
                if (resultado.deletedCount === 0) {
                    socket.emit('erro', 'Usuário não encontrado na desconexão.');
                }
            } catch {
                socket.emit('erro', 'Erro ao remover usuário ao desconectar.');
            }
        });

    });
}

module.exports = initSocket;
