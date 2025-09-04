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
  TabPane
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
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  CalendarDays,
  UserCheck,
  UserX,
  RotateCcw,
  Settings
} from 'lucide-react';

const Roster = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('weekly');
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [formData, setFormData] = useState({
    staffName: '',
    department: '',
    shiftType: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    days: [],
    notes: ''
  });

  // Mock staff data
  const staffMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      department: 'Cardiology',
      phone: '+880 1712-345678',
      email: 'sarah.johnson@hospital.com',
      status: 'Active',
      currentShift: 'Morning',
      nextShift: '2024-01-21 08:00 AM'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Anesthesiologist',
      department: 'Anesthesiology',
      phone: '+880 1712-345679',
      email: 'michael.chen@hospital.com',
      status: 'Active',
      currentShift: 'Night',
      nextShift: '2024-01-21 08:00 PM'
    },
    {
      id: 3,
      name: 'Nurse Aisha Rahman',
      role: 'Registered Nurse',
      department: 'ICU',
      phone: '+880 1712-345680',
      email: 'aisha.rahman@hospital.com',
      status: 'Active',
      currentShift: 'Evening',
      nextShift: '2024-01-21 02:00 PM'
    },
    {
      id: 4,
      name: 'Dr. Emily Davis',
      role: 'Surgeon',
      department: 'Surgery',
      phone: '+880 1712-345681',
      email: 'emily.davis@hospital.com',
      status: 'On Leave',
      currentShift: null,
      nextShift: '2024-01-25 08:00 AM'
    },
    {
      id: 5,
      name: 'Tech Ahmed Ali',
      role: 'Lab Technician',
      department: 'Laboratory',
      phone: '+880 1712-345682',
      email: 'ahmed.ali@hospital.com',
      status: 'Active',
      currentShift: 'Morning',
      nextShift: '2024-01-21 08:00 AM'
    }
  ];

  // Mock roster data
  const weeklyRoster = [
    {
      id: 1,
      staffName: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      shiftType: 'Morning',
      startDate: '2024-01-20',
      endDate: '2024-01-26',
      startTime: '08:00 AM',
      endTime: '04:00 PM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      status: 'Confirmed',
      notes: 'Cardiac ward duty'
    },
    {
      id: 2,
      staffName: 'Dr. Michael Chen',
      department: 'Anesthesiology',
      shiftType: 'Night',
      startDate: '2024-01-20',
      endDate: '2024-01-26',
      startTime: '08:00 PM',
      endTime: '08:00 AM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      status: 'Confirmed',
      notes: 'Emergency anesthesia coverage'
    },
    {
      id: 3,
      staffName: 'Nurse Aisha Rahman',
      department: 'ICU',
      shiftType: 'Evening',
      startDate: '2024-01-20',
      endDate: '2024-01-26',
      startTime: '02:00 PM',
      endTime: '10:00 PM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      status: 'Pending',
      notes: 'ICU patient care'
    },
    {
      id: 4,
      staffName: 'Tech Ahmed Ali',
      department: 'Laboratory',
      shiftType: 'Morning',
      startDate: '2024-01-20',
      endDate: '2024-01-26',
      startTime: '08:00 AM',
      endTime: '04:00 PM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      status: 'Confirmed',
      notes: 'Lab testing and analysis'
    }
  ];

  const departments = [
    'Cardiology',
    'Anesthesiology',
    'Surgery',
    'ICU',
    'Emergency',
    'Laboratory',
    'Radiology',
    'Pharmacy',
    'Nursing',
    'Administration'
  ];

  const shiftTypes = [
    'Morning (8 AM - 4 PM)',
    'Evening (2 PM - 10 PM)',
    'Night (8 PM - 8 AM)',
    'Day (6 AM - 6 PM)',
    'Night (6 PM - 6 AM)',
    'Part-time (4 hours)',
    'On-call'
  ];

  const getStatusBadge = (status) => {
    const config = {
      'Active': 'success',
      'On Leave': 'warning',
      'Inactive': 'secondary',
      'Confirmed': 'success',
      'Pending': 'warning',
      'Cancelled': 'danger'
    };
    return <Badge bg={config[status] || 'secondary'}>{status}</Badge>;
  };

  const getShiftBadge = (shiftType) => {
    const config = {
      'Morning': 'primary',
      'Evening': 'info',
      'Night': 'dark',
      'Day': 'success',
      'Part-time': 'warning',
      'On-call': 'danger'
    };
    return <Badge bg={config[shiftType] || 'secondary'}>{shiftType}</Badge>;
  };

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoster = weeklyRoster.filter(roster =>
    roster.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roster.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roster.shiftType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Staff', value: staffMembers.length, color: 'primary' },
    { label: 'On Duty', value: staffMembers.filter(s => s.status === 'Active' && s.currentShift).length, color: 'success' },
    { label: 'On Leave', value: staffMembers.filter(s => s.status === 'On Leave').length, color: 'warning' },
    { label: 'Scheduled Shifts', value: weeklyRoster.length, color: 'info' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('New shift data:', formData);
    setShowShiftModal(false);
    setFormData({
      staffName: '',
      department: '',
      shiftType: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      days: [],
      notes: ''
    });
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 gradient-text">Staff Roster</h2>
          <p className="text-muted mb-0">Manage staff schedules, shifts, and duty assignments</p>
        </div>
        <div>
          <Button 
            variant="outline-primary" 
            className="me-2 shadow-sm"
            onClick={() => setShowStaffModal(true)}
          >
            <Users size={16} className="me-2" />
            Add Staff
          </Button>
          <Button 
            variant="primary" 
            onClick={() => setShowShiftModal(true)}
            className="shadow-sm"
            style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
              border: 'none'
            }}
          >
            <Plus size={16} className="me-2" />
            Schedule Shift
          </Button>
        </div>
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
              placeholder="Search staff by name, department, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Card className="border-0 shadow-lg glass mb-4">
        <CardHeader className="border-0 pb-0">
          <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <NavItem>
              <NavLink eventKey="weekly" className="border-0">
                <CalendarDays size={16} className="me-2" />
                Weekly Roster
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink eventKey="staff" className="border-0">
                <Users size={16} className="me-2" />
                Staff Directory
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink eventKey="calendar" className="border-0">
                <Calendar size={16} className="me-2" />
                Calendar View
              </NavLink>
            </NavItem>
          </Nav>
        </CardHeader>
        <CardBody className="p-0">
          <TabContent activeKey={activeTab}>
            <TabPane eventKey="weekly">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead>
                    <tr>
                      <th>Staff Member</th>
                      <th>Department</th>
                      <th>Shift</th>
                      <th>Schedule</th>
                      <th>Days</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoster.map((roster) => (
                      <tr key={roster.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <User size={20} className="text-primary" />
                            </div>
                            <div>
                              <div className="fw-semibold">{roster.staffName}</div>
                              <small className="text-muted">{roster.startTime} - {roster.endTime}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-medium">{roster.department}</div>
                        </td>
                        <td>
                          {getShiftBadge(roster.shiftType)}
                        </td>
                        <td>
                          <div className="fw-medium">{roster.startDate} to {roster.endDate}</div>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            {roster.days.map((day, index) => (
                              <Badge key={index} bg="light" text="dark" className="small">
                                {day}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(roster.status)}
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="link" className="text-decoration-none">
                              <MoreVertical size={16} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => {
                                setSelectedShift(roster);
                                setShowShiftModal(true);
                              }}>
                                <Eye size={16} className="me-2" />
                                View Details
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <Edit size={16} className="me-2" />
                                Edit Shift
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <UserCheck size={16} className="me-2" />
                                Confirm Shift
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="text-danger">
                                <Trash2 size={16} className="me-2" />
                                Cancel Shift
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

            <TabPane eventKey="staff">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead>
                    <tr>
                      <th>Staff Member</th>
                      <th>Department</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Current Shift</th>
                      <th>Next Shift</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((staff) => (
                      <tr key={staff.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <User size={20} className="text-primary" />
                            </div>
                            <div>
                              <div className="fw-semibold">{staff.name}</div>
                              <small className="text-muted">{staff.role}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-medium">{staff.department}</div>
                        </td>
                        <td>
                          <div className="small">
                            <div><Phone size={12} className="me-1" />{staff.phone}</div>
                            <div><Mail size={12} className="me-1" />{staff.email}</div>
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(staff.status)}
                        </td>
                        <td>
                          {staff.currentShift ? (
                            getShiftBadge(staff.currentShift)
                          ) : (
                            <span className="text-muted">Not assigned</span>
                          )}
                        </td>
                        <td>
                          <div className="small text-muted">{staff.nextShift}</div>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="link" className="text-decoration-none">
                              <MoreVertical size={16} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>
                                <Eye size={16} className="me-2" />
                                View Profile
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <Edit size={16} className="me-2" />
                                Edit Details
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <Calendar size={16} className="me-2" />
                                View Schedule
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="text-danger">
                                <UserX size={16} className="me-2" />
                                Deactivate
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

            <TabPane eventKey="calendar">
              <div className="p-4 text-center">
                <Calendar size={48} className="text-muted mb-3" />
                <h5>Calendar View</h5>
                <p className="text-muted">Interactive calendar view for staff scheduling - coming soon</p>
                <Button variant="outline-primary">
                  <Settings size={16} className="me-2" />
                  Configure Calendar
                </Button>
              </div>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>

      {/* Schedule Shift Modal */}
      <Modal show={showShiftModal} onHide={() => setShowShiftModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Schedule New Shift</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Staff Member</FormLabel>
                  <Form.Select 
                    value={formData.staffName}
                    onChange={(e) => handleInputChange('staffName', e.target.value)}
                    required
                  >
                    <option value="">Select Staff Member</option>
                    {staffMembers.map((staff) => (
                      <option key={staff.id} value={staff.name}>{staff.name} - {staff.department}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Department</FormLabel>
                  <Form.Select 
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Shift Type</FormLabel>
                  <Form.Select 
                    value={formData.shiftType}
                    onChange={(e) => handleInputChange('shiftType', e.target.value)}
                    required
                  >
                    <option value="">Select Shift Type</option>
                    {shiftTypes.map((shift, index) => (
                      <option key={index} value={shift}>{shift}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Start Date</FormLabel>
                  <FormControl 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>End Date</FormLabel>
                  <FormControl 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Start Time</FormLabel>
                  <FormControl 
                    type="time" 
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>End Time</FormLabel>
                  <FormControl 
                    type="time" 
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    required 
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="mb-3">
              <FormLabel>Working Days</FormLabel>
              <div className="d-flex gap-2 flex-wrap">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <Form.Check
                    key={day}
                    type="checkbox"
                    id={`day-${day}`}
                    label={day}
                    checked={formData.days.includes(day)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('days', [...formData.days, day]);
                      } else {
                        handleInputChange('days', formData.days.filter(d => d !== day));
                      }
                    }}
                  />
                ))}
              </div>
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Notes</FormLabel>
              <FormControl 
                as="textarea" 
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Special instructions, requirements, etc."
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowShiftModal(false)}>
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
            Schedule Shift
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Staff Modal */}
      <Modal show={showStaffModal} onHide={() => setShowStaffModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Add New Staff Member</Modal.Title>
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
                  <FormLabel>Role</FormLabel>
                  <FormControl type="text" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Department</FormLabel>
                  <Form.Select required>
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl type="tel" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl type="email" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Status</FormLabel>
                  <Form.Select>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowStaffModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">Add Staff Member</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Roster; 