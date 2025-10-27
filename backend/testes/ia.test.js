const request = require('supertest');
const app = require('../src/index.js');
const { connect, closeDatabase, clearDatabase } = require('./setup');
//Desconecte o banco de dados no index.js e desligue o servidor

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

