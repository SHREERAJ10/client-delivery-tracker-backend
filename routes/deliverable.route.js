import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { createDeliverable, deleteDeliverable, getDeliverable, updateDeliverable } from '../controllers/deliverable.controller.js';

const router = express.Router({mergeParams:true});

router.post("/", verifyToken, createDeliverable);
router.get("/", verifyToken, getDeliverable);
router.delete("/:id", verifyToken, deleteDeliverable);
router.put("/:id", verifyToken, updateDeliverable);

export default router;