import express from 'express';
import { auth } from '../middlewares/auth.js';
import {
  createCallLog,
  getCallLogs,
  deleteCallLog,
} from '../controllers/callLogController.js';

const router = express.Router();

router.use(auth);

router.post('/', createCallLog);
router.get('/', getCallLogs);
router.delete('/:id', deleteCallLog);

export default router;