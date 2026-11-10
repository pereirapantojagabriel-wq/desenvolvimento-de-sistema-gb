const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middlewares/auth');

exports.register = (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario, telefone, bio, formacao, habilidades } = req.body;

    // RNF02: Validação no servidor
    if (!nome || !email || !senha || !tipo_usuario) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios (nome, email, senha e tipo de usuário).' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Informe um e-mail válido.' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'A senha deve conter no mínimo 6 caracteres.' });
    }

    if (!['candidato', 'empresa'].includes(tipo_usuario)) {
      return res.status(400).json({ error: 'Tipo de usuário inválido. Escolha Candidato ou Empresa.' });
    }

    // RF03: Impedir cadastro duplicado
    const existing = db.prepare('SELECT id_usuario FROM USUARIO WHERE email = ?').get(trimmedEmail);
    if (existing) {
      return res.status(409).json({ error: 'Já existe um cadastro com este e-mail. Utilize outro ou faça login.' });
    }

    // RNF01: Hash seguro de senha
    const senha_hash = bcrypt.hashSync(senha, 10);

    const stmt = db.prepare(`
      INSERT INTO USUARIO (nome, email, senha_hash, tipo_usuario, telefone, bio, formacao, habilidades)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      nome.trim(),
      trimmedEmail,
      senha_hash,
      tipo_usuario,
      telefone ? telefone.trim() : null,
      bio ? bio.trim() : null,
      formacao ? formacao.trim() : null,
      habilidades ? habilidades.trim() : null
    );

    const userPayload = {
      id_usuario: result.lastInsertRowid,
      nome: nome.trim(),
      email: trimmedEmail,
      tipo_usuario
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(201).json({
      message: 'Cadastro realizado com sucesso!',
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Ocorreu um erro interno ao processar o cadastro.' });
  }
};

exports.login = (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Informe seu e-mail e senha.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM USUARIO WHERE email = ?').get(trimmedEmail);

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const validPassword = bcrypt.compareSync(senha, user.senha_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const userPayload = {
      id_usuario: user.id_usuario,
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.tipo_usuario
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Ocorreu um erro interno ao processar o login.' });
  }
};

exports.me = (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id_usuario, nome, email, tipo_usuario, telefone, bio, formacao, habilidades, criado_em
      FROM USUARIO WHERE id_usuario = ?
    `).get(req.user.id_usuario);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter dados do usuário.' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Sessão encerrada com sucesso.' });
};

exports.forgotPassword = (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Informe seu endereço de e-mail.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT id_usuario, nome, email FROM USUARIO WHERE email = ?').get(trimmedEmail);

    if (!user) {
      return res.status(404).json({ error: 'Nenhum usuário cadastrado com este e-mail.' });
    }

    // Código simulado de 6 dígitos para auto-atendimento de recuperação
    const codigoRecuperacao = '849201';

    return res.json({
      message: `Código de verificação enviado com sucesso para ${user.email}!`,
      codigoSimulado: codigoRecuperacao
    });
  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    return res.status(500).json({ error: 'Erro ao processar solicitação de recuperação de senha.' });
  }
};

exports.resetPassword = (req, res) => {
  try {
    const { email, codigo, nova_senha } = req.body;

    if (!email || !codigo || !nova_senha) {
      return res.status(400).json({ error: 'Preencha o e-mail, o código de verificação e a nova senha.' });
    }

    if (nova_senha.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT id_usuario FROM USUARIO WHERE email = ?').get(trimmedEmail);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const nova_senha_hash = bcrypt.hashSync(nova_senha, 10);
    db.prepare('UPDATE USUARIO SET senha_hash = ? WHERE id_usuario = ?').run(nova_senha_hash, user.id_usuario);

    return res.json({
      message: 'Senha redefinida com sucesso! Você já pode entrar com a nova senha.'
    });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ error: 'Erro ao redefinir senha.' });
  }
};

