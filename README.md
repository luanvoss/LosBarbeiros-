# API RESTful - Barbearia Los Barbeiros
   Este projeto é uma API RESTful feita em Node.js com Express e conectada ao banco MySQL.
   Ela permite cadastrar, listar, atualizar e excluir clientes, barbeiros e agendamentos.

   ###### **•Importante : Antes de iniciar, configure seu banco MySQL e o arquivo .env**

```bash

   .env
   
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASS=root
    DB_NAME=LosBarbeiros

```

## Objetivo do Projeto :
 O objetivo é praticar o desenvolvimento de uma API REST usando Node.js e Express.
 O projeto também treina CRUD, rotas, conexão com banco e testes no Postman.


## Tecnologias Usadas :

- Node.js ➝ usado para rodar o backend.

- Express ➝ usado para criar as rotas e endpoints.

- MySQL ➝ usado para armazenar os dados.

- Postman ➝ usado para testar as requisições da API.


## Organização do Projeto :
- O projeto foi separado em pastas para facilitar a manutenção e leitura do código.

```bash

Pasta/Arquivo :                       Para que serve :

• /config                    ➝          •configuração do banco de dados

• /routes                    ➝          •rotas da API (clientes, barbeiros, agenda)

• server.js                  ➝          •arquivo principal que inicia o servidor

• /config/db.js              ➝          •Faz a conexão com o banco MySQL

• /routes/clientes.js        ➝          •Rotas e CRUD dos clientes

• /routes/barbeiros.js       ➝          •Rotas e CRUD dos barbeiros

• /routes/agenda.js          ➝          •Rotas e CRUD dos agendamentos

```
---

## Como Rodar o Projeto :

1) Instalar dependências ➝
Esse comando instala tudo que o projeto precisa para funcionar.

```bash

npm install

```

2) Rodar o servidor ➝
Esse comando liga a API para poder testar no Postman.

```bash

npm start

```

## URL Base da API ➝
A API roda na seguinte URL:

```bash

http://localhost:3001

```

---

## **Tabelas do Banco de Dados :**

- O projeto utiliza as seguintes tabelas no MySQL ➝

```bash

Tabela :                         O que armazena :

• clientes                         • Dados dos clientes

• barbeiros                        • Dados dos barbeiros

• agenda                           • Agendamentos feitos

```

---

## Rotas de Clientes :
Essas rotas controlam o cadastro e gerenciamento dos clientes.

**GET - Listar todos os clientes**

- Retorna todos os clientes cadastrados no banco.

  GET /clientes

---

**GET - Buscar cliente por ID**

- Retorna um cliente específico usando o ID.

  GET /clientes/:id

---

**GET - Buscar cliente por Nome**

- Retorna um cliente específico usando o nome.

  GET /clientes/nome/:nome

---

**POST - Criar cliente**

- Cria um novo cliente no banco com nome, email e telefone.

  POST /clientes

---

```bash

Exemplo de JSON:
{
  "Nome": "Fernando Silva",
  "Email": "fernando@email.com",
  "Telefone": "22777777777"
}

```

---

**PUT - Atualizar cliente completo**

- Atualiza todos os dados do cliente de uma vez.

  PUT /clientes/:id

---

**PATCH - Atualizar apenas um campo**

**- Atualiza somente um dado específico do cliente.**

  

- PATCH /clientes/updateNome/:id
  
  
  
- PATCH /clientes/updateEmail/:id
  
  
  
- PATCH /clientes/updateTelefone/:id

---

**DELETE - Excluir cliente**

- Remove um cliente do banco usando o ID.

  DELETE /clientes/:id

---

## **Rotas de Barbeiros**
Essas rotas controlam o cadastro e gerenciamento dos barbeiros.

---

**GET - Listar barbeiros**

- Mostra todos os barbeiros cadastrados.

  GET /barbeiros

---

**GET - Buscar barbeiro por Nome**

- Busca um barbeiro específico pelo nome.

  GET /barbeiros/nome/:nome

---

**GET - Buscar barbeiro por ID**

- Busca um barbeiro específico pelo ID.

  GET /barbeiros/:id

---

**POST - Criar barbeiro**

- Cadastra um barbeiro novo com CPF, nome, email e telefone.

  POST /barbeiros

---

```bash

Exemplo de JSON:
{
  "CPF": "01123456789",
  "Nome": "Lucas Barbeiro",
  "Email": "lucas@barbearia.com",
  "Telefone": "11999990000"
}

```

---

**PUT - Atualizar barbeiro completo**

- Atualiza todos os dados do barbeiro de uma vez.

  PUT /barbeiros/:id

---

**PATCH - Atualizar Nome, Email ou Telefone**

- Atualiza somente um campo específico do barbeiro.
  

- PATCH /barbeiros/updateNome/:id
  
  
  
  
- PATCH /barbeiros/updateEmail/:id




- PATCH /barbeiros/updateTelefone/:id

---

**DELETE - Excluir barbeiro**

- Remove um barbeiro do banco usando o ID ou nome.



- DELETE /barbeiros/:id

  



- DELETE /barbeiros/nome/:nome

---

## **Rotas de Agenda (Agendamentos)**
Essas rotas controlam os agendamentos entre clientes e barbeiros.

---

**GET - Listar agendamentos**

- Mostra todos os agendamentos cadastrados.

  GET /agenda

---

**GET - Buscar agendamento por ID**

- Busca um agendamento específico usando o ID.

  GET /agenda/:id

---

**POST - Criar agendamento**

- Cria um agendamento com data, hora, serviço, status, cliente e barbeiro.

  POST /agenda

---

```bash

Exemplo de JSON:
{
  "Data_agendamento": "2026-02-17",
  "Hora": "10:32:00",
  "Servico": "Corte + Barba",
  "Status_agendamento": ativo,
  "id_cliente": 1,
  "CPF_barbeiro": "01123456789"
}

```

---

**PUT - Atualizar agendamento**

- Atualiza os dados de um agendamento existente.

  PUT /agenda/:id

---

**DELETE - Excluir agendamento**

- Remove um agendamento do banco usando o ID.

  DELETE /agenda/:id

---

## Testes no Postman :
- O Postman foi usado para testar todas as rotas (GET, POST, PUT, PATCH e DELETE).
Basta colocar a rota, escolher o método e enviar o JSON no Body.

---

#### Projeto Feito ➝
- Projeto desenvolvido por : Deryck, Luan e Lucas