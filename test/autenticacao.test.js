const req = require('supertest');
const { app } = require('../rest/app.js');
const { expect } = require('chai');
const credenciais = require('../fixtures/credenciais.json');
const credenciaisInvalidas = require('../fixtures/credenciaisInvalidas.json');
const credenciaisVazia = require('../fixtures/credenciaisVazia.json');


describe('POST', () => {
    describe('POST/login', () => {
        it('Deve retornar status 200 para login com credenciais validas', async() => {
            
            const response = await req(app)
                .post('/login')
                .set('Content-type', 'application/json')
                .send(credenciais);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('token');
            
        });

        it('Deve retornar status 401 para login com credenciais invalidas', async() => {
            
            const response = await req(app)
                .post('/login')
                .set('Content-type', 'application/json')
                .send(credenciaisInvalidas);

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error', 'Usuário ou senha inválidos.');

        });

        it('Deve retornar status 400 para login com credenciais vazias', async() => {
            
            const response = await req(app)
                .post('/login')
                .set('Content-type', 'application/json')
                .send(credenciaisVazia);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Usuário e senha são obrigatórios.');

        });
       
    });
});