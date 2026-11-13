
const jwt = require('jsonwebtoken');
// Njibou JWT bech nverifiw les tokens.

const User = require('../models/User');
// Njibou modele User bech nlawjou 3al l'utilisateur.

const authMiddleware = async (req, res, next) => {
  // Hedheya middleware eli ye7mi les routes.

  try {
    // Ne5dhou token mel header Authorization.
    const authorization = req.headers.authorization;

    // Net2akdou eli fama token bel format Bearer.
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Token manquant ou format incorrect'
      });
    }

    // Ne5dhou el JWT bark, maghir le mot Bearer.
    const token = authorization.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({
        message: 'Token manquant'
      });
    }

    // Net2akdou eli cle secrete mawjoudа.
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET non configure');
    }

    // Nverifiw signature wel expiration mte3 token.
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    // Nlawjou 3al utilisateur mel ID eli fel token.
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: 'Utilisateur introuvable'
      });
    }

    // N7ottou utilisateur fel requete.
    req.user = user;

    // Nkamlou lel prochaine fonction.
    next();

  } catch (error) {
    // Ken token ghalet wala expired, nraj3ou message d'erreur.
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError' ||
      error.name === 'NotBeforeError'
    ) {
      return res.status(401).json({
        message: 'Token invalide ou expiré'
      });
    }

    console.error('Erreur authentification :', error);

    return res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = authMiddleware;
//Ligne hedhi tkhali fonction authMiddleware disponible lil les fichiers lokhrin.
