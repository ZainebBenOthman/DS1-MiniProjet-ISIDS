// Naamlou import lel model User bech najmou nestaamlou il modele w biblio bcryptjs lel hashage mtaa il mot de passe
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Fontion register texicuta wa9tili l'utilisateur yaamel une demande à créer un compte.
// Tnajem t7ot fiha les champs nom, login w mot de passe.
const register = async (req, res) => {
  try {
    // Les opérations d'inscription
    const { nom, login, password } = req.body;

    // Net2akdou eli les champs lkol mawjoudin
    if (
      typeof nom !== 'string' ||
      typeof login !== 'string' ||
      typeof password !== 'string' ||
      !nom.trim() ||
      !login.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: 'Nom, login et mot de passe (8 caractères minimum) requis'
      });
    }

    // Nlawjou ken login deja mawjoud
    const existingUser = await User.findOne({
      login: login.trim()
    });
    //Ken fama erreur fi les champs, yaamel retour 400. Ken login mte3ou deja mawjoud, yaamel retour 409. 
    if (existingUser) {
      return res.status(409).json({
        message: 'Ce login existe déjà'
      });
    }

    // Ken kol chay mriguel, yaamel hashage lel mot de passe w ykhalih fi MongoDB w yaamel retour 201 (Created).
    const passwordHash = await bcrypt.hash(password, 12);

    // Nsajlou utilisateur fi MongoDB.
    const user = await User.create({
      nom: nom.trim(),
      login: login.trim(),
      passwordHash,
      role: 'user'
    });

    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      utilisateur: {
        id: user._id,
        nom: user.nom,
        login: user.login,
        role: user.role
      }
    });

  } catch (error) { // Gestion d'une erreur.
    // Ken fama deux inscriptions b nafs login yabaath message d'erreur.
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Ce login existe déjà'
      });
    }

    console.error(error);
    return res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = { register }; //Ligne hedhi tkhali fonction register disponible lil les fichiers lokhrin.