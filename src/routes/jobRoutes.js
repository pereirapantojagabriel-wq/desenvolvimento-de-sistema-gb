const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken, optionalAuth, requireRole } = require('../middlewares/auth');

// RF07: Listar vagas abertas (público)
router.get('/open', jobController.listOpenJobs);

// Listar vagas da empresa logada
router.get('/company', authenticateToken, requireRole('empresa'), jobController.listCompanyJobs);

// RF08: Detalhes de uma vaga (opcionalmente autenticado para checar se candidato já se candidatou)
router.get('/:id', optionalAuth, jobController.getJobById);

// RF06: Cadastrar vaga (Empresa)
router.post('/', authenticateToken, requireRole('empresa'), jobController.createJob);

// RF09: Editar vaga (Empresa)
router.put('/:id', authenticateToken, requireRole('empresa'), jobController.updateJob);

// RF09: Encerrar ou reabrir vaga (Empresa)
router.patch('/:id/toggle-status', authenticateToken, requireRole('empresa'), jobController.toggleJobStatus);

module.exports = router;
