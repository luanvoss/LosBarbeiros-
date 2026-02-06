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
    res.json(rows[0]); // retorna o primeiro (e único) resultado
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
    res.json(rows[0]); // retorna o primeiro (e único) resultado
  } catch (error) {
    console.error('Erro ao consultar produto:', error);
    res.status(500).json({ error: 'Erro ao consultar produto', details: error.message });
  }
});

module.exports = router;