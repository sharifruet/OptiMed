import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import Pharmacy from './pages/Pharmacy';
import Laboratory from './pages/Laboratory';
import Billing from './pages/Billing';
import IPD from './pages/IPD';
import Emergency from './pages/Emergency';
import OperationTheater from './pages/OperationTheater';
import ICU from './pages/ICU';
import Roster from './pages/Roster';
import Reports from './pages/Reports';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="pharmacy" element={<Pharmacy />} />
          <Route path="laboratory" element={<Laboratory />} />
          <Route path="billing" element={<Billing />} />
          <Route path="ipd" element={<IPD />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="ot" element={<OperationTheater />} />
          <Route path="icu" element={<ICU />} />
          <Route path="roster" element={<Roster />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App; 