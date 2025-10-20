const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController.js');
const auth = require('../middlewares/auth.js');

router.post('/users', userController.criarUser);

router.delete('/users', auth, userController.deletarUser);

//verificar se usuário é válido
router.post('/users', userController.verificarUser)
