
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

module.exports = router;
