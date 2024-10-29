import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';


const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar a pasta public para servir arquivos estáticos
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota principal (/) para exibir cadastro.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});

async function criarEpopularTabelaDeUsuarios(nome_completo, email, telefone, data_nascimento, senha) {
  const db = await open({
    filename: './public/database/usuarios.db',
    driver: sqlite3.Database,
  });

  // Hash a senha antes de armazená-la
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(senha, saltRounds);

  await db.run('CREATE TABLE IF NOT EXISTS usuarios (nome_completo varchar(30) NOT NULL, email varchar(100) NOT NULL UNIQUE, telefone varchar(14) NOT NULL PRIMARY KEY UNIQUE, data_nascimento varchar(40) NOT NULL, senha varchar(100) NOT NULL)');
  
  await db.run('INSERT INTO usuarios (nome_completo, email, telefone, data_nascimento, senha) VALUES (?, ?, ?, ?, ?)', [nome_completo, email, telefone, data_nascimento, hashedPassword]);

  console.log('Usuário cadastrado com sucesso!');
}


app.post('/cadastro', async (req, res) => {
  const { nome_completo, email, telefone, data_nascimento, senha } = req.body;

  // Verifique se todos os campos obrigatórios foram enviados
  if (!nome_completo || !email || !telefone || !data_nascimento || !senha) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  try {
    await criarEpopularTabelaDeUsuarios(nome_completo, email, telefone, data_nascimento, senha);
    res.send('Cadastro realizado com sucesso!');
  } catch (err) {
    console.error("Erro ao realizar o cadastro:", err);
    return res.status(500).send("Erro ao realizar o cadastro");
  }
});



// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
