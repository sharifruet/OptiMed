import React, { useState, useEffect, useRef } from 'react';
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
  Calendar,
  Clock,
  User,
  Phone
} from 'lucide-react';
import axios from 'axios';

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    type: 'Consultation'
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Date, 3: Select Slot, 4: Patient Details
  const dropdownRef = useRef(null);

  // Fetch appointments and doctors data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appointmentsRes, doctorsRes] = await Promise.all([
          axios.get('/appointments'),
          axios.get('/doctors')
        ]);
        
        setAppointments(appointmentsRes.data.data || []);
        setDoctors(doctorsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch appointments and doctors data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const config = {
      'Scheduled': 'primary',
      'Completed': 'success',
      'Cancelled': 'danger'
    };
    return <Badge bg={config[status] || 'secondary'}>{status}</Badge>;
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
    doctor.department.toLowerCase().includes(doctorSearchTerm.toLowerCase())
  );

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor.name);
    setFormData(prev => ({ 
      ...prev, 
      doctorId: doctor.id,
      doctorName: doctor.name 
    }));
    setDoctorSearchTerm(doctor.name);
    setShowDoctorDropdown(false);
    setStep(2); // Move to date selection step
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date }));
    
    try {
      // Fetch available slots for the selected doctor and date
      const response = await axios.get(`/doctors/${formData.doctorId}/slots?date=${date}`);
      if (response.data.success) {
        setAvailableSlots(response.data.data.slots);
        setStep(3); // Move to slot selection step
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setError('Failed to fetch available slots');
    }
  };

  const handleSlotSelect = (slot) => {
    setFormData(prev => ({ ...prev, time: slot.time }));
    setStep(4); // Move to patient details step
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientPhone: '',
      doctorId: '',
      doctorName: '',
      date: '',
      time: '',
      type: 'Consultation'
    });
    setSelectedDoctor('');
    setDoctorSearchTerm('');
    setSelectedDate('');
    setAvailableSlots([]);
    setStep(1);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.patientName || !formData.patientPhone || !formData.doctorId || !formData.doctorName || !formData.date || !formData.time) {
        setError('Please fill in all required fields');
        return;
      }

      // Create appointment
      const response = await axios.post('/appointments', formData);
      
      if (response.data.success) {
        // Add new appointment to the list
        setAppointments(prev => [...prev, response.data.data]);
        
        // Reset form and close modal
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError(error.response?.data?.message || 'Failed to create appointment');
    }
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDoctorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 gradient-text">Appointments</h2>
          <p className="text-muted mb-0">Manage patient appointments and scheduling</p>
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
          New Appointment
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card className="border-0 shadow-lg glass mb-4">
        <CardBody>
          <InputGroup>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <FormControl
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </CardBody>
      </Card>

      <Card className="border-0 shadow-lg glass">
        <CardHeader className="border-0 pb-0">
          <h5 className="mb-0 fw-semibold">Appointments List</h5>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div className="fw-semibold">{appointment.patientName}</div>
                      <small className="text-muted">
                        <Phone size={12} className="me-1" />
                        {appointment.patientPhone}
                      </small>
                    </td>
                    <td>
                      <div className="fw-medium">{appointment.doctorName}</div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">{appointment.date}</div>
                        <small className="text-muted">{appointment.time}</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Calendar size={16} className="me-2 text-primary" />
                        {appointment.type}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(appointment.status)}
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

      <Modal show={showAddModal} onHide={() => {
        setShowAddModal(false);
        resetForm();
      }} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>
            {step === 1 && 'Step 1: Select Doctor'}
            {step === 2 && 'Step 2: Select Date'}
            {step === 3 && 'Step 3: Select Time Slot'}
            {step === 4 && 'Step 4: Patient Details'}
          </Modal.Title>
        </ModalHeader>
        <ModalBody>
          {/* Progress Indicator */}
          <div className="mb-4">
            <div className="d-flex justify-content-between">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="text-center">
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= stepNumber ? 'bg-primary text-white' : 'bg-light text-muted'}`} 
                       style={{ width: '30px', height: '30px', fontSize: '14px' }}>
                    {stepNumber}
                  </div>
                  <div className="mt-1 small">
                    {stepNumber === 1 && 'Doctor'}
                    {stepNumber === 2 && 'Date'}
                    {stepNumber === 3 && 'Time'}
                    {stepNumber === 4 && 'Details'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div>
              <h6 className="mb-3">Choose a doctor for the appointment</h6>
              <FormGroup className="mb-3">
                <FormLabel>Select Doctor</FormLabel>
                <div className="position-relative" ref={dropdownRef}>
                  <FormControl
                    type="text"
                    placeholder="Search and select doctor..."
                    value={doctorSearchTerm}
                    onChange={(e) => {
                      setDoctorSearchTerm(e.target.value);
                      setShowDoctorDropdown(true);
                      setSelectedDoctor('');
                    }}
                    onFocus={() => setShowDoctorDropdown(true)}
                    required
                  />
                  {showDoctorDropdown && (
                    <div className="doctor-dropdown">
                      {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                          <div
                            key={doctor.id}
                            className="doctor-dropdown-item"
                            onClick={() => handleDoctorSelect(doctor)}
                          >
                            <div className="doctor-name">{doctor.name}</div>
                            <div className="doctor-details">
                              {doctor.specialization} • {doctor.department}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="doctor-dropdown-item text-muted">No doctors found</div>
                      )}
                    </div>
                  )}
                </div>
              </FormGroup>
            </div>
          )}

          {/* Step 2: Select Date */}
          {step === 2 && (
            <div>
              <h6 className="mb-3">Select appointment date for {formData.doctorName}</h6>
              <FormGroup className="mb-3">
                <FormLabel>Appointment Date</FormLabel>
                <FormControl 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => handleDateSelect(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required 
                />
              </FormGroup>
            </div>
          )}

          {/* Step 3: Select Time Slot */}
          {step === 3 && (
            <div>
              <h6 className="mb-3">Available time slots for {formData.doctorName} on {selectedDate}</h6>
              {availableSlots.length > 0 ? (
                <div className="row">
                  {availableSlots.map((slot) => (
                    <div key={slot.slotId} className="col-md-3 mb-2">
                      <Button
                        variant="outline-primary"
                        className="w-100"
                        onClick={() => handleSlotSelect(slot)}
                      >
                        {slot.time}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert variant="info">
                  No available slots for the selected date. Please choose another date.
                </Alert>
              )}
            </div>
          )}

          {/* Step 4: Patient Details */}
          {step === 4 && (
            <div>
              <h6 className="mb-3">Complete appointment details</h6>
              <div className="mb-3 p-3 bg-light rounded">
                <strong>Selected:</strong> {formData.doctorName} - {selectedDate} at {formData.time}
              </div>
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
                    <FormLabel>Patient Phone Number</FormLabel>
                    <FormControl 
                      type="tel" 
                      value={formData.patientPhone}
                      onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                      placeholder="+880 1XXX-XXXXXX"
                      required 
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup className="mb-3">
                <FormLabel>Appointment Type</FormLabel>
                <Form.Select 
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Emergency">Emergency</option>
                </Form.Select>
              </FormGroup>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => {
            setShowAddModal(false);
            resetForm();
          }}>
            Cancel
          </Button>
          {step > 1 && (
            <Button variant="outline-secondary" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step === 4 && (
            <Button 
              variant="primary"
              onClick={handleSubmit}
              style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
                border: 'none'
              }}
            >
              Confirm Appointment
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Appointments; 