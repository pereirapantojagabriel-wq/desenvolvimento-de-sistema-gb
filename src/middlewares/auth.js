const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta-ecosmart-vagas-2026';

function authenticateToken(req, res, next) {
  let token = null;

  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado. Faça login para continuar.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Sessão inválida ou expirada. Faça login novamente.' });
  }
}

// Middleware opcional: se tiver token, preenche req.user, mas não bloqueia se não tiver
function optionalAuth(req, res, next) {
  let token = null;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // Ignora erro se for opcional
    }
  }
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Acesso não autorizado.' });
    }
    if (req.user.tipo_usuario !== role) {
      return res.status(403).json({ error: `Ação permitida apenas para usuários do tipo '${role}'.` });
    }
    next();
  };
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  optionalAuth,
  requireRole
};
