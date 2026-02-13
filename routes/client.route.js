import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import projectRouter from "../routes/project.route.js";
import { createClient, deleteClient, getClient, updateClient } from '../controllers/client.controller.js';

const router = express.Router();

router.use('/:clientId/project', projectRouter);

router.post('/', verifyToken, createClient);
router.get('/',verifyToken, getClient);
router.put('/:id', verifyToken, updateClient);
router.delete('/:id', verifyToken, deleteClient);

export default router;