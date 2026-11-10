# 💼 TrampoJovem — Sistema de Vagas e Candidaturas (Estágio & Jovem Aprendiz)

Sistema web completo desenvolvido para cadastro, divulgação e gerenciamento de vagas de estágio e jovem aprendiz, conectando estudantes e empresas no âmbito do **Simulado Centelha 3 Rondônia / Desenvolvimento de Sistemas**.

---

## 🌐 Endereço de Acesso Local
O sistema está ativo e configurado na porta **3011**:
👉 **[http://localhost:3011](http://localhost:3011)**

---

## 🚀 Contas Demo para Teste Imediato (com 1 clique na tela de login)

| Tipo de Usuário | Nome / Perfil | E-mail | Senha |
|---|---|---|---|
| **Candidato (Estudante)** | Gabriel Pereira Pantoja (3º B Informática) | `gabriel@demo.com` | `123456` |
| **Empresa / Administrador** | InovaTech Rondônia | `empresa@demo.com` | `123456` |

*Obs.: Você também pode cadastrar novos usuários de qualquer tipo pela tela de registro.*

---

## 📋 Funcionalidades Implementadas (100% da Especificação)

### 1. Autenticação & Usuários
- **RF01 & UC01**: Cadastro de usuários com nome, e-mail, senha e tipo de perfil (*Candidato* ou *Empresa*).
- **RF02 & UC02**: Login com e-mail e validação segura de senha com hash **bcrypt**.
- **RF03**: Validação de e-mail único (bloqueia e avisa sobre duplicidade).
- **RF04**: Logout seguro e encerramento de sessão.
- **RF05 & UC03**: Atualização de perfil do candidato (nome, telefone, formação, habilidades, biografia).

### 2. Gestão de Vagas (Empresa)
- **RF06 & UC04**: Publicação de novas vagas contendo título, descrição, requisitos, localidade, tipo de contratação (*Estágio* ou *Jovem Aprendiz*) e prazo de candidatura.
- **RF07 & UC05**: Listagem pública e responsiva de todas as vagas abertas com filtros de busca por palavra-chave, modalidade e localidade.
- **RF08 & UC06**: Visualização detalhada da vaga e requisitos em modal interativo.
- **RF09 & UC11**: Edição completa e encerramento/reabertura de vagas pela empresa.
- **Painel de Controle**: Indicadores em tempo real de total de vagas, vagas abertas e candidaturas recebidas.

### 3. Fluxo de Candidaturas (Candidato & Empresa)
- **RF10 & UC07**: Candidato autenticado se candidata a uma vaga aberta com 1 clique.
- **RF11**: Bloqueio automático contra candidaturas duplicadas pelo mesmo usuário.
- **RF12**: Registro imediato no banco de dados com data e status inicial **"Em análise"**.
- **RF13 & UC08**: Painel *"Minhas Candidaturas"* para o estudante acompanhar o status com badges visuais.
- **RF14 & UC09**: Painel de candidatos inscritos por vaga para a empresa visualizar perfis completos e contatos.
- **RF15 & UC10**: Atualização em tempo real do status do candidato pela empresa (*Em análise*, *Aprovado*, *Reprovado*).

---

## 🛠️ Tecnologias Utilizadas
- **Backend**: Node.js & Express
- **Banco de Dados**: SQLite Relacional via `better-sqlite3` com Foreign Keys ativas e integridade referencial (suporte a PostgreSQL configurável via `.env`).
- **Segurança**: Senhas criptografadas com `bcryptjs`, autenticação com `jsonwebtoken` (JWT) e validações robustas no servidor (RNF01, RNF02, RNF03).
- **Frontend**: HTML5, CSS3, JavaScript ES6+, Bootstrap 5.3 e Bootstrap Icons.
- **Porta**: 3011.

---

## 🏃 Como Rodar o Projeto

Caso queira reiniciar o servidor manualmente:
```bash
npm start
```
Acesse no seu navegador: **http://localhost:3011**
