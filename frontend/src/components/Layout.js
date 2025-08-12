import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Container, 
  Row, 
  Col, 
  Navbar, 
  Nav, 
  NavDropdown, 
  Offcanvas,
  Badge,
  Button,
  Dropdown,
  Card
} from 'react-bootstrap';
import {
  Home,
  Users,
  Calendar,
  UserCheck,
  Pill,
  TestTube,
  CreditCard,
  Bed,
  AlertTriangle,
  Scissors,
  Heart,
  Clock,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Settings
} from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Doctors', href: '/doctors', icon: UserCheck },
    { name: 'Pharmacy', href: '/pharmacy', icon: Pill },
    { name: 'Laboratory', href: '/laboratory', icon: TestTube },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'IPD', href: '/ipd', icon: Bed },
    { name: 'Emergency', href: '/emergency', icon: AlertTriangle },
    { name: 'Operation Theater', href: '/ot', icon: Scissors },
    { name: 'ICU', href: '/icu', icon: Heart },
    { name: 'Roster', href: '/roster', icon: Clock },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`sidebar d-none d-lg-flex flex-column flex-shrink-0 p-3 text-white`} style={{width: '280px'}}>
        <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <div className="d-flex align-items-center">
            <div className="bg-white rounded-circle p-2 me-3">
              <Heart size={24} className="text-primary" />
            </div>
            <div>
              <h5 className="mb-0 text-white">HMS</h5>
              <small className="text-white-50">Hospital Management</small>
            </div>
          </div>
        </div>
        <hr className="text-white-50" />
        <Nav className="nav-pills flex-column mb-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Nav.Item key={item.name}>
                <Link
                  to={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={18} className="me-2" />
                  {item.name}
                </Link>
              </Nav.Item>
            );
          })}
        </Nav>
        <hr className="text-white-50" />
        <div className="dropdown">
          <Dropdown>
            <Dropdown.Toggle variant="link" className="nav-link text-white text-decoration-none dropdown-toggle">
              <User size={18} className="me-2" />
              {user?.full_name || 'User'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#profile">
                <User size={16} className="me-2" />
                Profile
              </Dropdown.Item>
              <Dropdown.Item href="#settings">
                <Settings size={16} className="me-2" />
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <LogOut size={16} className="me-2" />
                Sign out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Offcanvas show={sidebarOpen} onHide={() => setSidebarOpen(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <div className="d-flex align-items-center">
              <Heart size={24} className="text-primary me-2" />
              Hospital Management System
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="nav-pills flex-column">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Nav.Item key={item.name}>
                  <Link
                    to={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={18} className="me-2" />
                    {item.name}
                  </Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Top Navigation */}
        <Navbar bg="white" expand="lg" className="border-bottom shadow-sm">
          <Container fluid>
            <Button
              variant="outline-secondary"
              className="d-lg-none me-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>
            
            <Navbar.Brand className="d-none d-lg-block">
              <h5 className="mb-0 text-primary">Hospital Management System</h5>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ms-auto">
                <Nav.Item className="me-3">
                  <Button variant="outline-secondary" size="sm" className="position-relative">
                    <Bell size={18} />
                    <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill" style={{fontSize: '0.6rem'}}>
                      3
                    </Badge>
                  </Button>
                </Nav.Item>
                
                <NavDropdown 
                  title={
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle p-1 me-2">
                        <User size={16} className="text-white" />
                      </div>
                      <span>{user?.full_name || 'User'}</span>
                    </div>
                  } 
                  id="user-dropdown"
                >
                  <NavDropdown.Item href="#profile">
                    <User size={16} className="me-2" />
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#settings">
                    <Settings size={16} className="me-2" />
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <LogOut size={16} className="me-2" />
                    Sign out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Page Content */}
        <div className="p-4">
          <Container fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Layout; 