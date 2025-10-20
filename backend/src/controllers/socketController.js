const User = require('../models/users.js');

async function salvarNoBanco({ socketId, user, msg, sala }) {
  // Busca o usuário pelo socketId
  const userLogado = await User.findOne({ socketId });

  if (!userLogado) {
    throw new Error('Usuário não encontrado!');
  }

  // Procura se o usuário já tem a conversa
  let conversa = userLogado.conversas.find(c => c.nome === (sala || 'publica'));

  // Se não existir, cria
  if (!conversa) {
    conversa = { nome: sala || 'publica', mensagens: [] };
    userLogado.conversas.push(conversa);
  }

  // Adiciona a mensagem na conversa
  conversa.mensagens.push({
    user,
    mensagem: msg,
  });

  // Salva no banco
  await userLogado.save();
}

module.exports =  salvarNoBanco;