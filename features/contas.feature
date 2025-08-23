Feature: Consultar Contas
  Como usuário autenticado
  Quero consultar contas bancárias
  Para visualizar saldos e status das contas

  Scenario: Consultar lista de contas com paginação
    Given que possuo um token JWT válido
    When envio uma requisição GET para "/contas?page=1&limit=5"
    Then o sistema deve retornar status 200
    And a resposta deve conter uma lista de até "5" contas
    And a resposta deve conter os campos "page", "limit", "total" e "contas"

  Scenario: Consultar conta existente por ID
    Given que possuo um token JWT válido
    When envio uma requisição GET para "/contas/1"
    Then o sistema deve retornar status 200
    And a resposta deve conter os campos "id", "titular", "saldo", "ativa"

  Scenario: Consultar conta inexistente por ID
    Given que possuo um token JWT válido
    When envio uma requisição GET para "/contas/9999"
    Then o sistema deve retornar status 404
    And a resposta deve conter "Conta não encontrada"

  Scenario: Consultar contas sem autenticação
    Given que não informo o token JWT
    When envio uma requisição GET para "/contas"
    Then o sistema deve retornar status 401
    And a resposta deve conter "Autenticação necessária"