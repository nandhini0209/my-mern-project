import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HouseDoor } from 'react-bootstrap-icons';

export default function NotFound() {
  return (
    <Container className="py-5 text-center">
      <div className="py-5">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h2 className="fw-bold mb-3">Page Not Found</h2>
        <p className="text-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
        <Button as={Link} to="/" variant="primary" size="lg">
          <HouseDoor className="me-2" /> Back to Home
        </Button>
      </div>
    </Container>
  );
}
