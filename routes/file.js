const express = require("express");
const fileController = require("../controllers/fileController");
const authMiddleware = require('../middleware/auth');

const router = express.Router();

//router.get('/', authMiddleware, fileController.all);
router.get('/:id', fileController.get);
//router.delete(':id', authMiddleware, fileController.delete);

module.exports = router;