const callGeminiAPI = require('../services/geminiService.js');

async function getAIChatResponse(req, res) {
    const camposEnviados = Object.keys(req.body);
    if (camposEnviados.length !== 1 || camposEnviados === 'mensagem') return res.status(400).json({error: 'Informe campos corretos'});

    try {
        const aiResponse = await callGeminiAPI(req.body.mensagem);
        res.json({resposta: aiResponse});

    } catch (error) {
        res.status(500).json({error: "Desculpe, não consegui processar sua mensagem no momento."})
    }
}



async function analyzeSentiment(req, res) {
    const camposEnviados = Object.keys(req.body);

    if (camposEnviados.length !== 1 || camposEnviados === 'mensagem') return res.status(400).json({error: 'Informe campos corretos'});

    try {
        const prompt = `Analise o sentimento das seguintes mensagens e classifique-o como "positive", "negative", "neutral" ou "mixed". Responda com apenas uma única palavra. Mensagem: "${req.body}"`;
        
        const sentiment = await callGeminiAPI(prompt);
        const cleanedSentiment = sentiment.trim().toLowerCase();

        if (['positive', 'negative', 'neutral', 'mixed'].includes(cleanedSentiment)) {
            return res.json({res: cleanedSentiment});
        }
        
        res.status(500).json({error: 'failed'});

    } catch (err) {
        res.status(500).json({error: "Erro ao chamar a API Gemini para análise de sentimento: " + err.message})
    }
}


module.exports = {getAIChatResponse, analyzeSentiment}