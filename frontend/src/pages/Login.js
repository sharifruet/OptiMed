import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Form, 
  FormGroup, 
  FormLabel, 
  FormControl, 
  Button, 
  Alert,
  InputGroup
} from 'react-bootstrap';
import { Eye, EyeOff, Heart, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: 'admin@hms.com',
      password: 'admin123'
    });
    
    setLoading(true);
    try {
      await login('admin@hms.com', 'admin123');
      toast.success('Demo login successful!');
    } catch (error) {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="border-0 shadow-lg">
              <CardBody className="p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                    <Heart size={32} className="text-primary" />
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Welcome Back</h2>
                  <p className="text-muted">Sign in to your Hospital Management System</p>
                </div>

                {/* Demo Login Alert */}
                <Alert variant="info" className="mb-4">
                  <div className="d-flex align-items-center">
                    <Lock size={16} className="me-2" />
                    <strong>Demo Credentials:</strong>
                  </div>
                  <small className="d-block mt-1">
                    Email: admin@hms.com | Password: admin123
                  </small>
                </Alert>

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  <FormGroup className="mb-3">
                    <FormLabel className="fw-medium">
                      <Mail size={16} className="me-2" />
                      Email Address
                    </FormLabel>
                    <FormControl
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="py-2"
                    />
                  </FormGroup>

                  <FormGroup className="mb-4">
                    <FormLabel className="fw-medium">
                      <Lock size={16} className="me-2" />
                      Password
                    </FormLabel>
                    <InputGroup>
                      <FormControl
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="py-2"
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="border-start-0"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </InputGroup>
                  </FormGroup>

                  <div className="d-grid gap-2 mb-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="py-2"
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </div>

                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="outline-secondary"
                      size="lg"
                      onClick={handleDemoLogin}
                      disabled={loading}
                      className="py-2"
                    >
                      Try Demo Login
                    </Button>
                  </div>
                </Form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    © 2024 Hospital Management System. All rights reserved.
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login; 