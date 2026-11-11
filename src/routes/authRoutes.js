const express = require('express'); //Nestaamelou express bech najmou naamlou les routes mte3na.
const router = express.Router();// Naamlou router jdida bech njam3ou fiha les routes mte3 l'authentification.

const { register } = require('../controllers/authController');// Njibou fonction register mel authController.js khater hiya eli bech taamel l'inscription mte3 l'utilisateur.

router.post('/register', register); // Naamlou route POST /register
// Ki L'utilisateur yab3ath demande inscription,
// Express y3ayet lel fonction register bech tverifi les données w tsajjel L'utilisateur fi MongoDB.

module.exports = router;//Ligne hedhi tkhali router disponible lil les fichiers lokhrin.