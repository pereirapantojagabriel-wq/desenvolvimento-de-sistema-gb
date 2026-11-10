const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken, requireRole } = require('../middlewares/auth');

// RF10, RF11, RF12: Candidatar-se a uma vaga (Apenas Candidato)
router.post('/apply', authenticateToken, requireRole('candidato'), applicationController.applyToJob);

// RF13: Minhas candidaturas (Apenas Candidato)
router.get('/my-applications', authenticateToken, requireRole('candidato'), applicationController.listCandidateApplications);

// RF14: Candidatos de uma vaga (Apenas Empresa)
router.get('/job/:id_vaga', authenticateToken, requireRole('empresa'), applicationController.listJobApplications);

// RF15: Atualizar status do candidato (Apenas Empresa)
router.patch('/:id_candidatura/status', authenticateToken, requireRole('empresa'), applicationController.updateApplicationStatus);

module.exports = router;
