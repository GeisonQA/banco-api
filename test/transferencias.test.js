const req = require('supertest');
const { app } = require('../rest/app.js');
const { expect } = require('chai');
const { obterToken } = require('../helpers/auteticador.js')
const dadosTransferencia = require('../fixtures/dadosTransferencia.json');
const saldoInvalido = require('../fixtures/saldoInvalido.json');


describe('POST', () => {

    let token;

    beforeEach(async () => {
        token = await obterToken();
    });


    describe('POST/transferencias', () => {
        it('Não deve permitir transferência abaixo do valor mínimo permitido, deve retornar status 422', async() => {

            const response = await req(app)
                .post('/transferencias')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(dadosTransferencia);

                expect(response.status).to.equal(422);
                expect(response.body).to.have.property('error', 'O valor da transferência deve ser maior ou igual a R$10,00.');
            
        });

        it('Não deve permitir transferência quando não houver saldo suficiente ', async() => {

            const response = await req(app)
                .post('/transferencias')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(saldoInvalido);

                expect(response.status).to.equal(422);
                expect(response.body).to.have.property('error', 'Saldo insuficiente para realizar a transferência.');

        })


    });

});