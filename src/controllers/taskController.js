// Njibou Mongoose bech netaamlou maa MongoDB
const mongoose = require('mongoose');
// Njibou modele Task bech nsajlou w njibou les taches
const Task = require('../models/Task');
// Njibou modele Project bech nverifiw eli projet mawjoud
const Project = require('../models/Project');

// Fonction bech naamlou tache jdida
//createTask	Creation mtaa une tache f MongoDB en verifiant eli projet mawjoud
const createTask = async (req, res) => {
  try {
    // Nekhdhou les donnees mel requete
    const { titre, description, statut, deadline, project } = req.body;

    // Net2akdou eli ID projet shih
    if (!mongoose.isValidObjectId(project)) {
      return res.status(400).json({
        message: 'ID projet invalide'
      });
    }

    // Nverifiw eli lprojet mawjoud fel MongoDB
    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({
        message: 'Projet introuvable'
      });
    }

    // Nsajlou tache jdida fel MongoDB
    const task = await Task.create({
      titre,
      description,
      statut,
      deadline,
      project
    });

    // Narjaou ltache eli taamlet
    return res.status(201).json({
      message: 'Tache creee avec succes',
      task
    });

  } catch (error) {
    // Ken tsir erreur fel serveur
    return res.status(500).json({
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Fonction bech naffichiw les taches
//getTasks	naffichiw les taches accessibles lel utilisateur connecté
const getTasks = async (req, res) => {
  try {
    let filter = {};

    // El user ychouf taches mtaa projets mteaou
    // El manager ynajem ychouf les taches lkol
    if (req.user.role !== 'manager') {
      const projects = await Project.find({
        owner: req.user._id
      }).select('_id');

      filter.project = {
        $in: projects.map(p => p._id)
      };
    }

    // Njibou les taches mel MongoDB
    const tasks = await Task.find(filter)
      .populate('project', 'nom')
      .populate('assignedTo', 'nom login');

    return res.status(200).json(tasks);

  } catch (error) {
    return res.status(500).json({
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Fonction bech naffichiw tache bel ID
//getTaskById	nconsultiw une tache moaayna a partir mn son identifiant
const getTaskById = async (req, res) => {
  try {
    // Net2akdou eli ID tache shih
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'ID tache invalide'
      });
    }

    // Nlawjou al tache fel MongoDB
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Tache introuvable'
      });
    }

    // Nverifiw el projet w droits mtaa utilisateur
    const project = await Project.findById(task.project);

    if (!project || (
      req.user.role !== 'manager' &&
      String(project.owner) !== String(req.user._id)
    )) {
      return res.status(404).json({
        message: 'Tache introuvable ou inaccessible'
      });
    }

    return res.status(200).json(task);

  } catch (error) {
    return res.status(500).json({
      message: 'Erreur serveur',
      error: error.message
    });
  }
};
//mofication mtaa tache
const updateTask = async (req, res) => {
  try {
    // Nverifiw eli ID mtaa tache shih
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'ID tache invalide'
      });
    }

    // Nlawjou al tache fel MongoDB
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Tache introuvable'
      });
    }

    // Nverifiw eli user andou el droit ybadel tache
    const project = await Project.findById(task.project);

    if (!project || (
      req.user.role !== 'manager' &&
      String(project.owner) !== String(req.user._id)
    )) {
      return res.status(403).json({
        message: 'Acces interdit'
      });
    }

    // Nekhdhou les champs elli utilisateur yheb ybadelhom
    const { titre, description, statut, deadline } = req.body;

    // Nbadlou ken les champs eli baathhom utilisateur
    if (titre !== undefined) task.titre = titre;
    if (description !== undefined) task.description = description;
    if (statut !== undefined) task.statut = statut;
    if (deadline !== undefined) task.deadline = deadline;

    // Nsajlou les modifications fel MongoDB
    await task.save();

    return res.status(200).json({
      message: 'Tache modifiee avec succes',
      task
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Donnees invalides',
        error: error.message
      });
    }

    return res.status(500).json({
      message: 'Erreur serveur'
    });
  }
};
//nfaskhou tache
const deleteTask = async (req, res) => {
  try {
    // Nverifiw eli ID tache shih
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'ID tache invalide'
      });
    }

    // Nlawjou al tache fel MongoDB
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Tache introuvable'
      });
    }

    // Nverifiw el projet w les droits mtaa utilisateur
    const project = await Project.findById(task.project);

    if (!project || (
      req.user.role !== 'manager' &&
      String(project.owner) !== String(req.user._id)
    )) {
      return res.status(403).json({
        message: 'Acces interdit'
      });
    }

    // Nfasskhou tache mel MongoDB
    await task.deleteOne();

    return res.status(200).json({
      message: 'Tache supprimee avec succes'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Erreur serveur'
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
