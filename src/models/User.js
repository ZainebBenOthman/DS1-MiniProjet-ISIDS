const mongoose = require('mongoose');

// Houni naamlou structure mte3 utilisateur
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },

  login: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  passwordHash: {
    type: String,
    required: true,
    select: false
  },

  role: {
    type: String,
    enum: ['user', 'manager'],
    default: 'user'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);