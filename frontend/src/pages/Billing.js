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
  CreditCard,
  DollarSign,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const bills = [
    {
      id: 1,
      patientName: 'Ahmed Rahman',
      patientId: 'P001',
      billNumber: 'BILL-2024-001',
      amount: 2500.00,
      paid: 2500.00,
      balance: 0.00,
      status: 'Paid',
      date: '2024-01-15',
      dueDate: '2024-01-15',
      items: ['Consultation', 'Lab Tests', 'Medicines']
    },
    {
      id: 2,
      patientName: 'Fatima Begum',
      patientId: 'P002',
      billNumber: 'BILL-2024-002',
      amount: 1800.00,
      paid: 1000.00,
      balance: 800.00,
      status: 'Partial',
      date: '2024-01-16',
      dueDate: '2024-01-23',
      items: ['Surgery', 'Room Charges', 'Medicines']
    },
    {
      id: 3,
      patientName: 'Mohammad Ali',
      patientId: 'P003',
      billNumber: 'BILL-2024-003',
      amount: 3200.00,
      paid: 0.00,
      balance: 3200.00,
      status: 'Pending',
      date: '2024-01-17',
      dueDate: '2024-01-24',
      items: ['Emergency Care', 'X-Ray', 'Medicines']
    },
    {
      id: 4,
      patientName: 'Ayesha Khan',
      patientId: 'P004',
      billNumber: 'BILL-2024-004',
      amount: 950.00,
      paid: 950.00,
      balance: 0.00,
      status: 'Paid',
      date: '2024-01-18',
      dueDate: '2024-01-18',
      items: ['Consultation', 'Medicines']
    },
    {
      id: 5,
      patientName: 'Abdul Karim',
      patientId: 'P005',
      billNumber: 'BILL-2024-005',
      amount: 4200.00,
      paid: 0.00,
      balance: 4200.00,
      status: 'Overdue',
      date: '2024-01-10',
      dueDate: '2024-01-17',
      items: ['ICU Charges', 'Specialist Consultation', 'Medicines']
    }
  ];

  const getStatusBadge = (status) => {
    const config = {
      'Paid': 'success',
      'Partial': 'warning',
      'Pending': 'info',
      'Overdue': 'danger'
    };
    return <Badge bg={config[status] || 'secondary'} className="fw-semibold">{status}</Badge>;
  };

  const getStatusIcon = (status) => {
    if (status === 'Paid') return <CheckCircle size={16} className="text-success" />;
    if (status === 'Partial') return <Clock size={16} className="text-warning" />;
    if (status === 'Overdue') return <AlertCircle size={16} className="text-danger" />;
    return <Clock size={16} className="text-info" />;
  };

  const filteredBills = bills.filter(bill =>
    bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Bills', value: bills.length, color: 'primary' },
    { label: 'Paid', value: bills.filter(b => b.status === 'Paid').length, color: 'success' },
    { label: 'Pending', value: bills.filter(b => b.status === 'Pending').length, color: 'info' },
    { label: 'Overdue', value: bills.filter(b => b.status === 'Overdue').length, color: 'danger' }
  ];

  const totalRevenue = bills.reduce((sum, bill) => sum + bill.paid, 0);
  const totalOutstanding = bills.reduce((sum, bill) => sum + bill.balance, 0);

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 gradient-text">Billing</h2>
          <p className="text-muted mb-0">Manage patient bills and payments</p>
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
          New Bill
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

      {/* Revenue Cards */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="stats-card border-0 shadow-lg glass">
            <CardBody className="p-4">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                  <DollarSign size={24} className="text-success" />
                </div>
                <div>
                  <h4 className="text-success mb-1 fw-bold">৳{totalRevenue.toLocaleString()}</h4>
                  <p className="text-muted mb-0">Total Revenue</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="stats-card border-0 shadow-lg glass">
            <CardBody className="p-4">
              <div className="d-flex align-items-center">
                <div className="bg-danger bg-opacity-10 rounded-circle p-3 me-3">
                  <AlertCircle size={24} className="text-danger" />
                </div>
                <div>
                  <h4 className="text-danger mb-1 fw-bold">৳{totalOutstanding.toLocaleString()}</h4>
                  <p className="text-muted mb-0">Outstanding Amount</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Search */}
      <Card className="border-0 shadow-lg glass mb-4">
        <CardBody>
          <InputGroup>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <FormControl
              placeholder="Search bills by patient name, bill number, or patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </CardBody>
      </Card>

      {/* Bills Table */}
      <Card className="border-0 shadow-lg glass">
        <CardHeader className="border-0 pb-0">
          <h5 className="mb-0 fw-semibold">Bills List</h5>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>Bill Details</th>
                  <th>Patient</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill.id}>
                    <td>
                      <div>
                        <div className="fw-semibold">{bill.billNumber}</div>
                        <small className="text-muted">{bill.date}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">{bill.patientName}</div>
                        <small className="text-muted">ID: {bill.patientId}</small>
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold">৳{bill.amount.toLocaleString()}</div>
                    </td>
                    <td>
                      <div className="fw-medium text-success">৳{bill.paid.toLocaleString()}</div>
                    </td>
                    <td>
                      <div className="fw-medium text-danger">৳{bill.balance.toLocaleString()}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{bill.dueDate}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {getStatusIcon(bill.status)}
                        <span className="ms-2">{getStatusBadge(bill.status)}</span>
                      </div>
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
                            <Receipt size={16} className="me-2" />
                            Print Bill
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <CreditCard size={16} className="me-2" />
                            Record Payment
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

      {/* Add Bill Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Create New Bill</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl type="text" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Patient ID</FormLabel>
                  <FormControl type="text" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Bill Date</FormLabel>
                  <FormControl type="date" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Due Date</FormLabel>
                  <FormControl type="date" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl type="number" step="0.01" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Payment Status</FormLabel>
                  <Form.Select required>
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className="mb-3">
              <FormLabel>Services/Items</FormLabel>
              <FormControl as="textarea" rows={3} placeholder="Enter services or items included in the bill" />
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
            Create Bill
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Billing; 