
const express = require('express'); //Nestaamelou express bech najmou naamlou un serveur API REST.
require('dotenv').config();// Na9raw les variables eli mawjoudin fi .env kima PORT, MONGO_URI ou JWT_SECRET.

const connectDB = require('./config/db');// Njibou fonction connectDB mel fichier db.js bech torbet serveur mte3na b MongoDB.
const authRoutes = require('./routes/authRoutes');// Njibou les routes mte3 l'authentification (inscription w ba3d connexion).

// Naamlou application Express jdida.Wel app heya eli bech tetsarref fel les requetes.
const app = express();

// Nkhalliw Express ya9ra les données JSON eli yab3athhom utilisateur mel Bruno.
app.use(express.json());

// Naamlou route GET / bech njarbou serveur bech ki n7ellou localhost:3000, serveur yraja3 message.
app.get('/', (req, res) => {
  res.json({ message: 'API ISIDS fonctionne !' });// Nab3thou reponse JSON lel utilisateur.
});

// Norbtou les routes mte3 authentification bel app (/auth + /register = /auth/register).
app.use('/auth', authRoutes);

// Ne5dhou numero port mel fichier .env ou ken port mch mawjoud, nesta3mlou il port 3000.
const PORT = process.env.PORT || 3000;

// Naamlou connexion MongoDB 9bal ma naamlou start lil serveur.
async function startServer() {
  try {
    await connectDB();// Nestannew connexion MongoDB tekmel 9bal ma naamlou start lil serveur.

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) { // Ken tsir mochkla fel connexion wala démarrage naffichiw message erreur fel terminal.
    console.error('Erreur de démarrage :', error.message);
    process.exit(1);//Nwa9fou programme ken fama erreur.
  }
}

startServer(); //N3aytou lel fonction bech serveur yabda ye5dem.
