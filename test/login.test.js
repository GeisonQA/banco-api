const {app} = require('../rest/app')
const request = require('supertest')
const {expect} = require('chai')

describe('POST', () => {
    describe('POST/login', () => {
        it('Validar status 200 para credenciais validas', async() => {
            const response = await request(app)
                .post('/login')
                .set('Content-type','Application/json')
                .send({username:'julio.lima', senha:'123456'})

                expect(response.status).to.equal(200)
                expect(response.body.token).to.be.a('string')
        });
        
    });
    
});