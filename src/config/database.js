const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const dbDir = isVercel ? '/tmp' : path.resolve(__dirname, '../../');
const dbPath = path.join(dbDir, 'database.sqlite');

let db;
let useFallback = false;

try {
  const Database = require('better-sqlite3');
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  console.log(`✅ Conectado ao banco SQLite em: ${dbPath}`);
} catch (err) {
  console.warn('⚠️ better-sqlite3 indisponível ou falhou ao abrir arquivo:', err.message);
  console.warn('🔄 Ativando motor de dados em memória resiliente para Vercel.');
  useFallback = true;
  db = createInMemoryDb();
}

function initDb() {
  if (!useFallback) {
    // 1. Tabela USUARIO
    db.exec(`
      CREATE TABLE IF NOT EXISTS USUARIO (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        senha_hash TEXT NOT NULL,
        tipo_usuario TEXT NOT NULL CHECK(tipo_usuario IN ('candidato', 'empresa')),
        telefone TEXT,
        bio TEXT,
        formacao TEXT,
        habilidades TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Tabela VAGA
    db.exec(`
      CREATE TABLE IF NOT EXISTS VAGA (
        id_vaga INTEGER PRIMARY KEY AUTOINCREMENT,
        id_empresa INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        requisitos TEXT NOT NULL,
        localidade TEXT NOT NULL,
        tipo_contratacao TEXT NOT NULL CHECK(tipo_contratacao IN ('Estágio', 'Jovem Aprendiz')),
        prazo_candidatura DATE NOT NULL,
        status TEXT NOT NULL DEFAULT 'aberta' CHECK(status IN ('aberta', 'encerrada')),
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_empresa) REFERENCES USUARIO (id_usuario) ON DELETE CASCADE
      );
    `);

    // 3. Tabela CANDIDATURA
    db.exec(`
      CREATE TABLE IF NOT EXISTS CANDIDATURA (
        id_candidatura INTEGER PRIMARY KEY AUTOINCREMENT,
        id_candidato INTEGER NOT NULL,
        id_vaga INTEGER NOT NULL,
        data_candidatura DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'Em análise' CHECK(status IN ('Em análise', 'Aprovado', 'Reprovado')),
        FOREIGN KEY (id_candidato) REFERENCES USUARIO (id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_vaga) REFERENCES VAGA (id_vaga) ON DELETE CASCADE,
        UNIQUE (id_candidato, id_vaga)
      );
    `);
  }

  seedInitialData();
}

function seedInitialData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM USUARIO').get().count;
  if (userCount > 0) return;

  const defaultPasswordHash = bcrypt.hashSync('123456', 10);

  // Inserir empresa demo
  const insertUser = db.prepare(`
    INSERT INTO USUARIO (nome, email, senha_hash, tipo_usuario, telefone, bio, formacao, habilidades)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const companyResult = insertUser.run(
    'InovaTech Rondônia',
    'empresa@demo.com',
    defaultPasswordHash,
    'empresa',
    '(69) 99234-5678',
    'Empresa de inovação tecnológica focada em soluções inteligentes e sustentabilidade digital.',
    'Polo Tecnológico de Porto Velho',
    'Tecnologia, Inovação, Sustentabilidade'
  );

  const companyId = companyResult.lastInsertRowid;

  // Inserir candidato demo (Gabriel Pereira Pantoja)
  const candidateResult = insertUser.run(
    'Gabriel Pereira Pantoja',
    'gabriel@demo.com',
    defaultPasswordHash,
    'candidato',
    '(69) 98412-3456',
    'Estudante do 3º ano do Ensino Técnico, apaixonado por programação web, IoT e automação. Buscando oportunidade para aplicar conhecimentos práticos.',
    '3º B – Técnico em Informática',
    'HTML, CSS, JavaScript, Node.js, Banco de Dados, IoT, Git'
  );

  const candidateId = candidateResult.lastInsertRowid;

  // Inserir vagas demo
  const insertJob = db.prepare(`
    INSERT INTO VAGA (id_empresa, titulo, descricao, requisitos, localidade, tipo_contratacao, prazo_candidatura, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const job1 = insertJob.run(
    companyId,
    'Estágio em Suporte e Desenvolvimento Web',
    'Auxiliar na manutenção de páginas web, suporte a usuários do sistema e testes de funcionalidades em equipe ágil.',
    'Cursando Técnico ou Superior em Informática, Ciência da Computação ou áreas afins; Conhecimentos básicos de HTML, CSS e JavaScript; Boa comunicação e vontade de aprender.',
    'Porto Velho - RO (Presencial / Híbrido)',
    'Estágio',
    '2026-11-30',
    'aberta'
  );

  const job2 = insertJob.run(
    companyId,
    'Jovem Aprendiz em Operações e Tecnologia',
    'Apoio em rotinas administrativas do setor de TI, organização de documentações técnicas, catalogação de equipamentos e atendimento inicial.',
    'Idade entre 14 e 24 anos; Cursando ou concluído Ensino Médio/Técnico; Pacote Office ou Google Docs básico; Proatividade e pontualidade.',
    'Porto Velho - RO (Centro)',
    'Jovem Aprendiz',
    '2026-12-15',
    'aberta'
  );

  const job3 = insertJob.run(
    companyId,
    'Estágio em Banco de Dados e Análise de Informações',
    'Atuar no suporte à estruturação de consultas SQL, apoio na validação de relatórios e alimentação de dashboards de monitoramento.',
    'Cursando Informática, Sistemas de Informação ou áreas correlatas; Noções de lógica de programação e SQL; Atenção a detalhes.',
    'Remoto / Porto Velho - RO',
    'Estágio',
    '2026-12-20',
    'aberta'
  );

  // Inserir candidatura inicial do Gabriel para a vaga 1
  const insertApp = db.prepare(`
    INSERT INTO CANDIDATURA (id_candidato, id_vaga, status)
    VALUES (?, ?, ?)
  `);

  insertApp.run(candidateId, job1.lastInsertRowid, 'Em análise');

  console.log('✅ Banco de dados inicializado com dados de teste (Empresa Demo & Gabriel Demo).');
}

// Fallback em memória para ambientes serverless sem suporte binário C++
function createInMemoryDb() {
  const store = {
    USUARIO: [],
    VAGA: [],
    CANDIDATURA: [],
    id_usuario_seq: 1,
    id_vaga_seq: 1,
    id_candidatura_seq: 1
  };

  return {
    exec(sql) {},
    pragma(cmd) {},
    prepare(sql) {
      const cleanSql = sql.replace(/\s+/g, ' ').trim();

      return {
        run(...params) {
          if (cleanSql.startsWith('INSERT INTO USUARIO')) {
            const [nome, email, senha_hash, tipo_usuario, telefone, bio, formacao, habilidades] = params;
            const id = store.id_usuario_seq++;
            store.USUARIO.push({
              id_usuario: id,
              nome,
              email: email ? email.toLowerCase() : '',
              senha_hash,
              tipo_usuario,
              telefone,
              bio,
              formacao,
              habilidades,
              criado_em: new Date().toISOString()
            });
            return { lastInsertRowid: id, changes: 1 };
          }

          if (cleanSql.startsWith('INSERT INTO VAGA')) {
            const [id_empresa, titulo, descricao, requisitos, localidade, tipo_contratacao, prazo_candidatura, status] = params;
            const id = store.id_vaga_seq++;
            store.VAGA.push({
              id_vaga: id,
              id_empresa,
              titulo,
              descricao,
              requisitos,
              localidade,
              tipo_contratacao,
              prazo_candidatura,
              status: status || 'aberta',
              criado_em: new Date().toISOString()
            });
            return { lastInsertRowid: id, changes: 1 };
          }

          if (cleanSql.startsWith('INSERT INTO CANDIDATURA')) {
            const [id_candidato, id_vaga, status] = params;
            const id = store.id_candidatura_seq++;
            store.CANDIDATURA.push({
              id_candidatura: id,
              id_candidato,
              id_vaga,
              status: status || 'Em análise',
              data_candidatura: new Date().toISOString()
            });
            return { lastInsertRowid: id, changes: 1 };
          }

          if (cleanSql.startsWith('UPDATE USUARIO SET')) {
            if (cleanSql.includes('senha_hash = ?')) {
              const [senha_hash, id_usuario] = params;
              const u = store.USUARIO.find(x => x.id_usuario === Number(id_usuario));
              if (u) u.senha_hash = senha_hash;
            } else {
              const [nome, telefone, bio, formacao, habilidades, id_usuario] = params;
              const u = store.USUARIO.find(x => x.id_usuario === Number(id_usuario));
              if (u) {
                u.nome = nome;
                u.telefone = telefone;
                u.bio = bio;
                u.formacao = formacao;
                u.habilidades = habilidades;
              }
            }
            return { changes: 1 };
          }

          if (cleanSql.startsWith('UPDATE VAGA SET status = ?')) {
            const [status, id_vaga] = params;
            const v = store.VAGA.find(x => x.id_vaga === Number(id_vaga));
            if (v) v.status = status;
            return { changes: 1 };
          }

          if (cleanSql.startsWith('UPDATE VAGA')) {
            const [titulo, descricao, requisitos, localidade, tipo_contratacao, prazo_candidatura, status, id_vaga] = params;
            const v = store.VAGA.find(x => x.id_vaga === Number(id_vaga));
            if (v) {
              if (titulo) v.titulo = titulo;
              if (descricao) v.descricao = descricao;
              if (requisitos) v.requisitos = requisitos;
              if (localidade) v.localidade = localidade;
              if (tipo_contratacao) v.tipo_contratacao = tipo_contratacao;
              if (prazo_candidatura) v.prazo_candidatura = prazo_candidatura;
              if (status) v.status = status;
            }
            return { changes: 1 };
          }

          if (cleanSql.startsWith('UPDATE CANDIDATURA SET status = ?')) {
            const [status, id_candidatura] = params;
            const c = store.CANDIDATURA.find(x => x.id_candidatura === Number(id_candidatura));
            if (c) c.status = status;
            return { changes: 1 };
          }

          return { changes: 0 };
        },

        get(...params) {
          if (cleanSql.includes('COUNT(*) as count FROM USUARIO')) {
            return { count: store.USUARIO.length };
          }

          if (cleanSql.includes('FROM USUARIO WHERE email = ?')) {
            const email = (params[0] || '').toLowerCase();
            return store.USUARIO.find(u => u.email.toLowerCase() === email);
          }

          if (cleanSql.includes('FROM USUARIO WHERE id_usuario = ?')) {
            const id = Number(params[0]);
            return store.USUARIO.find(u => u.id_usuario === id);
          }

          if (cleanSql.includes('FROM VAGA WHERE id_vaga = ?') || cleanSql.includes('FROM VAGA v INNER JOIN USUARIO u')) {
            const id = Number(params[0]);
            const v = store.VAGA.find(x => x.id_vaga === id);
            if (!v) return undefined;
            const u = store.USUARIO.find(x => x.id_usuario === v.id_empresa) || {};
            return {
              ...v,
              empresa_nome: u.nome || '',
              empresa_email: u.email || '',
              empresa_telefone: u.telefone || ''
            };
          }

          if (cleanSql.includes('FROM CANDIDATURA WHERE id_vaga = ? AND id_candidato = ?') || cleanSql.includes('id_candidato = ? AND id_vaga = ?')) {
            const [p1, p2] = params.map(Number);
            return store.CANDIDATURA.find(c => 
              (c.id_vaga === p1 && c.id_candidato === p2) ||
              (c.id_candidato === p1 && c.id_vaga === p2)
            );
          }

          if (cleanSql.includes('FROM CANDIDATURA c INNER JOIN VAGA v')) {
            const id = Number(params[0]);
            const c = store.CANDIDATURA.find(x => x.id_candidatura === id);
            if (!c) return undefined;
            const v = store.VAGA.find(x => x.id_vaga === c.id_vaga) || {};
            const u = store.USUARIO.find(x => x.id_usuario === c.id_candidato) || {};
            return {
              id_candidatura: c.id_candidatura,
              id_empresa: v.id_empresa,
              candidato_nome: u.nome,
              vaga_titulo: v.titulo
            };
          }

          return undefined;
        },

        all(...params) {
          if (cleanSql.includes('FROM VAGA v INNER JOIN USUARIO u ON v.id_empresa = u.id_usuario WHERE v.status = \'aberta\'')) {
            return store.VAGA
              .filter(v => v.status === 'aberta')
              .map(v => {
                const u = store.USUARIO.find(x => x.id_usuario === v.id_empresa) || {};
                return { ...v, empresa_nome: u.nome || '' };
              })
              .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
          }

          if (cleanSql.includes('FROM VAGA v LEFT JOIN CANDIDATURA c ON v.id_vaga = c.id_vaga WHERE v.id_empresa = ?')) {
            const id_empresa = Number(params[0]);
            return store.VAGA
              .filter(v => v.id_empresa === id_empresa)
              .map(v => {
                const total = store.CANDIDATURA.filter(c => c.id_vaga === v.id_vaga).length;
                return { ...v, total_candidatos: total };
              })
              .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
          }

          if (cleanSql.includes('FROM CANDIDATURA c INNER JOIN VAGA v ON c.id_vaga = v.id_vaga INNER JOIN USUARIO u ON v.id_empresa = u.id_usuario WHERE c.id_candidato = ?')) {
            const id_candidato = Number(params[0]);
            return store.CANDIDATURA
              .filter(c => c.id_candidato === id_candidato)
              .map(c => {
                const v = store.VAGA.find(x => x.id_vaga === c.id_vaga) || {};
                const u = store.USUARIO.find(x => x.id_usuario === v.id_empresa) || {};
                return {
                  id_candidatura: c.id_candidatura,
                  data_candidatura: c.data_candidatura,
                  status_candidatura: c.status,
                  id_vaga: v.id_vaga,
                  vaga_titulo: v.titulo,
                  tipo_contratacao: v.tipo_contratacao,
                  localidade: v.localidade,
                  status_vaga: v.status,
                  prazo_candidatura: v.prazo_candidatura,
                  empresa_nome: u.nome || ''
                };
              })
              .sort((a, b) => new Date(b.data_candidatura) - new Date(a.data_candidatura));
          }

          if (cleanSql.includes('FROM CANDIDATURA c INNER JOIN USUARIO u ON c.id_candidato = u.id_usuario WHERE c.id_vaga = ?')) {
            const id_vaga = Number(params[0]);
            return store.CANDIDATURA
              .filter(c => c.id_vaga === id_vaga)
              .map(c => {
                const u = store.USUARIO.find(x => x.id_usuario === c.id_candidato) || {};
                return {
                  id_candidatura: c.id_candidatura,
                  data_candidatura: c.data_candidatura,
                  status_candidatura: c.status,
                  id_candidato: u.id_usuario,
                  candidato_nome: u.nome,
                  candidato_email: u.email,
                  candidato_telefone: u.telefone,
                  candidato_bio: u.bio,
                  candidato_formacao: u.formacao,
                  candidato_habilidades: u.habilidades
                };
              })
              .sort((a, b) => new Date(b.data_candidatura) - new Date(a.data_candidatura));
          }

          return [];
        }
      };
    }
  };
}

initDb();

module.exports = db;
