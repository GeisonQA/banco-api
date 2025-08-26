Feature: Autenticação de Usuário
  Como cliente da API
  Quero realizar login com usuário e senha
  Para obter um token JWT e acessar os serviços

  Scenario: Login bem-sucedido
    Given que informo username "joao" e senha "12345"
    When envio uma requisição POST para "/login"
    Then o sistema deve retornar status 200
    And a resposta deve conter o campo "token"
    And o token deve expirar em 1 hora

  Scenario: Login com credenciais inválidas
    Given que informo username "joao" e senha "errada"
    When envio uma requisição POST para "/login"
    Then o sistema deve retornar status 401
    And a resposta deve conter a mensagem "Credenciais inválidas"

  Scenario: Login com parâmetros ausentes
    Given que não envio o campo "senha"
    When envio uma requisição POST para "/login"
    Then o sistema deve retornar status 400
    And a resposta deve conter "Parâmetros de login ausentes"
