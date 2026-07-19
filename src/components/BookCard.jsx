import { Card, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { StarFill, CartPlus, LightningChargeFill } from 'react-bootstrap-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import BookImage from './BookImage';

export default function BookCard({ book }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(book, 1);
    toast.success(`"${book.title}" added to cart`);
  }

  function handleBuyNow(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(book, 1);
    if (!user) {
      toast.info('Please log in to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  }

  return (
    <Card className="book-card h-100 border-0 shadow-sm">
      <Link to={`/books/${book._id}`} className="text-decoration-none">
        <div className="book-card-img-wrapper">
          <BookImage src={book.image} alt={book.title} className="book-card-img" />
          <Badge bg="light" text="dark" className="book-card-genre">{book.genre}</Badge>
        </div>
      </Link>
      <Card.Body className="d-flex flex-column">
        <Link to={`/books/${book._id}`} className="text-decoration-none">
          <Card.Title className="book-card-title text-dark">{book.title}</Card.Title>
        </Link>
        <Card.Subtitle className="text-muted small mb-2">by {book.author}</Card.Subtitle>
        <div className="d-flex align-items-center gap-1 mb-2">
          <StarFill className="text-warning" size={14} />
          <span className="small fw-semibold">{book.rating?.toFixed(1) || 'N/A'}</span>
          <span className="text-muted small ms-auto">${book.price.toFixed(2)}</span>
        </div>
        <div className="d-flex gap-2 mt-auto">
          <Button variant="primary" size="sm" className="d-flex align-items-center justify-content-center gap-1 flex-grow-1" onClick={handleAdd}>
            <CartPlus size={16} /> Add
          </Button>
          <Button variant="success" size="sm" className="d-flex align-items-center justify-content-center gap-1 flex-grow-1" onClick={handleBuyNow}>
            <LightningChargeFill size={16} /> Buy
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
