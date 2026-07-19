import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, InputGroup } from 'react-bootstrap';
import { Envelope, Lock, Eye, EyeSlash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'Admin') navigate('/admin/dashboard');
      else navigate(from);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(role) {
    if (role === 'admin') setForm({ email: 'admin@bookstore.com', password: 'admin123' });
    else setForm({ email: 'user@bookstore.com', password: 'user123' });
  }

  return (
    <Container className="py-5">
      <div className="auth-wrapper mx-auto">
        <Card className="auth-card border-0 shadow-lg">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Welcome Back</h2>
              <p className="text-muted">Sign in to your BookHaven account</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <InputGroup>
                  <InputGroup.Text><Envelope /></InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text><Lock /></InputGroup.Text>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                  />
                  <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check type="checkbox" label="Remember me" />
                <Link to="/forgot-password" className="small text-decoration-none">Forgot password?</Link>
              </div>

              <Button type="submit" variant="primary" className="w-100 py-2 mb-3" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>

            <div className="text-center mb-3">
              <span className="text-muted small">Demo accounts:</span>
            </div>
            <div className="d-flex gap-2 mb-4">
              <Button variant="outline-secondary" size="sm" className="w-100" onClick={() => fillDemo('user')}>User Demo</Button>
              <Button variant="outline-secondary" size="sm" className="w-100" onClick={() => fillDemo('admin')}>Admin Demo</Button>
            </div>

            <p className="text-center text-muted mb-0">
              Don't have an account? <Link to="/register" className="fw-semibold text-decoration-none">Sign up free</Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
