# BookHaven - MERN Stack BookStore E-Commerce Application

A full-stack e-commerce web application for an online bookstore, built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Authentication** — JWT-based login/registration with bcryptjs password hashing
- **Role-Based Access Control** — User and Admin roles with protected routes
- **Book Catalog** — Browse, search, filter, and sort books by title, author, genre, price, and rating
- **Shopping Cart** — Add to cart, update quantities, remove items, clear cart
- **Checkout & Orders** — Place orders with shipping address, view order history, cancel orders
- **Reviews** — Add, update, and delete reviews with star ratings
- **Admin Dashboard** — Manage books (CRUD), manage orders (update status), view stats
- **Responsive UI** — Bootstrap 5 with a clean, modern design
- **Image Upload** — Multer integration for book cover images

## Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- React Bootstrap + Bootstrap 5
- Axios
- React Toastify (notifications)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- dotenv
- cors
- multer

## Project Structure

```
BookStore/
├── client/                 # (this repository - frontend)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level views
│   │   │   └── admin/      # Admin-only pages
│   │   ├── layouts/        # Layout wrappers
│   │   ├── context/        # React context providers (Auth, Cart)
│   │   ├── services/       # API service layer
│   │   ├── styles/         # Custom CSS
│   │   └── App.tsx         # Main app with routing
│   └── package.json
│
├── server/                 # Express.js backend
│   ├── config/             # Database connection
│   ├── middleware/         # Auth, upload, error middleware
│   ├── models/             # Mongoose models (User, Book, Order)
│   ├── controllers/        # Route controllers
│   ├── routes/             # Express route definitions
│   ├── uploads/            # Uploaded book images
│   ├── utils/              # Token generation, seed script
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file (copy from `.env.example`):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:5173
```

Seed the database with sample data:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

The API will run on `http://localhost:5000`.

### 2. Frontend Setup

```bash
npm install
```

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

> **Note:** The frontend includes a localStorage-backed mock API (`src/services/mockApi.js`) so it works immediately in the browser without the backend. To use the real Express backend, set `VITE_API_URL` and switch the service layer from `mockApi` to the axios-based `api.js`.

## Demo Accounts

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@bookstore.com   | admin123    |
| User  | user@bookstore.com    | user123     |

## API Endpoints

### Authentication
| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | /api/auth/register    | Public  | Register new user    |
| POST   | /api/auth/login       | Public  | Login user           |
| GET    | /api/auth/profile     | Private | Get user profile     |

### Books
| Method | Endpoint              | Access       | Description          |
|--------|-----------------------|--------------|----------------------|
| GET    | /api/books            | Public       | Get all books (search, filter, sort, paginate) |
| GET    | /api/books/:id        | Public       | Get single book      |
| POST   | /api/books            | Admin        | Create book          |
| PUT    | /api/books/:id        | Admin        | Update book          |
| DELETE | /api/books/:id        | Admin        | Delete book          |

### Reviews (nested under books)
| Method | Endpoint                          | Access  | Description          |
|--------|-----------------------------------|---------|----------------------|
| GET    | /api/books/:id/reviews            | Public  | Get reviews for book |
| POST   | /api/books/:id/reviews            | Private | Add review           |
| PUT    | /api/books/:id/reviews/:reviewId  | Private | Update review        |
| DELETE | /api/books/:id/reviews/:reviewId  | Private | Delete review        |

### Orders
| Method | Endpoint                | Access       | Description            |
|--------|-------------------------|--------------|------------------------|
| POST   | /api/orders             | Private      | Create order           |
| GET    | /api/orders/myorders     | Private      | Get user's orders      |
| GET    | /api/orders             | Admin        | Get all orders         |
| PUT    | /api/orders/:id/status  | Admin        | Update order status    |
| PUT    | /api/orders/:id/cancel   | Private      | Cancel order           |

### Query Parameters for GET /api/books

| Parameter  | Description                          | Example              |
|------------|--------------------------------------|----------------------|
| search     | Search by title or author            | ?search=gatsby       |
| genre      | Filter by genre                       | ?genre=Fantasy       |
| minPrice   | Minimum price                         | ?minPrice=10         |
| maxPrice   | Maximum price                         | ?maxPrice=20         |
| minRating  | Minimum rating                        | ?minRating=4         |
| sort       | Sort: newest, price-asc, price-desc, rating | ?sort=price-asc |
| page       | Page number                           | ?page=1              |
| limit      | Items per page                        | ?limit=9             |

## Security Features

- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens with 30-day expiry
- Protected routes with middleware
- Role-based authorization (User/Admin)
- Input validation on all models
- Centralized error handling
- Server-side price verification on checkout (never trusts client prices)
- CORS configured for the frontend client

## Testing with Postman

1. Start the backend server
2. Import the API endpoints into Postman
3. Test the following flows:
   - Register a new user → Login → Get profile
   - Browse books → Search → Filter → Sort
   - Add a book (admin) → Update → Delete
   - Create an order → Get my orders → Cancel order
   - Add a review → Update → Delete
   - Admin: Get all orders → Update order status

## License

This project is for educational purposes.
# Document
https://docs.google.com/document/d/1yCzo3BdN7fwPjSWmLsO_bAANCtzZQUDu/edit?usp=drive_link&ouid=116180054408580645651&rtpof=true&sd=true
# Demolink
https://drive.google.com/file/d/1m8-rTi_svbDed_hxEsZCcJUMiYwkXyrx/view?usp=drive_link
