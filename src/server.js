const express = require('express');
const { pool } = require('./config/db');
const app = express(); 

app.get('/Clientes', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Clientes');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao consultar produtos:', error);
    res.status(500).json({ error: 'Erro ao consultar produtos', details: error.message });
  }
});






module.exports = app; 