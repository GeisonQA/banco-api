const req = require('supertest');
const { app } = require('../rest/app.js');
const { expect } = require('chai');
const { obterToken } = require('../helpers/auteticador.js')
const dadosTransferencia = require('../fixtures/dadosTransferencia.json');
const saldoInvalido = require('../fixtures/saldoInvalido.json');
const transferenciaAcimaDeCincoMil = require('../fixtures/transferenciaAcimaDeCincoMil.json');
const saldoValido = require('../fixtures/saldoValido.json');        


describe('Transferencias', () => {

    let token;

    beforeEach(async () => {
        token = await obterToken();
    });


    describe('POST/transferencias', () => {
        it('Não deve permitir transferência abaixo do valor mínimo permitido, deve retornar status 422', async () => {

            const response = await req(app)
                .post('/transferencias')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(dadosTransferencia);

            expect(response.status).to.equal(422);
            expect(response.body).to.have.property('error', 'O valor da transferência deve ser maior ou igual a R$10,00.');

        });

        it('Não deve permitir transferência quando não houver saldo suficiente ', async () => {

            const response = await req(app)
                .post('/transferencias')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(saldoInvalido);

            expect(response.status).to.equal(422);
            expect(response.body).to.have.property('error', 'Saldo insuficiente para realizar a transferência.');

        });

        it('Validar que transferencias acima de 5000 sem token adicional retornará status 401 e resposta deve conter "Token adicional obrigatório" ', async () => {

            const response = await req(app)
                .post('/transferencias')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(transferenciaAcimaDeCincoMil);

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error', 'Autenticação necessária para transferências acima de R$5.000,00.');

        });

        it('Deve permitir transferência quando houver saldo suficiente e contas ativas. ', async () => {

            const response = await req(app)
                .post('/transferencias')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(saldoValido);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message', 'Transferência realizada com sucesso.');

        });

        it('Deve retornar a lista de transferências paginada com os campos obrigatórios', async () => {

            const response = await req(app)
                .get('/transferencias?pagina/1/limite/10')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                
           
            expect(response.status).to.equal(200);
      
            expect(response.body).to.have.property('page').that.is.a('number');
            expect(response.body).to.have.property('limit').that.is.a('number');
            expect(response.body).to.have.property('total').that.is.a('number');
            expect(response.body.transferencias.length).to.be.at.most(10);
            

            
        });

        it.skip('Deve retornar 404 e a mensagem "Transferência não encontrada" ao consultar uma transferência inexistente', async () => {

            const response = await req(app)
                .get('/transferencias/100')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                
           
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('error', 'Transferência não encontrada.');

        });

        it('Deve retornar 422 e a mensagem "Valor mínimo é R$10,00" ao tentar atualizar uma transferência com valor inválido', async () => {

            const response = await req(app)
                .put('/transferencias/5')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(dadosTransferencia);

            expect(response.status).to.equal(422);
            expect(response.body).to.have.property('error', 'O valor da transferência deve ser maior ou igual a R$10,00.');

        });

        it('Deve retornar 404 e a mensagem "Transferência não encontrada" ao tentar remover uma transferência inexistente', async () => {

            const response = await req(app)
                .delete('/transferencias/1')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)

                expect(response.status).to.equal(404);
                expect(response.body).to.have.property('error', 'Transferência não encontrada.');

        });

    });

});