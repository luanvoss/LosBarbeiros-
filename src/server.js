const express = require('express');
const { pool } = require('./config/db');
const app = express(); 

const clientesRoutes = require('./routes/clientes');
const barbeirosRoutes = require('./routes/barbeiros');
const agendaRoutes = require('./routes/agenda');

app.use('/clientes', clientesRoutes);
app.use('/barbeiros', barbeirosRoutes);
app.use('/agenda', agendaRoutes); 

module.exports = app; 