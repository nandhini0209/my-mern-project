import express from 'express';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Book CRUD routes
router.route('/')
  .get(getBooks)
  .post(protect, admin, upload.single('image'), createBook);

router.route('/:id')
  .get(getBook)
  .put(protect, admin, upload.single('image'), updateBook)
  .delete(protect, admin, deleteBook);

// Review routes (nested under books)
router.route('/:id/reviews')
  .get(getReviews)
  .post(protect, addReview);

router.route('/:id/reviews/:reviewId')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
