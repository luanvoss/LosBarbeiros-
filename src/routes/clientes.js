const express = require('express');
const { pool } = require('../config/db');
const router = express.Router(); 
// Rota GET - /clientes 
// Retorna as colunas 'id,Nome,Email,Telefone' da tabela 'Clientes' - SELECT nome FROM Cliente
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Cliente');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao consultar clientes:', error);
    res.status(500).json({ error: 'Erro ao consultar clientes', details: error.message });
  }
});
// Rota GET para /clientes/:id - consulta um cliente específico pelo ID 
// Retorna o cliente correspondente ao ID fornecido - SELECT * FROM cliente WHERE id = ?
router.get('/:id', async (req, res) => {
  const clientesId = req.params.id; 
  try {
    const [rows] = await pool.execute('SELECT * FROM cliente WHERE id = ?', [clientesId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(rows[0]); 
  } catch (error) {
    console.error('Erro ao consultar produto:', error);
    res.status(500).json({ error: 'Erro ao consultar produto', details: error.message });
  }
});
// Rota GET para /clientes/nome/:nome - consulta um cliente específico pelo nome  
// Retorna o cliente correspondente ao nome fornecido  - SELECT * FROM cliente  WHERE Nome = ?
router.get('/nome/:nome', async (req,res) => {
  const Nome = req.params.nome;
  try{
    const [rows] = await pool.execute('SELECT * FROM cliente WHERE Nome = ?',[Nome]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(rows[0]); 
  } catch (error) {
    console.error('Erro ao consultar cliente:', error);
    res.status(500).json({ error: 'Erro ao consultar cliente', details: error.message });
  }
});
// Rota DELETE - /clientes/:id - deleta um cliente 
router.delete('/:id', async (req, res) => {
  const clientesId= req.params.id;
  try {
// Primeiro verifica se o cliente existe
    const [cliente]= await pool.execute('SELECT * FROM cliente WHERE id = ?', [clientesId]);
    if (cliente.length === 0) {
      return res.status(404).json({ error: 'Cliente não encotrado'});
    }
// Procede com a exclusão do cliente 
    const [result] = await pool.execute('DELETE FROM cliente WHERE id  = ?', [clientesId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({ 
      message: 'Cliente excluído com sucesso',
      cliente: cliente[0].nome,
      id: clientesId
    });

  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ error: 'Erro ao excluir cliente, consulte se o cliente tem agendamento. Se "sim" exclua o agendamento', details: error.message });
  }
  });

// Rota POST - /clientes - cria um novc cliente 
// Insere um novo cliente na tabela 'clientes' - INSERT INTO clientes  (nome) VALUES (?)
router.post('/', async (req, res) => {
  const { Nome,Email,Telefone } = req.body;
// Validação de dados
  if (!Nome || Nome.trim() === '') {
    return res.status(400).json({ 
      error: 'Nome do cliente é obrigatório',
      message: 'Forneça um nome válido para o cliente'
    });
  }
// Verifica o tamanho do nome do cliente, se está dentro dos 50 caracteres permitidos 
  if (Nome.length > 50) {
    return res.status(400).json({ 
      error: 'Nome muito longo',
      message: 'O nome do cliente deve ter no máximo 30 caracteres'
    });
  }
// Verifica o tamanho do telefone do cliente, se está dentro dos 11 caracteres permitidos 
  if(Telefone.length > 11){
    return res.status(400).json({
      error:'Telefone muito longo, use até 11 caracteres',
      message: 'O telefone deve ter no máximo 11 caracteres'
    });
  }
// Verifica o tamanho do E-mail do cliente, se está dentro dos 50 caracteres permitidos 
  if(Email.length > 50){
    return res.status(400).json({
      error:'E-mail muito longo, use até 50 caracteres',
      message: 'O E-mail deve ter no máximo 50 caracteres'
    });
  }
// Verifica se já existe uma cliente com este nome
  try {
    const [clienteExistente] = await pool.execute('SELECT * FROM cliente WHERE nome = ?', [Nome]);
    if (clienteExistente.length > 0) {
      return res.status(409).json({ 
        error: 'Cliente já existe',
        message: `Já existe uma cliente com o nome "${Nome}"`
      });
    }
// Insere um novo cliente 
    const [result] = await pool.execute('INSERT INTO cliente (Nome,Email,Telefone) VALUES (?,?,?)', [Nome,Email,Telefone]);

// Busca um cliente inserido para retornar os dados completos (incluindo o ID criado automaticamente,Nome,E-mail,Telefone)
    const [novoCliente] = await pool.execute('SELECT * FROM cliente WHERE id = ?', [result.insertId]);
res.status(201).json({
      message: 'Cliente cadastrado com sucesso',
      cliente: novoCliente[0]
    });
    } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    res.status(500).json({ error: 'Erro ao cadastrar cliente', details: error.message });
  }
  
});

// Rota PUT - /clientes/:id - atualiza um cliente específico pelo ID
// Atualiza os dados de um cliente existente - UPDATE categorias SET Nome,Email,Telefone = ? WHERE id,Nome,E-mail,Telefone = ?
router.put('/:id', async (req, res) => {
  const clientesId = req.params.id;
  const { Nome,Email,Telefone } = req.body;
  
  // Validação de dados
  if (!Nome || Nome.trim() === '') {
    return res.status(400).json({ 
      error: 'Nome do cliente é obrigatório',
      message: 'Forneça um nome válido para o cliente'
    })
  }
  if (!Email || Email.trim() === '') {
    return res.status(400).json({ 
      error: 'Email do cliente é obrigatório',
      message: 'Forneça um Email válido para o cliente'
    })
  }
  if (!Telefone || Telefone.trim() === '') {
    return res.status(400).json({ 
      error: 'Telefone do cliente é obrigatório',
      message: 'Forneça um Telefone válido para o cliente'
    })
  }
   
// Verifica o tamanho do nome do cliente, se está dentro dos 50 caracteres permitidos 
  if (Nome.length > 50) {
    return res.status(400).json({ 
      error: 'Nome muito longo',
      message: 'O nome do cliente deve ter no máximo 50 caracteres'
    });
  }
// Verifica o tamanho do E-mail do cliente, se está dentro dos 50 caracteres permitidos
  if (Email.length > 50) {
    return res.status(400).json({ 
      error: 'E-mail muito longo',
      message: 'O E-mail do cliente deve ter no máximo 50 caracteres'
    });
  }
// Verifica o tamanho do telefone do cliente, se está dentro dos 11 caracteres permitidos
  if (Telefone.length > 11) {
    return res.status(400).json({ 
      error: 'Telefone muito longo',
      message: 'O Telefone do cliente deve ter no máximo 11 caracteres'
    });
  }

  // Primeiro verifica se o cliente existe
  try {
    const [clienteExistente] = await pool.execute('SELECT * FROM cliente WHERE id = ?', [clientesId]);
    if (clienteExistente.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
  
// Verifica se já existe outro cliente com este nome
    const [clienteComMesmoNome] = await pool.execute(
      'SELECT * FROM cliente WHERE nome = ? AND id = ?', 
      [Nome, clientesId]
    );
    if (clienteComMesmoNome.length > 0) {
      return res.status(409).json({ 
        error: 'cliente já existe',
        message: `Já existe outro cliente com o nome "${Nome}"`
      });
    }

// Se o nome é o mesmo que já existe, não precisa atualizar
    if (clienteExistente[0].nome === Nome) {
      return res.status(200).json({
        message: 'Cliente não foi modificado',
        cliente: clienteExistente[0],
        observacao: 'O cliente fornecido é igual ao cliente atual já cadastrado'
      });
    }

// Atualiza o cliente 
    const [resultNome] = await pool.execute('UPDATE cliente SET Nome = ?, Email = ?, Telefone = ? WHERE id = ?', [Nome, Email, Telefone, clientesId]);
    if (resultNome.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }


    // const [resultEmail] = await pool.execute('UPDATE cliente SET Email = ? WHERE id = ?', [Email, clientesId]);
    // if (resultEmail.affectedRows === 0) {
    //   return res.status(404).json({ error: 'Email não encontrado' });
    // }

    //  const [resultTelefone] = await pool.execute('UPDATE cliente SET Telefone = ? WHERE id = ?', [Telefone, clientesId]);
    // if (resultTelefone.affectedRows === 0) {
    //   return res.status(404).json({ error: 'Telefone não encontrado' });
    // }

// Busca o cliente atualizado para retornar os dados completos
    const [clienteAtualizado] = await pool.execute('SELECT * FROM cliente WHERE id = ?', [clientesId]);

    res.json({
      message: 'Cliente atualizada com sucesso',
      clienteAtualizado: clienteAtualizado[0],
      clienteAnterior: clienteExistente[0]
    });
    } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente', details: error.message });
  }
});

module.exports = router;