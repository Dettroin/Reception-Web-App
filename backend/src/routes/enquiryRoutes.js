import express from 'express';
import { auth } from '../middlewares/auth.js';
import {
  getEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
} from '../controllers/enquiryController.js';

const router = express.Router();
router.use(auth);

router.get('/', getEnquiries);
router.post('/', createEnquiry);
router.patch('/:id', updateEnquiry);
router.delete('/:id', deleteEnquiry);

export default router;