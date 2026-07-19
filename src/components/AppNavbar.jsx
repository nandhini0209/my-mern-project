import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, Button, Badge } from 'react-bootstrap';
import { Search, Cart3, PersonCircle, BoxArrowRight, ShieldCheck, BookHalf } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) navigate(`/books?search=${encodeURIComponent(search.trim())}`);
  }

  return (
    <Navbar expand="lg" sticky="top" className="navbar-custom shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2">
          <BookHalf size={24} className="text-primary" />
          <span className="brand-text">BookHaven</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/books">Books</Nav.Link>
            {user && <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>}
            {user?.role === 'Admin' && <Nav.Link as={Link} to="/admin/dashboard">Admin</Nav.Link>}
          </Nav>

          <Form className="d-flex me-2 my-2 my-lg-0" onSubmit={handleSearch} style={{ maxWidth: 260 }}>
            <Form.Control
              type="search"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="me-2"
              aria-label="Search"
            />
            <Button type="submit" variant="outline-primary"><Search /></Button>
          </Form>

          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/cart" className="position-relative px-2">
              <Cart3 size={22} />
              {totalItems > 0 && (
                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.65rem' }}>
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>
            {user ? (
              <NavDropdown title={<><PersonCircle size={20} className="me-1" />{user.name.split(' ')[0]}</>} align="end">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">My Orders</NavDropdown.Item>
                {user.role === 'Admin' && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin/dashboard"><ShieldCheck className="me-2" />Admin Dashboard</NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}><BoxArrowRight className="me-2" />Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-primary text-white px-3 ms-2">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
