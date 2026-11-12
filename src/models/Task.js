
const mongoose = require('mongoose');

// naamlou fschema mtaa les taches
const taskSchema = new mongoose.Schema({

  // les taches lkol yelmz ikoun aandhom titre obligatoire
  titre: {
    type: String,
    required: true,
    trim: true
  },

  // Description mtaa tache
  description: {
    type: String,
    default: ''
  },

  // Statut mtaa tache
  statut: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo'
  },

  // Date limite bech nkamlou tache
  deadline: {
    type: Date
  },

  // Kol tache marbouta b projet
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },

  // Utilisateur eli affecteh el manager
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }

}, {
  // MongoDB tzid createdAt w updatedAt automatiquement
  timestamps: true
});

// l'exportation mtaa  modele Task bech nestaamlouh fel controller
module.exports = mongoose.model('Task', taskSchema);
