// Seed script - populates MongoDB with sample data
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Book.deleteMany();
    await Order.deleteMany();

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bookstore.com',
      password: 'admin123',
      role: 'Admin',
    });
    const user = await User.create({
      name: 'Demo User',
      email: 'user@bookstore.com',
      password: 'user123',
      role: 'User',
    });
    console.log('Users created');

    // Create books
    const books = await Book.insertMany([
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', description: 'A portrait of the Jazz Age in all of its decadence and excess.', isbn: '9780743273565', publisher: 'Scribner', language: 'English', price: 12.99, stock: 45, rating: 4.7, image: 'https://images.pexels.com/photos/1033270/pexels-photo-1033270.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', description: 'A powerful tale of racial injustice in the American South.', isbn: '9780061120084', publisher: 'HarperCollins', language: 'English', price: 14.5, stock: 60, rating: 4.8, image: 'https://images.pexels.com/photos/1033384/pexels-photo-1033384.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { title: '1984', author: 'George Orwell', genre: 'Dystopian', description: 'A dystopian novel about totalitarianism.', isbn: '9780451524935', publisher: 'Signet Classics', language: 'English', price: 9.99, stock: 80, rating: 4.6, image: 'https://images.pexels.com/photos/1033772/pexels-photo-1033772.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', description: 'A romantic novel of manners.', isbn: '9780141439518', publisher: 'Penguin Classics', language: 'English', price: 11.25, stock: 35, rating: 4.5, image: 'https://images.pexels.com/photos/1034270/pexels-photo-1034270.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', description: 'A fantasy novel about Bilbo Baggins.', isbn: '9780547928227', publisher: 'Houghton Mifflin Harcourt', language: 'English', price: 16.99, stock: 50, rating: 4.9, image: 'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction', description: 'A story about adolescent rebellion.', isbn: '9780316769488', publisher: 'Little, Brown', language: 'English', price: 10.99, stock: 40, rating: 4.3, image: 'https://images.pexels.com/photos/1035270/pexels-photo-1035270.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian', description: 'A dystopian novel about reproductive technology.', isbn: '9780060850524', publisher: 'Harper Perennial', language: 'English', price: 13.49, stock: 25, rating: 4.4, image: 'https://images.pexels.com/photos/1035834/pexels-photo-1035834.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Adventure', description: 'A philosophical novel about a young shepherd.', isbn: '9780061122415', publisher: 'HarperOne', language: 'English', price: 15.0, stock: 70, rating: 4.6, image: 'https://images.pexels.com/photos/1036370/pexels-photo-1036370.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-Fiction', description: 'A brief history of humankind.', isbn: '9780062316097', publisher: 'Harper', language: 'English', price: 22.99, stock: 55, rating: 4.7, image: 'https://images.pexels.com/photos/1036736/pexels-photo-1036736.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { title: 'The Road', author: 'Cormac McCarthy', genre: 'Post-Apocalyptic', description: 'A post-apocalyptic novel.', isbn: '9780307387899', publisher: 'Vintage International', language: 'English', price: 14.0, stock: 30, rating: 4.2, image: 'https://images.pexels.com/photos/1037270/pexels-photo-1037270.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { title: 'Educated', author: 'Tara Westover', genre: 'Memoir', description: 'A memoir about education and family.', isbn: '9780399590504', publisher: 'Random House', language: 'English', price: 19.99, stock: 65, rating: 4.8, image: 'https://images.pexels.com/photos/1037834/pexels-photo-1037834.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', description: 'Build good habits and break bad ones.', isbn: '9780735211292', publisher: 'Avery', language: 'English', price: 21.0, stock: 90, rating: 4.9, image: 'https://images.pexels.com/photos/1038370/pexels-photo-1038370.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ]);
    console.log(`${books.length} books created`);

    // Create a sample order
    await Order.create({
      userId: user._id,
      books: [
        { bookId: books[0]._id, title: books[0].title, price: books[0].price, quantity: 1 },
        { bookId: books[2]._id, title: books[2].title, price: books[2].price, quantity: 2 },
      ],
      totalPrice: books[0].price + books[2].price * 2,
      shippingAddress: { fullName: 'Demo User', address: '123 Main St', city: 'Springfield', state: 'IL', zip: '62704', country: 'USA' },
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
    });
    console.log('Sample order created');

    console.log('\n=== Seed complete ===');
    console.log('Admin:  admin@bookstore.com / admin123');
    console.log('User:   user@bookstore.com / user123');
    process.exit(0);
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
