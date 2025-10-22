const User = require('../models/users.js');

async function salvarNoBanco({ socketId, user, msg, sala }) {
  const userLogado = await User.findOne({ socketId });

  if (!userLogado) {
    throw new Error('Usuário não encontrado!');
  }

  let conversa = userLogado.conversas.find(c => c.nome === (sala || 'publica'));

  if (!conversa) {
    conversa = { nome: sala || 'publica', mensagens: [] };
    userLogado.conversas.push(conversa);
  }

  conversa.mensagens.push({
    user,
    mensagem: msg,
  });

  await userLogado.save();
}

module.exports =  salvarNoBanco;