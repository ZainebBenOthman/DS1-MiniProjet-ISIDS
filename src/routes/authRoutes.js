const express = require('express'); //Nestaamelou express bech najmou naamlou les routes mte3na.
const router = express.Router();// Naamlou router jdida bech njam3ou fiha les routes mte3 l'authentification.

const { register, login } = require('../controllers/authController');// Njibou fonction register mel authController.js khater hiya eli bech taamel l'inscription mte3 l'utilisateur.

const authMiddleware = require('../middlewares/authMiddleware');
// Njibou middleware eli yverifi token JWT.

const roleMiddleware = require('../middlewares/roleMiddleware');
// Njibou middleware eli yverifi role mtaa l'utilisateur.

router.post('/register', register); // Naamlou route POST /register, ki L'utilisateur yab3ath demande inscription,
// Express y3ayet lel fonction register bech tverifi les données w tsajjel L'utilisateur fi MongoDB.

router.post('/login', login); // Naamlou route POST /login, ki L'utilisateur y7eb yconnecti n3aytou lil fonction login.

router.get('/me', authMiddleware, (req, res) => {
  // L'utilisateur lezem ykoun connecte

  res.status(200).json({
    message: 'Utilisateur authentifié',
    utilisateur: {
      id: req.user._id,
      nom: req.user.nom,
      login: req.user.login,
      role: req.user.role,
      dateCreation: req.user.createdAt
    }
  });
});

// Hedhiya route réservée lel managers
router.get(
  '/manager',
  authMiddleware,
  roleMiddleware('manager'),
  (req, res) => {
    res.status(200).json({
      message: 'Bienvenue manager !'
    });
  }
);

module.exports = router;//Ligne hedhi tkhali router disponible lil les fichiers lokhrin.