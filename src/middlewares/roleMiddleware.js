
const roleMiddleware = (...rolesAutorises) => {
  // N7adddou les roles eli 3andhom el 7a9 yodkhlou lel route.

  return (req, res, next) => {
    // Net2akdou eli fama utilisateur authentifie.
    if (!req.user) {
      return res.status(401).json({
        message: 'Utilisateur non authentifié'
      });
    }

    // Nchoufou role mte3 utilisateur.
    if (!rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Accès interdit : permissions insuffisantes'
      });
    }

    // Ken role s7i7, nkamlou lel controller.
    next();
  };
};

module.exports = roleMiddleware;
//Ligne hedhi tkhali fonction roleMiddleware disponible lil les fichiers lokhrin.
