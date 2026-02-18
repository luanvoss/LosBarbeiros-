const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();


// consulta a tabela barbeiros
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM barbeiros');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao consultar barbeiro:', error);
    res.status(500).json({ error: 'Erro ao consultar barbeiro', details: error.message });
  }
});

// consulta barbeiro pelo id
router.get('/:id', async (req, res) => {
  const barbeirosId = req.params.id; 
  try {
    const [rows] = await pool.execute('SELECT * FROM barbeiros WHERE id = ?', [barbeirosId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' });
    }
    res.json(rows[0]); 
  } catch (error) {
    console.error('Erro ao consultar barbeiro:', error);
    res.status(500).json({ error: 'Erro ao consultar barbeiro', details: error.message });
  }
});

// Rota GET para / consultar barbeiro pelo nome
router.get('/nome/:nome', async (req,res) => {
  const Nome = req.params.nome;
  try{
    const [rows] = await pool.execute('SELECT * FROM barbeiros WHERE Nome = ?',[Nome]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' });
    }
    res.json(rows[0]); 
  } catch (error) {
    console.error('Erro ao consultar barbeiro:', error);
    res.status(500).json({ error: 'Erro ao consultar barbeiro', details: error.message });
  }
});

// Rota DELETE - /barbeiros/:id - deleta um barbeiro pelo id
router.delete('/:id', async (req, res) => {
  const barbeirosId= req.params.id;
  try {
// Primeiro verifica se o barbeiro existe
    const [barbeiro]= await pool.execute('SELECT * FROM barbeiros WHERE id = ?', [barbeirosId]);
    if (barbeiro.length === 0) {
      return res.status(404).json({ error: 'Barbeiro não encotrado'});
    }
// Procede com a exclusão do barbeiro 
    const [result] = await pool.execute('DELETE FROM barbeiros WHERE id  = ?', [barbeirosId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' });
    }

    res.json({ 
      message: 'Barbeiro excluído com sucesso',
      cliente: cliente[0].nome,
      id: barbeirosId
    });

  } catch (error) {
    console.error('Erro ao excluir barbeiro:', error);
    res.status(500).json({ error: 'Erro ao excluir barbeiro, consulte se o barbeiro tem agendamento. Se "sim" exclua o agendamento', details: error.message });
  }
  });

  //DELETE - /barbeiros/nome/:nome - deleta um barbeiro pelo nome
router.delete('/nome/:nome', async (req, res) => {
  const Nome = req.params.nome;
  try {
// Primeiro verifica se o barbeiro existe
    const [barbeiro]= await pool.execute('SELECT * FROM barbeiros WHERE Nome = ?', [Nome]);
    if (barbeiro.length === 0) {
      return res.status(404).json({ error: 'Barbeiro não encotrado'});
    }
// Procede com a exclusão do barbeiro 
    const [result] = await pool.execute('DELETE FROM barbeiros WHERE Nome  = ?', [Nome]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' });
    }

    res.json({ 
      message: 'Barbeiro excluído com sucesso',
      barbeiro: barbeiro[0].nome,
    });

  } catch (error) {
    console.error('Erro ao excluir barbeiro:', error);
    res.status(500).json({ error: 'Erro ao excluir barbeiro, consulte se o barbeiro tem agendamento. Se "sim" exclua o agendamento', details: error.message });
  }
  });

// Rota POST - /barbeiros - cria um novo barbeiro 
// Insere um novo barbeiro na tabela 'barbeiros' - INSERT INTO barbeiros  (nome) VALUES (?)
router.post('/', async (req, res) => {
  const { CPF,Nome,Telefone,Email, } = req.body;

  // Verifica o tamanho do CPF do barbeiro, se está dentro dos 11 caracteres permitidos 
  if(CPF.length > 11){
    return res.status(400).json({
      error:'CPF muito longo, deve conter 11 caracteres',
      message: 'O CPF deve conter 11 caracteres'
    });
  }
  
// Validação de dados
  if (!Nome || Nome.trim() === '') {
    return res.status(400).json({ 
      error: 'Nome do barbeiro é obrigatório',
      message: 'Forneça um nome válido para o barbeiro'
    });
  }

// Verifica o tamanho do nome do barbeiro, se está dentro dos 50 caracteres permitidos 
  if (Nome.length > 50) {
    return res.status(400).json({ 
      error: 'Nome muito longo',
      message: 'O nome do barbeiro deve ter no máximo 50 caracteres'
    });
  }

// Verifica o tamanho do telefone do barbeiro, se está dentro dos 11 caracteres permitidos 
  if(Telefone.length > 11){
    return res.status(400).json({
      error:'Telefone muito longo, use até 11 caracteres',
      message: 'O telefone deve ter no máximo 11 caracteres'
    });
  }

// Verifica o tamanho do E-mail do barbeiro, se está dentro dos 50 caracteres permitidos 
  if(Email.length > 50){
    return res.status(400).json({
      error:'E-mail muito longo, use até 50 caracteres',
      message: 'O E-mail deve ter no máximo 50 caracteres'
    });
  }

// Verifica se já existe um barbeiro com este nome
  try {
    const [barbeiroExistente] = await pool.execute('SELECT * FROM barbeiros WHERE nome = ?', [Nome]);
    if (barbeiroExistente.length > 0) {
      return res.status(409).json({ 
        error: 'Barbeiro já existe',
        message: `Já existe um barbeiro com o nome "${Nome}"`
      });
    }

// Insere um novo barbeiro
    const [result] = await pool.execute('INSERT INTO barbeiros (CPF,Nome,Email,Telefone) VALUES (?,?,?,?)', [CPF,Nome,Email,Telefone]);

// Busca um barbeiro inserido para retornar os dados completos (incluindo o ID criado automaticamente,CPF,Nome,E-mail,Telefone)
    const [novoBarbeiro] = await pool.execute('SELECT * FROM barbeiros WHERE id = ?', [result.insertId]);
res.status(201).json({
      message: 'Barbeiro cadastrado com sucesso',
      barbeiro: novoBarbeiro[0]
    });
    } catch (error) {
    console.error('Erro ao cadastrar barbeiro:', error);
    res.status(500).json({ error: 'Erro ao cadastrar barbeiro', details: error.message });
  }
  
});

// Rota PUT - /barbeiros/:id - atualiza um barbeiro específico pelo ID
// Atualiza os dados de um barbeiro existente - UPDATE categorias SET CPF,Nome,Email,Telefone = ? WHERE CPF,id,Nome,E-mail,Telefone = ?
router.put('/:id', async (req, res) => {
  const barbeirosId = req.params.id;
  const { CPF,Nome,Email,Telefone } = req.body;

   // Verifica o tamanho do CPF do barbeiro, se está dentro dos 11 caracteres permitidos 
  if(CPF.length > 11){
    return res.status(400).json({
      error:'CPF muito longo, use até 11 caracteres',
      message: 'O CPF deve conter 11 caracteres'
    });
  }

  // Validação de dados
  if (!Nome || Nome.trim() === '') {
    return res.status(400).json({ 
      error: 'Nome do barbeiro é obrigatório',
      message: 'Forneça um nome válido para o barbeiro'
    })
  }

  if (!Email || Email.trim() === '') {
    return res.status(400).json({ 
      error: 'Email do barbeiro é obrigatório',
      message: 'Forneça um Email válido para o barbeiro'
    })
  }

  if (!Telefone || Telefone.trim() === '') {
    return res.status(400).json({ 
      error: 'Telefone do barbeiro é obrigatório',
      message: 'Forneça um Telefone válido para o barbeiro'
    })
  }
   
// Verifica o tamanho do nome do barbeiro, se está dentro dos 50 caracteres permitidos 
  if (Nome.length > 50) {
    return res.status(400).json({ 
      error: 'Nome muito longo',
      message: 'O nome do barbeiro deve ter no máximo 50 caracteres'
    });
  }

// Verifica o tamanho do E-mail do barbeiro, se está dentro dos 50 caracteres permitidos
  if (Email.length > 50) {
    return res.status(400).json({ 
      error: 'E-mail muito longo',
      message: 'O E-mail do barbeiro deve ter no máximo 50 caracteres'
    });
  }

// Verifica o tamanho do telefone do barbeiro, se está dentro dos 11 caracteres permitidos
  if (Telefone.length > 11) {
    return res.status(400).json({ 
      error: 'Telefone muito longo',
      message: 'O Telefone do barbeiro deve ter no máximo 11 caracteres'
    });
  }

  // Primeiro verifica se o barbeiro existe
  try {
    const [barbeiroExistente] = await pool.execute('SELECT * FROM barbeiros WHERE id = ?', [barbeirosId]);
    if (barbeiroExistente.length === 0) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' });
    }
  
// Verifica se já existe outro barbeiro com este nome
    const [barbeiroComMesmoNome] = await pool.execute(
      'SELECT * FROM barbeiros WHERE nome = ? AND id = ?', 
      [Nome, barbeirosId]
    );
    if (barbeiroComMesmoNome.length > 0) {
      return res.status(409).json({ 
        error: 'Barbeiro já existe',
        message: `Já existe outro barbeiro com o nome "${Nome}"`
      });
    }

// Se o nome é o mesmo que já existe, não precisa atualizar
    if (barbeiroExistente[0].nome === Nome) {
      return res.status(200).json({
        message: 'Barbeiro não foi modificado',
        barbeiro: barbeiroExistente[0],
        observacao: 'O barbeiro fornecido é igual ao barbeiro atual já cadastrado'
      });
    }

// Atualiza o barbeiro 
    const [resultNome] = await pool.execute('UPDATE barbeiro SET CPF = ?, Nome = ?, Email = ?, Telefone = ? WHERE id = ?', [CPF,Nome, Email, Telefone, barbeirosId]);
    if (resultNome.affectedRows === 0) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' });
    }

// Busca o barbeiro atualizado para retornar os dados completos
    const [barbeiroAtualizado] = await pool.execute('SELECT * FROM barbeiros WHERE id = ?', [barbeirosId]);

    res.json({
      message: 'Barbeiro atualizada com sucesso',
      barbeiroAtualizado: barbeiroAtualizado[0],
      barbeiroAnterior: barbeiroExistente[0]
    });
    } catch (error) {
    console.error('Erro ao atualizar barbeiro:', error);
    res.status(500).json({ error: 'Erro ao atualizar barbeiro', details: error.message });
  }
});

