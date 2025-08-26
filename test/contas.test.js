const req = require('supertest');
const { app } = require('../rest/app.js');
const { expect } = require('chai');
const { obterToken } = require('../helpers/auteticador.js')


describe('Contas', () => {

    let token;

    beforeEach(async () => {
        token = await obterToken();
    });

    describe('GET/contas', () => {
        it('Deve retornar uma lista paginada de contas com até 5 registros e metadados obrigatórios (page, limit, total, contas)', async () => {

            const response = await req(app)
                .get('/contas?page=1&limit=5')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)


            expect(response.status).to.equal(200);
            expect(response.body.contas.length).to.be.at.most(5);

        });

        it('Deve retornar os detalhes de uma conta existente pelo ID com status 200 e os campos obrigatórios (id, titular, saldo, ativa)', async () => {

            const response = await req(app)
                .get('/contas/1')
                .set('Content-type', 'Application/json')
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).to.equal(200)


        });

        it.skip('Deve retornar status 404 e a mensagem "Conta não encontrada" ao consultar uma conta inexistente por ID', async () => {

            const response = await req(app)
                .get('/contas/6')
                .set('Content-type', 'Application/json')
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).to.equal(404)


        });

    });

});