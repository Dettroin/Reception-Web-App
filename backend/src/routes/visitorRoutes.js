import express from 'express';
import { auth } from '../middlewares/auth.js';
import {
  getVisitors,
  createVisitor,
  getVisitor,
  updateVisitor,
  checkoutVisitor,
  deleteVisitor,
} from '../controllers/visitorController.js';

const router = express.Router();

router.use(auth);

router.get('/', getVisitors);
router.post('/', createVisitor);
router.get('/:id', getVisitor);
router.patch('/:id', updateVisitor);
router.post('/:id/checkout', checkoutVisitor);
router.delete('/:id', deleteVisitor);

export default router;