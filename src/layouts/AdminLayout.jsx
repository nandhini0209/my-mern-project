import { Outlet } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';
import AppNavbar from '../components/AppNavbar';
import AppFooter from '../components/AppFooter';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AppNavbar />
      <Container fluid className="flex-grow-1 py-4">
        <Row className="g-4">
          <Col lg={2} className="d-none d-lg-block">
            <div className="admin-sidebar-wrapper sticky-top" style={{ top: '80px' }}>
              <AdminSidebar />
            </div>
          </Col>
          <Col lg={10}>
            <Outlet />
          </Col>
        </Row>
        <div className="d-lg-none mb-3">
          <AdminSidebar />
        </div>
      </Container>
      <AppFooter />
    </div>
  );
}
