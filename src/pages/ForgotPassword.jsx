import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Envelope } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    toast.success('Password reset link sent to your email');
  }

  return (
    <Container className="py-5">
      <div className="auth-wrapper mx-auto">
        <Card className="auth-card border-0 shadow-lg">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Forgot Password</h2>
              <p className="text-muted">Enter your email to receive a reset link</p>
            </div>
            {sent ? (
              <Alert variant="success">
                A password reset link has been sent to <strong>{email}</strong>. Please check your inbox.
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100 py-2">Send Reset Link</Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