// Rota PATCH - /barbeiros/:id - atualiza algum dado específico do barbeiro 
// Atualização sem afetar outros campos.
router.patch('/updateNome/:id', async (req, res) => {
  const barbeirosId = req.params.id;
  const { Nome } = req.body;

// Verifica o tamanho do nome do barbeiro, se está dentro dos 50 caracteres permitidos 
  if (Nome.length > 50) {
    return res.status(400).json({ 
      error: 'Nome muito longo',
      message: 'O nome do barbeiro deve ter no máximo 50 caracteres'
    });
  }
  try {
// Primeiro verifica se o barbeiro existe e está ativo
    const [barbeiroExistente] = await pool.execute('SELECT * FROM barbeiros WHERE id = ? ', [barbeirosId]);
    if (barbeiroExistente.length === 0) {
      return res.status(404).json({ error: 'barbeiro não encontrado ou inativo' });
    }
  

// Atualiza os dados do barbeiro 
    const[result] = await pool.execute('UPDATE barbeiros SET Nome  = ? WHERE id = ?', [Nome,barbeirosId]);

   if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'barbeiro não encontrado' });
    }
    res.json({
      message: 'Nome atualizado com sucesso',
      barbeiro: {
        id: barbeirosId,
        nome: barbeiroExistente[0].nome,
      }
     });
     
    } catch (error) {
    console.error('Erro ao atualizar Nome:', error);
    res.status(500).json({ error: 'Erro ao atualizar Nome', details: error.message });
  }
});

