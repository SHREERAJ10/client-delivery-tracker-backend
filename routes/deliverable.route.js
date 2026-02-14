import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { createDeliverable } from '../controllers/deliverable.controller.js';

const router = express.Router({mergeParams:true});

router.post("/", verifyToken, createDeliverable);

export default router;