import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import { StarFill, CartPlus, ArrowLeft, LightningChargeFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { mockApi } from '../services/mockApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import AppBreadcrumb from '../components/AppBreadcrumb';
import BookImage from '../components/BookImage';
import { useNavigate } from 'react-router-dom';

export default function BookDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([mockApi.getBook(id), mockApi.getReviews(id)])
      .then(([b, r]) => { setBook(b); setReviews(r); })
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    addItem(book, quantity);
    toast.success(`Added ${quantity} × "${book.title}" to cart`);
  }

  function handleBuyNow() {
    addItem(book, quantity);
    if (!user) {
      toast.info('Please log in to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!user) { toast.info('Please log in to leave a review'); return; }
    setSubmitting(true);
    try {
      const newReview = await mockApi.addReview({ bookId: id, ...reviewForm }, token);
      setReviews([newReview, ...reviews]);
      setReviewForm({ rating: 5, review: '' });
      toast.success('Review added!');
    } catch (err) {
      toast.error(err.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!book) return <Container className="py-5 text-center"><p>Book not found.</p></Container>;

  return (
    <Container className="py-4">
      <AppBreadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Books', to: '/books' },
        { label: book.title },
      ]} />

      <Button as={Link} to="/books" variant="link" className="text-decoration-none mb-3 ps-0">
        <ArrowLeft /> Back to Books
      </Button>

      <Row className="g-4 mb-5">
        <Col md={5} lg={4}>
          <Card className="border-0 shadow-sm">
            <BookImage src={book.image} alt={book.title} style={{ height: 400, objectFit: 'cover' }} className="w-100" />
          </Card>
        </Col>
        <Col md={7} lg={8}>
          <div className="mb-2">
            <Badge bg="primary">{book.genre}</Badge>
            {book.stock > 0
              ? <Badge bg="success" className="ms-2">In Stock ({book.stock})</Badge>
              : <Badge bg="danger" className="ms-2">Out of Stock</Badge>}
          </div>
          <h1 className="fw-bold mb-2">{book.title}</h1>
          <p className="text-muted mb-3 fs-5">by {book.author}</p>
          <div className="d-flex align-items-center gap-2 mb-3">
            <StarRating rating={book.rating} />
            <span className="fw-semibold">{book.rating?.toFixed(1) || 'N/A'}</span>
            <span className="text-muted">({reviews.length} reviews)</span>
          </div>
          <p className="text-muted mb-4">{book.description}</p>

          <Row className="mb-4">
            <Col sm={6}><strong>ISBN:</strong> <span className="text-muted">{book.isbn}</span></Col>
            <Col sm={6}><strong>Publisher:</strong> <span className="text-muted">{book.publisher}</span></Col>
            <Col sm={6}><strong>Language:</strong> <span className="text-muted">{book.language}</span></Col>
            <Col sm={6}><strong>Published:</strong> <span className="text-muted">{new Date(book.createdAt).toLocaleDateString()}</span></Col>
          </Row>

          <h3 className="fw-bold text-primary mb-3">${book.price.toFixed(2)}</h3>

          <div className="d-flex gap-3 align-items-center flex-wrap">
            <div className="d-flex align-items-center border rounded">
              <Button variant="light" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
              <span className="px-3 fw-semibold">{quantity}</span>
              <Button variant="light" onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}>+</Button>
            </div>
            <Button variant="primary" size="lg" className="d-flex align-items-center gap-2 px-4" onClick={handleAddToCart} disabled={book.stock === 0}>
              <CartPlus size={20} /> Add to Cart
            </Button>
            <Button variant="success" size="lg" className="d-flex align-items-center gap-2 px-4" onClick={handleBuyNow} disabled={book.stock === 0}>
              <LightningChargeFill size={20} /> Buy Now
            </Button>
          </div>
        </Col>
      </Row>

      <hr />

      {/* Reviews Section */}
      <h3 className="fw-bold mb-4">Reviews ({reviews.length})</h3>
      {user ? (
        <Card className="border-0 shadow-sm mb-4 p-4">
          <h5 className="mb-3">Write a Review</h5>
          <Form onSubmit={handleSubmitReview}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Very Good</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Poor</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control as="textarea" rows={3} value={reviewForm.review} onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })} required placeholder="Share your thoughts about this book..." />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</Button>
          </Form>
        </Card>
      ) : (
        <Alert variant="info" className="mb-4">
          <Link to="/login">Log in</Link> to write a review.
        </Alert>
      )}

      {reviews.length === 0 ? (
        <p className="text-muted">No reviews yet. Be the first to review!</p>
      ) : (
        <Row className="g-3">
          {reviews.map((r) => (
            <Col xs={12} key={r._id}>
              <Card className="border-0 shadow-sm p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <strong>{r.userName}</strong>
                      <StarRating rating={r.rating} size={14} />
                    </div>
                    <p className="mb-0 text-muted">{r.review}</p>
                    <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
