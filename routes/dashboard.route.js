import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getDashboardMetrics } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/',verifyToken, getDashboardMetrics)

export default router;