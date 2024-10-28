import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';



const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '../views/home.html'));
});

async function criarEpopularTabelaDeUsuarios(nome, email, telefone, data_nascimento, senha) {
    const db = await open({
        filename: './banco.db',
        driver: sqlite3.Database,
    });

     // Hash a senha antes de armazená-la
     const saltRounds = 10; // O número de rounds de salt
     const hashedPassword = await bcrypt.hash(senha, saltRounds);

    await db.run('CREATE TABLE IF NOT EXISTS usuarios (nome varchar(30) NOT NULL, email varchar(100) NOT NULL UNIQUE, telefone varchar(14) NOT NULL PRIMARY KEY UNIQUE, data_nascimento varchar(40) NOT NULL, senha varchar(30) NOT NULL)');
    await db.run('INSERT INTO usuarios (nome, email, telefone, data_nascimento, senha) VALUES (?,?,?,?,?)', [nome, email, telefone, data_nascimento, senha]);

    console.log('Usuário inserido com sucesso!');
}

app.post('/cadastrar', async (req, res) => {
    const { nome, email, telefone, data_nascimento, senha } = req.body;
    if (!nome || !email || !telefone || !data_nascimento || !senha) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }

    try {
        await criarEpopularTabelaDeUsuarios(nome, email, telefone, data_nascimento, senha);
        return res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário' });
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }

    const db = await open({
        filename: path.join(__dirname, 'database', 'banco.db'),
        driver: sqlite3.Database,
    });

     // Busque o usuário pelo e-mail
    const usuario = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (usuario) {
        // Verifique a senha
        const match = await bcrypt.compare(senha, usuario.senha);
        if (match) {
            return res.json({ success: true, message: 'Login bem-sucedido!' });
        }
    }

    if (usuario) {
        return res.json({ success: true, message: 'Login bem-sucedido!' });
    } else {
        return res.json({ success: false, message: 'Usuário e/ou senha incorretos' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
