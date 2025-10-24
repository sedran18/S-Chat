const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const mensagemSchema = new mongoose.Schema({
    user: {
        type: String,
        trim: true,
        lowercase: true
    },
    mensagem: {
        type: String,
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
        trim: true,
        unique: true
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
    }
});


userSchema.methods.toJSON = function () {
    const userObj = this.toObject();
    delete userObj.tokens;
    delete userObj._id;

    return userObj;
}


userSchema.methods.gerarToken = async function() {
    const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET, {expiresIn: '1d'});
    this.tokens.push({token});
    await this.save();
    return token;
};


const User = mongoose.model('User', userSchema);
module.exports = User;
