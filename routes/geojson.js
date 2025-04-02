const express = require("express");
const geojsonDataController = require("../controllers/geojsonDataController");
const authMiddleware = require('../middleware/auth');
const upload = require("../middleware/multer");


const router = express.Router();

router.get('/', authMiddleware, geojsonDataController.all);
router.get(':id', authMiddleware, geojsonDataController.get);
router.post('/upload', authMiddleware, upload.single("file"), geojsonDataController.upload);
//router.put(':id', authMiddleware, geojsonDataController.update);
router.delete(':id', authMiddleware, geojsonDataController.delete);

module.exports = router;