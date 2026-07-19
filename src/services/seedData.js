// Seed data for the mock API. Mirrors the MongoDB collections described in the README.
// Book images use the Open Library Covers API (by ISBN) with a fallback gradient placeholder.

// Generate a book cover URL from ISBN via Open Library
function cover(isbn) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`;
}

// Fallback placeholder image (data URI) for books where the cover fails to load
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560" viewBox="0 0 400 560">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0%" stop-color="#2563eb"/>` +
    `<stop offset="100%" stop-color="#1e3a8a"/>` +
    `</linearGradient></defs>` +
    `<rect width="400" height="560" fill="url(#g)"/>` +
    `<text x="200" y="260" font-size="28" font-family="sans-serif" fill="white" text-anchor="middle" font-weight="bold">BookHaven</text>` +
    `<text x="200" y="300" font-size="16" font-family="sans-serif" fill="rgba(255,255,255,0.7)" text-anchor="middle">No Cover Available</text>` +
    `</svg>`
  );

export const seedUsers = [
  {
    _id: 'u-admin',
    name: 'Admin User',
    email: 'admin@bookstore.com',
    password: 'demo:YWRtaW4xMjM=',
    role: 'Admin',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: 'u-demo',
    name: 'Demo User',
    email: 'user@bookstore.com',
    password: 'demo:dXNlcjEyMw==',
    role: 'User',
    createdAt: '2024-01-02T00:00:00.000Z',
  },
];

// Plain-text passwords for the seeded accounts (demo only):
//   admin@bookstore.com / admin123
//   user@bookstore.com  / user123

