const express = require('express');
const { pool } = require('../config/db');
const router = express.Router(); 

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Cliente');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao consultar clientes:', error);
    res.status(500).json({ error: 'Erro ao consultar clientes', details: error.message });
  }
});

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

router.delete('/:id', async (req, res) => {
  const clientesId= req.params.id;
  try {
    const [cliente]= await pool.execute('SELECT * FROM cliente WHERE id = ?', [clientesId]);
    if (cliente.length === 0) {
      return res.status(404).json({ error: 'Cliente não encotrado'});
    }

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

router.post('/', async (req, res) => {
  const { Nome,Email,Telefone } = req.body;
  
  if (!Nome || Nome.trim() === '') {
    return res.status(400).json({ 
      error: 'Nome do cliente é obrigatório',
      message: 'Forneça um nome válido para o cliente'
    });
  }
  if (Nome.length > 30) {
    return res.status(400).json({ 
      error: 'Nome muito longo',
      message: 'O nome do cliente deve ter no máximo 30 caracteres'
    });
  }
  if(Telefone.length > 30){
    return res.status(400).json({
      error:'Telefone muito longo, use até 11 caracteres',
      message: 'O telefone deve ter no máximo 11 caracteres'
    });

  }
  try {
    const [clienteExistente] = await pool.execute('SELECT * FROM cliente WHERE nome = ?', [Nome]);
    if (clienteExistente.length > 0) {
      return res.status(409).json({ 
        error: 'Cliente já existe',
        message: `Já existe uma cliente com o nome "${Nome}"`
      });
    }
    const [result] = await pool.execute('INSERT INTO cliente (Nome,Email,Telefone) VALUES (?,?,?)', [Nome,Email,Telefone]);
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

module.exports = router;