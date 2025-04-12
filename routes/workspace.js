const express = require("express");
const workspaceController = require("../controllers/workspaceController");
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.get('/', authMiddleware, workspaceController.all);
router.get('/workspace-users/:id', authMiddleware, workspaceController.workspaceUsers);
router.get(':id', authMiddleware, workspaceController.get);
router.post('/', authMiddleware, workspaceController.create);
router.post('/add-user/:id', authMiddleware, workspaceController.addUser);
router.post('/remove-user/:id', authMiddleware, workspaceController.removeUser);
router.put(':id', authMiddleware, workspaceController.update);
router.delete(':id', authMiddleware, workspaceController.delete);

module.exports = router;