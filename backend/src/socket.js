const {Server} = require('socket.io');


function initSocket(server) {
    const io = new Server(server, {
        cors: {origin: "*"}
    });

    io.on('connection', (socket) => {
        io.on('receberMensagem', {})
    })
}

module.exports = initSocket;