const db = require('../db');
const { deleteDriveFile } = require('../googleDriveService');
const { Layer, User, Workspace, GeoJsonData } = require('../models/models');
const fs = require('fs');

exports.all = async (req, res) => {
    const { workspaceId } = req.query;

    try {
        const layers = await Layer.findAll({ where: { workspaceId }, include: User });

        res.status(200).json(layers);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.get = async (req, res) => {
    const { id } = req.params;
    const { workspaceId } = req.query;

    try {
        const layer = await Layer.findOne({
            where : {
                id,
                workspaceId
            },
            include: GeoJsonData
        })

        if(layer == null) return res.status(404).json("Cette couche n'existe pas");    
        
        res.status(200).json(layer);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

// CREATE : La couche se cree automatiquement lorsque le fichier geojson est uploade


// UPDATE : On ne modifier plus les informations d'un layer

// Suppression des donnees geojson, et par la mm occasion le couche est supprimee
exports.delete = async (req, res) => {

    const { id } = req.params;

    try {
        const layer = await Layer.findOne({ where: { id } });
        const geojsondata = await layer.getGeojsonDatum();

        if (!geojsondata) {
            return res.status(404).json({ message: "Donnée inexistante" });
        }

        await deleteDriveFile(geojsondata.filename);

        layer.destroy().then(() => {
            console.log("Couche supprimée avec succès");
        }).catch((err) => {
            console.error("Erreur lors de la suppression de la couche", err);
        });
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