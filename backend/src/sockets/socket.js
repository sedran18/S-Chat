const { Server } = require('socket.io');
const socketCntrl = require('../controllers/socketController.js');
const User =require('../models/users.js');

function initSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on('connection', (socket) => {
        socket.join('Pública');
        //do lado do cliente primeiro vc cria o user
        //adicionar o socket.id ao usuário
        socket.on('login', async ({ nome }) => {
            const user = await User.findOne({ nome });
            if (user) {
                user.socketId = socket.id;
                await user.save();
            }
        });


        // Mensagem recebida
        socket.on('mensagem', async ({ user, msg, sala }) => {
            // envia de volta e cada usuário salva no banco de dados pelo client side

            const nomeSala = sala || 'Pública';
            socketCntrl.salvarNoBanco({socketId: socket.id, user, msg, sala})
            io.to(nomeSala).emit('mensagem', { user, msg });
        });

        socket.on('pegarMensagens', async ({ sala, skip = 0, limit = 20 }) => {
            try {
                const nomeSala = sala || 'Pública';

                // Busca o usuário pelo socketId
                const usuario = await User.findOne({ socketId: socket.id });
                if (!usuario) return socket.emit('mensagens', { sala: nomeSala, mensagens: [] });

                // Encontra a conversa
                const conversa = usuario.conversas.find(c => c.nome === nomeSala);
                if (!conversa) return socket.emit('mensagens', { sala: nomeSala, mensagens: [] });

                // Paginação manual
                const mensagens = conversa.mensagens.slice(skip, skip + limit);

                // Envia para o cliente
                socket.emit('mensagens', { sala: nomeSala, mensagens });
            } catch (err) {
                console.error(err);
            }
        });





        // Entrar em uma sala
        socket.on('entrarNaSala', ({ sala }) => {
            socket.join(sala);
            console.log(`Socket ${socket.id} entrou na sala ${sala}`);
        });

        // Desconexão
        socket.on('disconnect', async () => {
            console.log(`Usuário desconectado: ${socket.id}`);
            // Aqui você poderia remover do banco se necessário
            await User.deleteOne({ socketId: socket.id });
        });
    });
}

module.exports = initSocket;
