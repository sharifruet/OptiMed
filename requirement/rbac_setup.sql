-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS user_otp;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS role_functions;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS login_logs;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS functions;
DROP TABLE IF EXISTS roles;

-- =========================
-- Enhanced Roles & Permissions System
-- =========================

CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    permission_key VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    module VARCHAR(50),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE functions (
    function_id INT AUTO_INCREMENT PRIMARY KEY,
    function_name VARCHAR(100) NOT NULL UNIQUE,
    function_key VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    module VARCHAR(50),
    route VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    granted_by INT,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

CREATE TABLE role_functions (
    role_id INT NOT NULL,
    function_id INT NOT NULL,
    granted_by INT,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, function_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (function_id) REFERENCES functions(function_id) ON DELETE CASCADE
);

-- =========================
-- Enhanced Users & Authentication
-- =========================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    language_preference ENUM('Bengali', 'English') DEFAULT 'English',
    last_login TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Multiple roles per user
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_by INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

CREATE TABLE user_otp (
    otp_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    otp_type ENUM('LOGIN', 'PASSWORD_RESET', 'REPORT_ACCESS') NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================
-- Sample Data for Enhanced RBAC
-- =========================

-- Insert Roles
INSERT INTO roles (role_name, description) VALUES
('Super Admin', 'Full system access with all privileges'),
('Hospital Admin', 'Hospital management and administrative functions'),
('Doctor', 'Medical staff with patient care privileges'),
('Nurse', 'Nursing staff with patient care privileges'),
('Lab Technician', 'Laboratory testing and results management'),
('Receptionist', 'Patient registration and appointment management'),
('Pharmacist', 'Pharmacy and medication management'),
('Accountant', 'Billing and financial management'),
('Manager', 'Department management and reporting'),
('Patient', 'Patient portal access');

-- Insert Permissions
INSERT INTO permissions (permission_name, permission_key, description, module, category) VALUES
-- Patient Management
('Create Patient', 'patient.create', 'Can create new patient records', 'Patient', 'CRUD'),
('Read Patient', 'patient.read', 'Can view patient information', 'Patient', 'CRUD'),
('Update Patient', 'patient.update', 'Can modify patient records', 'Patient', 'CRUD'),
('Delete Patient', 'patient.delete', 'Can delete patient records', 'Patient', 'CRUD'),

-- Appointment Management
('Create Appointment', 'appointment.create', 'Can create appointments', 'Appointment', 'CRUD'),
('Read Appointment', 'appointment.read', 'Can view appointments', 'Appointment', 'CRUD'),
('Update Appointment', 'appointment.update', 'Can modify appointments', 'Appointment', 'CRUD'),
('Delete Appointment', 'appointment.delete', 'Can delete appointments', 'Appointment', 'CRUD'),

-- Laboratory Management
('Create Lab Test', 'lab.create', 'Can create lab tests', 'Laboratory', 'CRUD'),
('Read Lab Test', 'lab.read', 'Can view lab tests', 'Laboratory', 'CRUD'),
('Update Lab Test', 'lab.update', 'Can modify lab tests', 'Laboratory', 'CRUD'),
('Delete Lab Test', 'lab.delete', 'Can delete lab tests', 'Laboratory', 'CRUD'),

-- IPD Management
('Create IPD Admission', 'ipd.create', 'Can create IPD admissions', 'IPD', 'CRUD'),
('Read IPD Records', 'ipd.read', 'Can view IPD records', 'IPD', 'CRUD'),
('Update IPD Records', 'ipd.update', 'Can modify IPD records', 'IPD', 'CRUD'),
('Discharge Patient', 'ipd.discharge', 'Can discharge IPD patients', 'IPD', 'CRUD'),

-- Emergency Management
('Create Emergency Case', 'emergency.create', 'Can create emergency cases', 'Emergency', 'CRUD'),
('Read Emergency Cases', 'emergency.read', 'Can view emergency cases', 'Emergency', 'CRUD'),
('Update Emergency Cases', 'emergency.update', 'Can modify emergency cases', 'Emergency', 'CRUD'),

-- Operation Theater
('Create Surgery', 'ot.create', 'Can create surgery schedules', 'OperationTheater', 'CRUD'),
('Read Surgery', 'ot.read', 'Can view surgery schedules', 'OperationTheater', 'CRUD'),
('Update Surgery', 'ot.update', 'Can modify surgery schedules', 'OperationTheater', 'CRUD'),
('Delete Surgery', 'ot.delete', 'Can delete surgery schedules', 'OperationTheater', 'CRUD'),

-- ICU Management
('Create ICU Admission', 'icu.create', 'Can create ICU admissions', 'ICU', 'CRUD'),
('Read ICU Records', 'icu.read', 'Can view ICU records', 'ICU', 'CRUD'),
('Update ICU Records', 'icu.update', 'Can modify ICU records', 'ICU', 'CRUD'),
('Monitor Vitals', 'icu.monitor', 'Can monitor patient vitals', 'ICU', 'CRUD'),

-- Staff Roster
('Create Roster', 'roster.create', 'Can create staff rosters', 'Roster', 'CRUD'),
('Read Roster', 'roster.read', 'Can view staff rosters', 'Roster', 'CRUD'),
('Update Roster', 'roster.update', 'Can modify staff rosters', 'Roster', 'CRUD'),
('Delete Roster', 'roster.delete', 'Can delete staff rosters', 'Roster', 'CRUD'),

-- Reports
('Generate Reports', 'reports.generate', 'Can generate reports', 'Reports', 'Reports'),
('View Reports', 'reports.view', 'Can view reports', 'Reports', 'Reports'),
('Export Reports', 'reports.export', 'Can export reports', 'Reports', 'Reports'),

-- User Management
('Create User', 'user.create', 'Can create new users', 'User', 'CRUD'),
('Read User', 'user.read', 'Can view user information', 'User', 'CRUD'),
('Update User', 'user.update', 'Can modify user information', 'User', 'CRUD'),
('Delete User', 'user.delete', 'Can delete users', 'User', 'CRUD'),

-- Role Management
('Create Role', 'role.create', 'Can create new roles', 'Role', 'CRUD'),
('Read Role', 'role.read', 'Can view role information', 'Role', 'CRUD'),
('Update Role', 'role.update', 'Can modify role information', 'Role', 'CRUD'),
('Delete Role', 'role.delete', 'Can delete roles', 'Role', 'CRUD'),
('Assign Permissions', 'role.permissions', 'Can assign permissions to roles', 'Role', 'CRUD');

-- Insert Functions
INSERT INTO functions (function_name, function_key, description, module, route) VALUES
-- Patient Functions
('Add Patient', 'add_patient', 'Add new patient to the system', 'Patient', '/patients/add'),
('View Patients', 'view_patients', 'View all patients', 'Patient', '/patients'),
('Edit Patient', 'edit_patient', 'Edit patient information', 'Patient', '/patients/edit'),
('Delete Patient', 'delete_patient', 'Delete patient record', 'Patient', '/patients/delete'),

-- Appointment Functions
('Schedule Appointment', 'schedule_appointment', 'Schedule new appointment', 'Appointment', '/appointments/schedule'),
('View Appointments', 'view_appointments', 'View all appointments', 'Appointment', '/appointments'),
('Edit Appointment', 'edit_appointment', 'Edit appointment details', 'Appointment', '/appointments/edit'),
('Cancel Appointment', 'cancel_appointment', 'Cancel appointment', 'Appointment', '/appointments/cancel'),

-- Laboratory Functions
('Create Lab Test', 'create_lab_test', 'Create new lab test', 'Laboratory', '/laboratory/create'),
('View Lab Tests', 'view_lab_tests', 'View all lab tests', 'Laboratory', '/laboratory'),
('Update Lab Results', 'update_lab_results', 'Update lab test results', 'Laboratory', '/laboratory/update'),

-- IPD Functions
('Admit Patient', 'admit_patient', 'Admit patient to IPD', 'IPD', '/ipd/admit'),
('View IPD Patients', 'view_ipd_patients', 'View IPD patients', 'IPD', '/ipd'),
('Update IPD Status', 'update_ipd_status', 'Update IPD patient status', 'IPD', '/ipd/update'),
('Discharge Patient', 'discharge_patient', 'Discharge IPD patient', 'IPD', '/ipd/discharge'),

-- Emergency Functions
('Create Emergency Case', 'create_emergency_case', 'Create emergency case', 'Emergency', '/emergency/create'),
('View Emergency Cases', 'view_emergency_cases', 'View emergency cases', 'Emergency', '/emergency'),
('Update Emergency Case', 'update_emergency_case', 'Update emergency case', 'Emergency', '/emergency/update'),

-- OT Functions
('Schedule Surgery', 'schedule_surgery', 'Schedule surgery', 'OperationTheater', '/ot/schedule'),
('View Surgeries', 'view_surgeries', 'View all surgeries', 'OperationTheater', '/ot'),
('Update Surgery', 'update_surgery', 'Update surgery details', 'OperationTheater', '/ot/update'),
('Cancel Surgery', 'cancel_surgery', 'Cancel surgery', 'OperationTheater', '/ot/cancel'),

-- ICU Functions
('Admit to ICU', 'admit_to_icu', 'Admit patient to ICU', 'ICU', '/icu/admit'),
('View ICU Patients', 'view_icu_patients', 'View ICU patients', 'ICU', '/icu'),
('Update ICU Status', 'update_icu_status', 'Update ICU patient status', 'ICU', '/icu/update'),
('Monitor Vitals', 'monitor_vitals', 'Monitor patient vitals', 'ICU', '/icu/monitor'),

-- Roster Functions
('Create Roster', 'create_roster', 'Create staff roster', 'Roster', '/roster/create'),
('View Roster', 'view_roster', 'View staff roster', 'Roster', '/roster'),
('Update Roster', 'update_roster', 'Update staff roster', 'Roster', '/roster/update'),
('Delete Roster', 'delete_roster', 'Delete staff roster', 'Roster', '/roster/delete'),

-- Report Functions
('Generate Reports', 'generate_reports', 'Generate system reports', 'Reports', '/reports/generate'),
('View Reports', 'view_reports', 'View all reports', 'Reports', '/reports'),
('Export Reports', 'export_reports', 'Export reports', 'Reports', '/reports/export'),

-- User Management Functions
('Add User', 'add_user', 'Add new user', 'User', '/users/add'),
('View Users', 'view_users', 'View all users', 'User', '/users'),
('Edit User', 'edit_user', 'Edit user information', 'User', '/users/edit'),
('Delete User', 'delete_user', 'Delete user', 'User', '/users/delete'),

-- Role Management Functions
('Add Role', 'add_role', 'Add new role', 'Role', '/roles/add'),
('View Roles', 'view_roles', 'View all roles', 'Role', '/roles'),
('Edit Role', 'edit_role', 'Edit role information', 'Role', '/roles/edit'),
('Delete Role', 'delete_role', 'Delete role', 'Role', '/roles/delete'),
('Manage Permissions', 'manage_permissions', 'Manage role permissions', 'Role', '/roles/permissions');

-- =========================
-- Assign Permissions to Roles
-- =========================

-- Super Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, permission_id FROM permissions;

-- Hospital Admin gets most permissions except user/role management
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, permission_id FROM permissions 
WHERE module NOT IN ('User', 'Role');

-- Doctor gets patient and appointment permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, permission_id FROM permissions 
WHERE module IN ('Patient', 'Appointment', 'IPD', 'ICU', 'Emergency', 'OperationTheater');

-- Nurse gets patient care permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, permission_id FROM permissions 
WHERE module IN ('Patient', 'Appointment', 'IPD', 'ICU', 'Emergency');

-- Lab Technician gets lab permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 5, permission_id FROM permissions 
WHERE module IN ('Laboratory', 'Patient');

-- Receptionist gets patient and appointment permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 6, permission_id FROM permissions 
WHERE module IN ('Patient', 'Appointment');

-- Pharmacist gets pharmacy permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 7, permission_id FROM permissions 
WHERE module IN ('Pharmacy', 'Patient');

-- Accountant gets billing permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 8, permission_id FROM permissions 
WHERE module IN ('Billing', 'Reports');

-- Manager gets management permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 9, permission_id FROM permissions 
WHERE module IN ('Patient', 'Appointment', 'Reports', 'Roster');

-- =========================
-- Assign Functions to Roles
-- =========================

-- Super Admin gets all functions
INSERT INTO role_functions (role_id, function_id)
SELECT 1, function_id FROM functions;

-- Hospital Admin gets most functions except user/role management
INSERT INTO role_functions (role_id, function_id)
SELECT 2, function_id FROM functions 
WHERE module NOT IN ('User', 'Role');

-- Doctor gets patient care functions
INSERT INTO role_functions (role_id, function_id)
SELECT 3, function_id FROM functions 
WHERE module IN ('Patient', 'Appointment', 'IPD', 'ICU', 'Emergency', 'OperationTheater');

-- Nurse gets patient care functions
INSERT INTO role_functions (role_id, function_id)
SELECT 4, function_id FROM functions 
WHERE module IN ('Patient', 'Appointment', 'IPD', 'ICU', 'Emergency');

-- Lab Technician gets lab functions
INSERT INTO role_functions (role_id, function_id)
SELECT 5, function_id FROM functions 
WHERE module IN ('Laboratory', 'Patient');

-- Receptionist gets patient and appointment functions
INSERT INTO role_functions (role_id, function_id)
SELECT 6, function_id FROM functions 
WHERE module IN ('Patient', 'Appointment');

-- Pharmacist gets pharmacy functions
INSERT INTO role_functions (role_id, function_id)
SELECT 7, function_id FROM functions 
WHERE module IN ('Pharmacy', 'Patient');

-- Accountant gets billing functions
INSERT INTO role_functions (role_id, function_id)
SELECT 8, function_id FROM functions 
WHERE module IN ('Billing', 'Reports');

-- Manager gets management functions
INSERT INTO role_functions (role_id, function_id)
SELECT 9, function_id FROM functions 
WHERE module IN ('Patient', 'Appointment', 'Reports', 'Roster');

-- =========================
-- Create Sample Users with Multiple Roles
-- =========================

-- Create users (password is 'password' for all)
INSERT INTO users (full_name, email, phone, password_hash, status) VALUES
('System Administrator', 'admin@hospital.com', '+880-1712345678', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ACTIVE'),
('Hospital Manager', 'manager@hospital.com', '+880-1712345679', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ACTIVE'),
('Dr. Mohammad Rahman', 'dr.rahman@hospital.com', '+880-1712345680', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ACTIVE'),
('Nurse Fatima Begum', 'nurse.fatima@hospital.com', '+880-1712345681', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ACTIVE'),
('Lab Technician Ali', 'lab.ali@hospital.com', '+880-1712345682', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ACTIVE'),
('Receptionist Ayesha', 'reception.ayesha@hospital.com', '+880-1712345683', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ACTIVE'),
('Pharmacist Karim', 'pharma.karim@hospital.com', '+880-1712345684', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ACTIVE'),
('Accountant Sajid', 'account.sajid@hospital.com', '+880-1712345685', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ACTIVE');

-- Assign multiple roles to users
INSERT INTO user_roles (user_id, role_id, is_primary) VALUES
(1, 1, TRUE), -- Admin has Super Admin role (primary)
(2, 2, TRUE), -- Manager has Hospital Admin role (primary)
(2, 9, FALSE), -- Manager also has Manager role
(3, 3, TRUE), -- Dr. Rahman has Doctor role (primary)
(3, 9, FALSE), -- Dr. Rahman also has Manager role
(4, 4, TRUE), -- Nurse Fatima has Nurse role (primary)
(5, 5, TRUE), -- Lab Ali has Lab Technician role (primary)
(6, 6, TRUE), -- Receptionist Ayesha has Receptionist role (primary)
(7, 7, TRUE), -- Pharmacist Karim has Pharmacist role (primary)
(8, 8, TRUE); -- Accountant Sajid has Accountant role (primary)
