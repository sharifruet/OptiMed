import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Form, 
  FormControl, 
  InputGroup,
  Table,
  Badge,
  Dropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormLabel,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  ProgressBar
} from 'react-bootstrap';
import { 
  Search, 
  Download, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Activity,
  FileText,
  Printer,
  Share2,
  Settings,
  RefreshCw,
  Filter as FilterIcon,
  Calendar as CalendarIcon,
  Download as DownloadIcon,
  Eye as EyeIcon,
  BarChart,
  LineChart,
  PieChart as PieChartIcon,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState('this-month');

  // Mock reports data
  const reports = [
    {
      id: 1,
      title: 'Monthly Patient Admissions',
      type: 'Analytics',
      category: 'Patient Care',
      lastGenerated: '2024-01-20',
      status: 'Generated',
      format: 'PDF',
      size: '2.3 MB',
      description: 'Comprehensive report of patient admissions for the current month'
    },
    {
      id: 2,
      title: 'Revenue Analysis Report',
      type: 'Financial',
      category: 'Finance',
      lastGenerated: '2024-01-19',
      status: 'Generated',
      format: 'Excel',
      size: '1.8 MB',
      description: 'Detailed financial analysis including revenue, expenses, and profitability'
    },
    {
      id: 3,
      title: 'Staff Performance Report',
      type: 'HR',
      category: 'Human Resources',
      lastGenerated: '2024-01-18',
      status: 'Pending',
      format: 'PDF',
      size: '3.1 MB',
      description: 'Staff performance metrics and productivity analysis'
    },
    {
      id: 4,
      title: 'Inventory Status Report',
      type: 'Inventory',
      category: 'Operations',
      lastGenerated: '2024-01-17',
      status: 'Generated',
      format: 'Excel',
      size: '1.2 MB',
      description: 'Current inventory levels and stock management analysis'
    },
    {
      id: 5,
      title: 'Quality Metrics Report',
      type: 'Quality',
      category: 'Quality Assurance',
      lastGenerated: '2024-01-16',
      status: 'Generated',
      format: 'PDF',
      size: '2.7 MB',
      description: 'Quality indicators and patient satisfaction metrics'
    },
    {
      id: 6,
      title: 'Emergency Department Report',
      type: 'Clinical',
      category: 'Emergency',
      lastGenerated: '2024-01-15',
      status: 'Generated',
      format: 'PDF',
      size: '1.9 MB',
      description: 'Emergency department statistics and response times'
    }
  ];

  const reportCategories = [
    'Patient Care',
    'Finance',
    'Human Resources',
    'Operations',
    'Quality Assurance',
    'Emergency',
    'Laboratory',
    'Pharmacy'
  ];

  const reportTypes = [
    'Analytics',
    'Financial',
    'HR',
    'Inventory',
    'Quality',
    'Clinical',
    'Operational',
    'Compliance'
  ];

  const getStatusBadge = (status) => {
    const config = {
      'Generated': 'success',
      'Pending': 'warning',
      'Failed': 'danger',
      'Processing': 'info'
    };
    return <Badge bg={config[status] || 'secondary'}>{status}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const config = {
      'Patient Care': 'primary',
      'Finance': 'success',
      'Human Resources': 'info',
      'Operations': 'warning',
      'Quality Assurance': 'danger',
      'Emergency': 'dark'
    };
    return <Badge bg={config[category] || 'secondary'}>{category}</Badge>;
  };

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Reports', value: reports.length, color: 'primary', icon: FileText },
    { label: 'Generated Today', value: reports.filter(r => r.status === 'Generated').length, color: 'success', icon: CheckCircle },
    { label: 'Pending Reports', value: reports.filter(r => r.status === 'Pending').length, color: 'warning', icon: Clock },
    { label: 'Failed Reports', value: reports.filter(r => r.status === 'Failed').length, color: 'danger', icon: XCircle }
  ];

  const overviewData = {
    patientAdmissions: {
      current: 245,
      previous: 220,
      change: '+11.4%',
      trend: 'up'
    },
    revenue: {
      current: 1250000,
      previous: 1180000,
      change: '+5.9%',
      trend: 'up'
    },
    bedOccupancy: {
      current: 85,
      previous: 78,
      change: '+9.0%',
      trend: 'up'
    },
    staffSatisfaction: {
      current: 4.2,
      previous: 4.0,
      change: '+5.0%',
      trend: 'up'
    }
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 gradient-text">Reports & Analytics</h2>
          <p className="text-muted mb-0">Generate, view, and analyze hospital reports and metrics</p>
        </div>
        <div>
          <Button 
            variant="outline-primary" 
            className="me-2 shadow-sm"
            onClick={() => setShowReportModal(true)}
          >
            <FilterIcon size={16} className="me-2" />
            Generate Report
          </Button>
          <Button 
            variant="primary" 
            className="shadow-sm"
            style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
              border: 'none'
            }}
          >
            <RefreshCw size={16} className="me-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Col key={index} xs={6} md={3} className="mb-3">
              <Card className="stats-card border-0 shadow-lg glass">
                <CardBody className="p-3 text-center">
                  <IconComponent size={24} className={`text-${stat.color} mb-2`} />
                  <h3 className={`text-${stat.color} mb-1 fw-bold`}>{stat.value}</h3>
                  <p className="text-muted mb-0 small">{stat.label}</p>
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-lg glass">
            <CardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Patient Admissions</h6>
                  <h4 className="mb-1 fw-bold">{overviewData.patientAdmissions.current}</h4>
                  <small className={`text-${overviewData.patientAdmissions.trend === 'up' ? 'success' : 'danger'}`}>
                    <TrendingUp size={12} className="me-1" />
                    {overviewData.patientAdmissions.change}
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <Users size={24} className="text-primary" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-lg glass">
            <CardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Revenue</h6>
                  <h4 className="mb-1 fw-bold">${(overviewData.revenue.current / 1000000).toFixed(1)}M</h4>
                  <small className={`text-${overviewData.revenue.trend === 'up' ? 'success' : 'danger'}`}>
                    <TrendingUp size={12} className="me-1" />
                    {overviewData.revenue.change}
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <DollarSign size={24} className="text-success" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-lg glass">
            <CardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Bed Occupancy</h6>
                  <h4 className="mb-1 fw-bold">{overviewData.bedOccupancy.current}%</h4>
                  <small className={`text-${overviewData.bedOccupancy.trend === 'up' ? 'success' : 'danger'}`}>
                    <TrendingUp size={12} className="me-1" />
                    {overviewData.bedOccupancy.change}
                  </small>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <Activity size={24} className="text-warning" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-lg glass">
            <CardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Staff Satisfaction</h6>
                  <h4 className="mb-1 fw-bold">{overviewData.staffSatisfaction.current}/5</h4>
                  <small className={`text-${overviewData.staffSatisfaction.trend === 'up' ? 'success' : 'danger'}`}>
                    <TrendingUp size={12} className="me-1" />
                    {overviewData.staffSatisfaction.change}
                  </small>
                </div>
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <Users size={24} className="text-info" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg glass mb-4">
        <CardBody>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-end-0">
                  <Search size={16} />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search reports by title, category, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select>
                <option value="">All Categories</option>
                {reportCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
              </Form.Select>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Card className="border-0 shadow-lg glass mb-4">
        <CardHeader className="border-0 pb-0">
          <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <NavItem>
              <NavLink eventKey="overview" className="border-0">
                <BarChart3 size={16} className="me-2" />
                Overview
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink eventKey="reports" className="border-0">
                <FileText size={16} className="me-2" />
                All Reports
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink eventKey="analytics" className="border-0">
                <PieChart size={16} className="me-2" />
                Analytics
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink eventKey="scheduled" className="border-0">
                <Calendar size={16} className="me-2" />
                Scheduled
              </NavLink>
            </NavItem>
          </Nav>
        </CardHeader>
        <CardBody className="p-0">
          <TabContent activeKey={activeTab}>
            <TabPane eventKey="overview">
              <div className="p-4">
                <Row>
                  <Col md={8}>
                    <h5>Key Performance Indicators</h5>
                    <div className="mt-3">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Patient Satisfaction</span>
                          <span>92%</span>
                        </div>
                        <ProgressBar now={92} className="mb-2" />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Average Length of Stay</span>
                          <span>4.2 days</span>
                        </div>
                        <ProgressBar now={70} className="mb-2" />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Emergency Response Time</span>
                          <span>8.5 min</span>
                        </div>
                        <ProgressBar now={85} className="mb-2" />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Staff Productivity</span>
                          <span>87%</span>
                        </div>
                        <ProgressBar now={87} className="mb-2" />
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <h5>Quick Actions</h5>
                    <div className="mt-3">
                      <Button variant="outline-primary" className="w-100 mb-2">
                        <Download size={16} className="me-2" />
                        Export Dashboard
                      </Button>
                      <Button variant="outline-success" className="w-100 mb-2">
                        <BarChart size={16} className="me-2" />
                        Generate Analytics
                      </Button>
                      <Button variant="outline-info" className="w-100 mb-2">
                        <Share2 size={16} className="me-2" />
                        Share Report
                      </Button>
                      <Button variant="outline-warning" className="w-100">
                        <Settings size={16} className="me-2" />
                        Configure Alerts
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>

            <TabPane eventKey="reports">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead>
                    <tr>
                      <th>Report Title</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Last Generated</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report.id}>
                        <td>
                          <div>
                            <div className="fw-semibold">{report.title}</div>
                            <small className="text-muted">{report.description}</small>
                          </div>
                        </td>
                        <td>
                          {getCategoryBadge(report.category)}
                        </td>
                        <td>
                          <Badge bg="light" text="dark">{report.type}</Badge>
                        </td>
                        <td>
                          <div className="small text-muted">{report.lastGenerated}</div>
                        </td>
                        <td>
                          {getStatusBadge(report.status)}
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="link" className="text-decoration-none">
                              <MoreVertical size={16} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>
                                <Eye size={16} className="me-2" />
                                View Report
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <Download size={16} className="me-2" />
                                Download
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <Printer size={16} className="me-2" />
                                Print
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <Share2 size={16} className="me-2" />
                                Share
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item>
                                <Edit size={16} className="me-2" />
                                Edit Report
                              </Dropdown.Item>
                              <Dropdown.Item className="text-danger">
                                <Trash2 size={16} className="me-2" />
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </TabPane>

            <TabPane eventKey="analytics">
              <div className="p-4 text-center">
                <BarChart3 size={48} className="text-muted mb-3" />
                <h5>Analytics Dashboard</h5>
                <p className="text-muted">Interactive charts and analytics - coming soon</p>
                <Row className="mt-4">
                  <Col md={4}>
                    <Button variant="outline-primary" className="w-100 mb-2">
                      <BarChart size={16} className="me-2" />
                      Bar Charts
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Button variant="outline-success" className="w-100 mb-2">
                      <LineChart size={16} className="me-2" />
                      Line Charts
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Button variant="outline-info" className="w-100 mb-2">
                      <PieChartIcon size={16} className="me-2" />
                      Pie Charts
                    </Button>
                  </Col>
                </Row>
              </div>
            </TabPane>

            <TabPane eventKey="scheduled">
              <div className="p-4 text-center">
                <Calendar size={48} className="text-muted mb-3" />
                <h5>Scheduled Reports</h5>
                <p className="text-muted">Manage automated report generation schedules</p>
                <Button variant="outline-primary">
                  <Settings size={16} className="me-2" />
                  Configure Schedules
                </Button>
              </div>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>

      {/* Generate Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Generate New Report</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Report Title</FormLabel>
                  <FormControl type="text" placeholder="Enter report title" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Report Type</FormLabel>
                  <Form.Select required>
                    <option value="">Select Report Type</option>
                    {reportTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Category</FormLabel>
                  <Form.Select required>
                    <option value="">Select Category</option>
                    {reportCategories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Format</FormLabel>
                  <Form.Select>
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                    <option value="CSV">CSV</option>
                    <option value="Word">Word</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Date Range</FormLabel>
                  <Form.Select>
                    <option value="today">Today</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="this-quarter">This Quarter</option>
                    <option value="this-year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Include Charts</FormLabel>
                  <Form.Check type="checkbox" label="Include visual charts and graphs" />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="mb-3">
              <FormLabel>Description</FormLabel>
              <FormControl 
                as="textarea" 
                rows={3}
                placeholder="Brief description of the report"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary"
            style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
              border: 'none'
            }}
          >
            Generate Report
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Reports; 