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
  Pill,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Pharmacy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const medicines = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Pain Relief',
      manufacturer: 'Square Pharmaceuticals',
      stock: 150,
      unit: 'Tablets',
      price: 2.50,
      status: 'In Stock',
      expiryDate: '2025-12-31',
      reorderLevel: 20
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotics',
      manufacturer: 'Beximco Pharmaceuticals',
      stock: 45,
      unit: 'Capsules',
      price: 8.75,
      status: 'Low Stock',
      expiryDate: '2024-06-30',
      reorderLevel: 50
    },
    {
      id: 3,
      name: 'Omeprazole 20mg',
      genericName: 'Omeprazole',
      category: 'Gastrointestinal',
      manufacturer: 'Incepta Pharmaceuticals',
      stock: 0,
      unit: 'Tablets',
      price: 12.00,
      status: 'Out of Stock',
      expiryDate: '2025-03-15',
      reorderLevel: 30
    },
    {
      id: 4,
      name: 'Metformin 500mg',
      genericName: 'Metformin',
      category: 'Diabetes',
      manufacturer: 'Renata Limited',
      stock: 89,
      unit: 'Tablets',
      price: 5.25,
      status: 'In Stock',
      expiryDate: '2025-09-20',
      reorderLevel: 25
    },
    {
      id: 5,
      name: 'Cetirizine 10mg',
      genericName: 'Cetirizine',
      category: 'Antihistamine',
      manufacturer: 'Opsonin Pharma',
      stock: 12,
      unit: 'Tablets',
      price: 3.50,
      status: 'Low Stock',
      expiryDate: '2024-08-10',
      reorderLevel: 15
    }
  ];

  const getStatusBadge = (status) => {
    const config = {
      'In Stock': 'success',
      'Low Stock': 'warning',
      'Out of Stock': 'danger'
    };
    return <Badge bg={config[status] || 'secondary'} className="fw-semibold">{status}</Badge>;
  };

  const getStockIcon = (status) => {
    if (status === 'Out of Stock') return <AlertTriangle size={16} className="text-danger" />;
    if (status === 'Low Stock') return <TrendingDown size={16} className="text-warning" />;
    return <TrendingUp size={16} className="text-success" />;
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Medicines', value: medicines.length, color: 'primary' },
    { label: 'In Stock', value: medicines.filter(m => m.status === 'In Stock').length, color: 'success' },
    { label: 'Low Stock', value: medicines.filter(m => m.status === 'Low Stock').length, color: 'warning' },
    { label: 'Out of Stock', value: medicines.filter(m => m.status === 'Out of Stock').length, color: 'danger' }
  ];

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 gradient-text">Pharmacy</h2>
          <p className="text-muted mb-0">Manage medicines, inventory, and prescriptions</p>
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
          Add Medicine
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
              placeholder="Search medicines by name, generic name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </CardBody>
      </Card>

      {/* Medicines Table */}
      <Card className="border-0 shadow-lg glass">
        <CardHeader className="border-0 pb-0">
          <h5 className="mb-0 fw-semibold">Medicines Inventory</h5>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Manufacturer</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td>
                      <div>
                        <div className="fw-semibold">{medicine.name}</div>
                        <small className="text-muted">{medicine.genericName}</small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info" className="fw-semibold">
                        {medicine.category}
                      </Badge>
                    </td>
                    <td>
                      <div className="fw-medium">{medicine.manufacturer}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {getStockIcon(medicine.status)}
                        <span className="ms-2 fw-medium">
                          {medicine.stock} {medicine.unit}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium">৳{medicine.price}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{medicine.expiryDate}</div>
                    </td>
                    <td>
                      {getStatusBadge(medicine.status)}
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
                          <Dropdown.Item>
                            <Package size={16} className="me-2" />
                            Update Stock
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

      {/* Add Medicine Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Add New Medicine</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Medicine Name</FormLabel>
                  <FormControl type="text" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Generic Name</FormLabel>
                  <FormControl type="text" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Category</FormLabel>
                  <Form.Select required>
                    <option value="">Select Category</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Antihistamine">Antihistamine</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Respiratory">Respiratory</option>
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl type="text" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl type="number" required />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Unit</FormLabel>
                  <Form.Select required>
                    <option value="">Select Unit</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Capsules">Capsules</option>
                    <option value="Bottles">Bottles</option>
                    <option value="Tubes">Tubes</option>
                    <option value="Vials">Vials</option>
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup className="mb-3">
                  <FormLabel>Price (৳)</FormLabel>
                  <FormControl type="number" step="0.01" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl type="date" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <FormLabel>Reorder Level</FormLabel>
                  <FormControl type="number" required />
                </FormGroup>
              </Col>
            </Row>
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
            Add Medicine
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Pharmacy; 