export const seedBooks = [
  {
    _id: 'b-1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    description: 'A portrait of the Jazz Age in all of its decadence and excess, The Great Gatsby is a classic story of the American Dream.',
    isbn: '9780743273565',
    publisher: 'Scribner',
    language: 'English',
    price: 12.99,
    stock: 45,
    rating: 4.7,
    image: cover('9780743273565'),
    createdAt: '2024-02-01T00:00:00.000Z',
  },
  {
    _id: 'b-2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    description: 'A powerful tale of racial injustice and the loss of innocence in the American South.',
    isbn: '9780061120084',
    publisher: 'HarperCollins',
    language: 'English',
    price: 14.5,
    stock: 60,
    rating: 4.8,
    image: cover('9780061120084'),
    createdAt: '2024-02-02T00:00:00.000Z',
  },
  {
    _id: 'b-3',
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
    isbn: '9780451524935',
    publisher: 'Signet Classics',
    language: 'English',
    price: 9.99,
    stock: 80,
    rating: 4.6,
    image: cover('9780451524935'),
    createdAt: '2024-02-03T00:00:00.000Z',
  },
  {
    _id: 'b-4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    description: 'A romantic novel of manners that follows the emotional development of Elizabeth Bennet.',
    isbn: '9780141439518',
    publisher: 'Penguin Classics',
    language: 'English',
    price: 11.25,
    stock: 35,
    rating: 4.5,
    image: cover('9780141439518'),
    createdAt: '2024-02-04T00:00:00.000Z',
  },
  {
    _id: 'b-5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'A fantasy novel about the quest of home-loving hobbit Bilbo Baggins to win a share of treasure guarded by a dragon.',
    isbn: '9780547928227',
    publisher: 'Houghton Mifflin Harcourt',
    language: 'English',
    price: 16.99,
    stock: 50,
    rating: 4.9,
    image: cover('9780547928227'),
    createdAt: '2024-02-05T00:00:00.000Z',
  },
  {
    _id: 'b-6',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    description: 'A story about adolescent rebellion and alienation, following Holden Caulfield through New York City.',
    isbn: '9780316769488',
    publisher: 'Little, Brown',
    language: 'English',
    price: 10.99,
    stock: 40,
    rating: 4.3,
    image: cover('9780316769488'),
    createdAt: '2024-02-06T00:00:00.000Z',
  },
  {
    _id: 'b-7',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    description: 'A dystopian novel that anticipates developments in reproductive technology and sleep-learning.',
    isbn: '9780060850524',
    publisher: 'Harper Perennial',
    language: 'English',
    price: 13.49,
    stock: 25,
    rating: 4.4,
    image: cover('9780060850524'),
    createdAt: '2024-02-07T00:00:00.000Z',
  },
  {
    _id: 'b-8',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Adventure',
    description: 'A philosophical novel about a young Andalusian shepherd on a journey to the Egyptian pyramids.',
    isbn: '9780061122415',
    publisher: 'HarperOne',
    language: 'English',
    price: 15.0,
    stock: 70,
    rating: 4.6,
    image: cover('9780061122415'),
    createdAt: '2024-02-08T00:00:00.000Z',
  },
  {
    _id: 'b-9',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    description: 'A sweeping narrative of humankind from the dawn of cognition to the modern age.',
    isbn: '9780062316097',
    publisher: 'Harper',
    language: 'English',
    price: 22.99,
    stock: 55,
    rating: 4.7,
    image: cover('9780062316097'),
    createdAt: '2024-02-09T00:00:00.000Z',
  },
  {
    _id: 'b-10',
    title: 'The Road',
    author: 'Cormac McCarthy',
    genre: 'Post-Apocalyptic',
    description: 'A post-apocalyptic novel about a father and son journeying through a devastated landscape.',
    isbn: '9780307387899',
    publisher: 'Vintage International',
    language: 'English',
    price: 14.0,
    stock: 30,
    rating: 4.2,
    image: cover('9780307387899'),
    createdAt: '2024-02-10T00:00:00.000Z',
  },
  {
    _id: 'b-11',
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Memoir',
    description: 'A memoir about a woman who grew up in a survivalist family and eventually earned a PhD from Cambridge.',
    isbn: '9780399590504',
    publisher: 'Random House',
    language: 'English',
    price: 19.99,
    stock: 65,
    rating: 4.8,
    image: cover('9780399590504'),
    createdAt: '2024-02-11T00:00:00.000Z',
  },
  {
    _id: 'b-12',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    description: 'An easy and proven way to build good habits and break bad ones.',
    isbn: '9780735211292',
    publisher: 'Avery',
    language: 'English',
    price: 21.0,
    stock: 90,
    rating: 4.9,
    image: cover('9780735211292'),
    createdAt: '2024-02-12T00:00:00.000Z',
  },
];

export const seedOrders = [
  {
    _id: 'o-1',
    userId: 'u-demo',
    books: [
      { bookId: 'b-1', title: 'The Great Gatsby', price: 12.99, quantity: 1 },
      { bookId: 'b-3', title: '1984', price: 9.99, quantity: 2 },
    ],
    totalPrice: 32.97,
    shippingAddress: {
      fullName: 'Demo User',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
      country: 'USA',
    },
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    createdAt: '2024-03-01T00:00:00.000Z',
  },
  {
    _id: 'o-2',
    userId: 'u-demo',
    books: [
      { bookId: 'b-5', title: 'The Hobbit', price: 16.99, quantity: 1 },
    ],
    totalPrice: 16.99,
    shippingAddress: {
      fullName: 'Demo User',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
      country: 'USA',
    },
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    createdAt: '2024-03-15T00:00:00.000Z',
  },
];

export const seedReviews = [
  {
    _id: 'r-1',
    userId: 'u-demo',
    bookId: 'b-1',
    userName: 'Demo User',
    rating: 5,
    review: 'A timeless masterpiece. The prose is simply beautiful.',
    createdAt: '2024-03-05T00:00:00.000Z',
  },
  {
    _id: 'r-2',
    userId: 'u-demo',
    bookId: 'b-3',
    userName: 'Demo User',
    rating: 4,
    review: 'Chilling and prophetic. A must-read for every generation.',
    createdAt: '2024-03-06T00:00:00.000Z',
  },
];
