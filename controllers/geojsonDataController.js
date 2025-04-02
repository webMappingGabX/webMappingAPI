const db = require('../db');
const { GeoJsonData, Layer, User } = require('../models/models');
const fs = require('fs');

exports.all = async (req, res) => {
    const { workspaceId } = req.query;

    try {
        const layers = await Layer.findAll({ where: { "workspaceId": workspaceId }, order: [['createdAt', 'ASC']], include: GeoJsonData });

        let geojsonDatas = [];
        layers.forEach((layer) => {
            geojsonDatas.push(layer.GeojsonDatum);
        });

        res.status(200).json(geojsonDatas);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.get = async (req, res) => {
    const {id} = req.params;

    try {
        const geojsondata = await GeoJsonData.findOne({ where: {'id': id}, include: Layer });

        if(geojsondata == null)
        {
            return res.status(404).json("Cette donnee n'existe pas");    
        }
        res.status(200).json(geojsondata);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

/*exports.upload = async (req, res) => {
    const userId = req.userData.userId;
    try {
        const { editing } = req.body;
        const { filename, path, mimetype } = req.file;
        // Sauvegarde dans la base de données
        const file = await GeoJsonData.create({ filename, path, mimetype, userId, editing });
    
        res.json({ message: "Fichier uploadé avec succès", file });
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'upload : " + error + "; userId : " + userId });
      }
}*/

exports.upload = async (req, res) => {
    const userId = req.userData.userId;
    try {
        const { layerId, editing, name, description, workspaceId } = req.body;
        const { filename, path, mimetype } = req.file;

        // Sauvegarde dans la base de données
        if (!layerId) {
            const layer = await Layer.create({ name, description, "owner": userId, workspaceId });
            
            const file = await GeoJsonData.create({ filename, path, mimetype, editing });
            file.setLayer(layer);

            res.json({ message: "Fichier uploadé avec succès", file });
        } else {
            const layer = await Layer.findOne({ where: { id: layerId } });
            const existingData = await layer.getGeojsonDatum();

            if (!existingData) {
                return res.status(404).json({ message: "Données GeoJSON non trouvées" });
            }
            // Si un fichier existe déjà, le remplacer 
            fs.unlinkSync(existingData.path);
            //existingData.update({ filename, path, mimetype, editing });

            if(filename != null) existingData.filename = filename;
            if(path != null) existingData.path = path;
            if(mimetype != null) existingData.mimetype = mimetype;
            if(editing != null) existingData.editing = editing;

            existingData.save();

            res.json({ message: "Fichier remplacé avec succès", file: existingData });
        }
        
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'upload : " + error + "; userId : " + userId });
      }
}

/*
exports.update = async (req, res) => {
    const { id } = req.params;
    const { geojsonData } = req.body;
    const userId = req.userData.userId;

    try {
        // Récupérer le fichier existant
        const existingData = await GeoJsonData.findOne({ 
            where: { 
                id,
                userId // Sécurité : vérifier que l'utilisateur est propriétaire
            } 
        });

        if (!existingData) {
            return res.status(404).json({ message: "Données GeoJSON non trouvées" });
        }

        // Écrire le nouveau contenu GeoJSON dans le fichier
        fs.writeFileSync(existingData.path, JSON.stringify(geojsonData, null, 2));

        // Mettre à jour le statut d'édition si nécessaire, 
        await existingData.update({ 
            editing: true,
            updatedAt: new Date()
        });

        res.status(200).json({ 
            message: "GeoJSON mis à jour avec succès",
            data: existingData
        });

    } catch (err) {
        res.status(500).json({
            message: "Erreur lors de la mise à jour",
            error: err.message
        });
    }
};
*/

exports.delete = async (req, res) => {

    const { id } = req.params;

    try {
        const geojsondata = await GeoJsonData.findOne({ where: { id } });

        if (!geojsondata) {
            return res.status(404).json({ message: "Donnée inexistante" });
        }

        fs.unlinkSync(geojsondata.path);

        geojsondata.destroy().then(() => {
            res.status(200).json({ message: "Donnée supprimée avec succès" });
        }).catch((err) => {
            res.status(500).json({ message: "Erreur lors de la suppression de la donnée", error: err });
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}