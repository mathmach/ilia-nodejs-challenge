# Code Challenge NodeJS

Antes de começar

O Framework SST aparentemente é algo novo no qual nunca tinha visto, achei bem interessante e desafiador o projeto, porém devido ao tempo que pude dedicar ao desafio, tive que priorizar algumas coisas para que a aplicação ficasse funcional no mínimo, além disso ainda é bem inacessível encontrar conteúdos a respeito do framework, até na própria documentação que possuí páginas quebradas como é o caso da documentação de envs. Além disso alguns critérios como Docker eu fiquei na dúvida pois o SST.dev utiliza toda a infra da AWS e não encontrei uma forma de criar um container localhost.

## Começando

Instale o exemplo.

```bash
$ npm install
```

## Commands

### `npm run start`

Inicia a aplicação (usar para cada microserviço).

### `npm run test`

Inicia os testes usando Jest (apenas teste padrão de inicialização).

## Documentação API

### Microserviços

`User`

    https://documenter.getpostman.com/view/1856117/2s8YzS1iqV

`Wallet`

    https://documenter.getpostman.com/view/1856117/2s8YzS1iqX

## Como executar usando Postman

Usar os arquivos **Microservice Users.postman_collection.json**, **Microservice Wallet.postman_collection.json** e **SST.postman_environment.json** para importar no Postman

Definir a env principal baseUrl com a URL gerada ao iniciar a aplicação, seguindo a sequência abaixo, as envs necessárias serão geradas automaticamente:

> - criar usuário
> - autenticar
> - criar transação

Seguindo esse fluxo o Postman irá popular as envs necessárias para as chamadas de consulta
