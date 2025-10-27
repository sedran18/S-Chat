require('dotenv').config();
const conectarAoBancoDEDados = require('./config/database.js');
if (process.env.NODE_ENV !== 'test') {
    conectarAoBancoDEDados(); 
}; 
const express = require('express');
const {createServer} = require('node:http');
const initSocket = require('./sockets/socket.js');
const usersRoute = require('./routes/users.js');
const iaRoute = require('./routes/iaRoute.js');
const cors = require("cors");

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api', usersRoute);
app.use('/api', iaRoute);

initSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
})
module.exports = {server, app}
