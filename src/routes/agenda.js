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

router.delete('/:id', async (req, res) => {
  const agendaId= req.params.id;
  try {
    const [agenda]= await pool.execute('SELECT * FROM agenda WHERE Id_agendamento = ?', [agendaId]);
    if (agenda.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encotrado'});
    }

    const [result] = await pool.execute('DELETE FROM agenda WHERE Id_agendamento  = ?', [agendaId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.json({ 
      message: 'Agendamento excluído com sucesso',
      agenda: agenda[0].id,
      id: agendaId
    });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).json({ error: 'Erro ao excluir agendamento', details: error.message });
  }
  
});


});

module.exports = router;