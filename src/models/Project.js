
const mongoose = require('mongoose');
// Njibou Mongoose bech naamlou modele Project.

const projectSchema = new mongoose.Schema({

  nom: {
    type: String,
    required: true,
    trim: true
  },
  // Essm il projet obligatoire.

  description: {
    type: String,
    default: ''
  },
  // Description mte3 projet.

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Kol projet lezem ykoun 3andou owner eli houwa utilisateur eli 3amlo.

  statut: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo'
  }
  // Statut projet, par defaut ykoun todo ou ynajem ykoun ya todo, doing wala done.

}, { timestamps: true });
// Mongoose yzid createdAt w updatedAt automatiquement.

module.exports = mongoose.model('Project', projectSchema);
//Ligne hedhi tkhali modele Project disponible bech nesta3mlouh fel controller.