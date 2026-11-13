// Naamlou import lel model User bech najmou nestaamlou il modele w biblio bcryptjs lel hashage mtaa il mot de passe
const User = require('../models/User');
const bcrypt = require('bcryptjs');
// Njibou bibliotheque JWT bech naamlou token wa9teli l'utilisateur yaamel connexion
const jwt = require('jsonwebtoken');

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

const login = async (req, res) => {
  // Naamlou fonction mte3 connexion.

  try {
    // Ne5dhou login w password eli yab3athhom Bruno.
    const { login, password } = req.body || {};

    // Net2akdou eli login w password s7a7.
    if (
      typeof login !== 'string' ||
      typeof password !== 'string' ||
      !login.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: 'Login et mot de passe obligatoires'
      });
    }

    // Nlawjou 3al utilisateur bel login mte3ou.
    const user = await User.findOne({
      login: login.trim()
    }).select('+passwordHash');

    // Ken utilisateur mch mawjoud, nraj3ou erreur.
    if (!user) {
      return res.status(401).json({
        message: 'Identifiants incorrects'
      });
    }

    // N9arnou password eli da5lou utilisateur bel hash eli mawjoud fi MongoDB.
    const passwordValide = await bcrypt.compare(
      password,
      user.passwordHash
    );

    // Ken mot de passe ghalet, yab3ath message d'erreur.
    if (!passwordValide) {
      return res.status(401).json({
        message: 'Identifiants incorrects'
      });
    }

    // Net2akdou eli cle JWT mawjoud fi .env.
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET non configure');
    }

    // Naamlou token signé mte3 utilisateur.
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Ken kol chay s7i7, nraj3ou token wel infos mtaa l'utilisateur.
    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      utilisateur: {
        id: user._id,
        nom: user.nom,
        login: user.login,
        role: user.role
      }
    });

  } catch (error) {
    // Ken tsir erreur inattendue, naffichiwhha f terminal.
    console.error('Erreur login :', error);

    return res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = { register, login }; //Ligne hedhi tkhali fonction register w login disponibles lil les fichiers lokhrin.