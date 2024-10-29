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

// Rota principal (/) para exibir login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});

// Rota para exibir home.html
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'home.html'));
});

async function criarEpopularTabelaDeUsuarios(nome_completo, email, telefone, data_nascimento, senha) {
    const db = await open({
        filename: './public/database/usuarios.db',
        driver: sqlite3.Database,
    });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    await db.run('CREATE TABLE IF NOT EXISTS usuarios (nome_completo varchar(30) NOT NULL, email varchar(100) NOT NULL UNIQUE, telefone varchar(14) NOT NULL PRIMARY KEY UNIQUE, data_nascimento varchar(40) NOT NULL, senha varchar(100) NOT NULL)');
    
    await db.run('INSERT INTO usuarios (nome_completo, email, telefone, data_nascimento, senha) VALUES (?, ?, ?, ?, ?)', [nome_completo, email, telefone, data_nascimento, hashedPassword]);

    console.log('Usuário cadastrado com sucesso!');
}

app.post('/cadastro', async (req, res) => {
    const { nome_completo, email, telefone, data_nascimento, senha } = req.body;

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

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    console.log('Login solicitado para:', email); // Log para depuração

    try {
        const db = await open({
            filename: path.join(__dirname, 'public', 'database', 'usuarios.db'),
            driver: sqlite3.Database,
        });

        const user = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (!user) {
            console.log('Usuário não encontrado'); // Log para depuração
            return res.status(400).json({ message: 'Email ou senha inválidos!' });
        }

        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if (!senhaCorreta) {
            console.log('Senha incorreta'); // Log para depuração
            return res.status(400).json({ message: 'Email ou senha inválidos!' });
        }

        console.log('Login bem-sucedido'); // Log para depuração
        res.status(200).json({ redirect: '/home.html' });

    } catch (err) {
        console.error('Erro ao realizar o login:', err.message); // Log do erro específico
        res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
