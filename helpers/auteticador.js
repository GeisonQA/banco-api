const req = require('supertest');
const { app } = require('../rest/app.js');
const credenciais = require('../fixtures/credenciais.json');


const obterToken = async()=>{
      const response = await req(app)
                .post('/login')
                .set('Content-type', 'application/json')
                .send(credenciais);

      return response.body.token;
}

module.exports = {obterToken}