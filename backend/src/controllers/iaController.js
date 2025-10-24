const callGeminiAPI = require('../services/geminiService.js');

async function chamarGeminiHelper(prompt) {
    try {
        const aiResponse = await callGeminiAPI(prompt);
        return aiResponse;
    } catch (error) {
        console.error("Erro ao chamar Gemini:", error.message);
        throw new Error("Desculpe, não consegui processar sua mensagem no momento.");
    }
}

async function getAIChatResponse(req, res) {

    if (!req.body.mensagem) {
        return res.status(400).json({error: 'Parâmetro mensagem está faltando'});
    }

    try {
        const aiResponse = await chamarGeminiHelper(req.body.mensagem);
        res.json({resposta: aiResponse});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function automatizarResposta(req, res) {
    
    if (!req.body.mensagem) {
        return res.status(400).json({error: 'Parâmetro mensagem está faltando'});
    }

    const prompt = 'Analise e me sugira uma resposta para essa mensagem (envie somente a mensagem por favor, sem texto a mais): ' + req.body.mensagem;

    try {
        const aiResponse = await chamarGeminiHelper(prompt);
        res.json({resposta: aiResponse});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


module.exports = {getAIChatResponse, automatizarResposta }