
const Project = require('../models/Project');
// Njibou modele Project bech naamlou les operations MongoDB.

const createProject = async (req, res) => {
  // Fonction createProject eli taamel projet jdid.

  try {
    // Ne5dhou informations mel Body eli yab3athhom Bruno.
    const { nom, description, statut } = req.body || {};

    // Net2akdou eli nom mawjoud w s7i7.
    if (typeof nom !== 'string' || !nom.trim()) {
      return res.status(400).json({
        message: 'Le nom du projet est obligatoire'
      });
    }

    // Net2akdou eli description s7i7a.
    if (description !== undefined &&
        typeof description !== 'string') {
      return res.status(400).json({
        message: 'La description doit etre un texte'
      });
    }

    // Net2akdou eli statut mel valeurs autorisees, snn yab3ath message d'erreur.
    const statutsAutorises = ['todo', 'doing', 'done'];

    if (statut !== undefined &&
        !statutsAutorises.includes(statut)) {
      return res.status(400).json({
        message: 'Statut invalide'
      });
    }

    // Naamlou projet jdid fi MongoDB.
    const project = await Project.create({
      nom: nom.trim(),
      description: description || '',
      statut: statut || 'todo',

      // Na5dhou ID utilisateur mel JWT verifie.
      owner: req.user._id
    });

    // Nraj3ou reponse eli projet est cree avec succes.
    return res.status(201).json({
      message: 'Projet cree avec succes',
      projet: project
    });

  } catch (error) {
    // Ken tssir erreur, naffichiwhha fel terminal.
    console.error('Erreur creation projet :', error);

    return res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

const getMyProjects = async (req, res) => {
  // Bech njibou les projets mte3 l'utilisateur connecté.
  try {
    // Nekhdhou les parametres mta3 tri mel URL
    const { sortBy, order } = req.query;

    // Les champs eli najmou nsortiw bihom
    const allowedSort = ['createdAt', 'nom', 'statut'];

    // Ken sortBy mouch mawjoud, nsortiw par date
    if (sortBy !== undefined && !allowedSort.includes(sortBy)) {
      return res.status(400).json({
        message: 'Champ de tri invalide'
      });
    }

    // Net2akdou eli ordre asc wala desc
    if (order !== undefined && !['asc', 'desc'].includes(order)) {
      return res.status(400).json({
        message: 'Ordre de tri invalide'
      });
    }

    // Par defaut, tri par date lekhra wnty mechi
    const field = sortBy || 'createdAt';
    const direction = order === 'asc' ? 1 : -1;

    // Njibou les projets mta3 utilisateur w nsortiw bihom
    const projects = await Project.find({
      owner: req.user._id
    }).sort({ [field]: direction, _id: 1 });

    // Nraj3ou la liste des projets tries
    return res.status(200).json({
      message: 'Liste de vos projets',
      nombre: projects.length,
      projets: projects
    });

  } catch (error) {
    console.error('Erreur recuperation projets :', error);

    return res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};


const mongoose = require('mongoose');
// Njibou Mongoose bech nverifiw format mta3 l'ID.

const getProjectById = async (req, res) => {
  // Bech njibou projet we7ed bel ID mte3ou.

  try {
    // Ne5dhou ID projet mel URL.
    const projectId = req.params.id;

    // Net2akdou eli ID 3andou format MongoDB s7i7.
    if (!mongoose.isObjectIdOrHexString(projectId)) {
      return res.status(400).json({
        message: 'Identifiant de projet invalide'
      });
    }

    // Nlawjou 3al projet bel ID.
    const project = await Project.findById(projectId);

    // Ken projet mch mawjoud yab3ath message d'erreur.
    if (!project) {
      return res.status(404).json({
        message: 'Projet introuvable'
      });
    }

    // Nverifiw eli projet mta3 l'utilisateur connecté.
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Acces interdit a ce projet'
      });
    }

    // Ken kol chay s7i7, nraj3ou projet.
    return res.status(200).json({
      message: 'Projet trouve',
      projet: project
    });

  } catch (error) {
    // Ken tsir erreur inattendue, naffichiwhha fel terminal.
    console.error('Erreur recherche projet :', error);

    return res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

const updateProject = async (req, res) => {
  // Bech nbaddlou informations mte3 projet.

  try {
    // Ne5dhou ID projet mel URL.
    const projectId = req.params.id;

    // Net2akdou eli l'ID 3andou format s7i7.
    if (!mongoose.isObjectIdOrHexString(projectId)) {
      return res.status(400).json({
        message: 'Identifiant de projet invalide'
      });
    }

    // Nlawjou 3al projet fel base MongoDB.
    const project = await Project.findById(projectId);

    // Ken projet mch mawjoud nab3ath message d'erreur.
    if (!project) {
      return res.status(404).json({
        message: 'Projet introuvable'
      });
    }

    // Net2akdou eli l'utilisateur howa il owner mta3 projet.
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Acces interdit : ce projet ne vous appartient pas'
      });
    }

    // Ne5dhou les nouvelles informations mel Body.
    const { nom, description, statut } = req.body || {};

    // Ken l'utilisateur mab3ath 7atta modification.
    if (
      nom === undefined &&
      description === undefined &&
      statut === undefined
    ) {
      return res.status(400).json({
        message: 'Aucune modification fournie'
      });
    }

    // Ken l'utilisateur b3ath nom jdid, net2akdou menou.
    if (nom !== undefined) {
      if (typeof nom !== 'string' || !nom.trim()) {
        return res.status(400).json({
          message: 'Le nom doit etre un texte non vide'
        });
      }

      project.nom = nom.trim();
    }

    // Ken l'utilisateur b3ath description jdida.
    if (description !== undefined) {
      if (typeof description !== 'string') {
        return res.status(400).json({
          message: 'La description doit etre un texte'
        });
      }

      project.description = description;
    }

    // Ken l'utilisateur b3ath statut jdid.
    if (statut !== undefined) {
      const statutsAutorises = ['todo', 'doing', 'done'];

      if (!statutsAutorises.includes(statut)) {
        return res.status(400).json({
          message: 'Statut invalide'
        });
      }

      project.statut = statut;
    }

    // Nsajlou les modifications fel MongoDB.
    await project.save();

    // Nraj3ou projet ba3d modification.
    return res.status(200).json({
      message: 'Projet modifie avec succes',
      projet: project
    });

  } catch (error) {
    // Ken tsir erreur inattendue, naffichiwhha fel terminal.
    console.error('Erreur modification projet :', error);

    return res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

const deleteProject = async (req, res) => {
  // Bech nafs5ou projet mel MongoDB.

  try {
    // Ne5dhou l'ID mta3 projet mel URL.
    const projectId = req.params.id;

    // Net2akdou eli format mta3 ID s7i7.
    if (!mongoose.isObjectIdOrHexString(projectId)) {
      return res.status(400).json({
        message: 'Identifiant de projet invalide'
      });
    }

    // Nlawjou 3al projet fel MongoDB.
    const project = await Project.findById(projectId);

    // Ken projet mch mawjoud, nraj3ou erreur404.
    if (!project) {
      return res.status(404).json({
        message: 'Projet introuvable'
      });
    }

    // Nverifiw eli l'utilisateur howa il owner mta3 projet.
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Acces interdit : ce projet ne vous appartient pas'
      });
    }

    // Ken utilisateur howa owner, nfass5ou projet.
    await project.deleteOne();

    // Nraj3ou comme reponse eli suppression naj7et.
    return res.status(200).json({
      message: 'Projet supprime avec succes'
    });

  } catch (error) {
    // Ken tsir erreur inattendue, naffichiwhha fel terminal.
    console.error('Erreur suppression projet :', error);

    return res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = { createProject, getMyProjects, getProjectById, updateProject, deleteProject };
//Ligne hedhi tkhali  les fonctions disponibles bech nesta3mlouhom fel routes.
