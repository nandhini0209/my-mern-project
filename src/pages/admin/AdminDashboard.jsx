import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BookFill, CartCheckFill, CurrencyDollar, PeopleFill } from 'react-bootstrap-icons';
import { mockApi } from '../../services/mockApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      mockApi.getBooks({ limit: 1000 }),
      mockApi.getAllOrders(token),
    ]).then(([booksData, orders]) => {
      const totalRevenue = orders.filter(o => o.orderStatus !== 'Cancelled').reduce((s, o) => s + o.totalPrice, 0);
      setStats({
        totalBooks: booksData.total,
        totalOrders: orders.length,
        totalRevenue,
        totalUsers: 2,
        recentOrders: orders.slice(0, 5),
      });
    });
  }, [token]);

  if (!stats) return <LoadingSpinner />;

  const cards = [
    { label: 'Total Books', value: stats.totalBooks, icon: <BookFill />, color: 'success' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <CartCheckFill />, color: 'primary' },
    { label: 'Revenue', value: `${stats.totalRevenue.toFixed(2)}`, icon: <CurrencyDollar />, color: 'warning' },
    { label: 'Users', value: stats.totalUsers, icon: <PeopleFill />, color: 'info' },
  ];

  return (
    <Container fluid>
      <h1 className="fw-bold mb-4">Dashboard</h1>

      <Row className="g-3 mb-4">
        {cards.map((c, i) => (
          <Col sm={6} lg={3} key={i}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className={`stat-icon bg-${c.color}-subtle text-${c.color} rounded-3 d-flex align-items-center justify-content-center me-3`}>
                  {c.icon}
                </div>
                <div>
                  <p className="text-muted mb-0 small">{c.label}</p>
                  <h3 className="fw-bold mb-0">{c.value}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3">Recent Orders</h5>
          {stats.recentOrders.length === 0 ? (
            <p className="text-muted">No orders yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td>#{o._id}</td>
                      <td>{o.books.length}</td>
                      <td>${o.totalPrice.toFixed(2)}</td>
                      <td><span className={`badge bg-${o.orderStatus === 'Delivered' ? 'success' : o.orderStatus === 'Cancelled' ? 'danger' : 'info'}`}>{o.orderStatus}</span></td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
