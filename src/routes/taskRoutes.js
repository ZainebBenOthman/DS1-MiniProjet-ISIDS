
const express = require('express');

// Njibou les fonctions mtaa gestion des taches
const taskController = require('../controllers/taskController');

// Njibou middleware JWT 
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Les routes lkol lezim l utilisateur ikoun connecté
router.use(authMiddleware);

// Route bech naamlou tache jdida
router.post('/', taskController.createTask);

// Route bech naffichiw les taches
router.get('/', taskController.getTasks);

// Route bech naffichiw tache bel ID
router.get('/:id', taskController.getTaskById);

// Route bech nbadlou tache
router.put('/:id', taskController.updateTask);

// Route bech nfasskhou tache
router.delete('/:id', taskController.deleteTask);

// Ken el manager ynajem yaffecti tache l utilisateur
router.patch('/:id/assign', taskController.assignTask);

module.exports = router;
