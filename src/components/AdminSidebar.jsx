import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Speedometer2, BookFill, CartCheckFill, PersonBadge } from 'react-bootstrap-icons';

export default function AdminSidebar() {
  const location = useLocation();
  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <Speedometer2 /> },
    { to: '/admin/books', label: 'Manage Books', icon: <BookFill /> },
    { to: '/admin/orders', label: 'Manage Orders', icon: <CartCheckFill /> },
    { to: '/admin/users', label: 'Users', icon: <PersonBadge /> },
  ];

  return (
    <div className="admin-sidebar py-3">
      <h6 className="text-uppercase text-muted px-3 mb-3 small fw-bold">Admin Panel</h6>
      <Nav className="flex-column">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Nav.Link
              key={link.to}
              as={Link}
              to={link.to}
              className={`admin-nav-link ${active ? 'active' : ''}`}
            >
              <span className="me-2">{link.icon}</span> {link.label}
            </Nav.Link>
          );
        })}
      </Nav>
    </div>
  );
}
