// Mock API service layer backed by localStorage.
// Mirrors the Express/MongoDB backend described in the README so the frontend
// works live in the browser. In production, swap these calls for axios requests
// to VITE_API_URL (see services/api.js).

import { seedUsers, seedBooks, seedOrders, seedReviews } from './seedData';

const DB_KEY = 'bookstore_db_v2';

function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  const db = {
    users: seedUsers,
    books: seedBooks,
    orders: seedOrders,
    reviews: seedReviews,
  };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function genId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Simple hash for demo only. The real backend uses bcryptjs.
function fakeHash(password) {
  return `demo:${btoa(password)}`;
}
function fakeCompare(password, hash) {
  if (!hash) return false;
  if (hash.startsWith('demo:')) {
    try { return atob(hash.slice(5)) === password; } catch { return false; }
  }
  return false;
}

function makeToken(user) {
  return btoa(JSON.stringify({ id: user._id, role: user.role }));
}

function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

export const mockApi = {
  // ---------- AUTH ----------
  async register({ name, email, password }) {
    await delay();
    const db = getDB();
    const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw { response: { status: 400, data: { message: 'Email already registered' } } };
    const user = {
      _id: genId('u'),
      name,
      email,
      password: fakeHash(password),
      role: 'User',
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    saveDB(db);
    return { token: makeToken(user), user: publicUser(user) };
  },

  async login({ email, password }) {
    await delay();
    const db = getDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !fakeCompare(password, user.password)) {
      throw { response: { status: 401, data: { message: 'Invalid email or password' } } };
    }
    return { token: makeToken(user), user: publicUser(user) };
  },

  async getProfile(token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    let payload;
    try {
      payload = JSON.parse(atob(token));
    } catch {
      throw { response: { status: 401, data: { message: 'Invalid token' } } };
    }
    const db = getDB();
    const user = db.users.find((u) => u._id === payload.id);
    if (!user) throw { response: { status: 404, data: { message: 'User not found' } } };
    return publicUser(user);
  },

  // ---------- BOOKS ----------
  async getBooks({ search, genre, minPrice, maxPrice, minRating, sort, page = 1, limit = 9 } = {}) {
    await delay();
    const db = getDB();
    let books = [...db.books];

    if (search) {
      const q = search.toLowerCase();
      books = books.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }
    if (genre && genre !== 'All') books = books.filter((b) => b.genre === genre);
    if (minPrice != null) books = books.filter((b) => b.price >= Number(minPrice));
    if (maxPrice != null) books = books.filter((b) => b.price <= Number(maxPrice));
    if (minRating != null) books = books.filter((b) => b.rating >= Number(minRating));

    switch (sort) {
      case 'price-asc': books.sort((a, b) => a.price - b.price); break;
      case 'price-desc': books.sort((a, b) => b.price - a.price); break;
      case 'rating': books.sort((a, b) => b.rating - a.rating); break;
      case 'newest': books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      default: break;
    }

    const total = books.length;
    const start = (page - 1) * limit;
    const paged = books.slice(start, start + Number(limit));
    return { books: paged, total, page: Number(page), totalPages: Math.ceil(total / limit) };
  },

  async getBook(id) {
    await delay();
    const db = getDB();
    const book = db.books.find((b) => b._id === id);
    if (!book) throw { response: { status: 404, data: { message: 'Book not found' } } };
    return book;
  },

  async createBook(data, token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    const db = getDB();
    const book = { _id: genId('b'), rating: 0, createdAt: new Date().toISOString(), ...data };
    db.books.push(book);
    saveDB(db);
    return book;
  },

  async updateBook(id, data, token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    const db = getDB();
    const idx = db.books.findIndex((b) => b._id === id);
    if (idx === -1) throw { response: { status: 404, data: { message: 'Book not found' } } };
    db.books[idx] = { ...db.books[idx], ...data };
    saveDB(db);
    return db.books[idx];
  },

  async deleteBook(id, token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    const db = getDB();
    db.books = db.books.filter((b) => b._id !== id);
    saveDB(db);
    return { message: 'Book removed' };
  },

  // ---------- ORDERS ----------
  async createOrder(orderData, token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    const db = getDB();
    const order = {
      _id: genId('o'),
      ...orderData,
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      createdAt: new Date().toISOString(),
    };
    db.orders.push(order);
    saveDB(db);
    return order;
  },

  async getMyOrders(token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    const db = getDB();
    let payload;
    try { payload = JSON.parse(atob(token)); } catch { throw { response: { status: 401, data: { message: 'Invalid token' } } }; }
    return db.orders.filter((o) => o.userId === payload.id).reverse();
  },

  async getAllOrders(token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    const db = getDB();
    return db.orders.reverse();
  },

  async updateOrderStatus(id, status, token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    const db = getDB();
    const order = db.orders.find((o) => o._id === id);
    if (!order) throw { response: { status: 404, data: { message: 'Order not found' } } };
    order.orderStatus = status;
    saveDB(db);
    return order;
  },

  async cancelOrder(id, token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    const db = getDB();
    const order = db.orders.find((o) => o._id === id);
    if (!order) throw { response: { status: 404, data: { message: 'Order not found' } } };
    order.orderStatus = 'Cancelled';
    saveDB(db);
    return order;
  },

  // ---------- REVIEWS ----------
  async getReviews(bookId) {
    await delay();
    const db = getDB();
    return db.reviews.filter((r) => r.bookId === bookId).reverse();
  },

  async addReview(data, token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    const db = getDB();
    let payload;
    try { payload = JSON.parse(atob(token)); } catch { throw { response: { status: 401, data: { message: 'Invalid token' } } }; }
    const user = db.users.find((u) => u._id === payload.id);
    const review = {
      _id: genId('r'),
      userId: payload.id,
      userName: user?.name || 'Anonymous',
      bookId: data.bookId,
      rating: data.rating,
      review: data.review,
      createdAt: new Date().toISOString(),
    };
    db.reviews.push(review);
    // Recalculate book rating
    const bookReviews = db.reviews.filter((r) => r.bookId === data.bookId);
    const book = db.books.find((b) => b._id === data.bookId);
    if (book && bookReviews.length > 0) {
      book.rating = Math.round((bookReviews.reduce((s, r) => s + r.rating, 0) / bookReviews.length) * 10) / 10;
    }
    saveDB(db);
    return review;
  },

  async updateReview(id, data, token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    const db = getDB();
    const review = db.reviews.find((r) => r._id === id);
    if (!review) throw { response: { status: 404, data: { message: 'Review not found' } } };
    review.rating = data.rating;
    review.review = data.review;
    saveDB(db);
    return review;
  },

  async deleteReview(id, token) {
    await delay();
    if (!token) throw { response: { status: 401, data: { message: 'Not authorized' } } };
    const db = getDB();
    db.reviews = db.reviews.filter((r) => r._id !== id);
    saveDB(db);
    return { message: 'Review removed' };
  },
};