router.patch('/updateEmail/:id', async (req, res) => {
  const barbeirosId = req.params.id;
  const { Email } = req.body;

  // Verifica o tamanho do E-mail do barbeiro, se está dentro dos 50 caracteres permitidos 
  if (Email.length > 50) {
    return res.status(400).json({ 
      error: 'E-mail muito longo',
      message: 'O E-mail do barbeiro deve ter no máximo 50 caracteres'
    });
  }
// Primeiro verifica se o barbeiro existe e está ativo
  try{
  const [barbeiroExistente] = await pool.execute('SELECT * FROM barbeiros WHERE id = ? ', [barbeirosId]);
    if (barbeiroExistente.length === 0) {
      return res.status(404).json({ error: 'barbeiro não encontrado ou inativo' });
    }
// Atualiza os dados do barbeiro 
    const [resultEmail] = await pool.execute('UPDATE barbeiros SET Email  = ? WHERE id = ?', [Email,barbeirosId]);

   if (resultEmail.affectedRows === 0) {
      return res.status(404).json({ error: 'E-mail não encontrado' });
    }
    res.json({
      message: 'Email atualizado com sucesso',
      barbeiro: {
        id: barbeirosId,
        Email: barbeiroExistente[0].Email,
    }
     });
     
    } catch (error) {
    console.error('Erro ao atualizar E-mail:', error);
    res.status(500).json({ error: 'Erro ao atualizar E-mail', details: error.message });
  }
});

router.patch('/updateTelefone/:id', async (req, res) => {
  const barbeirosId = req.params.id;
  const { Telefone } = req.body;

// Verifica o tamanho do Telefone do barbeiro, se está dentro dos 11 caracteres permitidos 
  if (Telefone.length > 11) {
    return res.status(400).json({ 
      error: 'Telefone muito longo',
      message: 'O telefone do barbeiro deve ter no máximo 11 caracteres'
    });
  }
  // Primeiro verifica se o barbeiro existe e está ativo
  try{
  const [barbeiroExistente] = await pool.execute('SELECT * FROM barbeiros WHERE id = ? ', [barbeirosId]);
    if (barbeiroExistente.length === 0) {
      return res.status(404).json({ error: 'barbeiro não encontrado ou inativo' });
    }

 // Atualiza os dados do barbeiro 
    const [resultTelefone] = await pool.execute('UPDATE barbeiros SET Telefone  = ? WHERE id = ?', [Telefone,barbeirosId]);

   if (resultTelefone.affectedRows === 0) {
      return res.status(404).json({ error: 'telefone não encontrado' });
    }
    res.json({
      message: 'Telefone atualizado com sucesso',
      barbeiro: {
        id: barbeirosId,
        Telefone: barbeiroExistente[0].Telefone,
    }
     });
     
    } catch (error) {
    console.error('Erro ao atualizar Telefone:', error);
    res.status(500).json({ error: 'Erro ao atualizar telefone', details: error.message });
  }
});


module.exports = router;