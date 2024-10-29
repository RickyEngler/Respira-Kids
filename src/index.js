const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('usuarios.db');


const app = express();
const PORT = 3000;

// Configurar a pasta public para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota principal (/) para exibir cadastro.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'cadastro.html'));
});

app.post('/cadastro', (req, res) => {
  const { nome_completo, email, telefone, data_nascimento, senha } = req.body;

  // Verifique se todos os campos obrigatórios foram enviados
  if (!nome_completo || !email || !telefone || !data_nascimento || !senha) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  // Inserir os dados na tabela de usuários
  const query = `INSERT INTO usuarios (nome_completo, email, telefone, data_nascimento, senha) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [nome_completo, email, telefone, data_nascimento, senha], function(err) {
    if (err) {
      console.error("Erro ao salvar o usuário:", err);
      return res.status(500).send("Erro ao realizar o cadastro");
    }
    res.send('Cadastro realizado com sucesso!');
  });
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
