import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { createDeliverable, getDeliverable } from '../controllers/deliverable.controller.js';

const router = express.Router({mergeParams:true});

router.post("/", verifyToken, createDeliverable);
router.get("/", verifyToken, getDeliverable);

export default router;