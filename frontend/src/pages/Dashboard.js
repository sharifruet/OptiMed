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
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Patients',
      value: '1,234',
      icon: Users,
      color: 'primary',
      trend: '+12%',
      trendUp: true
    },
    {
      name: 'Today\'s Appointments',
      value: '45',
      icon: Calendar,
      color: 'success',
      trend: '+5%',
      trendUp: true
    },
    {
      name: 'Revenue Today',
      value: '৳125,000',
      icon: CreditCard,
      color: 'warning',
      trend: '+8%',
      trendUp: true
    },
    {
      name: 'IPD Patients',
      value: '89',
      icon: Bed,
      color: 'info',
      trend: '-2%',
      trendUp: false
    },
    {
      name: 'Emergency Cases',
      value: '12',
      icon: AlertTriangle,
      color: 'danger',
      trend: '+15%',
      trendUp: true
    },
  ];

  const recentActivities = [
    {
      action: 'New patient registered',
      time: '2 minutes ago',
      type: 'success',
      user: 'Dr. Ahmed'
    },
    {
      action: 'Appointment scheduled',
      time: '15 minutes ago',
      type: 'info',
      user: 'Nurse Fatima'
    },
    {
      action: 'Payment received',
      time: '1 hour ago',
      type: 'warning',
      user: 'Admin'
    },
    {
      action: 'Lab report completed',
      time: '2 hours ago',
      type: 'primary',
      user: 'Lab Tech'
    },
  ];

  const quickActions = [
    { name: 'Register New Patient', icon: Users, color: 'primary' },
    { name: 'Schedule Appointment', icon: Calendar, color: 'success' },
    { name: 'Process Payment', icon: CreditCard, color: 'warning' },
    { name: 'View Reports', icon: Activity, color: 'info' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Welcome to Hospital Management System</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm">
            <Activity size={16} className="me-2" />
            Generate Report
          </Button>
          <Button variant="primary" size="sm">
            <Calendar size={16} className="me-2" />
            Today's Schedule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col key={index} xs={12} sm={6} lg={4} xl={2} className="mb-3">
            <Card className="stats-card h-100 border-0 shadow-sm">
              <CardBody className="p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <div className={`bg-${stat.color} bg-opacity-10 rounded-circle p-2 me-3`}>
                        <stat.icon size={20} className={`text-${stat.color}`} />
                      </div>
                      <div className="d-flex align-items-center">
                        {stat.trendUp ? (
                          <TrendingUp size={14} className="text-success me-1" />
                        ) : (
                          <TrendingDown size={14} className="text-danger me-1" />
                        )}
                        <small className={`text-${stat.trendUp ? 'success' : 'danger'}`}>
                          {stat.trend}
                        </small>
                      </div>
                    </div>
                    <h4 className="mb-1 fw-bold">{stat.value}</h4>
                    <p className="text-muted mb-0 small">{stat.name}</p>
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
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-light">
              <h5 className="mb-0">Quick Actions</h5>
            </CardHeader>
            <CardBody>
              <div className="d-grid gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline-secondary"
                    className="text-start d-flex align-items-center"
                    size="lg"
                  >
                    <action.icon size={18} className={`text-${action.color} me-3`} />
                    {action.name}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-light">
              <h5 className="mb-0">Recent Activity</h5>
            </CardHeader>
            <CardBody className="p-0">
              <ListGroup variant="flush">
                {recentActivities.map((activity, index) => (
                  <ListGroupItem key={index} className="border-0 px-3 py-3">
                    <div className="d-flex align-items-start">
                      <div className={`bg-${activity.type} bg-opacity-10 rounded-circle p-1 me-3 mt-1`}>
                        <div className={`bg-${activity.type} rounded-circle`} style={{width: '8px', height: '8px'}}></div>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-medium">{activity.action}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">{activity.user}</small>
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
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-light">
              <h5 className="mb-0">System Status</h5>
            </CardHeader>
            <CardBody>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">Database</span>
                  <Badge bg="success">Online</Badge>
                </div>
                <ProgressBar variant="success" now={95} className="mb-3" />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">Server Load</span>
                  <Badge bg="warning">Medium</Badge>
                </div>
                <ProgressBar variant="warning" now={65} className="mb-3" />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">Storage</span>
                  <Badge bg="info">75%</Badge>
                </div>
                <ProgressBar variant="info" now={75} className="mb-3" />
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">Network</span>
                  <Badge bg="success">Stable</Badge>
                </div>
                <ProgressBar variant="success" now={88} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats Row */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-light">
              <h5 className="mb-0">Department Overview</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs={6} className="text-center mb-3">
                  <div className="p-3 bg-primary bg-opacity-10 rounded">
                    <h3 className="text-primary mb-1">12</h3>
                    <small className="text-muted">Active Doctors</small>
                  </div>
                </Col>
                <Col xs={6} className="text-center mb-3">
                  <div className="p-3 bg-success bg-opacity-10 rounded">
                    <h3 className="text-success mb-1">8</h3>
                    <small className="text-muted">Available Beds</small>
                  </div>
                </Col>
                <Col xs={6} className="text-center">
                  <div className="p-3 bg-warning bg-opacity-10 rounded">
                    <h3 className="text-warning mb-1">5</h3>
                    <small className="text-muted">Pending Tests</small>
                  </div>
                </Col>
                <Col xs={6} className="text-center">
                  <div className="p-3 bg-info bg-opacity-10 rounded">
                    <h3 className="text-info mb-1">3</h3>
                    <small className="text-muted">Scheduled Surgeries</small>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-light">
              <h5 className="mb-0">Today's Summary</h5>
            </CardHeader>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Appointments</span>
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2">45</span>
                  <Badge bg="success">+12%</Badge>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Admissions</span>
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2">8</span>
                  <Badge bg="primary">+3</Badge>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Discharges</span>
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2">6</span>
                  <Badge bg="info">+1</Badge>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Emergency Cases</span>
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2">12</span>
                  <Badge bg="danger">+5</Badge>
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