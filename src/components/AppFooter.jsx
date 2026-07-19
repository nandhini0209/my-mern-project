import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BookHalf, Facebook, Twitter, Instagram, Envelope } from 'react-bootstrap-icons';

export default function AppFooter() {
  return (
    <footer className="footer-custom mt-auto">
      <Container className="py-5">
        <Row className="gy-4">
          <Col md={4}>
            <h5 className="d-flex align-items-center gap-2 mb-3">
              <BookHalf size={22} className="text-primary" /> BookHaven
            </h5>
            <p className="text-muted small">
              Your trusted online bookstore. Discover thousands of titles across every genre, delivered to your door.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="social-icon"><Facebook /></a>
              <a href="#" className="social-icon"><Twitter /></a>
              <a href="#" className="social-icon"><Instagram /></a>
              <a href="#" className="social-icon"><Envelope /></a>
            </div>
          </Col>
          <Col md={2} sm={6}>
            <h6 className="fw-bold mb-3">Explore</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/books" className="footer-link">All Books</Link></li>
              <li className="mb-2"><Link to="/books?genre=Fiction" className="footer-link">Fiction</Link></li>
              <li className="mb-2"><Link to="/books?genre=Fantasy" className="footer-link">Fantasy</Link></li>
              <li className="mb-2"><Link to="/books?genre=Non-Fiction" className="footer-link">Non-Fiction</Link></li>
            </ul>
          </Col>
          <Col md={2} sm={6}>
            <h6 className="fw-bold mb-3">Account</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/login" className="footer-link">Login</Link></li>
              <li className="mb-2"><Link to="/register" className="footer-link">Register</Link></li>
              <li className="mb-2"><Link to="/cart" className="footer-link">Cart</Link></li>
              <li className="mb-2"><Link to="/orders" className="footer-link">Orders</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="fw-bold mb-3">Newsletter</h6>
            <p className="text-muted small">Subscribe for new releases and exclusive offers.</p>
            <div className="d-flex gap-2">
              <input type="email" className="form-control form-control-sm" placeholder="Email address" />
              <button className="btn btn-primary btn-sm">Subscribe</button>
            </div>
          </Col>
        </Row>
        <hr className="my-4 border-light-subtle" />
        <p className="text-center text-muted small mb-0">
          &copy; {new Date().getFullYear()} BookHaven. Built with the MERN Stack. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
