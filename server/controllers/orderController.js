import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Book from '../models/Book.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { books, shippingAddress } = req.body;

  if (!books || books.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }
  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address required');
  }

  // Verify prices and calculate total from DB (never trust client prices)
  let totalPrice = 0;
  const orderBooks = [];
  for (const item of books) {
    const book = await Book.findById(item.bookId);
    if (!book) {
      res.status(404);
      throw new Error(`Book not found: ${item.bookId}`);
    }
    const quantity = Number(item.quantity);
    totalPrice += book.price * quantity;
    orderBooks.push({
      bookId: book._id,
      title: book.title,
      price: book.price,
      quantity,
    });
    // Decrement stock
    book.stock = Math.max(0, book.stock - quantity);
    await book.save();
  }

  const order = await Order.create({
    userId: req.user._id,
    books: orderBooks,
    totalPrice: Math.round(totalPrice * 100) / 100,
    shippingAddress,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
  });

  res.status(201).json(order);
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.orderStatus = orderStatus;
  const updated = await order.save();
  res.json(updated);
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  // Only the order owner or an admin can cancel
  if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }
  order.orderStatus = 'Cancelled';
  const updated = await order.save();
  res.json(updated);
});
