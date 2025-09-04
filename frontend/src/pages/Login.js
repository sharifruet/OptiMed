import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
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
import { Eye, EyeOff, Heart, Lock, Mail, Activity, Users, Calendar, Pill } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Login successful!');
        // Navigation will be handled by useEffect when user state changes
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: 'admin@hospital.com',
      password: 'password'
    });
    
    setLoading(true);
    try {
      const result = await login('admin@hospital.com', 'password');
      if (result.success) {
        toast.success('Demo login successful!');
        // Navigation will be handled by useEffect when user state changes
      }
    } catch (error) {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center position-relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #06b6d4 100%)'
    }}>
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
        <div className="position-absolute" style={{ top: '10%', left: '10%', opacity: 0.1 }}>
          <Activity size={100} className="text-white" />
        </div>
        <div className="position-absolute" style={{ top: '20%', right: '15%', opacity: 0.1 }}>
          <Users size={80} className="text-white" />
        </div>
        <div className="position-absolute" style={{ bottom: '20%', left: '20%', opacity: 0.1 }}>
          <Calendar size={90} className="text-white" />
        </div>
        <div className="position-absolute" style={{ bottom: '15%', right: '10%', opacity: 0.1 }}>
          <Pill size={70} className="text-white" />
        </div>
      </div>

      <Container className="position-relative" style={{ zIndex: 1 }}>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="fade-in">
              <Card className="border-0 shadow-lg glass">
                <CardBody className="p-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3" style={{
                      background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)'
                    }}>
                      <Heart size={32} className="text-primary" />
                    </div>
                    <h2 className="fw-bold gradient-text mb-2">Welcome Back</h2>
                    <p className="text-muted mb-0">Sign in to your Hospital Management System</p>
                  </div>

                  {/* Demo Login Alert */}
                  <Alert variant="info" className="mb-4 border-0" style={{
                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
                    borderLeft: '4px solid var(--primary-color)'
                  }}>
                    <div className="d-flex align-items-center">
                      <Lock size={16} className="me-2 text-primary" />
                      <strong className="text-primary">Demo Credentials:</strong>
                    </div>
                    <small className="d-block mt-1 text-muted">
                      Email: admin@hospital.com | Password: password
                    </small>
                  </Alert>

                  {/* Login Form */}
                  <Form onSubmit={handleSubmit}>
                    <FormGroup className="mb-3">
                      <FormLabel className="fw-medium text-muted">
                        <Mail size={16} className="me-2 text-primary" />
                        Email Address
                      </FormLabel>
                      <FormControl
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="py-3 border-0 shadow-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                    </FormGroup>

                    <FormGroup className="mb-4">
                      <FormLabel className="fw-medium text-muted">
                        <Lock size={16} className="me-2 text-primary" />
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
                          className="py-3 border-0 shadow-sm"
                          style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)'
                          }}
                        />
                        <Button
                          variant="outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="border-0 shadow-sm"
                          style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </InputGroup>
                    </FormGroup>

                    <div className="d-grid gap-3 mb-3">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                        className="py-3 fw-semibold shadow-sm"
                        style={{
                          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
                          border: 'none'
                        }}
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
                        variant="outline-primary"
                        size="lg"
                        onClick={handleDemoLogin}
                        disabled={loading}
                        className="py-3 fw-semibold shadow-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid var(--primary-color)',
                          color: 'var(--primary-color)'
                        }}
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
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login; 