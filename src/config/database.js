const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Enable Foreign Key support
db.pragma('foreign_keys = ON');

function initDb() {
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

initDb();

module.exports = db;
