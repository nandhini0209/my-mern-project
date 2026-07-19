import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { CreditCard, CheckCircle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';
import AppBreadcrumb from '../components/AppBreadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        userId: user._id,
        books: items.map((i) => ({ bookId: i.bookId, title: i.title, price: i.price, quantity: i.quantity })),
        totalPrice,
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
      };
      const order = await mockApi.createOrder(orderData, token);
      setOrderId(order._id);
      setPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  if (placed) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <CheckCircle size={80} className="text-success mb-4" />
          <h1 className="fw-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted mb-1">Your order has been placed successfully.</p>
          <p className="text-muted mb-4">Order ID: <strong>#{orderId}</strong></p>
          <div className="d-flex gap-2 justify-content-center">
            <Button as={Link} to="/orders" variant="primary">View My Orders</Button>
            <Button as={Link} to="/books" variant="outline-primary">Continue Shopping</Button>
          </div>
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Button as={Link} to="/books" variant="primary">Browse Books</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <AppBreadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />

      <h1 className="fw-bold mb-4">Checkout</h1>

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Shipping Address</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control name="fullName" value={form.fullName} onChange={handleChange} required />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control name="address" value={form.address} onChange={handleChange} required />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control name="city" value={form.city} onChange={handleChange} required />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control name="state" value={form.state} onChange={handleChange} required />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label>ZIP Code</Form.Label>
                    <Form.Control name="zip" value={form.zip} onChange={handleChange} required />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Control name="country" value={form.country} onChange={handleChange} required />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3"><CreditCard className="me-2" />Payment Details</h5>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control name="cardNumber" value={form.cardNumber} onChange={handleChange} required placeholder="1234 5678 9012 3456" maxLength={19} />
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Label>Name on Card</Form.Label>
                    <Form.Control name="cardName" value={form.cardName} onChange={handleChange} required />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control name="expiry" value={form.expiry} onChange={handleChange} required placeholder="MM/YY" />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control name="cvv" value={form.cvv} onChange={handleChange} required placeholder="123" maxLength={4} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm sticky-top" style={{ top: '80px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <Table borderless size="sm" className="mb-3">
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.bookId}>
                        <td className="text-truncate" style={{ maxWidth: 180 }}>
                          <small>{item.title} × {item.quantity}</small>
                        </td>
                        <td className="text-end"><small>${(item.price * item.quantity).toFixed(2)}</small></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong className="text-primary fs-5">${totalPrice.toFixed(2)}</strong>
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-100" disabled={loading}>
                  {loading ? <LoadingSpinner /> : 'Place Order'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
