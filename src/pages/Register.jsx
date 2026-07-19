import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, InputGroup } from 'react-bootstrap';
import { Person, Envelope, Lock, Eye, EyeSlash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password });
      toast.success(`Welcome to BookHaven, ${user.name}!`);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-5">
      <div className="auth-wrapper mx-auto">
        <Card className="auth-card border-0 shadow-lg">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Create Account</h2>
              <p className="text-muted">Join BookHaven and start your reading journey</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text><Person /></InputGroup.Text>
                  <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <InputGroup>
                  <InputGroup.Text><Envelope /></InputGroup.Text>
                  <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text><Lock /></InputGroup.Text>
                  <Form.Control type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required placeholder="Min 6 characters" />
                  <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text><Lock /></InputGroup.Text>
                  <Form.Control type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Re-enter password" />
                </InputGroup>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 py-2 mb-3" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Form>

            <p className="text-center text-muted mb-0">
              Already have an account? <Link to="/login" className="fw-semibold text-decoration-none">Sign in</Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
