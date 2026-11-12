
const express = require('express');
// Nest7a9ou Express.

const router = express.Router();
// Naamlou router mta3 projets.

const authMiddleware = require('../middlewares/authMiddleware');
// Njibou middleware bech nverifiw JWT.

const roleMiddleware = require('../middlewares/roleMiddleware');
// Njibou middleware eli yverifi role utilisateur.

const {
  createProject,
  getMyProjects,
  getProjectById, 
  updateProject,
  deleteProject,
  searchProjects,
  getAllProjects
} = require('../controllers/projectController');
// Njibou fonction createProject ou getMyProjects mel controller bech nesta3mlouhom fel routes.

router.post('/', authMiddleware, createProject);
// Ki l'utilisateur yab3ath POST /projects, nverifiw token bech mba3ed naamlou projet.

router.get('/', authMiddleware, getMyProjects);
// Ki l'utilisateur yab3ath GET /projects, nverifiw token bech mba3ed njibou projets mte3ou.

router.get('/search', authMiddleware, searchProjects);
// L'utilisateur ynajem ylawej 3al les projets mte3ou.

router.get(
  '/all',
  authMiddleware,
  roleMiddleware('manager'),
  getAllProjects
);
// El manager bark howa ili ynajem ychouf les projets il koll.

router.get('/:id', authMiddleware, getProjectById);
// Njibou projet mou3ayen bel ID mte3ou.

router.put('/:id', authMiddleware, updateProject);
// L'utilisateur ynajem ybadel projet mte3ou.

router.delete('/:id', authMiddleware, deleteProject);
// L'utilisateur ynajem yfassa5 projet mte3ou.

module.exports = router;
//Ligne hedhi tkhali router disponible lil les fichiers lokhrin.
