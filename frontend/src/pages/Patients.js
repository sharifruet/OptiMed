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
  Phone,
  Mail,
  MapPin,
  Calendar,
  User
} from 'lucide-react';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: '',
    status: 'Active'
  });

  // Sample patient data
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Ahmed Rahman',
      email: 'ahmed.rahman@email.com',
      phone: '+880 1712-345678',
      age: 35,
      gender: 'Male',
      bloodGroup: 'A+',
      status: 'Active',
      lastVisit: '2024-01-15',
      address: 'Dhaka, Bangladesh'
    },
    {
      id: 2,
      name: 'Fatima Begum',
      email: 'fatima.begum@email.com',
      phone: '+880 1812-345679',
      age: 28,
      gender: 'Female',
      bloodGroup: 'O+',
      status: 'Active',
      lastVisit: '2024-01-14',
      address: 'Chittagong, Bangladesh'
    },
    {
      id: 3,
      name: 'Mohammad Ali',
      email: 'mohammad.ali@email.com',
      phone: '+880 1912-345680',
      age: 45,
      gender: 'Male',
      bloodGroup: 'B+',
      status: 'Inactive',
      lastVisit: '2024-01-10',
      address: 'Sylhet, Bangladesh'
    },
    {
      id: 4,
      name: 'Ayesha Khan',
      email: 'ayesha.khan@email.com',
      phone: '+880 1612-345681',
      age: 32,
      gender: 'Female',
      bloodGroup: 'AB+',
      status: 'Active',
      lastVisit: '2024-01-16',
      address: 'Rajshahi, Bangladesh'
    },
    {
      id: 5,
      name: 'Abdul Karim',
      email: 'abdul.karim@email.com',
      phone: '+880 1512-345682',
      age: 50,
      gender: 'Male',
      bloodGroup: 'A-',
      status: 'Active',
      lastVisit: '2024-01-13',
      address: 'Khulna, Bangladesh'
    }
  ]);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age.toString(),
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      address: patient.address,
      status: patient.status
    });
    setShowEditModal(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPatient = () => {
    const newPatient = {
      id: patients.length + 1,
      ...formData,
      age: parseInt(formData.age),
      lastVisit: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => [...prev, newPatient]);
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdatePatient = () => {
    const updatedPatients = patients.map(patient => 
      patient.id === selectedPatient.id 
        ? { 
            ...patient, 
            ...formData, 
            age: parseInt(formData.age),
            lastVisit: new Date().toISOString().split('T')[0]
          }
        : patient
    );
    setPatients(updatedPatients);
    setShowEditModal(false);
    resetForm();
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(prev => prev.filter(patient => patient.id !== patientId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      bloodGroup: '',
      address: '',
      status: 'Active'
    });
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Patients</h2>
          <p className="text-muted mb-0">Manage patient information and records</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="d-flex align-items-center"
        >
          <Plus size={16} className="me-2" />
          Add Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <CardBody>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="d-flex justify-content-end">
              <Button variant="outline-secondary" className="d-flex align-items-center">
                <Filter size={16} className="me-2" />
                Filters
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Patients Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Patient List</h5>
            <Badge bg="primary">{filteredPatients.length} patients</Badge>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Patient</th>
                <th>Contact</th>
                <th>Age/Gender</th>
                <th>Blood Group</th>
                <th>Status</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                        <User size={16} className="text-primary" />
                      </div>
                      <div>
                        <div className="fw-medium">{patient.name}</div>
                        <small className="text-muted">ID: {patient.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="small">
                        <Mail size={12} className="me-1" />
                        {patient.email}
                      </div>
                      <div className="small text-muted">
                        <Phone size={12} className="me-1" />
                        {patient.phone}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-medium">{patient.age} years</div>
                      <small className="text-muted">{patient.gender}</small>
                    </div>
                  </td>
                  <td>
                    <Badge bg="outline-secondary" className="border">
                      {patient.bloodGroup}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={patient.status === 'Active' ? 'success' : 'secondary'}>
                      {patient.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="small">
                      <Calendar size={12} className="me-1" />
                      {patient.lastVisit}
                    </div>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        <MoreVertical size={14} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleViewPatient(patient)}>
                          <Eye size={14} className="me-2" />
                          View Details
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleEditPatient(patient)}>
                          <Edit size={14} className="me-2" />
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          className="text-danger"
                          onClick={() => handleDeletePatient(patient.id)}
                        >
                          <Trash2 size={14} className="me-2" />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Add Patient Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Add New Patient</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl 
                    type="text" 
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl 
                    type="email" 
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl 
                    type="tel" 
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Age</FormLabel>
                  <FormControl 
                    type="number" 
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Gender</FormLabel>
                  <Form.Select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Blood Group</FormLabel>
                  <Form.Select
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Status</FormLabel>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="mb-3">
              <FormLabel>Address</FormLabel>
              <FormControl 
                as="textarea" 
                rows={3} 
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddPatient}>
            Add Patient
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Edit Patient - {selectedPatient?.name}</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl 
                    type="text" 
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl 
                    type="email" 
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl 
                    type="tel" 
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Age</FormLabel>
                  <FormControl 
                    type="number" 
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Gender</FormLabel>
                  <Form.Select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Blood Group</FormLabel>
                  <Form.Select
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Status</FormLabel>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="mb-3">
              <FormLabel>Address</FormLabel>
              <FormControl 
                as="textarea" 
                rows={3} 
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdatePatient}>
            Update Patient
          </Button>
        </ModalFooter>
      </Modal>

      {/* View Patient Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </ModalHeader>
        <ModalBody>
          {selectedPatient && (
            <div>
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                  <User size={32} className="text-primary" />
                </div>
                <h4>{selectedPatient.name}</h4>
                <p className="text-muted">Patient ID: {selectedPatient.id}</p>
              </div>
              
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Email:</strong>
                    <div className="d-flex align-items-center mt-1">
                      <Mail size={14} className="me-2 text-muted" />
                      {selectedPatient.email}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Phone:</strong>
                    <div className="d-flex align-items-center mt-1">
                      <Phone size={14} className="me-2 text-muted" />
                      {selectedPatient.phone}
                    </div>
                  </div>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Age:</strong> {selectedPatient.age} years
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Gender:</strong> {selectedPatient.gender}
                  </div>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Blood Group:</strong>
                    <Badge bg="outline-secondary" className="ms-2 border">
                      {selectedPatient.bloodGroup}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Status:</strong>
                    <Badge bg={selectedPatient.status === 'Active' ? 'success' : 'secondary'} className="ms-2">
                      {selectedPatient.status}
                    </Badge>
                  </div>
                </Col>
              </Row>
              
              <div className="mb-3">
                <strong>Address:</strong>
                <div className="d-flex align-items-center mt-1">
                  <MapPin size={14} className="me-2 text-muted" />
                  {selectedPatient.address}
                </div>
              </div>
              
              <div className="mb-3">
                <strong>Last Visit:</strong>
                <div className="d-flex align-items-center mt-1">
                  <Calendar size={14} className="me-2 text-muted" />
                  {selectedPatient.lastVisit}
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowViewModal(false);
            handleEditPatient(selectedPatient);
          }}>
            Edit Patient
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Patients; 