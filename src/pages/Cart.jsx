import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Form, Image } from 'react-bootstrap';
import { Trash, CartX, ArrowRight, CartCheck } from 'react-bootstrap-icons';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import AppBreadcrumb from '../components/AppBreadcrumb';
import ConfirmDialog from '../components/ConfirmDialog';
import BookImage from '../components/BookImage';
import { useState } from 'react';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [showClear, setShowClear] = useState(false);

  function handleCheckout() {
    navigate('/checkout');
  }

  function handleClear() {
    clearCart();
    setShowClear(false);
    toast.info('Cart cleared');
  }

  if (items.length === 0) {
    return (
      <Container className="py-5">
        <AppBreadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <div className="text-center py-5">
          <CartX size={64} className="text-muted mb-3" />
          <h2 className="fw-bold mb-2">Your Cart is Empty</h2>
          <p className="text-muted mb-4">Browse our collection and find your next great read.</p>
          <Button as={Link} to="/books" variant="primary" size="lg">Browse Books <ArrowRight className="ms-2" /></Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <AppBreadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">Shopping Cart</h1>
        <Button variant="outline-danger" size="sm" onClick={() => setShowClear(true)}>
          <Trash /> Clear Cart
        </Button>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Table responsive className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Book</th>
                    <th>Price</th>
                    <th style={{ width: 130 }}>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.bookId}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <BookImage src={item.image} alt={item.title} rounded style={{ width: 50, height: 65, objectFit: 'cover' }} />
                          <div>
                            <Link to={`/books/${item.bookId}`} className="fw-semibold text-decoration-none text-dark">{item.title}</Link>
                            <br /><small className="text-muted">{item.author}</small>
                          </div>
                        </div>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center border rounded">
                          <Button variant="light" size="sm" onClick={() => updateQuantity(item.bookId, item.quantity - 1)}>-</Button>
                          <span className="px-2 fw-semibold">{item.quantity}</span>
                          <Button variant="light" size="sm" onClick={() => updateQuantity(item.bookId, item.quantity + 1)}>+</Button>
                        </div>
                      </td>
                      <td className="fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button variant="link" className="text-danger p-0" onClick={() => removeItem(item.bookId)}>
                          <Trash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '80px' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tax</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong className="text-primary fs-5">${totalPrice.toFixed(2)}</strong>
              </div>
              <Button variant="primary" size="lg" className="w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleCheckout}>
                <CartCheck /> Proceed to Checkout
              </Button>
              <Button as={Link} to="/books" variant="outline-secondary" className="w-100 mt-2">Continue Shopping</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmDialog
        show={showClear}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart?"
        onConfirm={handleClear}
        onCancel={() => setShowClear(false)}
        confirmText="Clear All"
      />
    </Container>
  );
}
