import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import createClientController from '../controllers/clientControllers/createClientController.js';
import getClientController from '../controllers/clientControllers/getClientController.js';

const router = express.Router();

router.post('/', verifyToken, createClientController);
router.get('/',verifyToken, getClientController);

export default router;