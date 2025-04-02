const express = require("express");
const layerController = require("../controllers/layerController");
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, layerController.all);
router.get('/:id', authMiddleware, layerController.get);
router.delete('/:id', authMiddleware, layerController.delete);

module.exports = router;