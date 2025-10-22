const express = require('express');
const router = express.Router();
const iaController = require('../controllers/iaController.js');
const auth = require('../middlewares/auth.js');

router.post('/ia/resposta', auth, iaController.getAIChatResponse);
router.post('/ia/sentimento', auth, iaController.analyzeSentiment);

module.exports = router;