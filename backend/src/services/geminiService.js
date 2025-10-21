const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

async function callGeminiAPI(prompt) {
    const payload = {
        contents: [{
            parts: [{
                text: 'Seu nome vai ser Sedran. Apenas saiba disso, caso eu perguntar sobre me responda, caso contrário não há necessidade de mencionar isso' + prompt
            }]
        }]
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Erro na API Gemini:", errorBody);
        throw new Error(`A chamada da API falhou com o status ${response.status}`);
    }

    const data = await response.json();
    
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        console.error("Resposta da API Gemini em formato inesperado:", data);
        throw new Error("Não foi possível extrair o texto da resposta da API.");
    }

    return text;
}


module.exports = callGeminiAPI;