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
  Bed,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity
} from 'lucide-react';

const IPD = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    age: '',
    gender: '',
    phone: '',
    emergencyContact: '',
    admittingDoctor: '',
    diagnosis: '',
    roomType: '',
    estimatedStay: '',
    notes: ''
  });

  // Mock IPD patients data
  const ipdPatients = [
    {
      id: 1,
      patientName: 'Ahmed Rahman',
      patientId: 'P001',
      age: 45,
      gender: 'Male',
      phone: '+880 1712-123456',
      emergencyContact: '+880 1812-654321',
      admittingDoctor: 'Dr. Sarah Johnson',
      diagnosis: 'Acute Myocardial Infarction',
      roomType: 'ICU',
      roomNumber: 'ICU-101',
      admissionDate: '2024-01-18',
      estimatedStay: '7 days',
      currentStay: '3 days',
      status: 'Admitted',
      vitalSigns: {
        bp: '140/90',
        pulse: '85',
        temperature: '98.6°F',
        oxygen: '98%'
      },
      treatmentPlan: 'Cardiac monitoring, medication therapy',
      notes: 'Stable condition, responding well to treatment'
    },
    {
      id: 2,
      patientName: 'Fatima Begum',
      patientId: 'P002',
      age: 32,
      gender: 'Female',
      phone: '+880 1812-234567',
      emergencyContact: '+880 1912-765432',
      admittingDoctor: 'Dr. Michael Chen',
      diagnosis: 'Appendicitis',
      roomType: 'General Ward',
      roomNumber: 'GW-205',
      admissionDate: '2024-01-19',
      estimatedStay: '5 days',
      currentStay: '2 days',
      status: 'Admitted',
      vitalSigns: {
        bp: '120/80',
        pulse: '72',
        temperature: '99.2°F',
        oxygen: '99%'
      },
      treatmentPlan: 'Post-operative care, antibiotics',
      notes: 'Recovering well after surgery'
    },
    {
      id: 3,
      patientName: 'Mohammad Ali',
      patientId: 'P003',
      age: 28,
      gender: 'Male',
      phone: '+880 1912-345678',
      emergencyContact: '+880 1612-876543',
      admittingDoctor: 'Dr. Emily Davis',
      diagnosis: 'Pneumonia',
      roomType: 'Semi-Private',
      roomNumber: 'SP-301',
      admissionDate: '2024-01-20',
      estimatedStay: '10 days',
      currentStay: '1 day',
      status: 'Admitted',
      vitalSigns: {
        bp: '135/85',
        pulse: '95',
        temperature: '101.5°F',
        oxygen: '92%'
      },
      treatmentPlan: 'Antibiotics, oxygen therapy',
      notes: 'Requires close monitoring'
    },
    {
      id: 4,
      patientName: 'Aisha Khan',
      patientId: 'P004',
      age: 55,
      gender: 'Female',
      phone: '+880 1612-456789',
      emergencyContact: '+880 1512-987654',
      admittingDoctor: 'Dr. Robert Wilson',
      diagnosis: 'Hip Fracture',
      roomType: 'Private',
      roomNumber: 'PR-401',
      admissionDate: '2024-01-15',
      estimatedStay: '14 days',
      currentStay: '6 days',
      status: 'Ready for Discharge',
      vitalSigns: {
        bp: '125/82',
        pulse: '78',
        temperature: '98.8°F',
        oxygen: '97%'
      },
      treatmentPlan: 'Physical therapy, pain management',
      notes: 'Ready for discharge, follow-up scheduled'
    }
  ];

  const roomTypes = [
    'ICU',
    'General Ward',
    'Semi-Private',
    'Private',
    'Isolation'
  ];

  const getStatusBadge = (status) => {
    const config = {
      'Admitted': 'primary',
      'Ready for Discharge': 'success',
      'Discharged': 'secondary',
      'Transferred': 'info'
    };
    return <Badge bg={config[status] || 'secondary'}>{status}</Badge>;
  };

  const getRoomTypeBadge = (roomType) => {
    const config = {
      'ICU': 'danger',
      'General Ward': 'warning',
      'Semi-Private': 'info',
      'Private': 'success',
      'Isolation': 'dark'
    };
    return <Badge bg={config[roomType] || 'secondary'}>{roomType}</Badge>;
  };

  const filteredPatients = ipdPatients.filter(patient =>
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Patients', value: ipdPatients.length, color: 'primary' },
    { label: 'ICU Patients', value: ipdPatients.filter(p => p.roomType === 'ICU').length, color: 'danger' },
    { label: 'General Ward', value: ipdPatients.filter(p => p.roomType === 'General Ward').length, color: 'warning' },
    { label: 'Ready for Discharge', value: ipdPatients.filter(p => p.status === 'Ready for Discharge').length, color: 'success' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('New IPD admission data:', formData);
    setShowAdmissionModal(false);
    setFormData({
      patientName: '',
      patientId: '',
      age: '',
      gender: '',
      phone: '',
      emergencyContact: '',
      admittingDoctor: '',
      diagnosis: '',
      roomType: '',
      estimatedStay: '',
      notes: ''
    });
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 gradient-text">Inpatient Department (IPD)</h2>
          <p className="text-muted mb-0">Manage inpatient admissions, room allocation, and patient care</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowAdmissionModal(true)}
          className="shadow-sm"
          style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
            border: 'none'
          }}
        >
          <Plus size={16} className="me-2" />
          New Admission
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
              placeholder="Search patients by name, ID, or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </CardBody>
      </Card>

      {/* IPD Patients Table */}
      <Card className="border-0 shadow-lg glass">
        <CardHeader className="border-0 pb-0">
          <h5 className="mb-0 fw-semibold">Inpatient Patients</h5>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Room</th>
                  <th>Doctor</th>
                  <th>Diagnosis</th>
                  <th>Status</th>
                  <th>Stay Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <User size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="fw-semibold">{patient.patientName}</div>
                          <small className="text-muted">
                            ID: {patient.patientId} • {patient.age} years, {patient.gender}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">{patient.roomNumber}</div>
                        {getRoomTypeBadge(patient.roomType)}
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium">{patient.admittingDoctor}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{patient.diagnosis}</div>
                    </td>
                    <td>
                      {getStatusBadge(patient.status)}
                    </td>
                    <td>
                      <div className="fw-medium">{patient.currentStay} / {patient.estimatedStay}</div>
                      <small className="text-muted">Admitted: {patient.admissionDate}</small>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="link" className="text-decoration-none">
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {
                            setSelectedPatient(patient);
                            setShowPatientModal(true);
                          }}>
                            <Eye size={16} className="me-2" />
                            View Details
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Edit size={16} className="me-2" />
                            Update Treatment
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Activity size={16} className="me-2" />
                            Vital Signs
                          </Dropdown.Item>
                          {patient.status === 'Ready for Discharge' && (
                            <Dropdown.Item className="text-success">
                              <CheckCircle size={16} className="me-2" />
                              Process Discharge
                            </Dropdown.Item>
                          )}
                          <Dropdown.Divider />
                          <Dropdown.Item className="text-danger">
                            <Trash2 size={16} className="me-2" />
                            Transfer Patient
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

      {/* New Admission Modal */}
      <Modal show={showAdmissionModal} onHide={() => setShowAdmissionModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>New Patient Admission</Modal.Title>
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
                  <FormLabel>Admitting Doctor</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.admittingDoctor}
                    onChange={(e) => handleInputChange('admittingDoctor', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.diagnosis}
                    onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Room Type</FormLabel>
                  <Form.Select 
                    value={formData.roomType}
                    onChange={(e) => handleInputChange('roomType', e.target.value)}
                    required
                  >
                    <option value="">Select Room Type</option>
                    {roomTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Estimated Stay</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.estimatedStay}
                    onChange={(e) => handleInputChange('estimatedStay', e.target.value)}
                    placeholder="e.g., 7 days"
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="mb-3">
              <FormLabel>Admission Notes</FormLabel>
              <FormControl 
                as="textarea" 
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Special instructions, allergies, etc."
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAdmissionModal(false)}>
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
            Admit Patient
          </Button>
        </ModalFooter>
      </Modal>

      {/* Patient Details Modal */}
      <Modal show={showPatientModal} onHide={() => setShowPatientModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Patient Details - {selectedPatient?.patientName}</Modal.Title>
        </ModalHeader>
        <ModalBody>
          {selectedPatient ? (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Patient ID:</strong> {selectedPatient.patientId}
                </Col>
                <Col md={6}>
                  <strong>Age/Gender:</strong> {selectedPatient.age} years, {selectedPatient.gender}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Phone:</strong> {selectedPatient.phone}
                </Col>
                <Col md={6}>
                  <strong>Emergency Contact:</strong> {selectedPatient.emergencyContact}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Room:</strong> {selectedPatient.roomNumber} ({selectedPatient.roomType})
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> {getStatusBadge(selectedPatient.status)}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Admitting Doctor:</strong> {selectedPatient.admittingDoctor}
                </Col>
                <Col md={6}>
                  <strong>Admission Date:</strong> {selectedPatient.admissionDate}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <strong>Diagnosis:</strong> {selectedPatient.diagnosis}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <strong>Treatment Plan:</strong> {selectedPatient.treatmentPlan}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <strong>Notes:</strong> {selectedPatient.notes}
                </Col>
              </Row>
              
              <div className="mt-4">
                <h6>Vital Signs:</h6>
                <Row>
                  <Col md={3}>
                    <div className="text-center p-2 bg-light rounded">
                      <div className="fw-bold text-primary">{selectedPatient.vitalSigns?.bp || 'N/A'}</div>
                      <small className="text-muted">Blood Pressure</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center p-2 bg-light rounded">
                      <div className="fw-bold text-success">{selectedPatient.vitalSigns?.pulse || 'N/A'}</div>
                      <small className="text-muted">Pulse</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center p-2 bg-light rounded">
                      <div className="fw-bold text-warning">{selectedPatient.vitalSigns?.temperature || 'N/A'}</div>
                      <small className="text-muted">Temperature</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center p-2 bg-light rounded">
                      <div className="fw-bold text-info">{selectedPatient.vitalSigns?.oxygen || 'N/A'}</div>
                      <small className="text-muted">Oxygen</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p>Loading patient details...</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowPatientModal(false)}>
            Close
          </Button>
          <Button variant="primary">Update Treatment</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default IPD; 