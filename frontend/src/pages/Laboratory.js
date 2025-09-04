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
  ProgressBar
} from 'react-bootstrap';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  TestTube,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Upload
} from 'lucide-react';

const Laboratory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    testType: '',
    doctorName: '',
    priority: 'Normal',
    notes: ''
  });

  // Mock lab tests data
  const labTests = [
    {
      id: 1,
      patientName: 'Ahmed Rahman',
      patientId: 'P001',
      testType: 'Blood Test - Complete',
      doctorName: 'Dr. Sarah Johnson',
      priority: 'High',
      status: 'In Progress',
      requestedDate: '2024-01-20',
      completedDate: null,
      technician: 'Lab Tech 1',
      results: null,
      notes: 'Fasting required'
    },
    {
      id: 2,
      patientName: 'Fatima Begum',
      patientId: 'P002',
      testType: 'Urine Analysis',
      doctorName: 'Dr. Michael Chen',
      priority: 'Normal',
      status: 'Completed',
      requestedDate: '2024-01-19',
      completedDate: '2024-01-20',
      technician: 'Lab Tech 2',
      results: 'Normal',
      notes: 'Sample collected'
    },
    {
      id: 3,
      patientName: 'Mohammad Ali',
      patientId: 'P003',
      testType: 'X-Ray - Chest',
      doctorName: 'Dr. Emily Davis',
      priority: 'Emergency',
      status: 'Completed',
      requestedDate: '2024-01-18',
      completedDate: '2024-01-18',
      technician: 'Lab Tech 3',
      results: 'Clear',
      notes: 'Emergency case'
    },
    {
      id: 4,
      patientName: 'Aisha Khan',
      patientId: 'P004',
      testType: 'ECG',
      doctorName: 'Dr. Robert Wilson',
      priority: 'Normal',
      status: 'Pending',
      requestedDate: '2024-01-21',
      completedDate: null,
      technician: null,
      results: null,
      notes: 'Scheduled for tomorrow'
    }
  ];

  const testTypes = [
    'Blood Test - Complete',
    'Blood Test - Basic',
    'Urine Analysis',
    'X-Ray - Chest',
    'X-Ray - Spine',
    'ECG',
    'Ultrasound - Abdomen',
    'Ultrasound - Heart',
    'MRI - Brain',
    'CT Scan - Chest',
    'Biopsy',
    'Culture Test'
  ];

  const getStatusBadge = (status) => {
    const config = {
      'Pending': 'warning',
      'In Progress': 'info',
      'Completed': 'success',
      'Cancelled': 'danger'
    };
    return <Badge bg={config[status] || 'secondary'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const config = {
      'Low': 'success',
      'Normal': 'primary',
      'High': 'warning',
      'Emergency': 'danger'
    };
    return <Badge bg={config[priority] || 'secondary'}>{priority}</Badge>;
  };

  const filteredTests = labTests.filter(test =>
    test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Tests', value: labTests.length, color: 'primary' },
    { label: 'Completed', value: labTests.filter(t => t.status === 'Completed').length, color: 'success' },
    { label: 'In Progress', value: labTests.filter(t => t.status === 'In Progress').length, color: 'info' },
    { label: 'Pending', value: labTests.filter(t => t.status === 'Pending').length, color: 'warning' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('New lab test data:', formData);
    setShowAddTestModal(false);
    setFormData({
      patientName: '',
      patientId: '',
      testType: '',
      doctorName: '',
      priority: 'Normal',
      notes: ''
    });
  };

  const handleResultSubmit = () => {
    console.log('Test result data:', selectedTest);
    setShowResultModal(false);
    setSelectedTest(null);
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 gradient-text">Laboratory</h2>
          <p className="text-muted mb-0">Manage lab tests, reports, and results</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowAddTestModal(true)}
          className="shadow-sm"
          style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
            border: 'none'
          }}
        >
          <Plus size={16} className="me-2" />
          New Lab Test
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col key={index} xs={6} md={3} className="mb-3">
            <Card className="stats-card border-0 shadow-lg glass">
              <CardBody className="p-3 text-center">
                <h3 className={`text-${stat.color} mb-1 fw-bold`}>{stat.value}</h3>
                <p className="text-muted mb-0 small">{stat.label}</p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Search */}
      <Card className="border-0 shadow-lg glass mb-4">
        <CardBody>
          <InputGroup>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <FormControl
              placeholder="Search tests by patient name, test type, or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </CardBody>
      </Card>

      {/* Lab Tests Table */}
      <Card className="border-0 shadow-lg glass">
        <CardHeader className="border-0 pb-0">
          <h5 className="mb-0 fw-semibold">Lab Tests</h5>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Test Type</th>
                  <th>Doctor</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Requested Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test) => (
                  <tr key={test.id}>
                    <td>
                      <div className="fw-semibold">{test.patientName}</div>
                      <small className="text-muted">ID: {test.patientId}</small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <TestTube size={16} className="me-2 text-primary" />
                        {test.testType}
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium">{test.doctorName}</div>
                    </td>
                    <td>
                      {getPriorityBadge(test.priority)}
                    </td>
                    <td>
                      {getStatusBadge(test.status)}
                    </td>
                    <td>
                      <div className="fw-medium">{test.requestedDate}</div>
                      {test.completedDate && (
                        <small className="text-muted">Completed: {test.completedDate}</small>
                      )}
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="link" className="text-decoration-none">
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {
                            setSelectedTest(test);
                            setShowResultModal(true);
                          }}>
                            <Eye size={16} className="me-2" />
                            View Details
                          </Dropdown.Item>
                          {test.status === 'Pending' && (
                            <Dropdown.Item>
                              <Edit size={16} className="me-2" />
                              Start Test
                            </Dropdown.Item>
                          )}
                          {test.status === 'In Progress' && (
                            <Dropdown.Item>
                              <CheckCircle size={16} className="me-2" />
                              Complete Test
                            </Dropdown.Item>
                          )}
                          {test.results && (
                            <Dropdown.Item>
                              <Download size={16} className="me-2" />
                              Download Report
                            </Dropdown.Item>
                          )}
                          <Dropdown.Divider />
                          <Dropdown.Item className="text-danger">
                            <Trash2 size={16} className="me-2" />
                            Cancel Test
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Add New Test Modal */}
      <Modal show={showAddTestModal} onHide={() => setShowAddTestModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Schedule New Lab Test</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Patient ID</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.patientId}
                    onChange={(e) => handleInputChange('patientId', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Test Type</FormLabel>
                  <Form.Select 
                    value={formData.testType}
                    onChange={(e) => handleInputChange('testType', e.target.value)}
                    required
                  >
                    <option value="">Select Test Type</option>
                    {testTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Requesting Doctor</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.doctorName}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Priority</FormLabel>
                  <Form.Select 
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="mb-3">
              <FormLabel>Notes</FormLabel>
              <FormControl 
                as="textarea" 
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Special instructions, fasting requirements, etc."
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAddTestModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleSubmit}
            style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
              border: 'none'
            }}
          >
            Schedule Test
          </Button>
        </ModalFooter>
      </Modal>

      {/* Test Result Modal */}
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Test Results - {selectedTest?.testType}</Modal.Title>
        </ModalHeader>
        <ModalBody>
          {selectedTest ? (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Patient:</strong> {selectedTest.patientName}
                </Col>
                <Col md={6}>
                  <strong>Patient ID:</strong> {selectedTest.patientId}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Test Type:</strong> {selectedTest.testType}
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> {getStatusBadge(selectedTest.status)}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Requested Date:</strong> {selectedTest.requestedDate}
                </Col>
                <Col md={6}>
                  <strong>Completed Date:</strong> {selectedTest.completedDate || 'Pending'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <strong>Notes:</strong> {selectedTest.notes}
                </Col>
              </Row>
              {selectedTest.results && (
                <div className="mt-3">
                  <h6>Test Results:</h6>
                  <div className="p-3 bg-light rounded">
                    <strong>Result:</strong> {selectedTest.results}
                  </div>
                </div>
              )}
              {selectedTest.status === 'In Progress' && (
                <div className="mt-3">
                  <h6>Test Progress:</h6>
                  <ProgressBar now={75} className="mb-2" />
                  <small className="text-muted">75% Complete</small>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p>Loading test details...</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowResultModal(false)}>
            Close
          </Button>
          {selectedTest?.status === 'In Progress' && (
            <Button 
              variant="success"
              onClick={handleResultSubmit}
            >
              Complete Test
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Laboratory; 