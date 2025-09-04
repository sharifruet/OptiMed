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
  User,
  Clock,
  Phone,
  MapPin,
  Heart,
  Activity,
  Scissors,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';

const OperationTheater = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSurgeryModal, setShowSurgeryModal] = useState(false);
  const [selectedSurgery, setSelectedSurgery] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    surgeryType: '',
    surgeon: '',
    anesthetist: '',
    theaterNumber: '',
    scheduledDate: '',
    scheduledTime: '',
    estimatedDuration: '',
    priority: 'Normal',
    notes: ''
  });

  // Mock surgery data
  const surgeries = [
    {
      id: 1,
      patientName: 'Ahmed Rahman',
      patientId: 'P001',
      surgeryType: 'Cardiac Bypass Surgery',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Michael Chen',
      theaterNumber: 'OT-1',
      scheduledDate: '2024-01-20',
      scheduledTime: '09:00 AM',
      estimatedDuration: '4 hours',
      priority: 'High',
      status: 'In Progress',
      startTime: '09:15 AM',
      currentDuration: '2 hours 30 minutes',
      surgicalTeam: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Nurse Aisha', 'Tech Ahmed'],
      notes: 'Complex cardiac procedure'
    },
    {
      id: 2,
      patientName: 'Fatima Begum',
      patientId: 'P002',
      surgeryType: 'Appendectomy',
      surgeon: 'Dr. Emily Davis',
      anesthetist: 'Dr. Robert Wilson',
      theaterNumber: 'OT-2',
      scheduledDate: '2024-01-20',
      scheduledTime: '11:00 AM',
      estimatedDuration: '1.5 hours',
      priority: 'Normal',
      status: 'Scheduled',
      startTime: null,
      currentDuration: null,
      surgicalTeam: ['Dr. Emily Davis', 'Dr. Robert Wilson', 'Nurse Fatima', 'Tech Ali'],
      notes: 'Laparoscopic procedure'
    },
    {
      id: 3,
      patientName: 'Mohammad Ali',
      patientId: 'P003',
      surgeryType: 'Hip Replacement',
      surgeon: 'Dr. Lisa Anderson',
      anesthetist: 'Dr. David Brown',
      theaterNumber: 'OT-3',
      scheduledDate: '2024-01-20',
      scheduledTime: '02:00 PM',
      estimatedDuration: '3 hours',
      priority: 'Normal',
      status: 'Completed',
      startTime: '02:15 PM',
      currentDuration: '2 hours 45 minutes',
      surgicalTeam: ['Dr. Lisa Anderson', 'Dr. David Brown', 'Nurse Sara', 'Tech Omar'],
      notes: 'Total hip replacement'
    },
    {
      id: 4,
      patientName: 'Aisha Khan',
      patientId: 'P004',
      surgeryType: 'Emergency C-Section',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Michael Chen',
      theaterNumber: 'OT-1',
      scheduledDate: '2024-01-20',
      scheduledTime: 'Emergency',
      estimatedDuration: '1 hour',
      priority: 'Emergency',
      status: 'Scheduled',
      startTime: null,
      currentDuration: null,
      surgicalTeam: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Nurse Aisha', 'Tech Ahmed'],
      notes: 'Emergency delivery'
    }
  ];

  const surgeryTypes = [
    'Cardiac Bypass Surgery',
    'Appendectomy',
    'Hip Replacement',
    'Knee Replacement',
    'C-Section',
    'Hernia Repair',
    'Gallbladder Removal',
    'Tonsillectomy',
    'Cataract Surgery',
    'Brain Surgery',
    'Lung Surgery',
    'Kidney Transplant'
  ];

  const theaters = [
    'OT-1',
    'OT-2', 
    'OT-3',
    'OT-4',
    'OT-5'
  ];

  const getStatusBadge = (status) => {
    const config = {
      'Scheduled': 'primary',
      'In Progress': 'warning',
      'Completed': 'success',
      'Cancelled': 'danger',
      'Postponed': 'info'
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

  const filteredSurgeries = surgeries.filter(surgery =>
    surgery.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surgery.surgeryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surgery.surgeon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Surgeries', value: surgeries.length, color: 'primary' },
    { label: 'In Progress', value: surgeries.filter(s => s.status === 'In Progress').length, color: 'warning' },
    { label: 'Completed Today', value: surgeries.filter(s => s.status === 'Completed').length, color: 'success' },
    { label: 'Emergency Cases', value: surgeries.filter(s => s.priority === 'Emergency').length, color: 'danger' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('New surgery data:', formData);
    setShowSurgeryModal(false);
    setFormData({
      patientName: '',
      patientId: '',
      surgeryType: '',
      surgeon: '',
      anesthetist: '',
      theaterNumber: '',
      scheduledDate: '',
      scheduledTime: '',
      estimatedDuration: '',
      priority: 'Normal',
      notes: ''
    });
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 gradient-text">Operation Theater</h2>
          <p className="text-muted mb-0">Manage surgeries, theater allocation, and surgical teams</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowSurgeryModal(true)}
          className="shadow-sm"
          style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
            border: 'none'
          }}
        >
          <Plus size={16} className="me-2" />
          Schedule Surgery
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
              placeholder="Search surgeries by patient name, surgery type, or surgeon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </CardBody>
      </Card>

      {/* Surgeries Table */}
      <Card className="border-0 shadow-lg glass">
        <CardHeader className="border-0 pb-0">
          <h5 className="mb-0 fw-semibold">Scheduled Surgeries</h5>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Surgery Type</th>
                  <th>Theater</th>
                  <th>Surgeon</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSurgeries.map((surgery) => (
                  <tr key={surgery.id} className={surgery.priority === 'Emergency' ? 'table-danger' : ''}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <User size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="fw-semibold">{surgery.patientName}</div>
                          <small className="text-muted">ID: {surgery.patientId}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Scissors size={16} className="me-2 text-primary" />
                        {surgery.surgeryType}
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium">{surgery.theaterNumber}</div>
                      {getPriorityBadge(surgery.priority)}
                    </td>
                    <td>
                      <div className="fw-medium">{surgery.surgeon}</div>
                      <small className="text-muted">Anesthetist: {surgery.anesthetist}</small>
                    </td>
                    <td>
                      <div className="fw-medium">{surgery.scheduledDate}</div>
                      <small className="text-muted">{surgery.scheduledTime} ({surgery.estimatedDuration})</small>
                    </td>
                    <td>
                      {getStatusBadge(surgery.status)}
                      {surgery.status === 'In Progress' && (
                        <div className="mt-1">
                          <small className="text-muted">
                            <Timer size={12} className="me-1" />
                            {surgery.currentDuration}
                          </small>
                        </div>
                      )}
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="link" className="text-decoration-none">
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {
                            setSelectedSurgery(surgery);
                            setShowSurgeryModal(true);
                          }}>
                            <Eye size={16} className="me-2" />
                            View Details
                          </Dropdown.Item>
                          {surgery.status === 'Scheduled' && (
                            <Dropdown.Item>
                              <Edit size={16} className="me-2" />
                              Start Surgery
                            </Dropdown.Item>
                          )}
                          {surgery.status === 'In Progress' && (
                            <Dropdown.Item>
                              <CheckCircle size={16} className="me-2" />
                              Complete Surgery
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item>
                            <Users size={16} className="me-2" />
                            View Team
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="text-danger">
                            <Trash2 size={16} className="me-2" />
                            Cancel Surgery
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

      {/* Schedule Surgery Modal */}
      <Modal show={showSurgeryModal} onHide={() => setShowSurgeryModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Schedule New Surgery</Modal.Title>
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
                  <FormLabel>Surgery Type</FormLabel>
                  <Form.Select 
                    value={formData.surgeryType}
                    onChange={(e) => handleInputChange('surgeryType', e.target.value)}
                    required
                  >
                    <option value="">Select Surgery Type</option>
                    {surgeryTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
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
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Surgeon</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.surgeon}
                    onChange={(e) => handleInputChange('surgeon', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Anesthetist</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.anesthetist}
                    onChange={(e) => handleInputChange('anesthetist', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Theater Number</FormLabel>
                  <Form.Select 
                    value={formData.theaterNumber}
                    onChange={(e) => handleInputChange('theaterNumber', e.target.value)}
                    required
                  >
                    <option value="">Select Theater</option>
                    {theaters.map((theater, index) => (
                      <option key={index} value={theater}>{theater}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Scheduled Date</FormLabel>
                  <FormControl 
                    type="date" 
                    value={formData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Scheduled Time</FormLabel>
                  <FormControl 
                    type="time" 
                    value={formData.scheduledTime}
                    onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Estimated Duration</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.estimatedDuration}
                    onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                    placeholder="e.g., 2 hours"
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="mb-3">
              <FormLabel>Surgery Notes</FormLabel>
              <FormControl 
                as="textarea" 
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Special instructions, equipment needed, etc."
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowSurgeryModal(false)}>
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
            Schedule Surgery
          </Button>
        </ModalFooter>
      </Modal>

      {/* Surgery Details Modal */}
      <Modal show={selectedSurgery && setShowSurgeryModal} onHide={() => setSelectedSurgery(null)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Surgery Details - {selectedSurgery?.surgeryType}</Modal.Title>
        </ModalHeader>
        <ModalBody>
          {selectedSurgery ? (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Patient:</strong> {selectedSurgery.patientName} (ID: {selectedSurgery.patientId})
                </Col>
                <Col md={6}>
                  <strong>Surgery Type:</strong> {selectedSurgery.surgeryType}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Surgeon:</strong> {selectedSurgery.surgeon}
                </Col>
                <Col md={6}>
                  <strong>Anesthetist:</strong> {selectedSurgery.anesthetist}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Theater:</strong> {selectedSurgery.theaterNumber}
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> {getStatusBadge(selectedSurgery.status)}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Scheduled:</strong> {selectedSurgery.scheduledDate} at {selectedSurgery.scheduledTime}
                </Col>
                <Col md={6}>
                  <strong>Duration:</strong> {selectedSurgery.estimatedDuration}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <strong>Notes:</strong> {selectedSurgery.notes}
                </Col>
              </Row>
              
              <div className="mt-4">
                <h6>Surgical Team:</h6>
                <div className="p-3 bg-light rounded">
                  {selectedSurgery.surgicalTeam.map((member, index) => (
                    <div key={index} className="mb-1">
                      <User size={16} className="me-2 text-primary" />
                      {member}
                    </div>
                  ))}
                </div>
              </div>

              {selectedSurgery.status === 'In Progress' && (
                <div className="mt-4">
                  <h6>Surgery Progress:</h6>
                  <ProgressBar now={65} className="mb-2" />
                  <small className="text-muted">65% Complete - {selectedSurgery.currentDuration}</small>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p>Loading surgery details...</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setSelectedSurgery(null)}>
            Close
          </Button>
          <Button variant="primary">Update Surgery</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default OperationTheater; 