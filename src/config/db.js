
// Njibou Mongoose bech najmou netwaslou b MongoDB.
const mongoose = require('mongoose');

// Naamlou fonction bech norbtou application bel base.
const connectDB = async () => {
  
// Njarbou naamlou connexion.
  try {
    
    // Nesta3mlou adresse MongoDB elli fi .env ou nestanew 7atta connexion tekmel.
    await mongoose.connect(process.env.MONGO_URI);
    
    // Ken connexion khedhmet, naffichiw message fel terminal.
    console.log('MongoDB connecté');
    
    // Ken connexion makhedmetch, nodkhlou lel catch.
  } catch (error) {
    
    // Naffichiw chniya l'erreur.
    console.error('Erreur MongoDB :', error.message);
    
    // Nraj3ou l'erreur lel app.js bech serveur ma yabdech ken MongoDB mouhouch connecte.
    throw error;
    
  }
};

module.exports = connectDB; // Ligne hedhi tkhali il fonction connectDB disponible lil les fichiers lokhrin.
