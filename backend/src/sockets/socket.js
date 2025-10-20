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
            // Se não houver sala, envia para todos (menos quem enviou)
            // envia de volta e cada usuário salva no banco de dados pelo client side

            const nomeSala = sala || 'Pública';
            io.to(nomeSala).emit('mensagem', { user, msg });
            socketCntrl.salvarNoBanco({socketId: socket.id, user, msg, sala})
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
