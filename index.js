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
    const query = 'SELECT * FROM users WHERE nome = ? AND senha = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            res.status(500).send('Erro interno.');
        } else {
            if (results.length > 0) {
                // Redireciona para "pagina.html" após um login bem-sucedido
                res.redirect('pagina.html');
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

