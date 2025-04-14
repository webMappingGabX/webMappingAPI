const { getDriveFile } = require("../googleDriveService");

exports.get = async (req, res) => {

    const { id } = req.params;
    
    try {
        const response = await getDriveFile(id);
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error getting file:', error);
        res.status(500).send('Error retrieving file');
    }
};