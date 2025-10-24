const mongoose = require('mongoose');

const conectarAoBancoDeDados = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado ao mongoDB');
    } catch (e) {
        console.error('Erro ao conectar com o banco de dados: ', e);
    }
}
module.exports = conectarAoBancoDeDados;