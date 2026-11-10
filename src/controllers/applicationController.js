const db = require('../config/database');

// RF10, RF11, RF12: Candidatar-se a uma vaga
exports.applyToJob = (req, res) => {
  try {
    const { id_vaga } = req.body;

    if (!id_vaga) {
      return res.status(400).json({ error: 'ID da vaga não informado.' });
    }

    // Verificar se vaga existe e está aberta
    const job = db.prepare('SELECT * FROM VAGA WHERE id_vaga = ?').get(id_vaga);
    if (!job) {
      return res.status(404).json({ error: 'Vaga não encontrada.' });
    }

    if (job.status !== 'aberta') {
      return res.status(400).json({ error: 'Esta vaga já foi encerrada e não aceita mais candidaturas.' });
    }

    // RF11: Impedir duplicidade
    const existing = db.prepare(`
      SELECT id_candidatura FROM CANDIDATURA 
      WHERE id_candidato = ? AND id_vaga = ?
    `).get(req.user.id_usuario, id_vaga);

    if (existing) {
      return res.status(409).json({ error: 'Você já realizou sua candidatura para esta vaga!' });
    }

    // RF12: Registrar candidatura com status inicial "Em análise"
    const stmt = db.prepare(`
      INSERT INTO CANDIDATURA (id_candidato, id_vaga, status)
      VALUES (?, ?, 'Em análise')
    `);

    const result = stmt.run(req.user.id_usuario, id_vaga);

    return res.status(201).json({
      message: 'Candidatura realizada com sucesso!',
      id_candidatura: result.lastInsertRowid,
      status: 'Em análise'
    });
  } catch (error) {
    console.error('Erro ao candidatar-se:', error);
    return res.status(500).json({ error: 'Erro ao processar sua candidatura.' });
  }
};

// RF13: Candidato consulta "Minhas candidaturas"
exports.listCandidateApplications = (req, res) => {
  try {
    const applications = db.prepare(`
      SELECT 
        c.id_candidatura,
        c.data_candidatura,
        c.status AS status_candidatura,
        v.id_vaga,
        v.titulo AS vaga_titulo,
        v.tipo_contratacao,
        v.localidade,
        v.status AS status_vaga,
        v.prazo_candidatura,
        u.nome AS empresa_nome
      FROM CANDIDATURA c
      INNER JOIN VAGA v ON c.id_vaga = v.id_vaga
      INNER JOIN USUARIO u ON v.id_empresa = u.id_usuario
      WHERE c.id_candidato = ?
      ORDER BY c.data_candidatura DESC
    `).all(req.user.id_usuario);

    return res.json({ applications });
  } catch (error) {
    console.error('Erro ao listar candidaturas:', error);
    return res.status(500).json({ error: 'Erro ao consultar suas candidaturas.' });
  }
};

// RF14: Empresa consulta candidatos de uma vaga
exports.listJobApplications = (req, res) => {
  try {
    const { id_vaga } = req.params;

    // Verificar se vaga pertence à empresa
    const job = db.prepare('SELECT * FROM VAGA WHERE id_vaga = ?').get(id_vaga);
    if (!job) {
      return res.status(404).json({ error: 'Vaga não encontrada.' });
    }

    if (job.id_empresa !== req.user.id_usuario) {
      return res.status(403).json({ error: 'Acesso negado. Esta vaga pertence a outra empresa.' });
    }

    const applications = db.prepare(`
      SELECT 
        c.id_candidatura,
        c.data_candidatura,
        c.status AS status_candidatura,
        u.id_usuario AS id_candidato,
        u.nome AS candidato_nome,
        u.email AS candidato_email,
        u.telefone AS candidato_telefone,
        u.bio AS candidato_bio,
        u.formacao AS candidato_formacao,
        u.habilidades AS candidato_habilidades
      FROM CANDIDATURA c
      INNER JOIN USUARIO u ON c.id_candidato = u.id_usuario
      WHERE c.id_vaga = ?
      ORDER BY c.data_candidatura DESC
    `).all(id_vaga);

    return res.json({ job, applications });
  } catch (error) {
    console.error('Erro ao listar candidatos da vaga:', error);
    return res.status(500).json({ error: 'Erro ao consultar candidaturas da vaga.' });
  }
};

// RF15: Empresa altera status da candidatura ("Em análise", "Aprovado", "Reprovado")
exports.updateApplicationStatus = (req, res) => {
  try {
    const { id_candidatura } = req.params;
    const { status } = req.body;

    const validStatuses = ['Em análise', 'Aprovado', 'Reprovado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Status inválido. Escolha entre: ${validStatuses.join(', ')}`
      });
    }

    // Verificar se candidatura pertence a uma vaga da empresa
    const app = db.prepare(`
      SELECT c.id_candidatura, v.id_empresa, u.nome AS candidato_nome, v.titulo AS vaga_titulo
      FROM CANDIDATURA c
      INNER JOIN VAGA v ON c.id_vaga = v.id_vaga
      INNER JOIN USUARIO u ON c.id_candidato = u.id_usuario
      WHERE c.id_candidatura = ?
    `).get(id_candidatura);

    if (!app) {
      return res.status(404).json({ error: 'Candidatura não encontrada.' });
    }

    if (app.id_empresa !== req.user.id_usuario) {
      return res.status(403).json({ error: 'Permissão negada para atualizar esta candidatura.' });
    }

    db.prepare('UPDATE CANDIDATURA SET status = ? WHERE id_candidatura = ?').run(status, id_candidatura);

    return res.json({
      message: `Status do candidato ${app.candidato_nome} atualizado para "${status}" com sucesso!`,
      status
    });
  } catch (error) {
    console.error('Erro ao atualizar status da candidatura:', error);
    return res.status(500).json({ error: 'Erro ao atualizar status da candidatura.' });
  }
};
