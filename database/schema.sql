-- ==============================================================================
-- PROJETO: TrampoJovem — Sistema de Vagas e Candidaturas (Estágio & Aprendiz)
-- AUTOR: Gabriel Pereira Pantoja (3º B Técnico em Informática - IFRO Calama)
-- PROFESSOR ORIENTADOR: Prof. Rafael Pitwak
-- SGBD ALVO: SQLite 3 / PostgreSQL ANSI SQL
-- ARQUIVO: database/schema.sql
-- ==============================================================================

-- 1. Habilitar suporte a chaves estrangeiras (SQLite)
PRAGMA foreign_keys = ON;

-- 2. Tabela USUARIO
-- Armazena os usuários do sistema divididos por tipo: 'candidato' ou 'empresa'
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

-- 3. Tabela VAGA
-- Armazena as oportunidades cadastradas pelas empresas
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

-- 4. Tabela CANDIDATURA
-- Relaciona o candidato à vaga (N:N), garantindo candidatura única (RF11)
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

-- ==============================================================================
-- DADOS INICIAIS DE TESTE (SEEDS)
-- Senha padrão das contas demo: 123456
-- Hash Bcrypt correspondente: $2a$10$w8Dq6Z/tWbYqYqR2t9u8Eeq5cI3BfWpL5uS1H4sL3N6z2h7p4Q5uO
-- ==============================================================================

-- Inserir Empresa Demo (id_usuario = 1)
INSERT OR IGNORE INTO USUARIO (id_usuario, nome, email, senha_hash, tipo_usuario, telefone, bio, formacao, habilidades)
VALUES (
    1,
    'InovaTech Rondônia',
    'empresa@demo.com',
    '$2a$10$xT61c4N5M55jZ3qD/a.Nue2uVj6s8T7vA4cR0J7g3h2w1e4r5t6y7',
    'empresa',
    '(69) 99234-5678',
    'Empresa de inovação tecnológica focada em soluções inteligentes e sustentabilidade digital.',
    'Polo Tecnológico de Porto Velho',
    'Tecnologia, Inovação, Sustentabilidade'
);

-- Inserir Candidato Demo (Gabriel Pereira Pantoja) (id_usuario = 2)
INSERT OR IGNORE INTO USUARIO (id_usuario, nome, email, senha_hash, tipo_usuario, telefone, bio, formacao, habilidades)
VALUES (
    2,
    'Gabriel Pereira Pantoja',
    'gabriel@demo.com',
    '$2a$10$xT61c4N5M55jZ3qD/a.Nue2uVj6s8T7vA4cR0J7g3h2w1e4r5t6y7',
    'candidato',
    '(69) 98412-3456',
    'Estudante do 3º ano do Ensino Técnico, apaixonado por programação web, IoT e automação. Buscando oportunidade para aplicar conhecimentos práticos.',
    '3º B – Técnico em Informática',
    'HTML, CSS, JavaScript, Node.js, Banco de Dados, IoT, Git'
);

-- Inserir Vaga 1 (Estágio)
INSERT OR IGNORE INTO VAGA (id_vaga, id_empresa, titulo, descricao, requisitos, localidade, tipo_contratacao, prazo_candidatura, status)
VALUES (
    1,
    1,
    'Estágio em Suporte e Desenvolvimento Web',
    'Auxiliar na manutenção de páginas web, suporte a usuários do sistema e testes de funcionalidades em equipe ágil.',
    'Cursando Técnico ou Superior em Informática, Ciência da Computação ou áreas afins; Conhecimentos básicos de HTML, CSS e JavaScript; Boa comunicação e vontade de aprender.',
    'Porto Velho - RO (Presencial / Híbrido)',
    'Estágio',
    '2026-11-30',
    'aberta'
);

-- Inserir Vaga 2 (Jovem Aprendiz)
INSERT OR IGNORE INTO VAGA (id_vaga, id_empresa, titulo, descricao, requisitos, localidade, tipo_contratacao, prazo_candidatura, status)
VALUES (
    2,
    1,
    'Jovem Aprendiz em Operações e Tecnologia',
    'Apoio em rotinas administrativas do setor de TI, organização de documentações técnicas, catalogação de equipamentos e atendimento inicial.',
    'Idade entre 14 e 24 anos; Cursando ou concluído Ensino Médio/Técnico; Pacote Office ou Google Docs básico; Proatividade e pontualidade.',
    'Porto Velho - RO (Centro)',
    'Jovem Aprendiz',
    '2026-12-15',
    'aberta'
);

-- Inserir Vaga 3 (Estágio)
INSERT OR IGNORE INTO VAGA (id_vaga, id_empresa, titulo, descricao, requisitos, localidade, tipo_contratacao, prazo_candidatura, status)
VALUES (
    3,
    1,
    'Estágio em Banco de Dados e Análise de Informações',
    'Atuar no suporte à estruturação de consultas SQL, apoio na validação de relatórios e alimentação de dashboards de monitoramento.',
    'Cursando Informática, Sistemas de Informação ou áreas correlatas; Noções de lógica de programação e SQL; Atenção a detalhes.',
    'Remoto / Porto Velho - RO',
    'Estágio',
    '2026-12-20',
    'aberta'
);

-- Inserir Candidatura Inicial (Gabriel na Vaga 1 com status "Em análise")
INSERT OR IGNORE INTO CANDIDATURA (id_candidatura, id_candidato, id_vaga, status)
VALUES (
    1,
    2,
    1,
    'Em análise'
);
