import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { createProject } from '../controllers/project.controller.js';

const router = express.Router();

router.post('/', verifyToken, createProject);

export default router;