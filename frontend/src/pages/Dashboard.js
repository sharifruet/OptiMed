import React from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  ProgressBar,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';
import {
  Users,
  Calendar,
  CreditCard,
  Bed,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Plus,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Patients',
      value: '1,234',
      icon: Users,
      color: 'primary',
      trend: '+12%',
      trendUp: true,
      bgGradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)'
    },
    {
      name: 'Today\'s Appointments',
      value: '45',
      icon: Calendar,
      color: 'success',
      trend: '+5%',
      trendUp: true,
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
    },
    {
      name: 'Revenue Today',
      value: '৳125,000',
      icon: CreditCard,
      color: 'warning',
      trend: '+8%',
      trendUp: true,
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)'
    },
    {
      name: 'IPD Patients',
      value: '89',
      icon: Bed,
      color: 'info',
      trend: '-2%',
      trendUp: false,
      bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)'
    },
    {
      name: 'Emergency Cases',
      value: '12',
      icon: AlertTriangle,
      color: 'danger',
      trend: '+15%',
      trendUp: true,
      bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)'
    },
  ];

  const recentActivities = [
    {
      action: 'New patient registered',
      time: '2 minutes ago',
      type: 'success',
      user: 'Dr. Ahmed',
      icon: Users
    },
    {
      action: 'Appointment scheduled',
      time: '15 minutes ago',
      type: 'info',
      user: 'Nurse Fatima',
      icon: Calendar
    },
    {
      action: 'Payment received',
      time: '1 hour ago',
      type: 'warning',
      user: 'Admin',
      icon: CreditCard
    },
    {
      action: 'Lab report completed',
      time: '2 hours ago',
      type: 'primary',
      user: 'Lab Tech',
      icon: FileText
    },
  ];

  const quickActions = [
    { name: 'Register New Patient', icon: Users, color: 'primary', gradient: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)' },
    { name: 'Schedule Appointment', icon: Calendar, color: 'success', gradient: 'linear-gradient(135deg, var(--success-color) 0%, #059669 100%)' },
    { name: 'Process Payment', icon: CreditCard, color: 'warning', gradient: 'linear-gradient(135deg, var(--warning-color) 0%, #d97706 100%)' },
    { name: 'View Reports', icon: Activity, color: 'info', gradient: 'linear-gradient(135deg, var(--info-color) 0%, #0891b2 100%)' },
  ];

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-3" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div>
          <h2 className="mb-1 gradient-text">Dashboard</h2>
          <p className="text-muted mb-0">Welcome to Hospital Management System</p>
        </div>
        <div className="d-flex gap-3">
          <Button 
            variant="outline-primary" 
            size="sm"
            className="shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '2px solid var(--primary-color)',
              color: 'var(--primary-color)'
            }}
          >
            <Activity size={16} className="me-2" />
            Generate Report
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            className="shadow-sm"
            style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
              border: 'none'
            }}
          >
            <Calendar size={16} className="me-2" />
            Today's Schedule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col key={index} xs={12} sm={6} lg={4} xl={2} className="mb-3">
            <Card className="stats-card h-100 border-0 shadow-lg glass" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardBody className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="rounded-circle p-3 me-3 shadow-sm"
                        style={{ background: stat.bgGradient }}
                      >
                        <stat.icon size={24} className={`text-${stat.color}`} />
                      </div>
                      <div className="d-flex align-items-center">
                        {stat.trendUp ? (
                          <TrendingUp size={16} className="text-success me-1" />
                        ) : (
                          <TrendingDown size={16} className="text-danger me-1" />
                        )}
                        <Badge 
                          bg={stat.trendUp ? 'success' : 'danger'}
                          className="fw-semibold"
                          style={{ fontSize: '0.7rem' }}
                        >
                          {stat.trend}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="mb-1 fw-bold gradient-text">{stat.value}</h3>
                    <p className="text-muted mb-0 fw-medium">{stat.name}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Row */}
      <Row>
        {/* Quick Actions */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-lg glass">
            <CardHeader className="border-0 pb-0">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                  <Plus size={20} className="text-primary" />
                </div>
                <h5 className="mb-0 fw-semibold">Quick Actions</h5>
              </div>
            </CardHeader>
            <CardBody className="pt-3">
              <div className="d-grid gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline-secondary"
                    className="text-start d-flex align-items-center py-3 shadow-sm"
                    size="lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid var(--gray-200)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = action.gradient;
                      e.target.style.color = 'white';
                      e.target.style.borderColor = 'transparent';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                      e.target.style.color = 'var(--gray-700)';
                      e.target.style.borderColor = 'var(--gray-200)';
                    }}
                  >
                    <action.icon size={20} className={`text-${action.color} me-3`} />
                    <span className="fw-medium">{action.name}</span>
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-lg glass">
            <CardHeader className="border-0 pb-0">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                  <Clock size={20} className="text-success" />
                </div>
                <h5 className="mb-0 fw-semibold">Recent Activity</h5>
              </div>
            </CardHeader>
            <CardBody className="p-0 pt-3">
              <ListGroup variant="flush">
                {recentActivities.map((activity, index) => (
                  <ListGroupItem key={index} className="border-0 px-4 py-3" style={{
                    background: 'transparent',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(14, 165, 233, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                  >
                    <div className="d-flex align-items-start">
                      <div className={`bg-${activity.type} bg-opacity-10 rounded-circle p-2 me-3 mt-1`}>
                        <activity.icon size={16} className={`text-${activity.type}`} />
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-semibold">{activity.action}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted fw-medium">{activity.user}</small>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                      </div>
                    </div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>

        {/* System Status */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-lg glass">
            <CardHeader className="border-0 pb-0">
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                  <BarChart3 size={20} className="text-info" />
                </div>
                <h5 className="mb-0 fw-semibold">System Status</h5>
              </div>
            </CardHeader>
            <CardBody className="pt-3">
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-medium">Database</span>
                  <Badge bg="success" className="fw-semibold">Online</Badge>
                </div>
                <ProgressBar 
                  variant="success" 
                  now={95} 
                  className="mb-3 shadow-sm" 
                  style={{ height: '8px', borderRadius: 'var(--radius-lg)' }}
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-medium">Server Load</span>
                  <Badge bg="warning" className="fw-semibold">Medium</Badge>
                </div>
                <ProgressBar 
                  variant="warning" 
                  now={65} 
                  className="mb-3 shadow-sm" 
                  style={{ height: '8px', borderRadius: 'var(--radius-lg)' }}
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-medium">Storage</span>
                  <Badge bg="info" className="fw-semibold">75%</Badge>
                </div>
                <ProgressBar 
                  variant="info" 
                  now={75} 
                  className="mb-3 shadow-sm" 
                  style={{ height: '8px', borderRadius: 'var(--radius-lg)' }}
                />
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-medium">Network</span>
                  <Badge bg="success" className="fw-semibold">Stable</Badge>
                </div>
                <ProgressBar 
                  variant="success" 
                  now={88} 
                  className="shadow-sm" 
                  style={{ height: '8px', borderRadius: 'var(--radius-lg)' }}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats Row */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-lg glass">
            <CardHeader className="border-0 pb-0">
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                  <Users size={20} className="text-warning" />
                </div>
                <h5 className="mb-0 fw-semibold">Department Overview</h5>
              </div>
            </CardHeader>
            <CardBody className="pt-3">
              <Row>
                <Col xs={6} className="text-center mb-3">
                  <div className="p-4 rounded-3 shadow-sm" style={{
                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
                    border: '1px solid rgba(14, 165, 233, 0.2)'
                  }}>
                    <h3 className="text-primary mb-1 fw-bold">12</h3>
                    <small className="text-muted fw-medium">Active Doctors</small>
                  </div>
                </Col>
                <Col xs={6} className="text-center mb-3">
                  <div className="p-4 rounded-3 shadow-sm" style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <h3 className="text-success mb-1 fw-bold">8</h3>
                    <small className="text-muted fw-medium">Available Beds</small>
                  </div>
                </Col>
                <Col xs={6} className="text-center">
                  <div className="p-4 rounded-3 shadow-sm" style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.2)'
                  }}>
                    <h3 className="text-warning mb-1 fw-bold">5</h3>
                    <small className="text-muted fw-medium">Pending Tests</small>
                  </div>
                </Col>
                <Col xs={6} className="text-center">
                  <div className="p-4 rounded-3 shadow-sm" style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                    border: '1px solid rgba(6, 182, 212, 0.2)'
                  }}>
                    <h3 className="text-info mb-1 fw-bold">3</h3>
                    <small className="text-muted fw-medium">Scheduled Surgeries</small>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-lg glass">
            <CardHeader className="border-0 pb-0">
              <div className="d-flex align-items-center">
                <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3">
                  <CheckCircle size={20} className="text-danger" />
                </div>
                <h5 className="mb-0 fw-semibold">Today's Summary</h5>
              </div>
            </CardHeader>
            <CardBody className="pt-3">
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-3" style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <span className="fw-semibold">Appointments</span>
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2 fs-5">45</span>
                  <Badge bg="success" className="fw-semibold">+12%</Badge>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-3" style={{
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
                border: '1px solid rgba(14, 165, 233, 0.2)'
              }}>
                <span className="fw-semibold">Admissions</span>
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2 fs-5">8</span>
                  <Badge bg="primary" className="fw-semibold">+3</Badge>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-3" style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}>
                <span className="fw-semibold">Discharges</span>
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2 fs-5">6</span>
                  <Badge bg="info" className="fw-semibold">+1</Badge>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <span className="fw-semibold">Emergency Cases</span>
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2 fs-5">12</span>
                  <Badge bg="danger" className="fw-semibold">+5</Badge>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 