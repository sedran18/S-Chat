require('dotenv').config()
const express = require('express');
const {createServer} = require('node:http');
const initSocket = require('./socket.js');

const app = express();
const server = createServer(app);

initSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
})