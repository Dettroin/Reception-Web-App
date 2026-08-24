 import express from 'express';
import {
  createCallLog,
  getCallLogs,
  deleteCallLog,
} from '../controllers/callLogController.js';

const router = express.Router();

router.post('/', createCallLog);
router.get('/', getCallLogs);
router.delete('/:id', deleteCallLog);

export default router;