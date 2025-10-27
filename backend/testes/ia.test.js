const request = require('supertest');
const { server, app } = require('../src/index.js');
const { connect, closeDatabase, clearDatabase } = require('./setup');
const callGeminiAPI = require('../src/services/geminiService.js');

// Mocka o serviço da Gemini API
jest.mock('../src/services/geminiService.js');

let userToken;

beforeAll(async () => {
    await connect();
});

beforeEach(async () => {
    // Mockar a implementação antes de cada teste
    callGeminiAPI.mockClear();

    // Criar um usuário e obter um token para autenticação
    const res = await request(app).post('/api/users').send({
        nome: 'usertesteia'
    });
    userToken = res.body.token;
});

afterEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('Rotas de IA (/api/ia)', () => {

    it('deve falhar sem autenticação', async () => {
        const res = await request(app)
            .post('/api/ia/resposta')
            .send({ mensagem: 'Olá' });

        expect(res.statusCode).toBe(401);
    });

    it('deve falhar se a mensagem estiver faltando em /ia/resposta', async () => {
        const res = await request(app)
            .post('/api/ia/resposta')
            .set('Authorization', `Bearer ${userToken}`)
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Parâmetro mensagem está faltando');
    });

    it('deve retornar uma resposta da IA para /ia/resposta', async () => {
        // Configura o mock para este teste
        callGeminiAPI.mockResolvedValue('Esta é uma resposta da IA.');

        const res = await request(app)
            .post('/api/ia/resposta')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ mensagem: 'Qual o seu nome?' });

        expect(res.statusCode).toBe(200);
        expect(res.body.resposta).toBe('Esta é uma resposta da IA.');
        // Verifica se o serviço foi chamado com o prompt correto
        expect(callGeminiAPI).toHaveBeenCalledWith('Qual o seu nome?');
    });

    it('deve retornar uma resposta automatizada para /ia/automatizar', async () => {
        callGeminiAPI.mockResolvedValue('Eu sugiro que você diga "Olá!"');

        const res = await request(app)
            .post('/api/ia/automatizar')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ mensagem: 'Meu cliente disse "Oi"' });

        expect(res.statusCode).toBe(200);
        expect(res.body.resposta).toBe('Eu sugiro que você diga "Olá!"');
        // Verifica se o prompt foi formatado corretamente
        const expectedPrompt = 'Analise e me sugira uma resposta para essa mensagem (envie somente a mensagem por favor, sem texto a mais): Meu cliente disse "Oi"';
        expect(callGeminiAPI).toHaveBeenCalledWith(expectedPrompt);
    });

    it('deve lidar com erros da API Gemini', async () => {
        // Simula uma falha na API
        callGeminiAPI.mockRejectedValue(new Error('Falha na API'));

        const res = await request(app)
            .post('/api/ia/resposta')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ mensagem: 'Qual o seu nome?' });

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Desculpe, não consegui processar sua mensagem no momento.');
    });
});