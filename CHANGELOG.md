# 📜 CHANGELOG — TrampoJovem

Registro cronológico e técnico de decisões arquiteturais, revisões humanas e correções realizadas durante o desenvolvimento do sistema **TrampoJovem**, desenvolvido com apoio do agente **Google Antigravity**.

> **Metodologia:** Spec-Driven Development (Planejar → Desenvolver → Auditar → Testar → Corrigir → Implantar)  
> **Autor / Revisor Técnico:** Gabriel Pereira Pantoja (3º B – Técnico em Informática)  
> **Orientador:** Prof. Rafael Pitwak — IFRO Campus Calama  

---

## [2.5.0] — 2026-11-17 (Fase Atual: Deploy Serverless, Homologação e Spec Final)

### 🚀 Adicionado
- **Roteamento Vercel Serverless:** Criação do arquivo de configuração [`vercel.json`](vercel.json) com roteamento universal `/(.*)` para a API Node.js.
- **Ponto de Entrada Serverless:** Criação de [`api/index.js`](api/index.js) reexportando o aplicativo Express para a infraestrutura de funções serverless da Vercel.
- **Spec Final Completa:** Elaboração do [`spec.md`](spec.md) com todas as seções obrigatórias de instalação detalhada passo a passo, tabela de relacionamentos e guia de testes.
- **Script SQL Oficial:** Criação do arquivo [`database/schema.sql`](database/schema.sql) com DDL de todas as tabelas e dados sementes de teste.
- **Relato de Experiência Oficial:** Documento acadêmico nos padrões da ABNT e modelo IFRO em formato Word [`RELATO_DE_EXPERIENCIA_GABRIEL_PANTOJA.docx`](RELATO_DE_EXPERIENCIA_GABRIEL_PANTOJA.docx).

### 🛠️ Revisão Humana & Correção Técnica (Erro Crítico na Nuvem)
- **Problema Detectado:** Ao conectar o GitHub à Vercel, a página falhou com `500 FUNCTION_INVOCATION_FAILED`. Os logs revelaram: `better-sqlite3: install-scripts not yet covered by allowScripts`. A Vercel opera em containers Linux com sistema de arquivos somente leitura (*read-only*), bloqueando compilações em C++ (`node-gyp rebuild`) e a gravação de arquivos SQLite na raiz do projeto (`/var/task/database.sqlite`).
- **Decisão do Desenvolvedor (Gabriel):** Rejeitei a ideia de forçar dependências pesadas na Vercel. Em vez disso, orientei a reestruturação de [`src/config/database.js`](src/config/database.js) para criar um **motor de banco de dados híbrido e resiliente**:
  1. Em ambiente local: opera com `better-sqlite3` persistente em disco.
  2. Em ambiente Vercel Serverless: direciona o banco para `/tmp` e possui um *fallback* em memória automático pré-carregado com os usuários demo e vagas.
- **Resultado:** A aplicação entrou no ar na Vercel imediatamente com resposta 200 OK em [https://desenvolvimento-de-sistema-gb-este.vercel.app](https://desenvolvimento-de-sistema-gb-este.vercel.app).

---

## [2.4.0] — 2026-10-20 (Módulo de Segurança, Autoatendimento e Catálogo de Telas)

### 🚀 Adicionado
- **Recuperação de Senha (RF / RNF):** Criação da interface [`public/recuperar-senha.html`](public/recuperar-senha.html) e dos endpoints `/api/auth/forgot-password` e `/api/auth/reset-password`.
- **Tela de Cadastro Dedicada:** Criação de [`public/cadastro.html`](public/cadastro.html) com seletor visual de perfil (*Candidato* vs. *Empresa*) e validação de senha forte.
- **Catálogo Visual com Capturas Oficiais:** Automação em Node.js com Puppeteer para capturar todas as 10 telas em 1400x900 e gerar documentos oficiais em PDF e DOCX.

### 🛠️ Revisão Humana & Correções
- **Revisão no Hash de Senha:** O agente havia proposto um gerador de código que aceitava redefinição direta sem verificação de comprimento mínimo. Forcei a validação de que toda nova senha digitada no reset passe pela checagem de 6 caracteres mínimos e receba hash Bcrypt (salt rounds = 10) antes de sobrescrever o registro no banco.
- **Ajuste de Dependências:** O agente havia colocado `puppeteer-core` e `docx` em `dependencies`. Mudei manualmente para `devDependencies` no `package.json` para evitar que a Vercel instalasse pacotes pesados no ambiente de produção.

---

## [2.0.0] — 2026-10-13 (Fluxo Completo de Vagas e Candidaturas)

### 🚀 Adicionado
- **Gestão de Vagas pela Empresa:** Criação de rotas em `jobRoutes.js` (criar, editar, listar e alternar status aberta/encerrada).
- **Módulo de Candidaturas:** Criação de `applicationRoutes.js` (candidatar-se, listar minhas candidaturas, listar inscritos por vaga e alteração de status para *Em análise*, *Aprovado*, *Reprovado*).
- **Painéis do Frontend:** Desenvolvimento de `empresa-vagas.html`, `empresa-candidatos.html` e `candidato-candidaturas.html`.

### 🛠️ Revisão Humana & Correção de Bugs
- **Bug do Express 5 (Wildcard Route):** Na inicialização do servidor, ocorreu o erro `PathError: Missing parameter name at index 6: /api/*`. Como o Express 5 atualizou o `path-to-regexp`, a sintaxe `app.all('/api/*')` foi descontinuada. Corrigi substituindo pelo middleware padrão `app.use('/api', ...)` e fallback `app.use((req, res) => ...)`.
- **Integridade Referencial (RF11):** O agente havia feito a checagem de candidatura duplicada apenas via `SELECT` no controller. Exigi e adicionei a constraint `UNIQUE(id_candidato, id_vaga)` no nível DDL do banco de dados para garantir integridade física no banco relacional contra concorrência.

---

## [1.0.0] — 2026-06-22 a 2026-08-30 (Planejamento, Spec e Arquitetura Inicial)

### 🚀 Adicionado
- **Elaboração da Spec Inicial:** Definição do escopo no âmbito do Simulado Centelha 3 Rondônia (Fase 1 - Ideias Inovadoras).
- **Vídeo Pitch:** Elaboração de roteiro e gravação de vídeo pitch de até 3 minutos apresentando a dor do estudante, a solução do TrampoJovem e a oportunidade de mercado.
- **Modelagem Relacional (DER):** Definição das entidades fundamentais: `USUARIO`, `VAGA` e `CANDIDATURA`.
- **Configuração de Autenticação Segura:** Implementação de JWT (JSON Web Tokens) assinados e senhas com hash Bcrypt.
