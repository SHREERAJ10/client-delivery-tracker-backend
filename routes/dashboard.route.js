import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getDashboardMetrics, getDeliverables } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/',verifyToken, getDashboardMetrics);
router.get('/deliverables', verifyToken, getDeliverables);

export default router;