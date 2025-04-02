const db = require('../db');
const { Workspace, User } = require('../models/models');

exports.all = async (req, res) => {
    try {
        const userId = req.userData.userId;

        const user = await User.findByPk(userId, { include: Workspace });
        res.status(200).json(user.Workspaces);
        //res.status(200).json({ "workspaces": user.Workspaces });
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const workspace = await Workspace.findByPk(id);

        if(workspace == null) return res.status(404).json("Cette donnee n'existe pas");    
        
        res.status(200).json(workspace);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.create = async (req, res) => {
    const { name, description } = req.body;
    try {
        const owner = req.userData.userId;
        const workspace = await Workspace.create({ name, description, owner });
        
        const user = await User.findByPk(owner);

        workspace.addUser(user);

        res.status(201).json({ message: "Espace de travail créé avec succès", workspace });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.addUser = async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;

    try {
        const workspace = await Workspace.findByPk(id);
        
        const user = await User.findOne({ where: email });
        
        if(workspace == null) return res.status(404).json("Cet espace de travail n'existe pas");
        if(user == null) return res.status(404).json("Utilisateur introuvable");

        const existingUser = await workspace.getUsers().some(user => user.email === email);

        if(!existingUser)
            workspace.addUser(user);
        else return res.status(400).json({ message : "Cet utilisateur appartient déjà au workspace" });
        
        res.status(201).json({ message: "Espace de travail créé avec succès", workspace });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.removeUser = async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;

    try {
        const workspace = await Workspace.findByPk(id);
        
        const user = await User.findOne({ where: email });
        
        if(workspace == null) return res.status(404).json("Cet espace de travail n'existe pas");
        if(user == null) return res.status(404).json("Utilisateur introuvable");

        workspace.removeUser(user);
        
        res.status(201).json({ message: "Espace de travail créé avec succès", workspace });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.update = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.userData.userId;

    try {
        const existingWorkspace = await Workspace.findOne({ 
            where: { 
                id,
                userId // Sécurité : vérifier si l'utilisateur est propriétaire
            } 
        });

        if (!existingWorkspace)  return res.status(404).json({ message: "Workspace non trouvées" });
        
        if(name != null) existingWorkspace.name = name;
        if(description != null) existingWorkspace.description = description;

        existingWorkspace.save();

        res.status(200).json({ 
            message: "Workspace mis à jour avec succès",
            data: existingData
        });

    } catch (err) {
        res.status(500).json({
            message: "Erreur lors de la mise à jour",
            error: err.message
        });
    }
};

exports.delete = async (req, res) => {

    const { id } = req.params;

    try {
        const workspace = await Workspace.findOne({ where: { id } });

        if (!workspace)  return res.status(404).json({ message: "Workspace inexistant" });

        workspace.destroy().then(() => {
            res.status(200).json({ message: "Workspace supprimé avec succès" });
        }).catch((err) => {
            res.status(500).json({ message: "Erreur lors de la suppression du worspace", error: err });
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}