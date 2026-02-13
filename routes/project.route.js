import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { createProject, deleteProject, getProject, updateProject } from '../controllers/project.controller.js';

const router = express.Router({mergeParams:true});

router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getProject);
router.delete('/:id', verifyToken, deleteProject);
router.put('/:id', verifyToken, updateProject);

export default router;