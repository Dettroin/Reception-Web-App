import express from 'express';
import { auth } from '../middlewares/auth.js';
import { getDashboardSummary } from '../controllers/dashboardController.js';

const router = express.Router();
router.use(auth);

router.get('/summary', getDashboardSummary);

export default router;