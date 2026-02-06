const express = require('express');
const { pool } = require('../config/db');
const router = express.Router(); 

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM agenda');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao consultar agenda:', error);
    res.status(500).json({ error: 'Erro ao agenda', details: error.message });
  }
});

module.exports = router;