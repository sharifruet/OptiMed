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
  Shield,
  MoreVertical,
  Key,
  Settings
} from 'lucide-react';
import axios from 'axios';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showFunctionsModal, setShowFunctionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form states
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    role_name: '',
    description: ''
  });
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedFunctions, setSelectedFunctions] = useState([]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
    fetchFunctions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/roles');
      setRoles(response.data.data || []);
    } catch (error) {
      setError('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('/roles/permissions/list');
      setPermissions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const fetchFunctions = async () => {
    try {
      const response = await axios.get('/roles/functions/list');
      setFunctions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching functions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRole) {
        await axios.put(`/roles/${selectedRole.role_id}`, formData);
      } else {
        await axios.post('/roles', formData);
      }
      
      setShowRoleModal(false);
      setSelectedRole(null);
      setFormData({ role_name: '', description: '' });
      fetchRoles();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save role');
    }
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setFormData({
      role_name: role.role_name,
      description: role.description || ''
    });
    setShowRoleModal(true);
  };

  const handleDeleteRole = async () => {
    try {
      await axios.delete(`/roles/${selectedRole.role_id}`);
      setShowDeleteModal(false);
      setSelectedRole(null);
      fetchRoles();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete role');
    }
  };

  const handlePermissionsSubmit = async () => {
    try {
      await axios.post(`/roles/${selectedRole.role_id}/permissions`, {
        permission_ids: selectedPermissions
      });
      setShowPermissionsModal(false);
      setSelectedPermissions([]);
      fetchRoles();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to assign permissions');
    }
  };

  const handleFunctionsSubmit = async () => {
    try {
      await axios.post(`/roles/${selectedRole.role_id}/functions`, {
        function_ids: selectedFunctions
      });
      setShowFunctionsModal(false);
      setSelectedFunctions([]);
      fetchRoles();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to assign functions');
    }
  };

  const handleManagePermissions = async (role) => {
    setSelectedRole(role);
    try {
      const response = await axios.get(`/roles/${role.role_id}`);
      const rolePermissions = response.data.data.permissions || [];
      setSelectedPermissions(rolePermissions.map(p => p.permission_id));
      setShowPermissionsModal(true);
    } catch (error) {
      setError('Failed to load role permissions');
    }
  };

  const handleManageFunctions = async (role) => {
    setSelectedRole(role);
    try {
      const response = await axios.get(`/roles/${role.role_id}`);
      const roleFunctions = response.data.data.functions || [];
      setSelectedFunctions(roleFunctions.map(f => f.function_id));
      setShowFunctionsModal(true);
    } catch (error) {
      setError('Failed to load role functions');
    }
  };

  const filteredRoles = roles.filter(role =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (userCount) => {
    if (userCount === 0) return <Badge bg="secondary">No Users</Badge>;
    return <Badge bg="success">{userCount} Users</Badge>;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><Shield className="me-2" />Role Management</h2>
        <Button variant="primary" onClick={() => setShowRoleModal(true)}>
          <Plus className="me-2" size={16} />
          Add New Role
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
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Description</th>
                <th>Users</th>
                <th>Permissions</th>
                <th>Functions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.role_id}>
                  <td><strong>{role.role_name}</strong></td>
                  <td>{role.description || 'No description'}</td>
                  <td>{getStatusBadge(role.user_count)}</td>
                  <td><Badge bg="primary">{role.permission_count} Permissions</Badge></td>
                  <td><Badge bg="secondary">{role.function_count} Functions</Badge></td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        <MoreVertical size={16} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEditRole(role)}>
                          <Edit className="me-2" size={16} />
                          Edit Role
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleManagePermissions(role)}>
                          <Key className="me-2" size={16} />
                          Manage Permissions
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleManageFunctions(role)}>
                          <Settings className="me-2" size={16} />
                          Manage Functions
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          onClick={() => {
                            setSelectedRole(role);
                            setShowDeleteModal(true);
                          }}
                          className="text-danger"
                        >
                          <Trash2 className="me-2" size={16} />
                          Delete Role
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Role Modal */}
      <Modal show={showRoleModal} onHide={() => {
        setShowRoleModal(false);
        setSelectedRole(null);
        setFormData({ role_name: '', description: '' });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedRole ? 'Edit Role' : 'Add New Role'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Role Name *</Form.Label>
              <Form.Control
                type="text"
                name="role_name"
                value={formData.role_name}
                onChange={handleInputChange}
                placeholder="Enter role name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter role description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {selectedRole ? 'Update Role' : 'Create Role'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Permissions Modal */}
      <Modal show={showPermissionsModal} onHide={() => setShowPermissionsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Manage Permissions - {selectedRole?.role_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {permissions.map((permission) => (
              <div key={permission.permission_id} className="col-md-6 mb-2">
                <Form.Check
                  type="checkbox"
                  id={`perm-${permission.permission_id}`}
                  label={permission.permission_name}
                  checked={selectedPermissions.includes(permission.permission_id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPermissions([...selectedPermissions, permission.permission_id]);
                    } else {
                      setSelectedPermissions(selectedPermissions.filter(id => id !== permission.permission_id));
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPermissionsModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePermissionsSubmit}>
            Save Permissions
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Functions Modal */}
      <Modal show={showFunctionsModal} onHide={() => setShowFunctionsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Manage Functions - {selectedRole?.role_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {functions.map((func) => (
              <div key={func.function_id} className="col-md-6 mb-2">
                <Form.Check
                  type="checkbox"
                  id={`func-${func.function_id}`}
                  label={func.function_name}
                  checked={selectedFunctions.includes(func.function_id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFunctions([...selectedFunctions, func.function_id]);
                    } else {
                      setSelectedFunctions(selectedFunctions.filter(id => id !== func.function_id));
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFunctionsModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFunctionsSubmit}>
            Save Functions
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            Are you sure you want to delete the role "{selectedRole?.role_name}"?
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteRole}>
            Delete Role
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoleManagement;
