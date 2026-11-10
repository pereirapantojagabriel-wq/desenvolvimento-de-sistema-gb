const db = require('../config/database');

// RF07: Listar vagas abertas
exports.listOpenJobs = (req, res) => {
  try {
    const { q, tipo, localidade } = req.query;

    let sql = `
      SELECT 
        v.id_vaga,
        v.id_empresa,
        v.titulo,
        v.descricao,
        v.requisitos,
        v.localidade,
        v.tipo_contratacao,
        v.prazo_candidatura,
        v.status,
        v.criado_em,
        u.nome AS empresa_nome
      FROM VAGA v
      INNER JOIN USUARIO u ON v.id_empresa = u.id_usuario
      WHERE v.status = 'aberta'
    `;
    const params = [];

    if (q && q.trim()) {
      sql += ` AND (v.titulo LIKE ? OR v.descricao LIKE ? OR v.requisitos LIKE ?)`;
      const term = `%${q.trim()}%`;
      params.push(term, term, term);
    }

    if (tipo && tipo.trim() && tipo !== 'todos') {
      sql += ` AND v.tipo_contratacao = ?`;
      params.push(tipo.trim());
    }

    if (localidade && localidade.trim()) {
      sql += ` AND v.localidade LIKE ?`;
      params.push(`%${localidade.trim()}%`);
    }

    sql += ` ORDER BY v.criado_em DESC`;

    const jobs = db.prepare(sql).all(...params);
    return res.json({ jobs });
  } catch (error) {
    console.error('Erro ao listar vagas abertas:', error);
    return res.status(500).json({ error: 'Erro ao buscar vagas abertas.' });
  }
};

// RF08: Detalhes de uma vaga
exports.getJobById = (req, res) => {
  try {
    const { id } = req.params;

    const job = db.prepare(`
      SELECT 
        v.id_vaga,
        v.id_empresa,
        v.titulo,
        v.descricao,
        v.requisitos,
        v.localidade,
        v.tipo_contratacao,
        v.prazo_candidatura,
        v.status,
        v.criado_em,
        u.nome AS empresa_nome,
        u.email AS empresa_email,
        u.telefone AS empresa_telefone
      FROM VAGA v
      INNER JOIN USUARIO u ON v.id_empresa = u.id_usuario
      WHERE v.id_vaga = ?
    `).get(id);

    if (!job) {
      return res.status(404).json({ error: 'Vaga não encontrada.' });
    }

    // Se usuário for candidato autenticado, checa se já se candidatou
    let jaCandidatou = false;
    let statusCandidatura = null;
    if (req.user && req.user.tipo_usuario === 'candidato') {
      const app = db.prepare(`
        SELECT status FROM CANDIDATURA 
        WHERE id_vaga = ? AND id_candidato = ?
      `).get(id, req.user.id_usuario);

      if (app) {
        jaCandidatou = true;
        statusCandidatura = app.status;
      }
    }

    return res.json({ job, jaCandidatou, statusCandidatura });
  } catch (error) {
    console.error('Erro ao detalhar vaga:', error);
    return res.status(500).json({ error: 'Erro ao consultar detalhes da vaga.' });
  }
};

// RF06: Cadastrar vaga (Empresa)
exports.createJob = (req, res) => {
  try {
    const { titulo, descricao, requisitos, localidade, tipo_contratacao, prazo_candidatura } = req.body;

    if (!titulo || !descricao || !requisitos || !localidade || !tipo_contratacao || !prazo_candidatura) {
      return res.status(400).json({
        error: 'Preencha todos os campos obrigatórios: título, descrição, requisitos, localidade, tipo de contratação e prazo.'
      });
    }

    if (!['Estágio', 'Jovem Aprendiz'].includes(tipo_contratacao)) {
      return res.status(400).json({ error: 'Tipo de contratação deve ser "Estágio" ou "Jovem Aprendiz".' });
    }

    const stmt = db.prepare(`
      INSERT INTO VAGA (id_empresa, titulo, descricao, requisitos, localidade, tipo_contratacao, prazo_candidatura, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'aberta')
    `);

    const result = stmt.run(
      req.user.id_usuario,
      titulo.trim(),
      descricao.trim(),
      requisitos.trim(),
      localidade.trim(),
      tipo_contratacao,
      prazo_candidatura
    );

    return res.status(201).json({
      message: 'Vaga cadastrada com sucesso!',
      id_vaga: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    return res.status(500).json({ error: 'Erro ao registrar nova vaga.' });
  }
};

// RF09: Editar vaga
exports.updateJob = (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, requisitos, localidade, tipo_contratacao, prazo_candidatura, status } = req.body;

    const job = db.prepare('SELECT * FROM VAGA WHERE id_vaga = ?').get(id);
    if (!job) {
      return res.status(404).json({ error: 'Vaga não encontrada.' });
    }

    if (job.id_empresa !== req.user.id_usuario) {
      return res.status(403).json({ error: 'Você só pode editar vagas criadas por sua empresa.' });
    }

    const stmt = db.prepare(`
      UPDATE VAGA
      SET titulo = COALESCE(?, titulo),
          descricao = COALESCE(?, descricao),
          requisitos = COALESCE(?, requisitos),
          localidade = COALESCE(?, localidade),
          tipo_contratacao = COALESCE(?, tipo_contratacao),
          prazo_candidatura = COALESCE(?, prazo_candidatura),
          status = COALESCE(?, status)
      WHERE id_vaga = ?
    `);

    stmt.run(
      titulo ? titulo.trim() : null,
      descricao ? descricao.trim() : null,
      requisitos ? requisitos.trim() : null,
      localidade ? localidade.trim() : null,
      tipo_contratacao || null,
      prazo_candidatura || null,
      status || null,
      id
    );

    return res.json({ message: 'Vaga atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error);
    return res.status(500).json({ error: 'Erro ao atualizar dados da vaga.' });
  }
};

// RF09: Encerrar ou reabrir vaga
exports.toggleJobStatus = (req, res) => {
  try {
    const { id } = req.params;
    const job = db.prepare('SELECT * FROM VAGA WHERE id_vaga = ?').get(id);

    if (!job) {
      return res.status(404).json({ error: 'Vaga não encontrada.' });
    }

    if (job.id_empresa !== req.user.id_usuario) {
      return res.status(403).json({ error: 'Você só pode alterar o status de vagas da sua empresa.' });
    }

    const novoStatus = job.status === 'aberta' ? 'encerrada' : 'aberta';
    db.prepare('UPDATE VAGA SET status = ? WHERE id_vaga = ?').run(novoStatus, id);

    return res.json({
      message: `Vaga ${novoStatus === 'aberta' ? 'reaberta' : 'encerrada'} com sucesso!`,
      status: novoStatus
    });
  } catch (error) {
    console.error('Erro ao alternar status da vaga:', error);
    return res.status(500).json({ error: 'Erro ao alterar status da vaga.' });
  }
};

// Listar vagas da empresa logada com contadores
exports.listCompanyJobs = (req, res) => {
  try {
    const jobs = db.prepare(`
      SELECT 
        v.*,
        COUNT(c.id_candidatura) AS total_candidatos
      FROM VAGA v
      LEFT JOIN CANDIDATURA c ON v.id_vaga = c.id_vaga
      WHERE v.id_empresa = ?
      GROUP BY v.id_vaga
      ORDER BY v.criado_em DESC
    `).all(req.user.id_usuario);

    return res.json({ jobs });
  } catch (error) {
    console.error('Erro ao listar vagas da empresa:', error);
    return res.status(500).json({ error: 'Erro ao listar vagas da empresa.' });
  }
};
