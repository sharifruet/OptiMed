import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Alert,
  Row,
  Col,
  InputGroup,
  FormControl,
  Dropdown
} from 'react-bootstrap';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  User,
  Settings,
  MoreVertical
} from 'lucide-react';
import axios from 'axios';

const DoctorSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    workingDays: [],
    workingHours: { start: '09:00', end: '17:00' },
    slotDuration: 30,
    breakTime: { start: '12:00', end: '13:00' },
    dayOffs: [],
    isActive: true
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  const workingDaysOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const slotDurationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [doctorsRes, schedulesRes] = await Promise.all([
        axios.get('/doctors'),
        axios.get('/doctors/schedules/all')
      ]);
      
      setDoctors(doctorsRes.data.data || []);
      setSchedules(schedulesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch doctors and schedules data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingDaysChange = (day) => {
    setFormData(prev => {
      const newWorkingDays = prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day];
      
      const newDayOffs = workingDaysOptions.filter(d => !newWorkingDays.includes(d));
      
      return {
        ...prev,
        workingDays: newWorkingDays,
        dayOffs: newDayOffs
      };
    });
  };

  const handleSubmit = async () => {
    try {
      if (!selectedDoctor) {
        setError('Please select a doctor');
        return;
      }

      if (formData.workingDays.length === 0) {
        setError('Please select at least one working day');
        return;
      }

      const response = await axios.put(`/doctors/${selectedDoctor.id}/schedule`, formData);
      
      if (response.data.success) {
        setShowScheduleModal(false);
        setSelectedDoctor(null);
        setFormData({
          workingDays: [],
          workingHours: { start: '09:00', end: '17:00' },
          slotDuration: 30,
          breakTime: { start: '12:00', end: '13:00' },
          dayOffs: [],
          isActive: true
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      setError(error.response?.data?.message || 'Failed to update schedule');
    }
  };

  const handleEditSchedule = (schedule) => {
    const doctor = doctors.find(d => d.id === schedule.doctorId);
    setSelectedDoctor(doctor);
    setFormData({
      workingDays: schedule.workingDays,
      workingHours: schedule.workingHours,
      slotDuration: schedule.slotDuration,
      breakTime: schedule.breakTime,
      dayOffs: schedule.dayOffs,
      isActive: schedule.isActive
    });
    setShowScheduleModal(true);
  };

  const getStatusBadge = (isActive) => {
    return isActive ? <Badge bg="success">Active</Badge> : <Badge bg="secondary">Inactive</Badge>;
  };

  const filteredSchedules = schedules.filter(schedule => {
    const doctor = doctors.find(d => d.id === schedule.doctorId);
    return doctor && doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><Calendar className="me-2" />Doctor Schedules</h2>
        <Button variant="primary" onClick={() => setShowScheduleModal(true)}>
          <Plus className="me-2" size={16} />
          Add Schedule
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <FormControl
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Working Days</th>
                <th>Working Hours</th>
                <th>Slot Duration</th>
                <th>Break Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.map((schedule) => {
                const doctor = doctors.find(d => d.id === schedule.doctorId);
                return (
                  <tr key={schedule.id}>
                    <td>
                      <div className="fw-semibold">{doctor?.name || 'Unknown'}</div>
                      <small className="text-muted">{doctor?.specialization}</small>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {schedule.workingDays.map((day) => (
                          <Badge key={day} bg="primary" className="small">
                            {day.slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium">
                        {schedule.workingHours.start} - {schedule.workingHours.end}
                      </div>
                    </td>
                    <td>
                      <Badge bg="info">{schedule.slotDuration} min</Badge>
                    </td>
                    <td>
                      <div className="small">
                        {schedule.breakTime.start} - {schedule.breakTime.end}
                      </div>
                    </td>
                    <td>{getStatusBadge(schedule.isActive)}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleEditSchedule(schedule)}>
                            <Edit className="me-2" size={16} />
                            Edit Schedule
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Schedule Modal */}
      <Modal show={showScheduleModal} onHide={() => {
        setShowScheduleModal(false);
        setSelectedDoctor(null);
        setFormData({
          workingDays: [],
          workingHours: { start: '09:00', end: '17:00' },
          slotDuration: 30,
          breakTime: { start: '12:00', end: '13:00' },
          dayOffs: [],
          isActive: true
        });
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDoctor ? `Edit Schedule - ${selectedDoctor.name}` : 'Add Doctor Schedule'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedDoctor && (
            <Form.Group className="mb-3">
              <Form.Label>Select Doctor</Form.Label>
              <Form.Select
                value={selectedDoctor?.id || ''}
                onChange={(e) => {
                  const doctor = doctors.find(d => d.id === parseInt(e.target.value));
                  setSelectedDoctor(doctor);
                }}
              >
                <option value="">Choose a doctor...</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {selectedDoctor && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Working Days</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {workingDaysOptions.map((day) => (
                    <Form.Check
                      key={day}
                      type="checkbox"
                      id={`day-${day}`}
                      label={day}
                      checked={formData.workingDays.includes(day)}
                      onChange={() => handleWorkingDaysChange(day)}
                      inline
                    />
                  ))}
                </div>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Working Hours Start</Form.Label>
                    <FormControl
                      type="time"
                      value={formData.workingHours.start}
                      onChange={(e) => handleInputChange('workingHours', { ...formData.workingHours, start: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Working Hours End</Form.Label>
                    <FormControl
                      type="time"
                      value={formData.workingHours.end}
                      onChange={(e) => handleInputChange('workingHours', { ...formData.workingHours, end: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Appointment Slot Duration</Form.Label>
                <Form.Select
                  value={formData.slotDuration}
                  onChange={(e) => handleInputChange('slotDuration', parseInt(e.target.value))}
                >
                  {slotDurationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Break Start</Form.Label>
                    <FormControl
                      type="time"
                      value={formData.breakTime.start}
                      onChange={(e) => handleInputChange('breakTime', { ...formData.breakTime, start: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Break End</Form.Label>
                    <FormControl
                      type="time"
                      value={formData.breakTime.end}
                      onChange={(e) => handleInputChange('breakTime', { ...formData.breakTime, end: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="isActive"
                  label="Schedule is active"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>
            Cancel
          </Button>
          {selectedDoctor && (
            <Button variant="primary" onClick={handleSubmit}>
              {selectedDoctor ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorSchedule;
