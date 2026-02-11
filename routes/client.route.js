import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { createClient, getClient } from '../controllers/client.controller.js';

const router = express.Router();

router.post('/', verifyToken, createClient);
router.get('/',verifyToken, getClient);

export default router;