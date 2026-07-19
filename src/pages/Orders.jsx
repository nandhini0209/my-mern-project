import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Button, Table } from 'react-bootstrap';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AppBreadcrumb from '../components/AppBreadcrumb';
import ConfirmDialog from '../components/ConfirmDialog';
import { toast } from 'react-toastify';

const STATUS_COLORS = {
  Processing: 'info',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'danger',
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    mockApi.getMyOrders(token).then(setOrders).finally(() => setLoading(false));
  }, [token]);

  async function handleCancel() {
    try {
      await mockApi.cancelOrder(cancelTarget, token);
      setOrders(orders.map((o) => o._id === cancelTarget ? { ...o, orderStatus: 'Cancelled' } : o));
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancelTarget(null);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <AppBreadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My Orders' }]} />

      <h1 className="fw-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted mb-3">You haven't placed any orders yet.</p>
          <Button as={Link} to="/books" variant="primary">Browse Books</Button>
        </div>
      ) : (
        <Row className="g-3">
          {orders.map((order) => (
            <Col xs={12} key={order._id}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between flex-wrap mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">Order #{order._id}</h5>
                      <small className="text-muted">Placed on {new Date(order.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div className="text-end">
                      <Badge bg={STATUS_COLORS[order.orderStatus] || 'secondary'} className="mb-1">{order.orderStatus}</Badge>
                      <br />
                      <Badge bg={order.paymentStatus === 'Paid' ? 'success' : 'warning'}>{order.paymentStatus}</Badge>
                    </div>
                  </div>

                  <Table responsive size="sm" className="mb-3">
                    <thead className="table-light">
                      <tr>
                        <th>Book</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.books.map((b, i) => (
                        <tr key={i}>
                          <td>{b.title}</td>
                          <td>{b.quantity}</td>
                          <td>${b.price.toFixed(2)}</td>
                          <td>${(b.price * b.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div className="text-muted small">
                      <strong>Ship to:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <strong className="text-primary fs-5">${order.totalPrice.toFixed(2)}</strong>
                      {(order.orderStatus === 'Processing' || order.orderStatus === 'Shipped') && (
                        <Button variant="outline-danger" size="sm" onClick={() => setCancelTarget(order._id)}>Cancel</Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <ConfirmDialog
        show={!!cancelTarget}
        title="Cancel Order"
        message="Are you sure you want to cancel this order?"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
        confirmText="Cancel Order"
      />
    </Container>
  );
}
