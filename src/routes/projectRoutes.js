
const express = require('express');
// Nest7a9ou Express.

const router = express.Router();
// Naamlou router mta3 projets.

const authMiddleware = require('../middlewares/authMiddleware');
// Njibou middleware bech nverifiw JWT.

const {
  createProject,
  getMyProjects,
  getProjectById, 
  updateProject,
  deleteProject
} = require('../controllers/projectController');
// Njibou fonction createProject ou getMyProjects mel controller bech nesta3mlouhom fel routes.

router.post('/', authMiddleware, createProject);
// Ki l'utilisateur yab3ath POST /projects, nverifiw token bech mba3ed naamlou projet.

router.get('/', authMiddleware, getMyProjects);
// Ki l'utilisateur yab3ath GET /projects, nverifiw token bech mba3ed njibou projets mte3ou.

router.get('/:id', authMiddleware, getProjectById);
// Njibou projet mou3ayen bel ID mte3ou.

router.put('/:id', authMiddleware, updateProject);
// L'utilisateur ynajem ybadel projet mte3ou.

router.delete('/:id', authMiddleware, deleteProject);
// L'utilisateur ynajem yfassa5 projet mte3ou.

module.exports = router;
//Ligne hedhi tkhali router disponible lil les fichiers lokhrin.
