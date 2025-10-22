const express = require('express');
const router = express.Router();
const iaController = require('../controllers/iaController.js');

router.post('/ia/resposta', iaController.getAIChatResponse);
router.post('/ia/sentimento', iaController.analyzeSentiment);

module.exports = router;