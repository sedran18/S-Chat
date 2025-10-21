const express = require('express');
const router = express.Router();
const iaController = require('../controllers/iaController.js');

router.post('/ia/resposta', iaController.getAIChatResponse);
router.post('/ai/sentimento', iaController.analyzeSentiment);