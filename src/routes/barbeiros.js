const express = require('express');
const { pool } = require('../config/db');
const router = express.Router(); 

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM barbeiro');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao consultar barbeiro:', error);
    res.status(500).json({ error: 'Erro ao consultar barbeiro', details: error.message });
  }
});

module.exports = router;