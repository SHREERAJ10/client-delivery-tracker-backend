import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import projectRouter from "../routes/project.route.js";
import { createClient, deleteClient, getClient, getClientOverview, getClients, getProjectsStats, updateClient } from '../controllers/client.controller.js';

const router = express.Router();


router.get('/projects/stats', verifyToken, getProjectsStats);
router.post('/', verifyToken, createClient);
router.get('/overview',verifyToken, getClientOverview);
router.get('/',verifyToken, getClients);
router.use('/:clientId/project', projectRouter);
router.get('/:id',verifyToken, getClient);
router.put('/:id', verifyToken, updateClient);
router.delete('/:id', verifyToken, deleteClient);

export default router;