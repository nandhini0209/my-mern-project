import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel, Badge } from 'react-bootstrap';
import { ArrowRight, StarFill, BookHalf, Truck, ShieldCheck, Headset } from 'react-bootstrap-icons';
import { mockApi } from '../services/mockApi';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import BookImage from '../components/BookImage';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getBooks({ sort: 'rating', limit: 8 }).then((data) => {
      setBooks(data.books);
      setLoading(false);
    });
  }, []);

  const featured = books.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-white">
        <Container className="py-5">
          <Row className="align-items-center min-vh-50 py-5">
            <Col lg={6} className="py-5">
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2 rounded-pill">New Arrivals Weekly</Badge>
              <h1 className="display-4 fw-bold mb-3">Discover Your Next Great Read</h1>
              <p className="lead mb-4 opacity-75">
                Explore thousands of books across every genre. From timeless classics to the latest bestsellers, find your perfect book at BookHaven.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button as={Link} to="/books" variant="light" size="lg" className="fw-semibold px-4">
                  Browse Books <ArrowRight className="ms-2" />
                </Button>
                <Button as={Link} to="/register" variant="outline-light" size="lg" className="px-4">
                  Join Free
                </Button>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block text-center">
              <div className="hero-book-stack">
                {featured.map((book, i) => (
                  <BookImage
                    key={book._id}
                    src={book.image}
                    alt={book.title}
                    className="hero-book-img"
                    style={{ transform: `rotate(${(i - 1) * 6}deg) translateY(${Math.abs(i - 1) * 12}px)` }}
                  />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-bottom py-4">
        <Container>
          <Row className="text-center g-4">
            <Col md={4}>
              <Truck size={32} className="text-primary mb-2" />
              <h6 className="fw-bold">Free Shipping</h6>
              <p className="text-muted small mb-0">On orders over $35</p>
            </Col>
            <Col md={4}>
              <ShieldCheck size={32} className="text-primary mb-2" />
              <h6 className="fw-bold">Secure Payment</h6>
              <p className="text-muted small mb-0">100% protected payments</p>
            </Col>
            <Col md={4}>
              <Headset size={32} className="text-primary mb-2" />
              <h6 className="fw-bold">24/7 Support</h6>
              <p className="text-muted small mb-0">Always here to help</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Top Rated Books */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Top Rated Books</h2>
            <p className="text-muted">Handpicked favorites from our community</p>
          </div>
          <Button as={Link} to="/books" variant="outline-primary">View All <ArrowRight className="ms-1" /></Button>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Row xs={2} sm={2} md={3} lg={4} className="g-4">
            {books.map((book) => (
              <Col key={book._id}>
                <BookCard book={book} />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Genre Showcase */}
      <section className="bg-white py-5">
        <Container>
          <h2 className="fw-bold text-center mb-5">Browse by Genre</h2>
          <Row className="g-4">
            {[
              { name: 'Fiction', icon: '📚', count: '2.5K+ books' },
              { name: 'Fantasy', icon: '🐉', count: '1.2K+ books' },
              { name: 'Non-Fiction', icon: '🌍', count: '1.8K+ books' },
              { name: 'Classic', icon: '🏛️', count: '900+ books' },
              { name: 'Romance', icon: '❤️', count: '1.5K+ books' },
              { name: 'Self-Help', icon: '🚀', count: '700+ books' },
            ].map((genre) => (
              <Col xs={6} md={4} lg={2} key={genre.name}>
                <Link to={`/books?genre=${genre.name}`} className="text-decoration-none">
                  <Card className="genre-card h-100 text-center border-0 shadow-sm">
                    <Card.Body className="py-4">
                      <div className="genre-icon mb-2">{genre.icon}</div>
                      <h6 className="fw-bold mb-1">{genre.name}</h6>
                      <p className="text-muted small mb-0">{genre.count}</p>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="cta-section text-white text-center py-5">
        <Container>
          <h2 className="fw-bold mb-3">Ready to Start Reading?</h2>
          <p className="lead mb-4 opacity-75">Join thousands of readers who trust BookHaven for their literary adventures.</p>
          <Button as={Link} to="/register" variant="light" size="lg" className="fw-semibold px-5">Create Free Account</Button>
        </Container>
      </section>
    </div>
  );
}
