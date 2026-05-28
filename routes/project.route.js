import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { createProject, deleteProject, getProject, getProjectDetails, getProjects, updateProject } from '../controllers/project.controller.js';
import deliverableRouter from "../routes/deliverable.route.js";

const router = express.Router({mergeParams:true});

router.post('/', verifyToken, createProject);
router.get('/',verifyToken, getProjects);
router.get('/details', verifyToken, getProjectDetails);
router.use('/:projectId/deliverable', deliverableRouter);
router.get('/:id',verifyToken, getProject);
router.delete('/:id', verifyToken, deleteProject);
router.put('/:id', verifyToken, updateProject);

export default router;