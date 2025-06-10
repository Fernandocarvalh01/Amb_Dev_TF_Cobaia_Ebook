const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Permitir requisições de qualquer origem
app.use(express.json()); // Parser para JSON
app.use(express.urlencoded({ extended: true })); // Parser para form data

// Dados simulados para demonstração (em produção seria um banco de dados)
let usuarios = [
    { id: 1, nome: 'João Silva', email: 'joao@email.com', idade: 28 },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', idade: 32 },
    { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', idade: 25 }
];

// Removido: let contatos = [];
let proximoIdUsuario = 4;
// Removido: let proximoIdContato = 1;

// Rota raiz - Informações da API
app.get('/', (req, res) => {
    res.json({
        message: 'API do Guia de Desenvolvimento Web',
        version: '1.0.0',
        endpoints: {
            usuarios: {
                'GET /api/usuarios': 'Listar todos os usuários',
                'GET /api/usuarios/:id': 'Buscar usuário por ID',
                'POST /api/usuarios': 'Criar novo usuário',
                'PUT /api/usuarios/:id': 'Atualizar usuário',
                'DELETE /api/usuarios/:id': 'Deletar usuário'
            },
            // Removido: contatos: { ... }
            utilitarios: {
                'POST /api/calculadora': 'Realizar cálculos matemáticos',
                'GET /api/status': 'Status da API'
            }
        },
        documentation: 'Esta API demonstra os conceitos de back-end abordados no e-book'
    });
});

// ===== ROTAS DE USUÁRIOS (CRUD Completo) =====

// GET /api/usuarios - Listar todos os usuários
app.get('/api/usuarios', (req, res) => {
    res.json({
        success: true,
        data: usuarios,
        total: usuarios.length
    });
});

// GET /api/usuarios/:id - Buscar usuário por ID
app.get('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario) {
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }
    
    res.json({
        success: true,
        data: usuario
    });
});

// POST /api/usuarios - Criar novo usuário
app.post('/api/usuarios', (req, res) => {
    const { nome, email, idade } = req.body;
    
    // Validação básica
    if (!nome || !email || !idade) {
        return res.status(400).json({
            success: false,
            message: 'Nome, email e idade são obrigatórios'
        });
    }
    
    // Verificar se email já existe
    const emailExiste = usuarios.find(u => u.email === email);
    if (emailExiste) {
        return res.status(400).json({
            success: false,
            message: 'Email já está em uso'
        });
    }
    
    const novoUsuario = {
        id: proximoIdUsuario++,
        nome,
        email,
        idade: parseInt(idade)
    };
    
    usuarios.push(novoUsuario);
    
    res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: novoUsuario
    });
});

// PUT /api/usuarios/:id - Atualizar usuário
app.put('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, email, idade } = req.body;
    
    const usuarioIndex = usuarios.findIndex(u => u.id === id);
    
    if (usuarioIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }
    
    // Verificar se email já existe (exceto para o próprio usuário)
    if (email) {
        const emailExiste = usuarios.find(u => u.email === email && u.id !== id);
        if (emailExiste) {
            return res.status(400).json({
                success: false,
                message: 'Email já está em uso'
            });
        }
    }
    
    // Atualizar apenas os campos fornecidos
    if (nome) usuarios[usuarioIndex].nome = nome;
    if (email) usuarios[usuarioIndex].email = email;
    if (idade) usuarios[usuarioIndex].idade = parseInt(idade);
    
    res.json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: usuarios[usuarioIndex]
    });
});

// DELETE /api/usuarios/:id - Deletar usuário
app.delete('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const usuarioIndex = usuarios.findIndex(u => u.id === id);
    
    if (usuarioIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }
    
    const usuarioRemovido = usuarios.splice(usuarioIndex, 1)[0];
    
    res.json({
        success: true,
        message: 'Usuário removido com sucesso',
        data: usuarioRemovido
    });
});

// ===== ROTAS UTILITÁRIAS =====

// POST /api/calculadora - Realizar cálculos
app.post('/api/calculadora', (req, res) => {
    const { num1, num2, operacao } = req.body;
    
    // Validação
    if (num1 === undefined || num2 === undefined || !operacao) {
        return res.status(400).json({
            success: false,
            message: 'num1, num2 e operacao são obrigatórios'
        });
    }
    
    const numero1 = parseFloat(num1);
    const numero2 = parseFloat(num2);
    
    if (isNaN(numero1) || isNaN(numero2)) {
        return res.status(400).json({
            success: false,
            message: 'num1 e num2 devem ser números válidos'
        });
    }
    
    let resultado;
    let operacaoTexto;
    
    switch (operacao) {
        case '+':
            resultado = numero1 + numero2;
            operacaoTexto = 'adição';
            break;
        case '-':
            resultado = numero1 - numero2;
            operacaoTexto = 'subtração';
            break;
        case '*':
            resultado = numero1 * numero2;
            operacaoTexto = 'multiplicação';
            break;
        case '/':
            if (numero2 === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Divisão por zero não é permitida'
                });
            }
            resultado = numero1 / numero2;
            operacaoTexto = 'divisão';
            break;
        default:
            return res.status(400).json({
                success: false,
                message: 'Operação inválida. Use: +, -, *, /'
            });
    }
    
    res.json({
        success: true,
        data: {
            num1: numero1,
            num2: numero2,
            operacao,
            operacaoTexto,
            resultado,
            calculo: `${numero1} ${operacao} ${numero2} = ${resultado}`
        }
    });
});

// GET /api/status - Status da API
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoria: process.memoryUsage(),
        versaoNode: process.version,
        estatisticas: {
            totalUsuarios: usuarios.length,
            // Removido: totalContatos: contatos.length
        }
    });
});

// ===== MIDDLEWARE DE TRATAMENTO DE ERROS =====

// Rota não encontrada
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        endpoint: req.originalUrl,
        metodo: req.method
    });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
    });
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📖 Documentação da API: http://localhost:${PORT}/`);
    console.log(`🔗 Endpoints disponíveis:`);
    console.log(`   GET  /api/usuarios`);
    console.log(`   POST /api/usuarios`);
    // Removido: console.log(`   GET  /api/contatos`);
    // Removido: console.log(`   POST /api/contatos`);
    console.log(`   POST /api/calculadora`);
    console.log(`   GET  /api/status`);
    console.log(`\n💡 Esta API demonstra os conceitos de back-end do e-book!`);
});

module.exports = app;