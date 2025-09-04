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
  Settings,
  ChevronRight,
  CalendarDays,
  Shield
} from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Define all navigation items with their required permissions/functions
  const allNavigation = [
    { name: 'Dashboard', href: '/', icon: Home, requiredPermission: null }, // Dashboard is always accessible
    { name: 'Patients', href: '/patients', icon: Users, requiredPermission: 'patient.read' },
    { name: 'Appointments', href: '/appointments', icon: Calendar, requiredPermission: 'appointment.read' },
    { name: 'Doctors', href: '/doctors', icon: UserCheck, requiredPermission: 'user.read' }, // Using user.read for doctors
    { name: 'Doctor Schedules', href: '/doctor-schedules', icon: CalendarDays, requiredPermission: 'user.read' }, // Using user.read for doctor schedules
    { name: 'Pharmacy', href: '/pharmacy', icon: Pill, requiredPermission: null }, // No pharmacy permissions yet
    { name: 'Laboratory', href: '/laboratory', icon: TestTube, requiredPermission: 'lab.read' },
    { name: 'Billing', href: '/billing', icon: CreditCard, requiredPermission: null }, // No billing permissions yet
    { name: 'IPD', href: '/ipd', icon: Bed, requiredPermission: 'ipd.read' },
    { name: 'Emergency', href: '/emergency', icon: AlertTriangle, requiredPermission: 'emergency.read' },
    { name: 'Operation Theater', href: '/ot', icon: Scissors, requiredPermission: 'ot.read' },
    { name: 'ICU', href: '/icu', icon: Heart, requiredPermission: 'icu.read' },
    { name: 'Roster', href: '/roster', icon: Clock, requiredPermission: 'roster.read' },
    { name: 'Reports', href: '/reports', icon: BarChart3, requiredPermission: 'reports.view' },
    { name: 'Role Management', href: '/roles', icon: Settings, requiredPermission: 'role.read' },
  ];

  // Filter navigation based on user permissions
  const navigation = allNavigation.filter(item => {
    // Dashboard is always accessible
    if (!item.requiredPermission) return true;
    
    // If user is not loaded yet, show all items temporarily
    if (!user) return true;
    
    // If user has no permissions, only show dashboard
    if (!user.permissions || user.permissions.length === 0) return false;
    
    // Check if user has the required permission
    return user.permissions.some(permission => 
      permission.permission_key === item.requiredPermission
    );
  });

  // Helper function to check if user has a specific permission
  const hasPermission = (permissionKey) => {
    if (!user?.permissions) return false;
    return user.permissions.some(permission => permission.permission_key === permissionKey);
  };

  // Helper function to check if user has any of the specified permissions
  const hasAnyPermission = (permissionKeys) => {
    if (!user?.permissions || !permissionKeys) return false;
    return user.permissions.some(permission => permissionKeys.includes(permission.permission_key));
  };

  // Get accessible menu count
  const accessibleMenuCount = navigation.filter(item => 
    !item.requiredPermission || hasPermission(item.requiredPermission)
  ).length;

  // Debug: Log user permissions (only in development)
  if (user && process.env.NODE_ENV === 'development') {
    console.log('User permissions:', user.permissions?.map(p => p.permission_key));
    console.log('Filtered navigation:', navigation.map(n => n.name));
    console.log('Accessible modules:', accessibleMenuCount);
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`sidebar d-none d-lg-flex flex-column flex-shrink-0 p-4 text-white`} style={{width: '300px'}}>
        {/* Logo Section */}
        <div className="d-flex align-items-center mb-4 text-white text-decoration-none">
          <div className="d-flex align-items-center">
            <div className="bg-white rounded-circle p-3 me-3 shadow-lg" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(10px)'
            }}>
              <Heart size={28} className="text-primary" />
            </div>
            <div>
              <h4 className="mb-0 text-white fw-bold">HMS</h4>
              <small className="text-white-50 fw-medium">Hospital Management</small>
            </div>
          </div>
        </div>
        
        <hr className="text-white-50 opacity-25" style={{ margin: '1.5rem 0' }} />
        
        {/* Navigation */}
        <Nav className="nav-pills flex-column mb-auto">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            const hasAccess = !item.requiredPermission || hasPermission(item.requiredPermission);
            
            return (
              <Nav.Item key={item.name} className="mb-2">
                <Link
                  to={item.href}
                  className={`nav-link d-flex align-items-center justify-content-between ${isActive ? 'active' : ''} ${!hasAccess ? 'opacity-50' : ''}`}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-lg)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  title={!hasAccess ? `Requires permission: ${item.requiredPermission}` : ''}
                >
                  <div className="d-flex align-items-center">
                    <item.icon size={20} className="me-3" />
                    <span className="fw-medium">{item.name}</span>
                    {!hasAccess && (
                      <Badge bg="warning" className="ms-2 small">
                        <small>Restricted</small>
                      </Badge>
                    )}
                  </div>
                  {isActive && (
                    <ChevronRight size={16} className="opacity-75" />
                  )}
                </Link>
              </Nav.Item>
            );
          })}
        </Nav>
        
        <hr className="text-white-50 opacity-25" style={{ margin: '1.5rem 0' }} />
        
        {/* User Profile */}
        <div className="dropdown">
          <Dropdown>
            <Dropdown.Toggle 
              variant="link" 
              className="nav-link text-white text-decoration-none dropdown-toggle d-flex align-items-center w-100 p-3 rounded-3"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="bg-white rounded-circle p-2 me-3">
                <User size={18} className="text-primary" />
              </div>
              <div className="flex-grow-1 text-start">
                <div className="fw-semibold">{user?.full_name || 'User'}</div>
                <small className="text-white-50">{user?.role_name || 'Admin'}</small>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow-lg border-0" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Dropdown.Item href="#profile" className="py-2">
                <User size={16} className="me-2 text-primary" />
                Profile
              </Dropdown.Item>
              <Dropdown.Item href="#settings" className="py-2">
                <Settings size={16} className="me-2 text-primary" />
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="py-2 text-danger">
                <LogOut size={16} className="me-2" />
                Sign out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Offcanvas 
        show={sidebarOpen} 
        onHide={() => setSidebarOpen(false)} 
        placement="start"
        className="glass"
        style={{
          background: 'linear-gradient(180deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Offcanvas.Header closeButton className="text-white">
          <Offcanvas.Title>
            <div className="d-flex align-items-center">
              <div className="bg-white rounded-circle p-2 me-3">
                <Heart size={24} className="text-primary" />
              </div>
              <div>
                <h5 className="mb-0 text-white fw-bold">HMS</h5>
                <small className="text-white-50">Hospital Management</small>
              </div>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="text-white">
          <Nav className="nav-pills flex-column">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Nav.Item key={item.name} className="mb-2">
                  <Link
                    to={item.href}
                    className={`nav-link d-flex align-items-center ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <item.icon size={20} className="me-3" />
                    <span className="fw-medium">{item.name}</span>
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
        <Navbar 
          bg="white" 
          expand="lg" 
          className="border-bottom shadow-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.95) !important',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--gray-200)'
          }}
        >
          <Container fluid>
            <Button
              variant="outline-secondary"
              className="d-lg-none me-3 shadow-sm"
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '2px solid var(--gray-200)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <Menu size={20} />
            </Button>
            
            <Navbar.Brand className="d-none d-lg-block">
              <h5 className="mb-0 gradient-text fw-bold">Hospital Management System</h5>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ms-auto">
                <Nav.Item className="me-3">
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="position-relative shadow-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid var(--gray-200)',
                      borderRadius: 'var(--radius-lg)'
                    }}
                  >
                    <Bell size={18} />
                    <Badge 
                      bg="danger" 
                      className="position-absolute top-0 start-100 translate-middle rounded-pill fw-semibold" 
                      style={{fontSize: '0.6rem'}}
                    >
                      3
                    </Badge>
                  </Button>
                </Nav.Item>
                
                <NavDropdown 
                  title={
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle p-2 me-2 shadow-sm" style={{
                        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)'
                      }}>
                        <User size={16} className="text-white" />
                      </div>
                      <span className="fw-semibold">{user?.full_name || 'User'}</span>
                    </div>
                  } 
                  id="user-dropdown"
                  className="shadow-sm"
                >
                  <NavDropdown.Header className="py-2">
                    <div className="small text-muted">
                      <strong>Role:</strong> {user?.roles?.[0]?.role_name || 'No Role'}
                    </div>
                    <div className="small text-muted">
                      <strong>Permissions:</strong> {user?.permissions?.length || 0}
                    </div>
                    <div className="small text-muted">
                      <strong>Accessible Modules:</strong> {accessibleMenuCount}
                    </div>
                  </NavDropdown.Header>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#profile" className="py-2">
                    <User size={16} className="me-2 text-primary" />
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#settings" className="py-2">
                    <Settings size={16} className="me-2 text-primary" />
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#permissions" className="py-2">
                    <Shield size={16} className="me-2 text-info" />
                    View Permissions
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="py-2 text-danger">
                    <LogOut size={16} className="me-2" />
                    Sign out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Page Content */}
        <div className="p-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <Container fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Layout; 