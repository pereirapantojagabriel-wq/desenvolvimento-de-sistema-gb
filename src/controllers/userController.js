const db = require('../config/database');

exports.getProfile = (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id_usuario, nome, email, tipo_usuario, telefone, bio, formacao, habilidades, criado_em
      FROM USUARIO WHERE id_usuario = ?
    `).get(req.user.id_usuario);

    if (!user) {
      return res.status(404).json({ error: 'Perfil não encontrado.' });
    }

    return res.json({ profile: user });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ error: 'Erro ao consultar perfil.' });
  }
};

exports.updateProfile = (req, res) => {
  try {
    const { nome, telefone, bio, formacao, habilidades } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ error: 'O nome é obrigatório.' });
    }

    const stmt = db.prepare(`
      UPDATE USUARIO
      SET nome = ?, telefone = ?, bio = ?, formacao = ?, habilidades = ?
      WHERE id_usuario = ?
    `);

    stmt.run(
      nome.trim(),
      telefone ? telefone.trim() : null,
      bio ? bio.trim() : null,
      formacao ? formacao.trim() : null,
      habilidades ? habilidades.trim() : null,
      req.user.id_usuario
    );

    const updatedUser = db.prepare(`
      SELECT id_usuario, nome, email, tipo_usuario, telefone, bio, formacao, habilidades
      FROM USUARIO WHERE id_usuario = ?
    `).get(req.user.id_usuario);

    return res.json({
      message: 'Perfil atualizado com sucesso!',
      profile: updatedUser
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ error: 'Erro ao atualizar dados do perfil.' });
  }
};
