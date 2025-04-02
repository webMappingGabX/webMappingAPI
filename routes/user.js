const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, userController.all);
router.get(':id', authMiddleware, userController.get);
router.post('/', authMiddleware, userController.create);
router.put(':id', authMiddleware, userController.update);
router.delete(':id', authMiddleware, userController.delete);
router.delete('/delete-account', authMiddleware, userController.deleteAccount);

module.exports = router;