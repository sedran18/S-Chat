const callGeminiAPI = require('../services/geminiService.js');

async function getAIChatResponse(req, res) {
    try {
        const aiResponse = await callGeminiAPI(req.body);
        res.json({resposta: aiResponse});

    } catch (error) {
        res.status(500).json({error: "Desculpe, não consegui processar sua mensagem no momento."})
    }
}



async function analyzeSentiment() {
    try {
        const prompt = `Analise o sentimento das seguintes mensagens e classifique-o como "positive", "negative", "neutral" ou "mixed". Responda com apenas uma única palavra. Mensagem: "${req.body}"`;
        
        const sentiment = await callGeminiAPI(prompt);
        const cleanedSentiment = sentiment.trim().toLowerCase();

        if (['positive', 'negative', 'neutral', 'mixed'].includes(cleanedSentiment)) {
            return cleanedSentiment;
        }
        
        return 'failed';

    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise de sentimento:", error.message);
        return 'failed';
    }
}


module.exports = {getAIChatResponse, analyzeSentiment}