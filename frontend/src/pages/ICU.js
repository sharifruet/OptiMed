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
  User,
  Clock,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity,
  Bed,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Monitor,
  Stethoscope,
  Thermometer,
  Droplets,
  Brain,
  Zap,
  Shield
} from 'lucide-react';

const ICU = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    age: '',
    gender: '',
    diagnosis: '',
    admittingDoctor: '',
    bedNumber: '',
    admissionDate: '',
    estimatedStay: '',
    priority: 'High',
    notes: ''
  });

  // Mock ICU patients data
  const icuPatients = [
    {
      id: 1,
      patientName: 'Ahmed Rahman',
      patientId: 'P001',
      age: 65,
      gender: 'Male',
      diagnosis: 'Acute Respiratory Distress Syndrome (ARDS)',
      admittingDoctor: 'Dr. Sarah Johnson',
      bedNumber: 'ICU-01',
      admissionDate: '2024-01-18',
      estimatedStay: '7-10 days',
      priority: 'Critical',
      status: 'Critical',
      vitalSigns: {
        bp: '90/60',
        pulse: '120',
        temperature: '38.5°C',
        oxygen: '85%',
        respiratoryRate: '28/min',
        consciousness: 'GCS 8/15'
      },
      medications: ['Vasopressors', 'Antibiotics', 'Sedatives'],
      equipment: ['Ventilator', 'ECG Monitor', 'Pulse Oximeter'],
      lastUpdate: '2 minutes ago',
      alerts: ['Low Blood Pressure', 'High Temperature']
    },
    {
      id: 2,
      patientName: 'Fatima Begum',
      patientId: 'P002',
      age: 45,
      gender: 'Female',
      diagnosis: 'Septic Shock',
      admittingDoctor: 'Dr. Michael Chen',
      bedNumber: 'ICU-02',
      admissionDate: '2024-01-19',
      estimatedStay: '5-7 days',
      priority: 'High',
      status: 'Stable',
      vitalSigns: {
        bp: '110/70',
        pulse: '95',
        temperature: '37.2°C',
        oxygen: '96%',
        respiratoryRate: '18/min',
        consciousness: 'GCS 15/15'
      },
      medications: ['Antibiotics', 'IV Fluids', 'Pain Management'],
      equipment: ['ECG Monitor', 'Pulse Oximeter', 'IV Pump'],
      lastUpdate: '5 minutes ago',
      alerts: []
    },
    {
      id: 3,
      patientName: 'Mohammad Ali',
      patientId: 'P003',
      age: 72,
      gender: 'Male',
      diagnosis: 'Post-Cardiac Surgery',
      admittingDoctor: 'Dr. Emily Davis',
      bedNumber: 'ICU-03',
      admissionDate: '2024-01-20',
      estimatedStay: '3-5 days',
      priority: 'High',
      status: 'Improving',
      vitalSigns: {
        bp: '130/80',
        pulse: '75',
        temperature: '36.8°C',
        oxygen: '98%',
        respiratoryRate: '16/min',
        consciousness: 'GCS 15/15'
      },
      medications: ['Anticoagulants', 'Pain Management', 'Antibiotics'],
      equipment: ['ECG Monitor', 'Pulse Oximeter', 'Chest Drain'],
      lastUpdate: '10 minutes ago',
      alerts: []
    },
    {
      id: 4,
      patientName: 'Aisha Khan',
      patientId: 'P004',
      age: 28,
      gender: 'Female',
      diagnosis: 'Traumatic Brain Injury',
      admittingDoctor: 'Dr. Lisa Anderson',
      bedNumber: 'ICU-04',
      admissionDate: '2024-01-20',
      estimatedStay: '10-14 days',
      priority: 'Critical',
      status: 'Critical',
      vitalSigns: {
        bp: '140/90',
        pulse: '110',
        temperature: '37.5°C',
        oxygen: '92%',
        respiratoryRate: '22/min',
        consciousness: 'GCS 6/15'
      },
      medications: ['Mannitol', 'Anticonvulsants', 'Sedatives'],
      equipment: ['Ventilator', 'ICP Monitor', 'ECG Monitor'],
      lastUpdate: '1 minute ago',
      alerts: ['Increased ICP', 'Decreased Consciousness']
    }
  ];

  const bedTypes = [
    'ICU-01',
    'ICU-02', 
    'ICU-03',
    'ICU-04',
    'ICU-05',
    'ICU-06',
    'ICU-07',
    'ICU-08'
  ];

  const diagnoses = [
    'Acute Respiratory Distress Syndrome (ARDS)',
    'Septic Shock',
    'Post-Cardiac Surgery',
    'Traumatic Brain Injury',
    'Multiple Organ Failure',
    'Acute Kidney Injury',
    'Severe Pneumonia',
    'Cardiac Arrest',
    'Stroke',
    'Severe Trauma',
    'Burns',
    'Post-Transplant'
  ];

  const getStatusBadge = (status) => {
    const config = {
      'Critical': 'danger',
      'Stable': 'success',
      'Improving': 'info',
      'Deteriorating': 'warning'
    };
    return <Badge bg={config[status] || 'secondary'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const config = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger',
      'Critical': 'danger'
    };
    return <Badge bg={config[priority] || 'secondary'}>{priority}</Badge>;
  };

  const filteredPatients = icuPatients.filter(patient =>
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.bedNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Beds', value: bedTypes.length, color: 'primary' },
    { label: 'Occupied', value: icuPatients.length, color: 'warning' },
    { label: 'Available', value: bedTypes.length - icuPatients.length, color: 'success' },
    { label: 'Critical Patients', value: icuPatients.filter(p => p.status === 'Critical').length, color: 'danger' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('New ICU admission data:', formData);
    setShowAdmissionModal(false);
    setFormData({
      patientName: '',
      patientId: '',
      age: '',
      gender: '',
      diagnosis: '',
      admittingDoctor: '',
      bedNumber: '',
      admissionDate: '',
      estimatedStay: '',
      priority: 'High',
      notes: ''
    });
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 gradient-text">Intensive Care Unit</h2>
          <p className="text-muted mb-0">Monitor critical patients, manage beds, and track vital signs</p>
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

      {/* Emergency Alert */}
      {icuPatients.filter(p => p.status === 'Critical').length > 0 && (
        <Alert variant="danger" className="mb-4">
          <AlertTriangle size={20} className="me-2" />
          <strong>Critical Alert:</strong> {icuPatients.filter(p => p.status === 'Critical').length} patients in critical condition requiring immediate attention.
        </Alert>
      )}

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
              placeholder="Search patients by name, diagnosis, or bed number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </CardBody>
      </Card>

      {/* ICU Patients Table */}
      <Card className="border-0 shadow-lg glass">
        <CardHeader className="border-0 pb-0">
          <h5 className="mb-0 fw-semibold">ICU Patients</h5>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Bed</th>
                  <th>Diagnosis</th>
                  <th>Vital Signs</th>
                  <th>Status</th>
                  <th>Last Update</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className={patient.status === 'Critical' ? 'table-danger' : ''}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <User size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="fw-semibold">{patient.patientName}</div>
                          <small className="text-muted">ID: {patient.patientId} • {patient.age} {patient.gender}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Bed size={16} className="me-2 text-primary" />
                        <div>
                          <div className="fw-medium">{patient.bedNumber}</div>
                          <small className="text-muted">Dr. {patient.admittingDoctor.split(' ').pop()}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium">{patient.diagnosis}</div>
                      <small className="text-muted">Admitted: {patient.admissionDate}</small>
                    </td>
                    <td>
                      <div className="small">
                        <div><Heart size={12} className="me-1" />BP: {patient.vitalSigns.bp}</div>
                        <div><Activity size={12} className="me-1" />Pulse: {patient.vitalSigns.pulse}</div>
                        <div><Thermometer size={12} className="me-1" />Temp: {patient.vitalSigns.temperature}</div>
                        <div><Droplets size={12} className="me-1" />O2: {patient.vitalSigns.oxygen}</div>
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(patient.status)}
                      {getPriorityBadge(patient.priority)}
                      {patient.alerts.length > 0 && (
                        <div className="mt-1">
                          <small className="text-danger">
                            <AlertTriangle size={12} className="me-1" />
                            {patient.alerts.length} alerts
                          </small>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="small text-muted">
                        <Clock size={12} className="me-1" />
                        {patient.lastUpdate}
                      </div>
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
                            <Monitor size={16} className="me-2" />
                            Monitor Vitals
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Stethoscope size={16} className="me-2" />
                            Update Status
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Edit size={16} className="me-2" />
                            Edit Patient
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="text-success">
                            <CheckCircle size={16} className="me-2" />
                            Discharge
                          </Dropdown.Item>
                          <Dropdown.Item className="text-danger">
                            <Trash2 size={16} className="me-2" />
                            Transfer
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
          <Modal.Title>New ICU Admission</Modal.Title>
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
                  <FormLabel>Priority</FormLabel>
                  <Form.Select 
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Diagnosis</FormLabel>
                  <Form.Select 
                    value={formData.diagnosis}
                    onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                    required
                  >
                    <option value="">Select Diagnosis</option>
                    {diagnoses.map((diagnosis, index) => (
                      <option key={index} value={diagnosis}>{diagnosis}</option>
                    ))}
                  </Form.Select>
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
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Bed Number</FormLabel>
                  <Form.Select 
                    value={formData.bedNumber}
                    onChange={(e) => handleInputChange('bedNumber', e.target.value)}
                    required
                  >
                    <option value="">Select Bed</option>
                    {bedTypes.filter(bed => !icuPatients.find(p => p.bedNumber === bed)).map((bed, index) => (
                      <option key={index} value={bed}>{bed}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Admission Date</FormLabel>
                  <FormControl 
                    type="date" 
                    value={formData.admissionDate}
                    onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Estimated Stay</FormLabel>
                  <FormControl 
                    type="text" 
                    value={formData.estimatedStay}
                    onChange={(e) => handleInputChange('estimatedStay', e.target.value)}
                    placeholder="e.g., 5-7 days"
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
                placeholder="Initial assessment, special requirements, etc."
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
      <Modal show={selectedPatient && setShowPatientModal} onHide={() => setSelectedPatient(null)} size="xl">
        <ModalHeader closeButton>
          <Modal.Title>Patient Details - {selectedPatient?.patientName}</Modal.Title>
        </ModalHeader>
        <ModalBody>
          {selectedPatient ? (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Patient Information</h6>
                  <div className="p-3 bg-light rounded">
                    <div className="mb-2"><strong>Name:</strong> {selectedPatient.patientName}</div>
                    <div className="mb-2"><strong>ID:</strong> {selectedPatient.patientId}</div>
                    <div className="mb-2"><strong>Age:</strong> {selectedPatient.age} years</div>
                    <div className="mb-2"><strong>Gender:</strong> {selectedPatient.gender}</div>
                    <div className="mb-2"><strong>Diagnosis:</strong> {selectedPatient.diagnosis}</div>
                    <div className="mb-2"><strong>Admitting Doctor:</strong> {selectedPatient.admittingDoctor}</div>
                    <div className="mb-2"><strong>Bed:</strong> {selectedPatient.bedNumber}</div>
                    <div className="mb-2"><strong>Admission Date:</strong> {selectedPatient.admissionDate}</div>
                    <div className="mb-2"><strong>Estimated Stay:</strong> {selectedPatient.estimatedStay}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <h6>Current Status</h6>
                  <div className="p-3 bg-light rounded">
                    <div className="mb-2">
                      <strong>Status:</strong> {getStatusBadge(selectedPatient.status)}
                    </div>
                    <div className="mb-2">
                      <strong>Priority:</strong> {getPriorityBadge(selectedPatient.priority)}
                    </div>
                    <div className="mb-2">
                      <strong>Last Update:</strong> {selectedPatient.lastUpdate}
                    </div>
                    {selectedPatient.alerts.length > 0 && (
                      <div className="mb-2">
                        <strong>Alerts:</strong>
                        <div className="mt-1">
                          {selectedPatient.alerts.map((alert, index) => (
                            <Badge key={index} bg="danger" className="me-1">
                              {alert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={12}>
                  <h6>Vital Signs</h6>
                  <div className="p-3 bg-light rounded">
                    <Row>
                      <Col md={2}>
                        <div className="text-center">
                          <Heart size={24} className="text-danger mb-1" />
                          <div><strong>Blood Pressure</strong></div>
                          <div className="text-primary">{selectedPatient.vitalSigns.bp}</div>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="text-center">
                          <Activity size={24} className="text-warning mb-1" />
                          <div><strong>Pulse</strong></div>
                          <div className="text-primary">{selectedPatient.vitalSigns.pulse} bpm</div>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="text-center">
                          <Thermometer size={24} className="text-info mb-1" />
                          <div><strong>Temperature</strong></div>
                          <div className="text-primary">{selectedPatient.vitalSigns.temperature}</div>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="text-center">
                          <Droplets size={24} className="text-success mb-1" />
                          <div><strong>Oxygen</strong></div>
                          <div className="text-primary">{selectedPatient.vitalSigns.oxygen}</div>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="text-center">
                          <Brain size={24} className="text-secondary mb-1" />
                          <div><strong>Respiratory</strong></div>
                          <div className="text-primary">{selectedPatient.vitalSigns.respiratoryRate}</div>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="text-center">
                          <Zap size={24} className="text-dark mb-1" />
                          <div><strong>Consciousness</strong></div>
                          <div className="text-primary">{selectedPatient.vitalSigns.consciousness}</div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <h6>Current Medications</h6>
                  <div className="p-3 bg-light rounded">
                    {selectedPatient.medications.map((med, index) => (
                      <div key={index} className="mb-1">
                        <Shield size={16} className="me-2 text-primary" />
                        {med}
                      </div>
                    ))}
                  </div>
                </Col>
                <Col md={6}>
                  <h6>Equipment</h6>
                  <div className="p-3 bg-light rounded">
                    {selectedPatient.equipment.map((equipment, index) => (
                      <div key={index} className="mb-1">
                        <Monitor size={16} className="me-2 text-success" />
                        {equipment}
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <div className="text-center">
              <p>Loading patient details...</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setSelectedPatient(null)}>
            Close
          </Button>
          <Button variant="primary">Update Patient</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ICU; 