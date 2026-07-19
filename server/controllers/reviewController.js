import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';

// @desc    Get reviews for a book
// @route   GET /api/books/:id/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  res.json(book.reviews);
});

// @desc    Add a review to a book
// @route   POST /api/books/:id/reviews
// @access  Private
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }
  if (!comment || !comment.trim()) {
    res.status(400);
    throw new Error('Review comment is required');
  }

  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  // Prevent duplicate reviews from the same user
  const alreadyReviewed = book.reviews.find(
    (r) => r.userId.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this book');
  }

  const review = {
    userId: req.user._id,
    userName: req.user.name,
    rating: Number(rating),
    comment: comment.trim(),
  };

  book.reviews.push(review);
  // Recalculate average rating
  book.rating = Math.round(
    (book.reviews.reduce((s, r) => s + r.rating, 0) / book.reviews.length) * 10
  ) / 10;

  await book.save();
  res.status(201).json(review);
});

// @desc    Update a review
// @route   PUT /api/books/:id/reviews/:reviewId
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  const review = book.reviews.id(req.params.reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to edit this review');
  }

  if (rating) review.rating = Number(rating);
  if (comment) review.comment = comment.trim();

  // Recalculate book rating
  book.rating = Math.round(
    (book.reviews.reduce((s, r) => s + r.rating, 0) / book.reviews.length) * 10
  ) / 10;

  await book.save();
  res.json(review);
});

// @desc    Delete a review
// @route   DELETE /api/books/:id/reviews/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  const review = book.reviews.id(req.params.reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  review.deleteOne();
  // Recalculate book rating
  if (book.reviews.length > 0) {
    book.rating = Math.round(
      (book.reviews.reduce((s, r) => s + r.rating, 0) / book.reviews.length) * 10
    ) / 10;
  } else {
    book.rating = 0;
  }

  await book.save();
  res.json({ message: 'Review removed' });
});
