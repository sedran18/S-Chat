const mongoose = require('mongoose');

const mensagemSchema = new mongoose.Schema({
    user: {
        type: String,
        trim: true
    },
    mensagem: {
        type: String,
    }
});

const salaSchema = new mongoose.Schema({
    nome: {
        type: String, 
        required: true,
        trim: true,
        unique: true,
        default: 'publica' 
    },
    mensagens: [mensagemSchema] 
});

const Sala = mongoose.model('Sala', salaSchema);

module.exports = Sala;