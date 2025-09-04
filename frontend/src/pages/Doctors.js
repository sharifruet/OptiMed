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
  FormLabel
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
  Stethoscope,
  Award,
  Phone,
  Mail
} from 'lucide-react';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      phone: '+880 1712-345678',
      specialization: 'Cardiology',
      experience: '15 years',
      status: 'Active',
      department: 'Cardiology',
      patients: 245,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      email: 'michael.chen@hospital.com',
      phone: '+880 1812-345679',
      specialization: 'Neurology',
      experience: '12 years',
      status: 'Active',
      department: 'Neurology',
      patients: 189,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      email: 'emily.davis@hospital.com',
      phone: '+880 1912-345680',
      specialization: 'Pediatrics',
      experience: '8 years',
      status: 'Active',
      department: 'Pediatrics',
      patients: 156,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Dr. Robert Wilson',
      email: 'robert.wilson@hospital.com',
      phone: '+880 1612-345681',
      specialization: 'Orthopedics',
      experience: '20 years',
      status: 'Active',
      department: 'Orthopedics',
      patients: 312,
      rating: 4.6
    },
    {
      id: 5,
      name: 'Dr. Lisa Anderson',
      email: 'lisa.anderson@hospital.com',
      phone: '+880 1512-345682',
      specialization: 'Dermatology',
      experience: '10 years',
      status: 'Inactive',
      department: 'Dermatology',
      patients: 98,
      rating: 4.5
    }
  ];

  const getStatusBadge = (status) => {
    return status === 'Active' ? 
      <Badge bg="success" className="fw-semibold">Active</Badge> : 
      <Badge bg="secondary" className="fw-semibold">Inactive</Badge>;
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Doctors', value: doctors.length, color: 'primary' },
    { label: 'Active Doctors', value: doctors.filter(d => d.status === 'Active').length, color: 'success' },
    { label: 'Departments', value: new Set(doctors.map(d => d.department)).size, color: 'info' },
    { label: 'Avg Rating', value: (doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length).toFixed(1), color: 'warning' }
  ];

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 gradient-text">Doctors</h2>
          <p className="text-muted mb-0">Manage hospital doctors and specialists</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          className="shadow-sm"
          style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
            border: 'none'
          }}
        >
          <Plus size={16} className="me-2" />
          Add Doctor
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
              placeholder="Search doctors by name, specialization, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </CardBody>
      </Card>

      {/* Doctors Table */}
      <Card className="border-0 shadow-lg glass">
        <CardHeader className="border-0 pb-0">
          <h5 className="mb-0 fw-semibold">Doctors List</h5>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Experience</th>
                  <th>Patients</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <User size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="fw-semibold">{doctor.name}</div>
                          <small className="text-muted">{doctor.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Stethoscope size={16} className="me-2 text-primary" />
                        {doctor.specialization}
                      </div>
                    </td>
                    <td>
                      <Badge bg="info" className="fw-semibold">
                        {doctor.department}
                      </Badge>
                    </td>
                    <td>
                      <div className="fw-medium">{doctor.experience}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{doctor.patients}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Award size={16} className="me-1 text-warning" />
                        <span className="fw-medium">{doctor.rating}</span>
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(doctor.status)}
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="link" className="text-decoration-none">
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>
                            <Eye size={16} className="me-2" />
                            View Details
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Edit size={16} className="me-2" />
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Divider />
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
        </CardBody>
      </Card>

      {/* Add Doctor Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Add New Doctor</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl type="text" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl type="email" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Phone</FormLabel>
                  <FormControl type="tel" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Specialization</FormLabel>
                  <FormControl type="text" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Experience</FormLabel>
                  <FormControl type="text" placeholder="e.g., 10 years" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Department</FormLabel>
                  <Form.Select required>
                    <option value="">Select Department</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Surgery">Surgery</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="mb-3">
              <FormLabel>Education</FormLabel>
              <FormControl type="text" placeholder="e.g., MBBS, MD (Cardiology)" required />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary"
            style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
              border: 'none'
            }}
          >
            Add Doctor
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Doctors; 