const mongoose = require('mongoose');

const mensagemSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        trim: true
    },
    mensagem: {
        type: String,
        required: true
    },
});

const conversaSchema = new mongoose.Schema({
    nome: {
        type: String, 
        required: true,
        trim: true
    },
    mensagens: [mensagemSchema]
});

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    conversas: [conversaSchema],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    socketId: {
        type: String,
        required: true
    }
});

userSchema.methods.gerarTokenj = async function() {
    const token = jwt_sign({_id: this._id.toString()}, process.env.JWT_SECRET, {expiresIn: '1d'});
    this.tokens.push({token});
    await this.save();

    return token;
}


const User = mongoose.model('User', userSchema);
module.exports = User;
