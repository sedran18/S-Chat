const express = require('express');
const router = express.Router();
const conversationCntrl = require('../controllers/conversationController.js');
const auth = require('../middlewares/auth.js')

//receber mensagens de conversa X {{user, mensagem}} e salvar no banco
router.get('/mensagens/:conversa', auth, conversationCntrl.receberMensagem);


