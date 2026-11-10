// api.js - Gerenciamento de Estado, Autenticação e Requisições HTTP

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

function getCurrentUser() {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

async function apiFetch(endpoint, options = {}) {
  const headers = options.headers || {};
  const token = getToken();

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  options.headers = headers;

  try {
    const res = await fetch(endpoint, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.error || `Erro (${res.status}): Falha na operação.`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

// Toast Notificações
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toastId = 'toast-' + Date.now();
  const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : type === 'warning' ? 'bg-warning text-dark' : 'bg-primary';

  const html = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 mb-2 shadow" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body fs-6">
          <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', html);
  const element = document.getElementById(toastId);
  const toast = new bootstrap.Toast(element, { delay: 4500 });
  toast.show();

  element.addEventListener('hidden.bs.toast', () => {
    element.remove();
  });
}

// Renderização dinâmica da Barra de Navegação (Navbar)
function renderNavbar() {
  const navContainer = document.getElementById('main-nav');
  if (!navContainer) return;

  const user = getCurrentUser();

  let userLinks = '';
  if (!user) {
    userLinks = `
      <li class="nav-item">
        <a class="nav-link" href="login.html"><i class="bi bi-box-arrow-in-right me-1"></i> Entrar / Cadastrar</a>
      </li>
    `;
  } else if (user.tipo_usuario === 'candidato') {
    userLinks = `
      <li class="nav-item">
        <a class="nav-link" href="candidato-candidaturas.html"><i class="bi bi-journal-check me-1"></i> Minhas Candidaturas</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="candidato-perfil.html"><i class="bi bi-person-circle me-1"></i> Meu Perfil</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle active fw-semibold text-primary" href="#" role="button" data-bs-toggle="dropdown">
          <i class="bi bi-person-fill"></i> ${user.nome.split(' ')[0]} <span class="badge bg-primary-subtle text-primary border ms-1">Candidato</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
          <li><a class="dropdown-item" href="candidato-perfil.html"><i class="bi bi-person me-2"></i>Editar Perfil</a></li>
          <li><a class="dropdown-item" href="candidato-candidaturas.html"><i class="bi bi-list-check me-2"></i>Minhas Vagas</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" onclick="logoutUser()"><i class="bi bi-box-arrow-right me-2"></i>Sair</a></li>
        </ul>
      </li>
    `;
  } else if (user.tipo_usuario === 'empresa') {
    userLinks = `
      <li class="nav-item">
        <a class="nav-link" href="empresa-vagas.html"><i class="bi bi-building me-1"></i> Painel da Empresa</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle active fw-semibold text-success" href="#" role="button" data-bs-toggle="dropdown">
          <i class="bi bi-briefcase-fill"></i> ${user.nome.split(' ')[0]} <span class="badge bg-success-subtle text-success border ms-1">Empresa</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
          <li><a class="dropdown-item" href="empresa-vagas.html"><i class="bi bi-speedometer2 me-2"></i>Gerenciar Vagas</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" onclick="logoutUser()"><i class="bi bi-box-arrow-right me-2"></i>Sair</a></li>
        </ul>
      </li>
    `;
  }

  navContainer.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center text-primary" href="index.html">
          <i class="bi bi-briefcase fs-3 me-2 text-primary"></i>
          <span>Trampo<strong class="text-dark">Jovem</strong></span>
          <span class="brand-badge">Estágio & Aprendiz</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="index.html"><i class="bi bi-search me-1"></i> Vagas Abertas</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-primary fw-semibold" href="catalogo.html"><i class="bi bi-file-earmark-slides me-1"></i> Catálogo de Telas</a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-1">
            ${userLinks}
          </ul>
        </div>
      </div>
    </nav>
  `;
}

async function logoutUser() {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } catch (e) {
    // prossegue limpando
  }
  clearAuth();
  showToast('Você saiu do sistema.', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 600);
}

// Atalho para login com conta demo
async function loginDemo(email, senha) {
  try {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { email, senha }
    });
    setToken(res.token);
    setCurrentUser(res.user);
    showToast(`Conectado como ${res.user.nome} (${res.user.tipo_usuario})!`, 'success');
    setTimeout(() => {
      if (res.user.tipo_usuario === 'empresa') {
        window.location.href = 'empresa-vagas.html';
      } else {
        window.location.href = 'index.html';
      }
    }, 600);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
});
