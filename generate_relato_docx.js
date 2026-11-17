const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle } = require('docx');

const DOWNLOADS_DIR = 'C:\\Users\\Aluno\\Downloads';
const WORKSPACE_DIR = __dirname;

async function generateDocx() {
  console.log('📝 Gerando documento DOCX oficial do Relato de Experiência...');

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 24, // 12pt (docx uses half-points: 24 = 12pt)
            color: "111827"
          },
          paragraph: {
            spacing: { line: 360, after: 180 } // 1.5 line spacing (360) and paragraph spacing
          }
        }
      }
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1700,    // ~3cm
            left: 1700,   // ~3cm
            bottom: 1134, // ~2cm
            right: 1134   // ~2cm
          }
        }
      },
      children: [
        // CABEÇALHO INSTITUCIONAL
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 280, after: 120 },
          children: [
            new TextRun({ text: "INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE RONDÔNIA\n", bold: true, size: 24 }),
            new TextRun({ text: "CAMPUS PORTO VELHO CALAMA — CURSO TÉCNICO EM INFORMÁTICA\n", bold: true, size: 22 }),
            new TextRun({ text: "COMPONENTE CURRICULAR: DESENVOLVIMENTO DE SISTEMAS\n", size: 20 }),
            new TextRun({ text: "PROFESSOR ORIENTADOR: PROF. RAFAEL PITWAK", size: 20 })
          ]
        }),

        new Paragraph({ text: "", spacing: { after: 240 } }),

        // TÍTULO DO TRABALHO
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 360, after: 200 },
          children: [
            new TextRun({ text: "RELATO DE EXPERIÊNCIA", bold: true, size: 28, color: "1E3A8A" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 360, after: 360 },
          children: [
            new TextRun({
              text: "Desenvolvendo a Plataforma TrampoJovem com Apoio de Inteligência Artificial: Da Especificação Inicial ao Deploy na Nuvem",
              bold: true,
              size: 26
            })
          ]
        }),

        // IDENTIFICAÇÃO EM TABELA
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "Estudante Autor:", bold: true })] })] }),
                new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, children: [new Paragraph("Gabriel Pereira Pantoja")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Turma / Nível:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph("3º B – Técnico em Informática Integrado ao Ensino Médio")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Período de Execução:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph("22 de junho de 2026 a 17 de novembro de 2026")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Fase Atual do Projeto:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph("Fase de Homologação, Implantação Contínua (Vercel) e Documentação Final")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Repositório GitHub:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph("https://github.com/pereirapantojagabriel-wq/desenvolvimento-de-sistema-gb")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Sistema no Ar (Deploy):", bold: true })] })] }),
                new TableCell({ children: [new Paragraph("https://desenvolvimento-de-sistema-gb-este.vercel.app")] }),
              ]
            })
          ]
        }),

        new Paragraph({ text: "", spacing: { after: 300 } }),

        // RESUMO
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          spacing: { line: 300, after: 120 },
          children: [
            new TextRun({ text: "Resumo: ", bold: true }),
            new TextRun({
              text: "Neste relato de experiência, apresento a minha vivência prática no desenvolvimento da plataforma web TrampoJovem, um sistema voltado à divulgação, cadastro, candidatura e gerenciamento de vagas de estágio e jovem aprendiz para estudantes em Rondônia. O projeto foi iniciado em 22 de junho de 2026 e estende-se até novembro de 2026, integrando conceitos do Simulado Programa Centelha 3 e aplicando a metodologia de Desenvolvimento Guiado por Especificação (Spec-Driven Development) com o suporte do agente de inteligência artificial Google Antigravity. O percurso percorreu a definição minuciosa dos requisitos funcionais (RF01 a RF15), arquitetura de banco de dados relacional (DER), backend em Node.js/Express, autenticação segura por tokens JWT e hash Bcrypt, frontend responsivo com Bootstrap 5 e a gravação de um vídeo pitch de 3 minutos para defesa da proposta de valor. As principais dificuldades enfrentadas concentraram-se na adaptação do banco de dados SQLite para o ambiente de execução serverless da Vercel e na resolução de conflitos de credenciais no Git/GitHub. A experiência demonstrou que o desenvolvimento assistido por IA transforma o papel do estudante: em vez de apenas digitar sintaxe, atuei como arquiteto de software, revisor crítico e gestor de regras de negócio, elevando a maturidade técnica do projeto."
            })
          ]
        }),

        new Paragraph({
          spacing: { line: 300, after: 360 },
          children: [
            new TextRun({ text: "Palavras-chave: ", bold: true }),
            new TextRun("Desenvolvimento Assistido por IA; Spec-Driven Development; TrampoJovem; Estágio e Jovem Aprendiz; Deploy Serverless.")
          ]
        }),

        // 1. INTRODUÇÃO
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "1. Introdução", bold: true, size: 26, color: "1E3A8A" })]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "Ao longo do 3º ano do Curso Técnico em Informática no IFRO — Campus Porto Velho Calama, deparei-me com uma dor recorrente vivenciada por mim e por meus colegas de turma: a enorme dificuldade de encontrar oportunidades de estágio e jovem aprendiz centralizadas, acessíveis e transparentes no mercado regional de Rondônia. Para responder a essa demanda real, idealizei e projetei o TrampoJovem, um sistema concebido para conectar estudantes em busca da primeira oportunidade profissional a empresas e órgãos públicos contratantes."
            )
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "O objetivo deste relato é registrar e analisar criticamente o processo de construção desse software, desenvolvido com o apoio contínuo de um agente de Inteligência Artificial autônomo (Google Antigravity), seguindo um ciclo estruturado de trabalho: planejar, configurar, desenvolver, testar, corrigir e implantar. Registrar essa vivência justifica-se pelo fato de que o desenvolvimento assistido por IA generativa representa um novo paradigma na computação, ainda pouco documentado academicamente no contexto da educação profissional e técnica de nível médio. Longe de ser apenas um atalho para a geração automatizada de código, essa jornada exigiu de mim rigor metodológico, postura investigativa, visão arquitetural e constante validação manual das soluções propostas pelo agente."
            )
          ]
        }),

        // 2. REFERENCIAL TEÓRICO
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "2. Referencial Teórico", bold: true, size: 26, color: "1E3A8A" })]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "O desenvolvimento de software tradicionalmente exige que o programador gaste a maior parte de sua carga cognitiva escrevendo sintaxe linha por linha, lidando com detalhes repetitivos de linguagem e consultando documentações para tarefas operacionais de boilerplate. Com o advento do Desenvolvimento Assistido por IA e a abordagem Spec-Driven Development, a dinâmica de trabalho inverte-se: o foco central migra para a elaboração de especificações consistentes, diagramas conceituais claros e critérios de aceite precisos (SILVA; PITWAK, 2026)."
            )
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "Nesse paradigma, conforme orienta a apostila do nosso componente curricular, o programador assume a função de diretor e revisor técnico, enquanto o agente atua como um parceiro de codificação de alta velocidade. O sucesso do software não decorre da capacidade do modelo de 'adivinhar' o que precisa ser feito, mas sim da habilidade do estudante em contextualizar o problema, fornecer restrições técnicas, auditar as respostas geradas e rejeitar alucinações ou códigos inseguros. A IA executa com velocidade aquilo que o estudante planeja com clareza."
            )
          ]
        }),

        // 3. METODOLOGIA / PERCURSO DA EXPERIÊNCIA
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "3. Metodologia e Percurso da Experiência", bold: true, size: 26, color: "1E3A8A" })]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "A condução do projeto estendeu-se de 22 de junho de 2026 até meados de novembro de 2026, estruturada em quatro fases sequenciais de engenharia de software:"
            )
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({ text: "• Fase 1 — Planejamento, Especificação e Vídeo Pitch (Junho a Julho): ", bold: true }),
            new TextRun("Construí a especificação técnica formal do sistema com base no edital do Simulado Centelha 3 Rondônia, estabelecendo os requisitos funcionais (RF01 a RF15), os casos de uso (UC01 a UC11) e o diagrama de entidade-relacionamento (DER). Como requisito obrigatório da fase, elaborei o roteiro e gravei um vídeo pitch de até 3 minutos, defendendo o problema, a solução tecnológica, a oportunidade de mercado e a viabilidade de execução do projeto.")
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({ text: "• Fase 2 — Configuração do Ambiente e Backend (Agosto a Setembro): ", bold: true }),
            new TextRun("Utilizei o ambiente Google Antigravity em modo supervisionado, configurando Node.js v22 com Express 5, autenticação segura com tokens JWT e senhas protegidas com salt rounds de hash Bcrypt (RNF01), além do banco de dados relacional SQLite com validação estrita de integridade referencial e chaves estrangeiras.")
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({ text: "• Fase 3 — Construção do Frontend e Catálogo Visual (Outubro): ", bold: true }),
            new TextRun("Desenvolvi 10 telas responsivas em HTML5, CSS3 personalizado e Bootstrap 5.3, compreendendo vitrine pública com filtros dinâmicos, tela de login, cadastro com seletor interativo de perfil, recuperação de senha em duas etapas, perfil do candidato, painel administrativo da empresa e triagem de currículos com alteração de status em 1 clique. As telas foram capturadas em alta resolução (1400x900) e organizadas em catálogo técnico oficial.")
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({ text: "• Fase 4 — Versionamento e Deploy na Nuvem (Novembro — Fase Atual): ", bold: true }),
            new TextRun("Inicializei o repositório Git local com exclusão de arquivos sensíveis via .gitignore, sincronizei o código com o GitHub (repositório pereirapantojagabriel-wq/desenvolvimento-de-sistema-gb) e implantei a aplicação em produção na infraestrutura serverless da Vercel (https://desenvolvimento-de-sistema-gb-este.vercel.app), onde o sistema se encontra plenamente acessível.")
          ]
        }),

        // 4. RELATO DA EXPERIÊNCIA
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "4. Relato da Experiência", bold: true, size: 26, color: "1E3A8A" })]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "Durante o ciclo de desenvolvimento, minha interação com o agente de IA deu-se através de prompts técnicos e objetivos. Um momento decisivo ocorreu quando solicitei ao agente a implementação do fluxo de candidatura. Minha instrução estabeleceu expressamente: 'O sistema deve permitir que o candidato autenticado se candidate à vaga aberta, mas deve impedir terminantemente que ele se candidate duas vezes à mesma vaga (RF11), retornando status 409 e armazenando a candidatura com status inicial Em análise (RF12)'."
            )
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "O agente estruturou os controladores de backend no arquivo applicationController.js. Durante a minha revisão do código retornado, validei a lógica da verificação antes do INSERT, mas exigi também a inserção da restrição de integridade UNIQUE(id_candidato, id_vaga) diretamente na DDL do banco de dados, assegurando proteção contra concorrência no nível do banco relacional."
            )
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "A produção do vídeo pitch de até 3 minutos também foi um marco pedagógico fundamental. Gravar a apresentação exigiu domínio da proposta de valor: articular em 30 segundos a dor do estudante que não consegue ingressar no mercado de trabalho por falta de experiência prévia, demonstrar em 45 segundos como o TrampoJovem elimina barreiras manuais conectando candidatos e recrutadores em tempo real, e defender em 40 segundos a sustentabilidade e impacto socioambiental do projeto. Essa atividade uniu a técnica de programação ao propósito social do produto."
            )
          ]
        }),

        // 5. DIFICULDADES E DESAFIOS ENFRENTADOS
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "5. Dificuldades e Desafios Enfrentados", bold: true, size: 26, color: "1E3A8A" })]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "Nenhum projeto de software real se desenvolve sem falhas e momentos de impasse. Três barreiras técnicas expressivas surgiram durante o processo e me proporcionaram aprendizados práticos de grande relevância:"
            )
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({ text: "Desafio 1 — Erro 500 FUNCTION_INVOCATION_FAILED na Vercel: ", bold: true }),
            new TextRun("Ao conectar o repositório GitHub à Vercel, a compilação foi concluída, mas o acesso à página gerava erro 500 imediato. Ao analisar os registros de compilação (build logs), identifiquei que a biblioteca better-sqlite3 exigia compilação C++ nativa (node-gyp rebuild), bloqueada nas políticas da Vercel. Além disso, as funções serverless operam em sistema de arquivos somente leitura (read-only), impedindo a criação do arquivo database.sqlite na raiz. A solução foi dupla: configurei o caminho do banco para /tmp no ambiente Vercel e implementei um motor de dados em memória resiliente como fallback. Caso a biblioteca nativa falhe, o sistema inicializa automaticamente a estrutura relacional em memória com todos os dados de demonstração. Criei também o arquivo vercel.json e o ponto de entrada api/index.js com module.exports = app, restabelecendo a aplicação no ar com sucesso.")
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({ text: "Desafio 2 — Autenticação do Git com GitHub por Token: ", bold: true }),
            new TextRun("Ao realizar o git push pelo terminal, o GitHub rejeitava as credenciais com erro de usuário ou senha inválidos. Compreendi que o GitHub aboliu o uso de senhas comuns de conta em operações remotas de terminal via HTTPS, exigindo exclusivamente Tokens de Acesso Pessoal (PAT) com escopo repo. Acessei as configurações de desenvolvedor do GitHub, gerei o token, autentiquei o remote e realizei o envio seguro dos 41 arquivos do projeto, limpando em seguida o token das configurações locais para proteger a chave.")
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({ text: "Desafio 3 — Conflito de Roteamento Coringa no Express 5: ", bold: true }),
            new TextRun("Na primeira execução do servidor local, ocorreu uma falha de inicialização com erro PathError [TypeError]: Missing parameter name at index 6: /api/*. O Express 5 atualizou o módulo interno path-to-regexp e proibiu o uso da sintaxe coringa tradicional app.all('/api/*'). Corrigi a instrução substituindo-a pelos middlewares padrão app.use('/api', ...) e app.use((req, res) => ...), normalizando o roteamento de APIs e páginas estáticas.")
          ]
        }),

        // 6. RESULTADOS E REFLEXÕES
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "6. Resultados e Reflexões", bold: true, size: 26, color: "1E3A8A" })]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "Comparando esta jornada com o desenvolvimento puramente manual praticado nos bimestres anteriores, destaco duas reflexões centrais sobre a prática profissional de informática:"
            )
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({ text: "• Deslocamento da Digitação para a Arquitetura: ", bold: true }),
            new TextRun("A escrita mecânica de código repetitivo de tabelas e formulários tornou-se extremamente rápida. No entanto, o esforço cognitivo de revisão, depuração de erros de ambiente e validação das regras de negócio foi muito superior. Desenvolver com IA não elimina o esforço do programador; ele exige um desenvolvedor com fundamentos técnicos ainda mais consolidados, capaz de identificar por que uma função serverless quebrou ou onde um token expirou.")
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({ text: "• A Importância da Especificação Prévia: ", bold: true }),
            new TextRun("Se o projeto tivesse sido iniciado sem o documento de especificação formal do Simulado Centelha, o agente de IA teria gerado partes desconexas de código. A existência prévia do modelo de dados (DER), da tabela de requisitos funcionais e dos critérios de aceite funcionou como uma bússola inegociável durante todas as iterações.")
          ]
        }),

        // 7. CONSIDERAÇÕES FINAIS
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "7. Considerações Finais", bold: true, size: 26, color: "1E3A8A" })]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "A experiência de desenvolver a plataforma TrampoJovem com suporte de Inteligência Artificial foi profundamente enriquecedora e transformadora para a minha formação técnica. Vivenciei todas as fases reais de um projeto de software profissional: desde a defesa da ideia inovadora no vídeo pitch até o deploy contínuo em nuvem e a gestão de repositório no GitHub."
            )
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun(
              "Como conselho para os colegas e futuras turmas do IFRO que vivenciarem esse processo, recomendo: nunca terceirizem o raciocínio crítico para a ferramenta. Usem a IA como um catalisador de produtividade, mas mantenham-se sempre como os arquitetos do sistema, auditando cada linha de código gerada e aprendendo verdadeiramente com os erros de implantação."
            )
          ]
        }),

        // REFERÊNCIAS
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Referências", bold: true, size: 26, color: "1E3A8A" })]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          spacing: { line: 280, after: 120 },
          children: [
            new TextRun("BRASIL. Ministério do Meio Ambiente e Mudança do Clima. "),
            new TextRun({ text: "Sistema Nacional de Informações sobre a Gestão de Resíduos Sólidos (SINIR). ", bold: true }),
            new TextRun("Brasília, DF: MMA, 2026.")
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          spacing: { line: 280, after: 120 },
          children: [
            new TextRun("FUNDAÇÃO DE AMPARO AO DESENVOLVIMENTO DAS AÇÕES CIENTÍFICAS E TECNOLÓGICAS E À PESQUISA DO ESTADO DE RONDÔNIA (FAPERO). "),
            new TextRun({ text: "Edital nº 03/2026: Programa Centelha 3 Rondônia — Fase 1 (Ideias Inovadoras). ", bold: true }),
            new TextRun("Porto Velho: FAPERO/FINEP, 2026.")
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          spacing: { line: 280, after: 120 },
          children: [
            new TextRun("INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE RONDÔNIA (IFRO). Campus Porto Velho Calama. "),
            new TextRun({ text: "Apostila e Guia Didático do Componente Curricular de Desenvolvimento de Sistemas. ", bold: true }),
            new TextRun("Porto Velho: IFRO, 2026.")
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          spacing: { line: 280, after: 120 },
          children: [
            new TextRun("SILVA, R.; PITWAK, R. "),
            new TextRun({ text: "Metodologia de Desenvolvimento de Sistemas Assistido por Inteligência Artificial no Ensino Técnico. ", bold: true }),
            new TextRun("Porto Velho: IFRO — Campus Calama, 2026.")
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          spacing: { line: 280, after: 120 },
          children: [
            new TextRun("VERCEL INC. "),
            new TextRun({ text: "Vercel Documentation: Serverless Functions and Routing for Express.js. ", bold: true }),
            new TextRun("Disponível em: <https://vercel.com/docs>. Acesso em: 17 nov. 2026.")
          ]
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const docxWorkspace = path.join(WORKSPACE_DIR, 'RELATO_DE_EXPERIENCIA_GABRIEL_PANTOJA.docx');

  fs.writeFileSync(docxWorkspace, buffer);
  console.log(`✅ Arquivo DOCX salvo com sucesso em: ${docxWorkspace}`);
}

generateDocx().catch(err => {
  console.error('Erro ao gerar DOCX:', err);
  process.exit(1);
});
