Feature: Transferências
  Como usuário autenticado
  Quero realizar e consultar transferências
  Para movimentar valores entre contas

  Scenario: Transferência abaixo do valor mínimo
    Given que possuo um token JWT válido
    When envio uma requisição POST para "/transferencias" com body:
      """
      { "contaOrigem": 1, "contaDestino": 2, "valor": 5 }
      """
    Then o sistema deve retornar status 422
    And a resposta deve conter "Valor mínimo é R$10,00"

  Scenario: Transferência sem saldo suficiente
    Given que possuo um token JWT válido
    And a conta de origem possui saldo "100"
    When envio uma requisição POST para "/transferencias" com body:
      """
      { "contaOrigem": 1, "contaDestino": 2, "valor": 200 }
      """
    Then o sistema deve retornar status 422
    And a resposta deve conter "Saldo insuficiente"

  Scenario: Transferência acima de 5000 sem token adicional
    Given que possuo um token JWT válido
    When envio uma requisição POST para "/transferencias" com body:
      """
      { "contaOrigem": 1, "contaDestino": 2, "valor": 6000 }
      """
    Then o sistema deve retornar status 401
    And a resposta deve conter "Token adicional obrigatório"

  Scenario: Transferência bem-sucedida
    Given que possuo um token JWT válido
    And a conta de origem possui saldo suficiente
    And as contas estão ativas
    When envio uma requisição POST para "/transferencias" com body:
      """
      { "contaOrigem": 1, "contaDestino": 2, "valor": 1000 }
      """
    Then o sistema deve retornar status 201
    And a resposta deve confirmar a transferência

  Scenario: Consultar lista de transferências paginada
    Given que possuo um token JWT válido
    When envio uma requisição GET para "/transferencias?page=1&limit=10"
    Then o sistema deve retornar status 200
    And a resposta deve conter os campos "page", "limit", "total" e "transferencias"

  Scenario: Consultar transferência inexistente por ID
    Given que possuo um token JWT válido
    When envio uma requisição GET para "/transferencias/9999"
    Then o sistema deve retornar status 404
    And a resposta deve conter "Transferência não encontrada"

  Scenario: Atualizar transferência com valor inválido
    Given que possuo um token JWT válido
    When envio uma requisição PUT para "/transferencias/1" com body:
      """
      { "contaOrigem": 1, "contaDestino": 2, "valor": 5 }
      """
    Then o sistema deve retornar status 422
    And a resposta deve conter "Valor mínimo é R$10,00"

  Scenario: Remover transferência inexistente
    Given que possuo um token JWT válido
    When envio uma requisição DELETE para "/transferencias/9999"
    Then o sistema deve retornar status 404
    And a resposta deve conter "Transferência não encontrada"
