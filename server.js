const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Inicializar banco de dados e sementes
require('./src/config/database');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');

const app = express();
const PORT = process.env.PORT || 3011;

// Middlewares essenciais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Diretório estático compatível com local e Vercel
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Rota de status/healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    port: PORT,
    environment: process.env.VERCEL ? 'vercel-serverless' : 'local-node',
    timestamp: new Date().toISOString()
  });
});

// Tratamento de erro 404 para rotas de API não encontradas
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint da API não encontrado.' });
});

// Fallback para frontend SPA / navegação direta
app.use((req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  res.sendFile(indexPath);
});

// Iniciar servidor local se não estiver rodando no ambiente Vercel Serverless
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('========================================================');
    console.log(`🚀 Sistema de Vagas e Candidaturas iniciado!`);
    console.log(`🌐 Acesse agora pelo navegador: http://localhost:${PORT}`);
    console.log(`🌐 Ou pelo IP: http://127.0.0.1:${PORT}`);
    console.log(`💼 Porta configurada: ${PORT}`);
    console.log('========================================================');
  });
}

// Exportar app para a Vercel Serverless Function
module.exports = app;
