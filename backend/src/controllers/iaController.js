const callGeminiAPI = require('../services/geminiService.js');
const User = require('../models/users.js');

async function getAIChatResponse(req, res) {
    const camposEnviados = Object.keys(req.body);

    if (camposEnviados.length !== 1 || camposEnviados[0] !== 'conversa') {
        return res.status(400).json({error: 'Informe campos corretos'});
    }

    try {
        const aiResponse = await callGeminiAPI(req.body.mensagem);
        res.json({resposta: aiResponse});

    } catch (error) {
        res.status(500).json({error: "Desculpe, não consegui processar sua mensagem no momento."})
    }
}



async function analyzeSentiment(req, res) {
    const { nome, conversa } = req.body; // ou req.params, se preferir
    if (!nome || !conversa) {
        return res.status(400).json({ error: 'Informe o nome do usuário e da conversa' });
    }

    try {
        // Busca o usuário e seleciona apenas a conversa desejada
        const usuario = await User.findOne({ nome }).select(`conversas.nome conversas.mensagens`);

        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

        // Procura a conversa específica
        const conversaObj = usuario.conversas.find(c => c.nome === conversa);
        if (!conversaObj || !conversaObj.mensagens.length) {
            return res.status(400).json({ error: 'Não há mensagens nesta conversa' });
        }

        // Pega as últimas 15 mensagens
        const ultimasMensagens = conversaObj.mensagens.slice(-15).map(m => m.mensagem);

        // Cria o prompt para a IA
        const prompt = `Analise o sentimento das seguintes mensagens e classifique como "positive", "negative", "neutral" ou "mixed". Responda apenas com uma palavra. Mensagens: "${ultimasMensagens.join(' | ')}"`;

        // Chama a Gemini
        const sentiment = await callGeminiAPI(prompt);
        const cleanedSentiment = sentiment.trim().toLowerCase();

        if (['positive', 'negative', 'neutral', 'mixed'].includes(cleanedSentiment)) {
            return res.json({ res: cleanedSentiment });
        }

        res.status(500).json({ error: 'Falha ao processar sentimento' });

    } catch (err) {
        res.status(500).json({ error: 'Erro ao analisar sentimento: ' + err.message });
    }
}


module.exports = {getAIChatResponse, analyzeSentiment}