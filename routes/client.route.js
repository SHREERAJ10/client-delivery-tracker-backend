import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { createClient, getClient, updateClient } from '../controllers/client.controller.js';

const router = express.Router();

router.post('/', verifyToken, createClient);
router.get('/',verifyToken, getClient);
router.put('/:id', verifyToken, updateClient);

export default router;