const { Server } = require('socket.io');
const socketCntrl = require('../controllers/socketController.js');
const User =require('../models/users.js');

function initSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*" }
    });
    const total = 0;

    io.on('connection', (socket) => {
        total +=1;
        socket.join('Pública');
        socket.join('Networking');

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
        socket.on('mensagemParaSalas', async ({ user, msg, sala }) => {
            // envia de volta e cada usuário salva no banco de dados pelo client side
            const nomeSala = sala || 'Pública';
            await socketCntrl.salvarNoBanco({socketId: socket.id, user, msg, sala})
            io.to(nomeSala).emit('mensagem', { user, msg });
        });



        socket.on('mensagemPrivada', async ({toName, msg}) => {
            const userFrom = await User.findOne({socketId: socket.id}).select('name');;
            const userTo = await User.findOne({name: toName}).select('socketId nome');
            
            await socketCntrl.salvarNoBanco({socketId: socket.id, user: userFrom, msg, sala: userTo.name});
            await socketCntrl.salvarNoBanco({socketId: userTo.socketId, user: userFrom, msg, sala: userFrom});

            socket.to(userTo.socketId).emit({de: userFrom, mensagem: msg});
        })



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
        });

        // Desconexão
        socket.on('disconnect', async () => {
            total -= 1;
            // Aqui você poderia remover do banco se necessário
            await User.deleteOne({ socketId: socket.id });
        });
    });
}

module.exports = initSocket;
