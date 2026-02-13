import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { createProject, getProject } from '../controllers/project.controller.js';

const router = express.Router({mergeParams:true});

router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getProject);

export default router;