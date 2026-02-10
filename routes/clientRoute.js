import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import createClientController from '../controllers/clientControllers/createClientController.js';

const router = express.Router();

router.post('/', verifyToken, createClientController);

export default router;