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
  ProgressBar,
  Alert
} from 'react-bootstrap';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  AlertTriangle,
  User,
  Clock,
  Phone,
  MapPin,
  Heart,
  Activity,
  Truck,
  Zap,
  Shield,
  Cross,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Emergency = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    age: '',
    gender: '',
    phone: '',
    emergencyContact: '',
    chiefComplaint: '',
    triageLevel: 'Green',
    arrivalMethod: 'Ambulance',
    assignedDoctor: '',
    notes: ''
  });

  // Mock emergency cases data
  const emergencyCases = [
    {
      id: 1,
      patientName: 'Ahmed Rahman',
      patientId: 'E001',
      age: 45,
      gender: 'Male',
      phone: '+880 1712-123456',
      emergencyContact: '+880 1812-654321',
      chiefComplaint: 'Chest Pain',
      triageLevel: 'Red',
      arrivalMethod: 'Ambulance',
      assignedDoctor: 'Dr. Sarah Johnson',
      arrivalTime: '2024-01-20 14:30',
      status: 'Under Treatment',
      vitalSigns: {
        bp: '180/110',
        pulse: '120',
        temperature: '98.6°F',
        oxygen: '95%'
      },
      treatmentPlan: 'ECG, cardiac enzymes, immediate intervention',
      notes: 'Critical condition, requires immediate attention',
      ambulanceId: 'AMB-001',
      estimatedArrival: '5 minutes'
    },
    {
      id: 2,
      patientName: 'Fatima Begum',
      patientId: 'E002',
      age: 32,
      gender: 'Female',
      phone: '+880 1812-234567',
      emergencyContact: '+880 1912-765432',
      chiefComplaint: 'Severe Abdominal Pain',
      triageLevel: 'Orange',
      arrivalMethod: 'Private Vehicle',
      assignedDoctor: 'Dr. Michael Chen',
      arrivalTime: '2024-01-20 15:15',
      status: 'Waiting for Surgery',
      vitalSigns: {
        bp: '140/90',
        pulse: '95',
        temperature: '100.2°F',
        oxygen: '98%'
      },
      treatmentPlan: 'Appendectomy, IV antibiotics',
      notes: 'Suspected appendicitis, surgery scheduled',
      ambulanceId: null,
      estimatedArrival: null
    },
    {
      id: 3,
      patientName: 'Mohammad Ali',
      patientId: 'E003',
      age: 28,
      gender: 'Male',
      phone: '+880 1912-345678',
      emergencyContact: '+880 1612-876543',
      chiefComplaint: 'Road Traffic Accident',
      triageLevel: 'Red',
      arrivalMethod: 'Ambulance',
      assignedDoctor: 'Dr. Emily Davis',
      arrivalTime: '2024-01-20 16:00',
      status: 'In Surgery',
      vitalSigns: {
        bp: '90/60',
        pulse: '140',
        temperature: '96.8°F',
        oxygen: '88%'
      },
      treatmentPlan: 'Emergency surgery, blood transfusion',
      notes: 'Multiple injuries, critical condition',
      ambulanceId: 'AMB-002',
      estimatedArrival: '10 minutes'
    },
    {
      id: 4,
      patientName: 'Aisha Khan',
      patientId: 'E004',
      age: 55,
      gender: 'Female',
      phone: '+880 1612-456789',
      emergencyContact: '+880 1512-987654',
      chiefComplaint: 'Difficulty Breathing',
      triageLevel: 'Yellow',
      arrivalMethod: 'Ambulance',
      assignedDoctor: 'Dr. Robert Wilson',
      arrivalTime: '2024-01-20 16:45',
      status: 'Under Observation',
      vitalSigns: {
        bp: '130/85',
        pulse: '85',
        temperature: '99.5°F',
        oxygen: '91%'
      },
      treatmentPlan: 'Oxygen therapy, bronchodilators',
      notes: 'Asthma exacerbation, responding to treatment',
      ambulanceId: 'AMB-003',
      estimatedArrival: '15 minutes'
    }
  ];

  const triageLevels = [
    { level: 'Red', label: 'Immediate', color: 'danger', description: 'Life-threatening' },
    { level: 'Orange', label: 'Very Urgent', color: 'warning', description: 'Within 10 minutes' },
    { level: 'Yellow', label: 'Urgent', color: 'info', description: 'Within 1 hour' },
    { level: 'Green', label: 'Non-urgent', color: 'success', description: 'Within 4 hours' },
    { level: 'Blue', label: 'Minor', color: 'secondary', description: 'Within 24 hours' }
  ];

  const arrivalMethods = [
    'Ambulance',
    'Private Vehicle',
    'Walk-in',
    'Police',
    'Fire Department'
  ];

  const getTriageBadge = (level) => {
    const triage = triageLevels.find(t => t.level === level);
    return <Badge bg={triage?.color || 'secondary'}>{triage?.label || level}</Badge>;
  };

  const getStatusBadge = (status) => {
    const config = {
      'Arriving': 'warning',
      'Under Treatment': 'primary',
      'Waiting for Surgery': 'info',
      'In Surgery': 'danger',
      'Under Observation': 'success',
      'Discharged': 'secondary'
    };
    return <Badge bg={config[status] || 'secondary'}>{status}</Badge>;
  };

  const filteredCases = emergencyCases.filter(emergencyCase =>
    emergencyCase.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emergencyCase.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emergencyCase.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Cases', value: emergencyCases.length, color: 'primary' },
    { label: 'Critical (Red)', value: emergencyCases.filter(c => c.triageLevel === 'Red').length, color: 'danger' },
    { label: 'Urgent (Orange)', value: emergencyCases.filter(c => c.triageLevel === 'Orange').length, color: 'warning' },
    { label: 'Ambulance Calls', value: emergencyCases.filter(c => c.arrivalMethod === 'Ambulance').length, color: 'info' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('New emergency case data:', formData);
    setShowEmergencyModal(false);
    setFormData({
      patientName: '',
      patientId: '',
      age: '',
      gender: '',
      phone: '',
      emergencyContact: '',
      chiefComplaint: '',
      triageLevel: 'Green',
      arrivalMethod: 'Ambulance',
      assignedDoctor: '',
      notes: ''
    });
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 gradient-text">Emergency Department</h2>
          <p className="text-muted mb-0">Manage emergency cases, triage, and critical care</p>
        </div>
        <Button 
          variant="danger" 
          onClick={() => setShowEmergencyModal(true)}
          className="shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            border: 'none'
          }}
        >
          <Plus size={16} className="me-2" />
          New Emergency Case
        </Button>
      </div>

      {/* Emergency Alert */}
      <Alert variant="danger" className="mb-4">
        <div className="d-flex align-items-center">
          <AlertTriangle size={20} className="me-2" />
          <strong>Emergency Alert:</strong> 3 critical cases currently under treatment. All emergency staff on standby.
        </div>
      </Alert>

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
              placeholder="Search emergency cases by patient name, ID, or complaint..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </CardBody>
      </Card>

      {/* Emergency Cases Table */}
      <Card className="border-0 shadow-lg glass">
        <CardHeader className="border-0 pb-0">
          <h5 className="mb-0 fw-semibold">Emergency Cases</h5>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Chief Complaint</th>
                  <th>Triage Level</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Arrival Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((emergencyCase) => (
                  <tr key={emergencyCase.id} className={emergencyCase.triageLevel === 'Red' ? 'table-danger' : ''}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className={`bg-${emergencyCase.triageLevel === 'Red' ? 'danger' : 'primary'} bg-opacity-10 rounded-circle p-2 me-3`}>
                          <User size={20} className={`text-${emergencyCase.triageLevel === 'Red' ? 'danger' : 'primary'}`} />
                        </div>
                        <div>
                          <div className="fw-semibold">{emergencyCase.patientName}</div>
                          <small className="text-muted">
                            ID: {emergencyCase.patientId} • {emergencyCase.age} years, {emergencyCase.gender}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium">{emergencyCase.chiefComplaint}</div>
                      <small className="text-muted">{emergencyCase.arrivalMethod}</small>
                    </td>
                    <td>
                      {getTriageBadge(emergencyCase.triageLevel)}
                    </td>
                    <td>
                      <div className="fw-medium">{emergencyCase.assignedDoctor}</div>
                    </td>
                    <td>
                      {getStatusBadge(emergencyCase.status)}
                    </td>
                    <td>
                      <div className="fw-medium">{emergencyCase.arrivalTime}</div>
                      {emergencyCase.ambulanceId && (
                        <small className="text-muted">Ambulance: {emergencyCase.ambulanceId}</small>
                      )}
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="link" className="text-decoration-none">
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {
                            setSelectedCase(emergencyCase);
                            setShowCaseModal(true);
                          }}>
                            <Eye size={16} className="me-2" />
                            View Details
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Activity size={16} className="me-2" />
                            Update Vitals
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Edit size={16} className="me-2" />
                            Update Treatment
                          </Dropdown.Item>
                          {emergencyCase.ambulanceId && (
                            <Dropdown.Item>
                              <Truck size={16} className="me-2" />
                              Track Ambulance
                            </Dropdown.Item>
                          )}
                          <Dropdown.Divider />
                          <Dropdown.Item className="text-success">
                            <CheckCircle size={16} className="me-2" />
                            Discharge
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

      {/* New Emergency Case Modal */}
      <Modal show={showEmergencyModal} onHide={() => setShowEmergencyModal(false)} size="lg">
        <ModalHeader closeButton className="bg-danger text-white">
          <Modal.Title>New Emergency Case</Modal.Title>
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
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Age</FormLabel>
                  <FormControl 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Gender</FormLabel>
                  <Form.Select 
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Phone</FormLabel>
                  <FormControl 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Emergency Contact</FormLabel>
                  <FormControl 
                    type="tel" 
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Chief Complaint</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.chiefComplaint}
                    onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Triage Level</FormLabel>
                  <Form.Select 
                    value={formData.triageLevel}
                    onChange={(e) => handleInputChange('triageLevel', e.target.value)}
                    required
                  >
                    {triageLevels.map((level, index) => (
                      <option key={index} value={level.level}>{level.level} - {level.label}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Arrival Method</FormLabel>
                  <Form.Select 
                    value={formData.arrivalMethod}
                    onChange={(e) => handleInputChange('arrivalMethod', e.target.value)}
                    required
                  >
                    {arrivalMethods.map((method, index) => (
                      <option key={index} value={method}>{method}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Assigned Doctor</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.assignedDoctor}
                    onChange={(e) => handleInputChange('assignedDoctor', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="mb-3">
              <FormLabel>Emergency Notes</FormLabel>
              <FormControl 
                as="textarea" 
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Critical information, allergies, immediate needs..."
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowEmergencyModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={handleSubmit}
          >
            Create Emergency Case
          </Button>
        </ModalFooter>
      </Modal>

      {/* Emergency Case Details Modal */}
      <Modal show={showCaseModal} onHide={() => setShowCaseModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Emergency Case Details - {selectedCase?.patientName}</Modal.Title>
        </ModalHeader>
        <ModalBody>
          {selectedCase ? (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Patient ID:</strong> {selectedCase.patientId || 'N/A'}
                </Col>
                <Col md={6}>
                  <strong>Age/Gender:</strong> {selectedCase.age || 'N/A'} years, {selectedCase.gender || 'N/A'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Phone:</strong> {selectedCase.phone || 'N/A'}
                </Col>
                <Col md={6}>
                  <strong>Emergency Contact:</strong> {selectedCase.emergencyContact || 'N/A'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Chief Complaint:</strong> {selectedCase.chiefComplaint || 'N/A'}
                </Col>
                <Col md={6}>
                  <strong>Triage Level:</strong> {selectedCase.triageLevel ? getTriageBadge(selectedCase.triageLevel) : 'N/A'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Arrival Method:</strong> {selectedCase.arrivalMethod || 'N/A'}
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> {selectedCase.status ? getStatusBadge(selectedCase.status) : 'N/A'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Assigned Doctor:</strong> {selectedCase.assignedDoctor || 'N/A'}
                </Col>
                <Col md={6}>
                  <strong>Arrival Time:</strong> {selectedCase.arrivalTime || 'N/A'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <strong>Treatment Plan:</strong> {selectedCase.treatmentPlan || 'N/A'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <strong>Notes:</strong> {selectedCase.notes || 'N/A'}
                </Col>
              </Row>
              
              <div className="mt-4">
                <h6>Vital Signs:</h6>
                <Row>
                  <Col md={3}>
                    <div className="text-center p-2 bg-light rounded">
                      <div className="fw-bold text-primary">{selectedCase.vitalSigns?.bp || 'N/A'}</div>
                      <small className="text-muted">Blood Pressure</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center p-2 bg-light rounded">
                      <div className="fw-bold text-success">{selectedCase.vitalSigns?.pulse || 'N/A'}</div>
                      <small className="text-muted">Pulse</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center p-2 bg-light rounded">
                      <div className="fw-bold text-warning">{selectedCase.vitalSigns?.temperature || 'N/A'}</div>
                      <small className="text-muted">Temperature</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center p-2 bg-light rounded">
                      <div className="fw-bold text-info">{selectedCase.vitalSigns?.oxygen || 'N/A'}</div>
                      <small className="text-muted">Oxygen</small>
                    </div>
                  </Col>
                </Row>
              </div>

              {selectedCase.ambulanceId && (
                <div className="mt-4">
                  <h6>Ambulance Information:</h6>
                  <div className="p-3 bg-light rounded">
                    <strong>Ambulance ID:</strong> {selectedCase.ambulanceId}<br/>
                    <strong>Estimated Arrival:</strong> {selectedCase.estimatedArrival}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p>Loading patient details...</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowCaseModal(false)}>
            Close
          </Button>
          <Button variant="primary">Update Treatment</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Emergency; 