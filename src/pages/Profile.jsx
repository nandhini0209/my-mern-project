import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { Envelope, Person, Calendar, ShieldCheck } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';
import AppBreadcrumb from '../components/AppBreadcrumb';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Container className="py-4">
      <AppBreadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Profile' }]} />

      <h1 className="fw-bold mb-4">My Profile</h1>

      <Row className="g-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-4">
            <div className="profile-avatar mx-auto mb-3">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h4 className="fw-bold mb-1">{user.name}</h4>
            <p className="text-muted mb-2">{user.email}</p>
            <Badge bg={user.role === 'Admin' ? 'danger' : 'primary'} className="px-3 py-2">
              <ShieldCheck className="me-1" /> {user.role}
            </Badge>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Account Information</h5>
            <Row className="g-3">
              <Col md={6}>
                <div className="info-item">
                  <Person className="me-2 text-muted" />
                  <div>
                    <small className="text-muted d-block">Full Name</small>
                    <strong>{user.name}</strong>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="info-item">
                  <Envelope className="me-2 text-muted" />
                  <div>
                    <small className="text-muted d-block">Email Address</small>
                    <strong>{user.email}</strong>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="info-item">
                  <ShieldCheck className="me-2 text-muted" />
                  <div>
                    <small className="text-muted d-block">Role</small>
                    <strong>{user.role}</strong>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="info-item">
                  <Calendar className="me-2 text-muted" />
                  <div>
                    <small className="text-muted d-block">Member Since</small>
                    <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
