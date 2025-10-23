const User = require('../models/users.js');
const path = require('path');
const Sala = require(path.join(__dirname, '..', 'models', 'sala.js'));

async function salvarNoBancoPrivado({ remetente, destinatario, msg }) {
  
  const userRemetente = await User.findOne({nome: remetente }); 
  const userReceptor = await User.findOne({ nome: destinatario });

  if (!userRemetente || !userReceptor) {
    throw new Error('Usuários não encontrados');
  }

  let conversaRemetente = userRemetente.conversas.find(c => c.nome === destinatario); 

  if (!conversaRemetente) {
    conversaRemetente = { nome: destinatario, mensagens: [] };
    userRemetente.conversas.push(conversaRemetente);
  }
  conversaRemetente.mensagens.push({
    user: remetente, 
    mensagem: msg,
  });

  let conversaReceptor = userReceptor.conversas.find(c => c.nome === remetente); 

  if (!conversaReceptor) {
    conversaReceptor = { nome: remetente, mensagens: [] };
    userReceptor.conversas.push(conversaReceptor);
  }
  conversaReceptor.mensagens.push({
    user: remetente, 
    mensagem: msg,
  });

  await userRemetente.save();
  await userReceptor.save();
  
}

async function salvaNoBancoPublico({ user, msg, sala }) {
    await Sala.findOneAndUpdate(
        { nome: sala },
        { 
            $push: { 
                mensagens: { user, mensagem: msg }
            }
        },
        { 
            upsert: true,
            new: true
        }
    );
}

module.exports = { salvarNoBancoPrivado, salvaNoBancoPublico };

