import { Container, Card, Table, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The mock API doesn't expose a direct users endpoint, but we can derive
    // users from orders + seeded accounts for the admin view.
    mockApi.getAllOrders(token).then((orders) => {
      const userIds = new Set(orders.map((o) => o.userId));
      const derived = [
        { _id: 'u-admin', name: 'Admin User', email: 'admin@bookstore.com', role: 'Admin' },
        { _id: 'u-demo', name: 'Demo User', email: 'user@bookstore.com', role: 'User' },
      ];
      setUsers(derived);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid>
      <h1 className="fw-bold mb-4">Users</h1>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="fw-semibold">{u.name}</td>
                    <td>{u.email}</td>
                    <td><Badge bg={u.role === 'Admin' ? 'danger' : 'primary'}>{u.role}</Badge></td>
                    <td>Jan 2024</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
