import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';

// @desc    Get all books with search, filter, sort, pagination
// @route   GET /api/books
// @access  Public
export const getBooks = asyncHandler(async (req, res) => {
  const { search, genre, minPrice, maxPrice, minRating, sort, page = 1, limit = 9 } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
    ];
  }
  if (genre && genre !== 'All') query.genre = genre;
  if (minPrice != null || maxPrice != null) {
    query.price = {};
    if (minPrice != null) query.price.$gte = Number(minPrice);
    if (maxPrice != null) query.price.$lte = Number(maxPrice);
  }
  if (minRating != null) query.rating = { $gte: Number(minRating) };

  let sortOption = { createdAt: -1 };
  if (sort === 'price-asc') sortOption = { price: 1 };
  else if (sort === 'price-desc') sortOption = { price: -1 };
  else if (sort === 'rating') sortOption = { rating: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const books = await Book.find(query).sort(sortOption).skip(skip).limit(Number(limit));
  const total = await Book.countDocuments(query);

  res.json({
    books,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
export const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  res.json(book);
});

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = asyncHandler(async (req, res) => {
  const { title, author, genre, description, isbn, publisher, language, price, stock, rating, image } = req.body;

  if (!title || !author || !genre || !description || !isbn || price == null) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  const book = await Book.create({
    title, author, genre, description, isbn,
    publisher: publisher || '',
    language: language || 'English',
    price: Number(price),
    stock: Number(stock) || 0,
    rating: Number(rating) || 0,
    image: image || (req.file ? `/uploads/${req.file.filename}` : ''),
  });

  res.status(201).json(book);
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  Object.assign(book, req.body);
  if (req.file) book.image = `/uploads/${req.file.filename}`;
  const updated = await book.save();
  res.json(updated);
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  await book.deleteOne();
  res.json({ message: 'Book removed' });
});
