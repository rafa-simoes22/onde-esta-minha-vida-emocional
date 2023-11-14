const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser'); // Para processar os dados do formulário 

app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/pagina.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'pagina.html'));
});

// Rota para processar o login
router.post('/login', function(req, res) {
    const { username, password } = req.body;

    // Consultar o banco de dados para verificar as credenciais
    const query = 'SELECT id FROM users WHERE nome = ? AND senha = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            res.status(500).send('Erro interno.');
        } else {
            if (results.length > 0) {
                const userId = results[0].id;

                // Redireciona para "pagina.html" e passa o ID do usuário
                res.redirect(`/pagina.html?userId=${userId}`);
            } else {
                res.send('Credenciais inválidas. Por favor, tente novamente.');
            }
        }
    });
});

// Rota para processar o cadastro
router.post('/signup', function(req, res) {
    const { newUsername, newPassword } = req.body;

    // Inserir novas informações na tabela users
    const query = 'INSERT INTO users (nome, senha) VALUES (?, ?)';
    connection.query(query, [newUsername, newPassword], (err, results) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            res.status(500).send('Erro interno.');
        } else {
            res.send('Cadastro bem-sucedido! Você pode fazer o login agora.');
        }
    });
});

// Rota para processar as ações do usuário
router.post('/acao', function(req, res) {
    const { acao } = req.body;
    console.log("Valor recebido:", acao);

    // Converter o valor booleano para 0 ou 1
    const valorAcao = acao === 'true' ? 1 : 0;

    const userId = obterIdUsuario(req); // Obter o ID do usuário logado da URL

    // Verificar se userId está presente
    if (!userId) {
        console.error('ID do usuário não encontrado na URL.');
        res.status(400).send('ID do usuário não encontrado na URL.');
        return;
    }

    // Inserir nova ação na tabela ações
    const query = 'INSERT INTO ações (id_users, acao) VALUES (?, ?)';
    connection.query(query, [userId, valorAcao], (err, results) => {
        if (err) {
            console.error('Erro ao registrar ação do usuário:', err);
            res.status(500).send('Erro interno.');
        } else {
            res.send('Ação registrada com sucesso!');
        }
    });
});



app.use('/', router);

const ipAddress = '172.16.31.36'; // Endereço IP da máquina
const port = 3003;

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'acesso123',
    database: 'site_compras',
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados MySQL');
    }
});

app.listen(port, ipAddress, () => {
    console.log(`Servidor rodando em http://${ipAddress}:${port}`);
});

function obterIdUsuario(req) {
    // Obtém o ID do usuário a partir dos parâmetros da URL
    return req.query.userId || null;
}