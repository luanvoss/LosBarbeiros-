const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req,res) => res.send({status: 'ok', message:'API funcionando'}));


app.get('/hello', (req,res) =>
res.send({ message: 'hello, word!'})
);
 
app.get('/professores', (req,res) =>
res.send({ nome: 'Lucas Sasse', disciplina: ['Programação de Aplicativos', 'Modelagem de Sistemas']})
);

app.get('/alunos/programacao-de-aplicativos',(req,res) =>
res.send({alunos:['Daniel','João','Luan','Lucas']})
);
 app.get('/alunos/programacao-de-aplicativos/nota',(req,res) =>
res.send({alunos:[
    {nome: 'Daniel', nota: 8.5},
    {nome: 'João', nota: 9.0},
    {nome: 'Luan', nota: 9.0},
    {nome: 'Lucas', nota: 8.0}
]})
);

app.use((err,req,res,next) =>{
    console.error(err);
    res.status(err.status||500).json({error: err.message ||'Erro Interno'});
});
module.exports = app;