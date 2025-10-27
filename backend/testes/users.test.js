const request = require('supertest');
const {server, app} = require('../src/index.js');
const { connect, closeDatabase, clearDatabase } = require('./setup');
//Desconecte o banco de dados no index.js e desligue o servidor

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('Usuários', () => {
    it ('criar usuário e retornar token e usuário', async () => {
        const res = await request(app).post('/api/users').send({
            nome: 'gabriel'
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.user.nome).toBe('gabriel');
        expect(res.body.token).toBeDefined();
    });

    it ('verificar se usuário já existe', async () => {
        const user = await request(app).post('/api/users').send({
            nome: 'gabriel'
        });
        const res = await request(app).post('/api/users').send({
            nome: 'gabriel'
        })

        expect(res.statusCode).toBe(400);
    });


    it ('Enviar com argumentos incorretos', async () => {
        const res = await request(app).post('/api/users').send({});

        expect(res.statusCode).toBe(400);
    });

    it ('Enviar com nome sedran', async () => {
        const res = await request(app).post('/api/users').send({
            nome: 'sedran'
        });

        expect(res.statusCode).toBe(400);
    });

    it ('Enviar com nome publica', async () => {
        const res = await request(app).post('/api/users').send({
            nome: 'publica'
        });

        expect(res.statusCode).toBe(400);
    });


    it('Deletar usuário e deletar', async () => {
        const user = await request(app).post('/api/users').send({
            nome: 'gabriel'
        });

        const token = user.body.token;

        const res = await request(app).delete('/api/users').set('Authorization', `Bearer ${token}`).send({});
        
        expect(res.statusCode).toBe(200);
    })
})