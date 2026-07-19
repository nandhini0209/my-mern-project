import { useEffect, useState, useCallback } from 'react';
import { Container, Card, Table, Badge, Form, Button } from 'react-bootstrap';
import { mockApi } from '../../services/mockApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_COLORS = {
  Processing: 'info',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'danger',
};
const STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function ManageOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const data = await mockApi.getAllOrders(token);
    setOrders(data);
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function handleStatusChange(orderId, newStatus) {
    try {
      await mockApi.updateOrderStatus(orderId, newStatus, token);
      setOrders(orders.map((o) => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Order status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid>
      <h1 className="fw-bold mb-4">Manage Orders</h1>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-muted py-4">No orders found.</td></tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id}>
                      <td className="fw-semibold">#{o._id}</td>
                      <td>{o.books.length} item(s)</td>
                      <td>${o.totalPrice.toFixed(2)}</td>
                      <td><Badge bg={o.paymentStatus === 'Paid' ? 'success' : 'warning'}>{o.paymentStatus}</Badge></td>
                      <td><Badge bg={STATUS_COLORS[o.orderStatus] || 'secondary'}>{o.orderStatus}</Badge></td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Form.Select size="sm" value={o.orderStatus} onChange={(e) => handleStatusChange(o._id, e.target.value)} style={{ width: 'auto' }}>
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </Form.Select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
