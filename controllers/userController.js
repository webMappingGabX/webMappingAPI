const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

// get all users
exports.all = async (req, res) => {
    try {
        const users = await User.findAll({ order: [['username', 'ASC']] });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.get = async (req, res) => {
    const { code } = req.params;

    try {
        const user = await User.findOne({ where: { 'id': id } });

        if(user == null)
        {
            return res.status(404).json("Cet utilisateur n'existe pas");    
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.create = async (req, res) => {
    const { username, email, type } = req.body;
    try {
        //const userId = req.userData.userId;
        const user = await User.create({ username, email, type });
        
        res.status(201).json({ message: "Utilisateur créé avec succès", "user": user });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}


exports.update = async (req, res) => {
    
    const { id } = req.params;
    const { username, email, type } = req.body;

    try {
        const user = await User.findOne({ where: { "id": id }});
        
        if(user != null)
        {
            if(username != null) user.username = username;
            if(email != null) user.email = email;
            if(type != null) user.type = type;

            user.save();
        
            res.status(200).json({ message: "User modifié avec succès", "user": user });
        } else {
            return res.status(404).json({ message: "User inexistant" });
        }
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

// delete any user
exports.delete = async (req, res) => {

    const { id } = req.params;

    try {
        const deletedUser = await User.destroy({ where: { "id": id }});

        if(deletedUser > 0)
        {
            res.status(200).json({ message: "Utilisateur supprimé avec succès" });
        }
        else res.status(404).json({ message: "Utilisateur inexistant" });
        
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

// delete auth user 
exports.deleteAccount = async (req, res) => {

    // const { id } = req.params;

    try {
        const userId = req.userData.userId;

        const deletedUser = await User.destroy({ where: { "id": userId }});

        if(deletedUser > 0)
        {
            res.status(200).json({ message: "Utilisateur supprimé avec succès" });
        }
        else res.status(404).json({ message: "Utilisateur inexistant" });
        
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}