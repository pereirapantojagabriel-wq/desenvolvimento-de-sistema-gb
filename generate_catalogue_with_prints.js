const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle } = require('docx');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const BASE_URL = 'http://localhost:3011';
const SCREENSHOT_DIR = path.resolve(__dirname, 'public/screenshots');
const ARTIFACT_SCREENSHOT_DIR = 'C:\\Users\\Aluno\\.gemini\\antigravity\\brain\\37ae3288-187e-4178-933c-c195007afe78\\screenshots';
const DOWNLOADS_DIR = 'C:\\Users\\Aluno\\Downloads';

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_SCREENSHOT_DIR)) fs.mkdirSync(ARTIFACT_SCREENSHOT_DIR, { recursive: true });

async function run() {
  console.log('🚀 Iniciando navegador Chrome para captura automatizada das telas...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const screens = [
    {
      id: '01',
      title: 'Tela 01 — Landing Page Institucional / Vitrine de Vagas Abertas',
      module: 'Público / Institucional',
      desc: 'Portal de entrada com proposta de valor, design moderno em tons de azul e verde, selos de oportunidade para estudantes de Ensino Médio/Técnico, atalhos de acesso rápido com 1 clique para as contas de demonstração e vitrine pública com filtros dinâmicos de busca (palavra-chave, modalidade Estágio/Aprendiz e cidade).',
      file: '01_landing_page.png',
      action: async () => {
        await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 800));
      }
    },
    {
      id: '02',
      title: 'Tela 02 — Modal Interativo de Detalhes da Vaga & Candidatura',
      module: 'Processo Seletivo / Candidatura',
      desc: 'Janela modal aberta ao clicar em qualquer card da vitrine. Apresenta descrição detalhada das atividades da vaga, lista de requisitos necessários, prazo limite de candidatura, modalidade de contratação e botão inteligente que permite ao estudante se candidatar com 1 clique ou alerta caso o usuário já esteja inscrito ou seja uma empresa.',
      file: '02_detalhes_vaga.png',
      action: async () => {
        await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 600));
        await page.evaluate(() => {
          if (typeof abrirDetalhesVaga === 'function') abrirDetalhesVaga(1);
        });
        await new Promise(r => setTimeout(r, 800));
      }
    },
    {
      id: '03',
      title: 'Tela 03 — Modal / Tela de Autenticação Unificada (Login)',
      module: 'Autenticação & Segurança',
      desc: 'Interface de acesso seguro com validação de credenciais de E-mail/Senha com hash bcrypt, suporte a autenticação por token JWT e cookies, botões de 1 clique para pré-preenchimento das contas demo (Gabriel ou InovaTech) e link direto para recuperação de senha.',
      file: '03_login.png',
      action: async () => {
        await page.goto(`${BASE_URL}/login.html`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 600));
      }
    },
    {
      id: '04',
      title: 'Tela 04 — Tela de Cadastro de Novo Usuário (Candidato ou Empresa)',
      module: 'Autenticação & Controle de Acesso',
      desc: 'Formulário completo de abertura de conta com seletor interativo de perfil: Candidato (Estudante/Aprendiz) ou Empresa (Publicar Vagas). Conta com validação no servidor de requisitos de segurança de senha (mínimo de 6 caracteres), impedimento de e-mails duplicados e campos específicos para estudantes (turma, escolaridade e habilidades).',
      file: '04_cadastro.png',
      action: async () => {
        await page.goto(`${BASE_URL}/cadastro.html`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 600));
      }
    },
    {
      id: '05',
      title: 'Tela 05 — Tela de Recuperação de Senha (Esqueceu a Senha)',
      module: 'Autenticação & Segurança',
      desc: 'Módulo de autoatendimento em duas etapas: na primeira, o usuário informa seu e-mail cadastrado e solicita o código de autenticação; na segunda, valida o código de 6 dígitos gerado e cadastra sua nova senha com confirmação, atualizando o hash no banco de dados SQLite instantaneamente.',
      file: '05_recuperar_senha.png',
      action: async () => {
        await page.goto(`${BASE_URL}/recuperar-senha.html`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 600));
      }
    },
    {
      id: '06',
      title: 'Tela 06 — Painel do Candidato: Edição de Perfil & Dados Pessoais',
      module: 'Perfil do Estudante / Gestão de Currículo',
      desc: 'Área privativa onde o estudante edita seus dados cadastrais, telefone/WhatsApp de contato, curso/turma (ex.: 3º B – Técnico em Informática), lista de habilidades técnicas e texto de apresentação pessoal (bio), atualizando as informações que serão visualizadas pelos recrutadores das empresas contratantes.',
      file: '06_candidato_perfil.png',
      action: async () => {
        await page.goto(`${BASE_URL}/login.html`, { waitUntil: 'networkidle2' });
        await page.evaluate(async () => {
          await loginDemo('gabriel@demo.com', '123456');
        });
        await new Promise(r => setTimeout(r, 1000));
        await page.goto(`${BASE_URL}/candidato-perfil.html`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 800));
      }
    },
    {
      id: '07',
      title: 'Tela 07 — Painel do Candidato: Minhas Candidaturas & Status',
      module: 'Processo Seletivo do Aluno',
      desc: 'Tabela completa com todas as vagas em que o candidato se inscreveu. Exibe nome do cargo, empresa, modalidade (Estágio vs Aprendiz), data da inscrição e badges coloridas com o andamento do processo seletivo em tempo real: ⏳ Em análise (amarelo), ✅ Aprovado (verde) ou ❌ Reprovado (vermelho).',
      file: '07_candidato_candidaturas.png',
      action: async () => {
        await page.goto(`${BASE_URL}/candidato-candidaturas.html`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 800));
      }
    },
    {
      id: '08',
      title: 'Tela 08 — Painel Administrativo da Empresa: Dashboard de Vagas',
      module: 'Gestão Corporativa / Administrativo',
      desc: 'Dashboard da empresa com cards de métricas em tempo real (Total de Vagas, Vagas Abertas e Total de Inscritos). Inclui listagem das vagas cadastradas com botão para publicar nova oportunidade, editar requisitos, encerrar ou reabrir vagas com 1 clique e botão de acesso direto à triagem de candidatos.',
      file: '08_empresa_dashboard.png',
      action: async () => {
        await page.goto(`${BASE_URL}/login.html`, { waitUntil: 'networkidle2' });
        await page.evaluate(async () => {
          await loginDemo('empresa@demo.com', '123456');
        });
        await new Promise(r => setTimeout(r, 1000));
        await page.goto(`${BASE_URL}/empresa-vagas.html`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 800));
      }
    },
    {
      id: '09',
      title: 'Tela 09 — Modal de Publicação e Edição de Vagas',
      module: 'Cadastro & Edição de Oportunidades',
      desc: 'Formulário modal rápido e intuitivo para cadastro ou alteração de vagas. Permite definir título da oportunidade, tipo de contratação (Estágio ou Jovem Aprendiz), localidade de atuação, prazo limite de candidatura, descrição das atividades do dia a dia e requisitos técnicos.',
      file: '09_empresa_nova_vaga_modal.png',
      action: async () => {
        await page.goto(`${BASE_URL}/empresa-vagas.html`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 600));
        await page.evaluate(() => {
          if (typeof abrirModalNovaVaga === 'function') abrirModalNovaVaga();
        });
        await new Promise(r => setTimeout(r, 800));
      }
    },
    {
      id: '10',
      title: 'Tela 10 — Gestão, Triagem e Decisão de Candidatos por Vaga',
      module: 'Triagem de Talentos / RH',
      desc: 'Área de tomada de decisão do recrutador. Para a vaga selecionada, exibe o perfil detalhado de cada jovem inscrito com contato, escolaridade/curso, tags de habilidades técnicas, texto de apresentação e data da candidatura. Permite à empresa alterar o status da candidatura na hora (Em análise, Aprovado, Reprovado) com persistência imediata.',
      file: '10_empresa_candidatos.png',
      action: async () => {
        await page.goto(`${BASE_URL}/empresa-candidatos.html?id_vaga=1`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 800));
      }
    }
  ];

  console.log('📸 Capturando as telas do sistema...');
  for (const s of screens) {
    try {
      await s.action();
      const localPath = path.join(SCREENSHOT_DIR, s.file);
      const artifactPath = path.join(ARTIFACT_SCREENSHOT_DIR, s.file);

      await page.screenshot({ path: localPath });
      fs.copyFileSync(localPath, artifactPath);
      console.log(`✅ [${s.id}/10] Capturada: ${s.title}`);
    } catch (err) {
      console.error(`❌ Erro ao capturar ${s.title}:`, err.message);
    }
  }

  // Gera HTML oficial do catálogo com as capturas embutidas
  console.log('📄 Gerando Catálogo Visual Oficial em HTML...');
  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>■ TrampoJovem — Catálogo Visual de Telas com Capturas Oficiais</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 2rem 0; }
    .page-container { max-width: 1100px; margin: 0 auto; padding: 0 1rem; }
    .header-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 2rem; margin-bottom: 3rem; }
    .screen-block { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 1.8rem; margin-bottom: 3.5rem; }
    .screen-img { width: 100%; height: auto; border-radius: 12px; border: 2px solid #334155; margin-bottom: 1.2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
    .screen-title { font-size: 1.4rem; font-weight: 700; color: #38bdf8; margin-bottom: 0.3rem; }
    .module-badge { background: #0284c7; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: 0.8rem; }
    .desc-box { background: #0f172a; border-left: 4px solid #38bdf8; padding: 1rem 1.2rem; border-radius: 0 8px 8px 0; font-size: 0.95rem; color: #cbd5e1; }
    @media print {
      body { background: white !important; color: black !important; padding: 0; }
      .header-card, .screen-block { background: white !important; border: 1px solid #ddd !important; break-inside: avoid; }
      .screen-title { color: #0284c7 !important; }
      .desc-box { background: #f8fafc !important; color: #333 !important; }
      .screen-img { border-color: #ccc !important; }
    }
  </style>
</head>
<body>
  <div class="page-container">
    
    <div class="header-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="fw-bold mb-0 text-white">■ TrampoJovem — Catálogo Visual de Telas com Capturas Oficiais</h2>
        <span class="badge bg-success px-3 py-2 fs-6">Versão Oficial 2.5 · Outubro 2026</span>
      </div>
      <p class="text-secondary mb-4">Apresentação de Todas as Telas do Sistema com Prints Reais e Descrição Técnica</p>

      <table class="table table-dark table-bordered mb-4 small">
        <tbody>
          <tr>
            <td class="fw-bold text-info" style="width:25%;">Aluno Desenvolvedor:</td>
            <td>Gabriel Pereira Pantoja</td>
            <td class="fw-bold text-info" style="width:25%;">Instituição:</td>
            <td>IFRO — Campus Calama / Rede Pública</td>
          </tr>
          <tr>
            <td class="fw-bold text-info">Turma / Curso:</td>
            <td>3º B – Técnico em Informática</td>
            <td class="fw-bold text-info">Componente:</td>
            <td>Desenvolvimento de Sistemas</td>
          </tr>
          <tr>
            <td class="fw-bold text-info">Orientação / Edital:</td>
            <td>Simulado Programa Centelha 3 Rondônia (Edital 03/2026)</td>
            <td class="fw-bold text-info">Metodologia:</td>
            <td>Spec-Driven Development</td>
          </tr>
        </tbody>
      </table>

      <h5 class="fw-bold text-white mb-2">Resumo do Sistema</h5>
      <p class="text-secondary small mb-0 lh-base">
        O TrampoJovem é uma plataforma completa focada na unificação e simplificação da divulgação e contratação de estudantes para vagas de <strong>Estágio</strong> e <strong>Jovem Aprendiz</strong>. O sistema integra contas de estudantes e empresas, vitrine pública com busca dinâmica por palavra-chave e localidade, candidatura em 1 clique com trava contra duplicidade, perfil completo com histórico de candidaturas e painel administrativo para gestão de oportunidades e deferimento de processos seletivos.
      </p>
    </div>

    ${screens.map(s => `
      <div class="screen-block">
        <img src="screenshots/${s.file}" alt="${s.title}" class="screen-img">
        <div class="screen-title">${s.title}</div>
        <div class="module-badge">Módulo: ${s.module}</div>
        <div class="desc-box">
          <strong>O que é esta tela / Funcionamento:</strong><br>
          ${s.desc}
        </div>
      </div>
    `).join('')}

  </div>
</body>
</html>`;

  const htmlPath = path.resolve(__dirname, 'public/catalogo_com_prints.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
  console.log('✅ HTML do catálogo salvo em public/catalogo_com_prints.html');

  // Gerar PDF oficial via Puppeteer
  console.log('📄 Gerando PDF em alta resolução...');
  await page.goto(`${BASE_URL}/catalogo_com_prints.html`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const pdfPathDownloads = path.join(DOWNLOADS_DIR, 'TRAMPOJOVEM_CATALOGO_VISUAL_COM_PRINTS.pdf');
  const pdfPathWorkspace = path.resolve(__dirname, 'TRAMPOJOVEM_CATALOGO_VISUAL_COM_PRINTS.pdf');

  await page.pdf({
    path: pdfPathWorkspace,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
  });

  fs.copyFileSync(pdfPathWorkspace, pdfPathDownloads);
  console.log(`✅ PDF gerado com sucesso em: ${pdfPathDownloads}`);

  await browser.close();

  // Gerar DOCX oficial para compatibilidade total
  console.log('📝 Gerando documento DOCX oficial...');
  const docxSections = [];

  // Cabeçalho DOCX
  docxSections.push(
    new Paragraph({
      text: "■ TrampoJovem — Catálogo Visual de Telas com Capturas Oficiais",
      heading: HeadingLevel.TITLE
    }),
    new Paragraph({
      text: "Apresentação de Todas as Telas do Sistema com Prints Reais e Descrição Técnica",
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({ text: "" }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Aluno Desenvolvedor:", bold: true })] })] }),
            new TableCell({ children: [new Paragraph("Gabriel Pereira Pantoja")] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Instituição:", bold: true })] })] }),
            new TableCell({ children: [new Paragraph("IFRO — Campus Calama")] }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Turma / Curso:", bold: true })] })] }),
            new TableCell({ children: [new Paragraph("3º B – Técnico em Informática")] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Componente:", bold: true })] })] }),
            new TableCell({ children: [new Paragraph("Desenvolvimento de Sistemas")] }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Orientação / Edital:", bold: true })] })] }),
            new TableCell({ children: [new Paragraph("Simulado Programa Centelha 3")] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Metodologia:", bold: true })] })] }),
            new TableCell({ children: [new Paragraph("Spec-Driven Development")] }),
          ]
        })
      ]
    }),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [new TextRun({ text: "Resumo do Sistema", bold: true, size: 28 })]
    }),
    new Paragraph({
      text: "O TrampoJovem é uma plataforma web completa desenvolvida para cadastro, divulgação, candidatura e acompanhamento de oportunidades de Estágio e Jovem Aprendiz. Conecta estudantes a empresas e órgãos contratantes, simplificando o processo seletivo através de um fluxo digital transparente, sem papelada e com acompanhamento em tempo real."
    }),
    new Paragraph({ text: "" })
  );

  for (const s of screens) {
    const imgBuffer = fs.readFileSync(path.join(SCREENSHOT_DIR, s.file));
    docxSections.push(
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [
          new ImageRun({
            data: imgBuffer,
            transformation: { width: 580, height: 370 }
          })
        ]
      }),
      new Paragraph({
        children: [new TextRun({ text: s.title, bold: true, size: 24 })]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Módulo: ", bold: true }),
          new TextRun({ text: s.module, color: "0284C7" })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "O que é esta tela / Funcionamento:\n", bold: true }),
          new TextRun({ text: s.desc })
        ]
      }),
      new Paragraph({ text: "" })
    );
  }

  const doc = new Document({
    sections: [{ children: docxSections }]
  });

  const docxBuffer = await Packer.toBuffer(doc);
  const docxPathDownloads = path.join(DOWNLOADS_DIR, 'TRAMPOJOVEM_CATALOGO_VISUAL_COM_PRINTS.docx');
  const docxPathWorkspace = path.resolve(__dirname, 'TRAMPOJOVEM_CATALOGO_VISUAL_COM_PRINTS.docx');

  fs.writeFileSync(docxPathWorkspace, docxBuffer);
  fs.writeFileSync(docxPathDownloads, docxBuffer);
  console.log(`✅ DOCX gerado com sucesso em: ${docxPathDownloads}`);

  console.log('🎉 PROCESSO CONCLUÍDO COM SUCESSO TOTAL!');
}

run().catch(err => {
  console.error('Erro na execução:', err);
  process.exit(1);
});
