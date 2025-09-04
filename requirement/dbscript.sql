-- =========================
-- Hospital Management System Database Schema
-- Bangladesh Healthcare Context
-- Version: 3.0 - Enhanced RBAC with Multiple Roles
-- Date: 2025-01-27
-- =========================

-- =========================
-- 1. Enhanced Roles & Permissions System
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
    permission_key VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'patient.create', 'patient.read'
    description TEXT,
    module VARCHAR(50), -- Patient, Billing, Lab, Pharmacy, etc.
    category VARCHAR(50), -- CRUD, Reports, Settings, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE functions (
    function_id INT AUTO_INCREMENT PRIMARY KEY,
    function_name VARCHAR(100) NOT NULL UNIQUE,
    function_key VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'add_patient', 'view_reports'
    description TEXT,
    module VARCHAR(50),
    route VARCHAR(100), -- Frontend route or API endpoint
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
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE role_functions (
    role_id INT NOT NULL,
    function_id INT NOT NULL,
    granted_by INT,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, function_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (function_id) REFERENCES functions(function_id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =========================
-- 2. Enhanced Users & Authentication
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
    is_primary BOOLEAN DEFAULT FALSE, -- Primary role for the user
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON DELETE SET NULL
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
-- 3. Audit & Logging
-- =========================

CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE login_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    login_status ENUM('SUCCESS', 'FAILED', 'LOCKED') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =========================
-- 4. Sample Data for Enhanced RBAC
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
('Export Patient Data', 'patient.export', 'Can export patient data', 'Patient', 'Reports'),

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
('Generate Lab Report', 'lab.report', 'Can generate lab reports', 'Laboratory', 'Reports'),

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
('Assign Permissions', 'role.permissions', 'Can assign permissions to roles', 'Role', 'CRUD'),

-- System Settings
('View Settings', 'settings.view', 'Can view system settings', 'Settings', 'Settings'),
('Update Settings', 'settings.update', 'Can modify system settings', 'Settings', 'Settings');

-- Insert Functions
INSERT INTO functions (function_name, function_key, description, module, route) VALUES
-- Patient Functions
('Add Patient', 'add_patient', 'Add new patient to the system', 'Patient', '/patients/add'),
('View Patients', 'view_patients', 'View all patients', 'Patient', '/patients'),
('Edit Patient', 'edit_patient', 'Edit patient information', 'Patient', '/patients/edit'),
('Delete Patient', 'delete_patient', 'Delete patient record', 'Patient', '/patients/delete'),
('Export Patients', 'export_patients', 'Export patient data', 'Patient', '/patients/export'),

-- Appointment Functions
('Schedule Appointment', 'schedule_appointment', 'Schedule new appointment', 'Appointment', '/appointments/schedule'),
('View Appointments', 'view_appointments', 'View all appointments', 'Appointment', '/appointments'),
('Edit Appointment', 'edit_appointment', 'Edit appointment details', 'Appointment', '/appointments/edit'),
('Cancel Appointment', 'cancel_appointment', 'Cancel appointment', 'Appointment', '/appointments/cancel'),

-- Laboratory Functions
('Create Lab Test', 'create_lab_test', 'Create new lab test', 'Laboratory', '/laboratory/create'),
('View Lab Tests', 'view_lab_tests', 'View all lab tests', 'Laboratory', '/laboratory'),
('Update Lab Results', 'update_lab_results', 'Update lab test results', 'Laboratory', '/laboratory/update'),
('Generate Lab Report', 'generate_lab_report', 'Generate lab report', 'Laboratory', '/laboratory/report'),

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
('Manage Permissions', 'manage_permissions', 'Manage role permissions', 'Role', '/roles/permissions'),

-- Settings Functions
('View Settings', 'view_settings', 'View system settings', 'Settings', '/settings'),
('Update Settings', 'update_settings', 'Update system settings', 'Settings', '/settings/update');

-- =========================
-- 5. Assign Permissions to Roles
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
-- 6. Assign Functions to Roles
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
-- 7. Create Sample Users with Multiple Roles
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

-- =========================
-- 8. Continue with existing tables...
-- =========================

-- =========================
-- 3. Patient Management (Bangladesh context)
-- =========================

CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Link to users table for portal access (nullable)
    patient_code VARCHAR(50) UNIQUE NOT NULL,
    nid_number VARCHAR(20),
    passport_number VARCHAR(20),
    birth_certificate_no VARCHAR(20),
    dob DATE,
    gender ENUM('Male', 'Female', 'Other'),
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    marital_status ENUM('Single', 'Married', 'Divorced', 'Widowed'),
    religion VARCHAR(50),
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    guardian_name VARCHAR(100),
    guardian_relation VARCHAR(50),
    guardian_phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    division VARCHAR(50),
    district VARCHAR(50),
    upazila VARCHAR(50),
    union_name VARCHAR(50),
    ward_no VARCHAR(10),
    postal_code VARCHAR(10),
    occupation VARCHAR(100),
    monthly_income DECIMAL(12,2),
    insurance_provider VARCHAR(100),
    insurance_number VARCHAR(50),
    insurance_type ENUM('Government', 'Private', 'Corporate', 'None') DEFAULT 'None',
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    emergency_contact_address TEXT,
    preferred_language ENUM('Bengali', 'English') DEFAULT 'Bengali',
    patient_category ENUM('General', 'VIP', 'Corporate', 'Government') DEFAULT 'General',
    registration_source ENUM('Walk-in', 'Online', 'Referral', 'Emergency') DEFAULT 'Walk-in',
    status ENUM('Active', 'Inactive', 'Deceased') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =========================
-- 4. Appointments
-- =========================

CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT,
    appointment_date DATETIME NOT NULL,
    appointment_type ENUM('Consultation', 'Follow-up', 'Emergency', 'Procedure', 'Check-up') DEFAULT 'Consultation',
    duration_minutes INT DEFAULT 30,
    status ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED') DEFAULT 'SCHEDULED',
    priority ENUM('Low', 'Normal', 'High', 'Emergency') DEFAULT 'Normal',
    consultation_fee DECIMAL(10,2),
    notes TEXT,
    cancellation_reason TEXT,
    cancelled_by INT,
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (cancelled_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =========================
-- 5. Billing
-- =========================

CREATE TABLE bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_id INT,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    bill_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL,
    vat_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    outstanding_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    payment_method ENUM('Cash', 'Card', 'bKash', 'Nagad', 'Rocket', 'Bank Transfer', 'Insurance') DEFAULT 'Cash',
    status ENUM('DRAFT', 'ISSUED', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED') DEFAULT 'DRAFT',
    insurance_claim_id VARCHAR(100),
    insurance_claim_status ENUM('Not Submitted', 'Submitted', 'Approved', 'Rejected', 'Paid') DEFAULT 'Not Submitted',
    notes TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE TABLE bill_items (
    bill_item_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    item_type ENUM('Consultation', 'Laboratory', 'Pharmacy', 'Procedure', 'Room', 'Other') NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    vat_rate DECIMAL(5,2) DEFAULT 15.00,
    vat_amount DECIMAL(10,2) GENERATED ALWAYS AS (unit_price * quantity * vat_rate / 100) STORED,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) GENERATED ALWAYS AS (unit_price * quantity * discount_percentage / 100) STORED,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (unit_price * quantity + vat_amount - discount_amount) STORED,
    reference_id INT, -- Link to specific service (appointment_id, lab_order_id, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE
);

-- =========================
-- 6. Pharmacy & Drug Store Management
-- =========================

-- Drug Categories
CREATE TABLE drug_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drug Manufacturers
CREATE TABLE drug_manufacturers (
    manufacturer_id INT AUTO_INCREMENT PRIMARY KEY,
    manufacturer_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    license_number VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drug Items (Enhanced)
CREATE TABLE pharmacy_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    generic_name VARCHAR(100),
    brand_name VARCHAR(100),
    category_id INT,
    manufacturer_id INT,
    dosage_form ENUM('Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops', 'Inhaler', 'Suppository', 'Other') NOT NULL,
    strength VARCHAR(50),
    pack_size VARCHAR(50), -- e.g., "10 tablets", "100ml"
    storage_condition ENUM('Room Temperature', 'Refrigerated', 'Frozen') DEFAULT 'Room Temperature',
    therapeutic_class VARCHAR(100),
    is_controlled_substance BOOLEAN DEFAULT FALSE,
    controlled_substance_schedule VARCHAR(10), -- Schedule I, II, III, etc.
    requires_prescription BOOLEAN DEFAULT TRUE,
    is_antibiotic BOOLEAN DEFAULT FALSE,
    is_vaccine BOOLEAN DEFAULT FALSE,
    unit_cost DECIMAL(10,2) NOT NULL,
    markup_percentage DECIMAL(5,2) DEFAULT 20.00,
    selling_price DECIMAL(10,2) GENERATED ALWAYS AS (unit_cost * (1 + markup_percentage / 100)) STORED,
    reorder_level INT DEFAULT 10,
    reorder_quantity INT DEFAULT 50,
    status ENUM('Active', 'Inactive', 'Discontinued') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES drug_categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (manufacturer_id) REFERENCES drug_manufacturers(manufacturer_id) ON DELETE SET NULL
);

-- Suppliers
CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    tax_id VARCHAR(50),
    payment_terms VARCHAR(100),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Drug Stock (Batch-wise inventory)
CREATE TABLE drug_stock (
    stock_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    batch_number VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    manufacturing_date DATE,
    quantity_received INT NOT NULL,
    quantity_available INT NOT NULL,
    quantity_dispensed INT DEFAULT 0,
    unit_cost DECIMAL(10,2) NOT NULL,
    supplier_id INT,
    purchase_order_id INT,
    received_date DATE NOT NULL,
    received_by INT NOT NULL,
    quality_check_status ENUM('Pending', 'Passed', 'Failed') DEFAULT 'Pending',
    quality_check_notes TEXT,
    status ENUM('Active', 'Expired', 'Recalled', 'Damaged') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES pharmacy_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    FOREIGN KEY (received_by) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Purchase Orders
CREATE TABLE pharmacy_purchase_orders (
    po_id INT AUTO_INCREMENT PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INT NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('Draft', 'Sent', 'Confirmed', 'Received', 'Cancelled') DEFAULT 'Draft',
    notes TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Purchase Order Items
CREATE TABLE pharmacy_po_items (
    po_item_id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity_ordered INT NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED,
    quantity_received INT DEFAULT 0,
    received_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (po_id) REFERENCES pharmacy_purchase_orders(po_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES pharmacy_items(item_id) ON DELETE RESTRICT
);

CREATE TABLE prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id INT NOT NULL,
    doctor_id INT,
    appointment_id INT,
    prescription_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT,
    allergies TEXT,
    notes TEXT,
    status ENUM('Active', 'Completed', 'Cancelled', 'Expired') DEFAULT 'Active',
    is_emergency BOOLEAN DEFAULT FALSE,
    validity_days INT DEFAULT 30,
    expiry_date DATE GENERATED ALWAYS AS (DATE_ADD(prescription_date, INTERVAL validity_days DAY)) STORED,
    total_items INT DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL
);

CREATE TABLE prescription_items (
    prescription_item_id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    item_id INT NOT NULL,
    dosage VARCHAR(50) NOT NULL, -- e.g., "1 tablet twice daily"
    frequency VARCHAR(50), -- e.g., "Every 8 hours"
    duration_days INT,
    quantity_required INT NOT NULL,
    quantity_dispensed INT DEFAULT 0,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity_dispensed * unit_price) STORED,
    instructions TEXT,
    special_instructions TEXT,
    is_dispensed BOOLEAN DEFAULT FALSE,
    dispensed_at TIMESTAMP NULL,
    dispensed_by INT,
    dispensing_status ENUM('Pending', 'Partial', 'Complete', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES pharmacy_items(item_id) ON DELETE RESTRICT,
    FOREIGN KEY (dispensed_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =========================
-- 7. Laboratory
-- =========================

CREATE TABLE lab_tests (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(100) NOT NULL,
    test_code VARCHAR(20) UNIQUE,
    description TEXT,
    category VARCHAR(50),
    department VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    turnaround_time_hours INT DEFAULT 24,
    requires_fasting BOOLEAN DEFAULT FALSE,
    sample_type VARCHAR(50), -- Blood, Urine, Stool, etc.
    normal_range_min DECIMAL(10,2),
    normal_range_max DECIMAL(10,2),
    unit VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE lab_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT,
    appointment_id INT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    collection_date DATETIME,
    collection_notes TEXT,
    status ENUM('PENDING', 'COLLECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    priority ENUM('Routine', 'Urgent', 'Emergency') DEFAULT 'Routine',
    total_amount DECIMAL(10,2),
    payment_status ENUM('Pending', 'Paid', 'Partial') DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL
);

CREATE TABLE lab_order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    test_id INT NOT NULL,
    status ENUM('PENDING', 'COLLECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    result_value DECIMAL(10,2),
    result_text TEXT,
    result_unit VARCHAR(20),
    is_abnormal BOOLEAN DEFAULT FALSE,
    abnormal_flag ENUM('Low', 'High', 'Critical Low', 'Critical High') NULL,
    reference_range VARCHAR(100),
    notes TEXT,
    completed_at TIMESTAMP NULL,
    completed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES lab_orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES lab_tests(test_id) ON DELETE RESTRICT,
    FOREIGN KEY (completed_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =========================
-- 8. Lab Reports (Customer Download Feature)
-- =========================

CREATE TABLE lab_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    report_file_path VARCHAR(255) NOT NULL, -- e.g. /reports/patient1234_test567.pdf
    report_file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    is_visible_to_patient BOOLEAN DEFAULT TRUE,
    is_downloaded BOOLEAN DEFAULT FALSE,
    downloaded_at TIMESTAMP NULL,
    downloaded_by INT,
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_item_id) REFERENCES lab_order_items(order_item_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (downloaded_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =========================
-- 9. Inventory Management
-- =========================

CREATE TABLE inventory_items (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    item_code VARCHAR(50) UNIQUE,
    category VARCHAR(50),
    subcategory VARCHAR(50),
    description TEXT,
    unit VARCHAR(20) DEFAULT 'Piece',
    quantity INT NOT NULL DEFAULT 0,
    reorder_level INT DEFAULT 0,
    unit_cost DECIMAL(10,2),
    supplier_id INT,
    location VARCHAR(100),
    expiry_date DATE,
    status ENUM('Active', 'Inactive', 'Discontinued') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- 10. Audit Log
-- =========================

CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =========================
-- 11. Additional Tables for Bangladesh Context
-- =========================

-- Emergency Contacts (Multiple contacts per patient)
CREATE TABLE emergency_contacts (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    priority_order INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- Medical History
CREATE TABLE medical_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    diagnosis_date DATE,
    status ENUM('Active', 'Resolved', 'Chronic') DEFAULT 'Active',
    severity ENUM('Mild', 'Moderate', 'Severe') DEFAULT 'Moderate',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- Allergies
CREATE TABLE patient_allergies (
    allergy_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    allergen_name VARCHAR(255) NOT NULL,
    allergy_type ENUM('Drug', 'Food', 'Environmental', 'Other') NOT NULL,
    severity ENUM('Mild', 'Moderate', 'Severe') DEFAULT 'Moderate',
    reaction_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- Immunization Records
CREATE TABLE immunizations (
    immunization_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    vaccine_name VARCHAR(255) NOT NULL,
    immunization_date DATE NOT NULL,
    next_due_date DATE,
    batch_number VARCHAR(50),
    administered_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (administered_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Vital Signs
CREATE TABLE vital_signs (
    vital_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_id INT,
    temperature DECIMAL(4,1),
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    pulse_rate INT,
    respiratory_rate INT,
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    bmi DECIMAL(4,2),
    oxygen_saturation DECIMAL(4,1),
    recorded_by INT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    FOREIGN KEY (recorded_by) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Payment Transactions
CREATE TABLE payment_transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    payment_method ENUM('Cash', 'Card', 'bKash', 'Nagad', 'Rocket', 'Bank Transfer', 'Insurance') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_reference VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
    processed_by INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Departments
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(20) UNIQUE,
    description TEXT,
    head_doctor_id INT,
    location VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (head_doctor_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Doctor Specializations
CREATE TABLE doctor_specializations (
    specialization_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    bmdc_registration_number VARCHAR(50),
    registration_date DATE,
    expiry_date DATE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Doctor Schedules
CREATE TABLE doctor_schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    day_of_week ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_patients INT DEFAULT 20,
    consultation_fee DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================
-- 12. IPD, OPD, Emergency, OT, ICU Management
-- =========================

-- Wards and Rooms
CREATE TABLE wards (
    ward_id INT AUTO_INCREMENT PRIMARY KEY,
    ward_name VARCHAR(100) NOT NULL,
    ward_code VARCHAR(20) UNIQUE,
    department_id INT,
    ward_type ENUM('General', 'Semi-Private', 'Private', 'ICU', 'Emergency', 'Isolation') NOT NULL,
    floor_number INT,
    total_beds INT NOT NULL,
    available_beds INT NOT NULL,
    charge_per_day DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

-- Beds
CREATE TABLE beds (
    bed_id INT AUTO_INCREMENT PRIMARY KEY,
    ward_id INT NOT NULL,
    bed_number VARCHAR(20) NOT NULL,
    bed_type ENUM('General', 'Semi-Private', 'Private', 'ICU', 'Emergency') NOT NULL,
    status ENUM('Available', 'Occupied', 'Maintenance', 'Reserved') DEFAULT 'Available',
    current_patient_id INT,
    daily_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id) ON DELETE CASCADE,
    FOREIGN KEY (current_patient_id) REFERENCES patients(patient_id) ON DELETE SET NULL
);

-- IPD Admissions
CREATE TABLE ipd_admissions (
    admission_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    bed_id INT NOT NULL,
    admission_date DATETIME NOT NULL,
    discharge_date DATETIME,
    admission_type ENUM('Emergency', 'Elective', 'Transfer') NOT NULL,
    admitting_doctor_id INT NOT NULL,
    diagnosis TEXT,
    treatment_plan TEXT,
    status ENUM('Admitted', 'Discharged', 'Transferred', 'Deceased') DEFAULT 'Admitted',
    discharge_summary TEXT,
    total_days INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (bed_id) REFERENCES beds(bed_id) ON DELETE RESTRICT,
    FOREIGN KEY (admitting_doctor_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Ward Rounds
CREATE TABLE ward_rounds (
    round_id INT AUTO_INCREMENT PRIMARY KEY,
    admission_id INT NOT NULL,
    doctor_id INT NOT NULL,
    round_date DATETIME NOT NULL,
    round_type ENUM('Morning', 'Evening', 'Night', 'Emergency') NOT NULL,
    patient_condition TEXT,
    treatment_notes TEXT,
    next_round_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admission_id) REFERENCES ipd_admissions(admission_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Operation Theater Rooms
CREATE TABLE ot_rooms (
    ot_id INT AUTO_INCREMENT PRIMARY KEY,
    ot_name VARCHAR(100) NOT NULL,
    ot_code VARCHAR(20) UNIQUE,
    ot_type ENUM('Major', 'Minor', 'Emergency', 'Cardiac', 'Neuro') NOT NULL,
    capacity INT DEFAULT 1,
    equipment_list TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Surgery Schedule
CREATE TABLE surgery_schedule (
    surgery_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    ot_id INT NOT NULL,
    surgery_date DATETIME NOT NULL,
    surgery_type VARCHAR(100) NOT NULL,
    surgeon_id INT NOT NULL,
    anesthetist_id INT,
    surgery_duration_minutes INT,
    pre_operative_notes TEXT,
    post_operative_notes TEXT,
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Postponed') DEFAULT 'Scheduled',
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (ot_id) REFERENCES ot_rooms(ot_id) ON DELETE RESTRICT,
    FOREIGN KEY (surgeon_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (anesthetist_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Surgical Team
CREATE TABLE surgical_team (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    surgery_id INT NOT NULL,
    team_member_id INT NOT NULL,
    role ENUM('Surgeon', 'Assistant Surgeon', 'Anesthetist', 'Nurse', 'Technician') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (surgery_id) REFERENCES surgery_schedule(surgery_id) ON DELETE CASCADE,
    FOREIGN KEY (team_member_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- ICU Management
CREATE TABLE icu_monitoring (
    monitoring_id INT AUTO_INCREMENT PRIMARY KEY,
    admission_id INT NOT NULL,
    monitoring_date DATETIME NOT NULL,
    temperature DECIMAL(4,1),
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    pulse_rate INT,
    respiratory_rate INT,
    oxygen_saturation DECIMAL(4,1),
    ventilator_settings TEXT,
    consciousness_level ENUM('Alert', 'Verbal', 'Pain', 'Unresponsive') DEFAULT 'Alert',
    fluid_balance DECIMAL(8,2),
    medication_notes TEXT,
    nurse_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admission_id) REFERENCES ipd_admissions(admission_id) ON DELETE CASCADE,
    FOREIGN KEY (nurse_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Emergency Triage
CREATE TABLE emergency_triage (
    triage_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    triage_date DATETIME NOT NULL,
    triage_category ENUM('Red', 'Yellow', 'Green', 'Black') NOT NULL,
    chief_complaint TEXT NOT NULL,
    vital_signs TEXT,
    initial_assessment TEXT,
    priority_score INT,
    assigned_doctor_id INT,
    status ENUM('Waiting', 'Under Treatment', 'Admitted', 'Discharged', 'Referred') DEFAULT 'Waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_doctor_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =========================
-- 13. Staff Roster and Leave Management
-- =========================

-- Staff Roster
CREATE TABLE staff_roster (
    roster_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    roster_date DATE NOT NULL,
    shift_type ENUM('Day', 'Night', 'Emergency', 'Off') NOT NULL,
    start_time TIME,
    end_time TIME,
    ward_id INT,
    department_id INT,
    is_overtime BOOLEAN DEFAULT FALSE,
    overtime_hours DECIMAL(4,2),
    status ENUM('Scheduled', 'Present', 'Absent', 'Late', 'Leave') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

-- Leave Management
CREATE TABLE leave_requests (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    leave_type ENUM('Casual', 'Sick', 'Annual', 'Maternity', 'Paternity', 'Emergency') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT GENERATED ALWAYS AS (DATEDIFF(end_date, start_date) + 1) STORED,
    reason TEXT,
    status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
    approved_by INT,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Leave Balance
CREATE TABLE leave_balance (
    balance_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    leave_type ENUM('Casual', 'Sick', 'Annual', 'Maternity', 'Paternity') NOT NULL,
    total_entitled INT NOT NULL,
    used_leaves INT DEFAULT 0,
    remaining_leaves INT GENERATED ALWAYS AS (total_entitled - used_leaves) STORED,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- OPD Queue Management
CREATE TABLE opd_queue (
    queue_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_id INT,
    department_id INT NOT NULL,
    queue_date DATE NOT NULL,
    queue_number INT NOT NULL,
    status ENUM('Waiting', 'In Consultation', 'Completed', 'No Show') DEFAULT 'Waiting',
    estimated_wait_time INT, -- in minutes
    actual_wait_time INT, -- in minutes
    consultation_start_time DATETIME,
    consultation_end_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT
);

-- =========================
-- 14. Enhanced Pharmacy Management
-- =========================

-- Drug Interactions
CREATE TABLE drug_interactions (
    interaction_id INT AUTO_INCREMENT PRIMARY KEY,
    drug1_id INT NOT NULL,
    drug2_id INT NOT NULL,
    interaction_type ENUM('Major', 'Moderate', 'Minor') NOT NULL,
    interaction_description TEXT NOT NULL,
    recommendation TEXT,
    severity_level ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drug1_id) REFERENCES pharmacy_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (drug2_id) REFERENCES pharmacy_items(item_id) ON DELETE CASCADE
);

-- Drug Allergies
CREATE TABLE drug_allergies (
    allergy_id INT AUTO_INCREMENT PRIMARY KEY,
    drug_id INT NOT NULL,
    allergy_name VARCHAR(255) NOT NULL,
    allergy_type ENUM('Drug', 'Ingredient', 'Class') NOT NULL,
    severity ENUM('Mild', 'Moderate', 'Severe', 'Life-threatening') DEFAULT 'Moderate',
    symptoms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drug_id) REFERENCES pharmacy_items(item_id) ON DELETE CASCADE
);

-- Dispensing Records
CREATE TABLE dispensing_records (
    dispensing_id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_item_id INT NOT NULL,
    patient_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity_dispensed INT NOT NULL,
    batch_number VARCHAR(50),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity_dispensed * unit_price) STORED,
    dispensing_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    dispensed_by INT NOT NULL,
    patient_counseling_notes TEXT,
    patient_education_provided BOOLEAN DEFAULT FALSE,
    side_effects_explained BOOLEAN DEFAULT FALSE,
    storage_instructions_given BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_item_id) REFERENCES prescription_items(prescription_item_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES pharmacy_items(item_id) ON DELETE RESTRICT,
    FOREIGN KEY (dispensed_by) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Pharmacy Returns
CREATE TABLE pharmacy_returns (
    return_id INT AUTO_INCREMENT PRIMARY KEY,
    dispensing_id INT NOT NULL,
    patient_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity_returned INT NOT NULL,
    return_reason ENUM('Expired', 'Damaged', 'Wrong Medication', 'Side Effects', 'Patient Request', 'Other') NOT NULL,
    return_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    returned_by INT NOT NULL,
    approved_by INT,
    refund_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispensing_id) REFERENCES dispensing_records(dispensing_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES pharmacy_items(item_id) ON DELETE RESTRICT,
    FOREIGN KEY (returned_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Pharmacy Billing
CREATE TABLE pharmacy_bills (
    pharmacy_bill_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id INT NOT NULL,
    prescription_id INT,
    bill_date DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    vat_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    outstanding_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    payment_method ENUM('Cash', 'Card', 'bKash', 'Nagad', 'Rocket', 'Insurance') DEFAULT 'Cash',
    insurance_claim_id VARCHAR(100),
    status ENUM('Draft', 'Issued', 'Paid', 'Partial', 'Cancelled') DEFAULT 'Draft',
    notes TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Pharmacy Bill Items
CREATE TABLE pharmacy_bill_items (
    bill_item_id INT AUTO_INCREMENT PRIMARY KEY,
    pharmacy_bill_id INT NOT NULL,
    prescription_item_id INT,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_price * discount_percentage / 100) STORED,
    final_price DECIMAL(10,2) GENERATED ALWAYS AS (total_price - discount_amount) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pharmacy_bill_id) REFERENCES pharmacy_bills(pharmacy_bill_id) ON DELETE CASCADE,
    FOREIGN KEY (prescription_item_id) REFERENCES prescription_items(prescription_item_id) ON DELETE SET NULL,
    FOREIGN KEY (item_id) REFERENCES pharmacy_items(item_id) ON DELETE RESTRICT
);

-- Drug Stock Alerts
CREATE TABLE drug_stock_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    alert_type ENUM('Low Stock', 'Expiry Warning', 'Out of Stock', 'Overstock') NOT NULL,
    alert_message TEXT NOT NULL,
    threshold_value INT,
    current_value INT,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by INT,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES pharmacy_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =========================
-- 12. Sample Data: Roles & Permissions
-- =========================

-- Roles
INSERT INTO roles (role_name, description) VALUES
('Admin', 'Full system access including user and settings management'),
('Manager', 'Department and operational management'),
('Doctor', 'Manage patients, prescribe medicines, order tests'),
('Nurse', 'Assist doctors, update patient vitals and notes'),
('LabTech', 'Manage lab orders and upload test reports'),
('Receptionist', 'Patient registration and appointment scheduling'),
('Pharmacist', 'Manage pharmacy inventory and dispensing'),
('Accountant', 'Handle billing and payments'),
('Patient', 'View own medical data and reports');

-- Permissions (examples)
INSERT INTO permissions (permission_name, description, module) VALUES
('manage_users', 'Create, update, delete system users', 'System'),
('view_all_patients', 'View all patient records', 'Patient'),
('edit_patient_records', 'Add or update patient medical information', 'Patient'),
('schedule_appointments', 'Book or cancel patient appointments', 'Appointment'),
('create_bills', 'Generate and manage patient bills', 'Billing'),
('manage_prescriptions', 'Create and update prescriptions', 'Pharmacy'),
('manage_lab_orders', 'Create and update lab test orders', 'Laboratory'),
('upload_lab_reports', 'Upload and manage lab test reports', 'Laboratory'),
('view_own_reports', 'Patients can view/download their own test reports', 'Patient'),
('manage_inventory', 'Manage hospital inventory', 'Inventory'),
('view_reports', 'View system reports and analytics', 'Reports'),
('manage_departments', 'Manage hospital departments', 'System'),
('process_payments', 'Process patient payments', 'Billing'),
('manage_suppliers', 'Manage suppliers and vendors', 'Inventory'),
('view_audit_logs', 'View system audit logs', 'System');

-- Role-Permission mappings
-- Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r CROSS JOIN permissions p WHERE r.role_name='Admin';

-- Manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.role_name='Manager' AND p.permission_name IN ('view_all_patients', 'view_reports', 'manage_departments', 'view_audit_logs', 'manage_suppliers');

-- Doctor permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.role_name='Doctor' AND p.permission_name IN ('view_all_patients', 'edit_patient_records', 'schedule_appointments', 'manage_prescriptions', 'manage_lab_orders');

-- Nurse permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.role_name='Nurse' AND p.permission_name IN ('view_all_patients', 'edit_patient_records');

-- LabTech permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.role_name='LabTech' AND p.permission_name IN ('manage_lab_orders', 'upload_lab_reports');

-- Receptionist permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.role_name='Receptionist' AND p.permission_name IN ('schedule_appointments', 'create_bills');

-- Pharmacist permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.role_name='Pharmacist' AND p.permission_name IN ('manage_prescriptions');

-- Accountant permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.role_name='Accountant' AND p.permission_name IN ('create_bills', 'process_payments', 'view_reports');

-- Patient permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.role_name='Patient' AND p.permission_name IN ('view_own_reports');

-- =========================
-- 15. Sample Data for Bangladesh Context
-- =========================

-- Sample Departments
INSERT INTO departments (department_name, department_code, description, location, phone) VALUES
('Cardiology', 'CARD', 'Heart and cardiovascular diseases', 'Ground Floor, Block A', '+880-2-1234567'),
('Orthopedics', 'ORTHO', 'Bone and joint problems', '1st Floor, Block A', '+880-2-1234568'),
('Pediatrics', 'PED', 'Children and adolescent care', '2nd Floor, Block A', '+880-2-1234569'),
('Gynecology', 'GYN', 'Women health and pregnancy', '3rd Floor, Block A', '+880-2-1234570'),
('Emergency', 'ER', 'Emergency medical services', 'Ground Floor, Block B', '+880-2-1234571'),
('Laboratory', 'LAB', 'Diagnostic laboratory services', 'Basement, Block A', '+880-2-1234572'),
('Pharmacy', 'PHARM', 'Medication dispensing', 'Ground Floor, Block C', '+880-2-1234573');

-- Sample Lab Tests
INSERT INTO lab_tests (test_name, test_code, description, category, department, price, turnaround_time_hours, sample_type, normal_range_min, normal_range_max, unit) VALUES
('Complete Blood Count', 'CBC', 'Complete blood count with differential', 'Hematology', 'Laboratory', 800.00, 24, 'Blood', NULL, NULL, NULL),
('Blood Glucose (Fasting)', 'GLU-F', 'Fasting blood glucose test', 'Biochemistry', 'Laboratory', 300.00, 4, 'Blood', 70, 100, 'mg/dL'),
('Blood Glucose (Random)', 'GLU-R', 'Random blood glucose test', 'Biochemistry', 'Laboratory', 300.00, 4, 'Blood', 70, 140, 'mg/dL'),
('HbA1c', 'HBA1C', 'Glycated hemoglobin test', 'Biochemistry', 'Laboratory', 1200.00, 24, 'Blood', 4.0, 5.6, '%'),
('Lipid Profile', 'LIPID', 'Complete lipid profile', 'Biochemistry', 'Laboratory', 1500.00, 24, 'Blood', NULL, NULL, NULL),
('Liver Function Test', 'LFT', 'Liver function panel', 'Biochemistry', 'Laboratory', 1200.00, 24, 'Blood', NULL, NULL, NULL),
('Kidney Function Test', 'KFT', 'Kidney function panel', 'Biochemistry', 'Laboratory', 1200.00, 24, 'Blood', NULL, NULL, NULL),
('Urine Analysis', 'UA', 'Complete urine analysis', 'Urinalysis', 'Laboratory', 400.00, 4, 'Urine', NULL, NULL, NULL),
('ECG', 'ECG', 'Electrocardiogram', 'Cardiology', 'Cardiology', 500.00, 2, 'N/A', NULL, NULL, NULL),
('Chest X-Ray', 'CXR', 'Chest X-ray examination', 'Radiology', 'Radiology', 800.00, 4, 'N/A', NULL, NULL, NULL);



-- Sample Suppliers
INSERT INTO suppliers (supplier_name, contact_person, phone, email, address, tax_id, payment_terms) VALUES
('Beximco Pharmaceuticals Ltd', 'Mr. Ahmed Khan', '+880-2-1234001', 'ahmed@beximco.com', 'Dhaka, Bangladesh', 'TAX-001', 'Net 30'),
('Square Pharmaceuticals Ltd', 'Ms. Fatima Rahman', '+880-2-1234002', 'fatima@square.com', 'Dhaka, Bangladesh', 'TAX-002', 'Net 30'),
('Incepta Pharmaceuticals Ltd', 'Mr. Karim Ali', '+880-2-1234003', 'karim@incepta.com', 'Dhaka, Bangladesh', 'TAX-003', 'Net 30'),
('Popular Pharmaceuticals Ltd', 'Ms. Ayesha Begum', '+880-2-1234004', 'ayesha@popular.com', 'Dhaka, Bangladesh', 'TAX-004', 'Net 30'),
('MediTech Equipment Ltd', 'Mr. Sajid Hossain', '+880-2-1234005', 'sajid@meditech.com', 'Dhaka, Bangladesh', 'TAX-005', 'Net 45');

-- Sample Users (Admin)
INSERT INTO users (role_id, full_name, email, phone, password_hash, language_preference) VALUES
(1, 'System Administrator', 'admin@hospital.com', '+880-1712345678', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'English'),
(2, 'Hospital Manager', 'manager@hospital.com', '+880-1712345679', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'English'),
(3, 'Dr. Mohammad Rahman', 'dr.rahman@hospital.com', '+880-1712345680', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bengali'),
(4, 'Nurse Fatima Begum', 'nurse.fatima@hospital.com', '+880-1712345681', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bengali'),
(5, 'Lab Technician Ali', 'lab.ali@hospital.com', '+880-1712345682', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bengali'),
(6, 'Receptionist Ayesha', 'reception.ayesha@hospital.com', '+880-1712345683', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bengali'),
(7, 'Pharmacist Karim', 'pharma.karim@hospital.com', '+880-1712345684', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bengali'),
(8, 'Accountant Sajid', 'account.sajid@hospital.com', '+880-1712345685', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bengali');

-- Sample Doctor Specializations
INSERT INTO doctor_specializations (doctor_id, specialization, bmdc_registration_number, registration_date, is_primary) VALUES
(3, 'Cardiology', 'BMDC-2020-001', '2020-01-15', TRUE),
(3, 'Internal Medicine', 'BMDC-2020-001', '2020-01-15', FALSE);

-- Sample Doctor Schedule
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, max_patients, consultation_fee) VALUES
(3, 'Sunday', '09:00:00', '17:00:00', 30, 1000.00),
(3, 'Monday', '09:00:00', '17:00:00', 30, 1000.00),
(3, 'Tuesday', '09:00:00', '17:00:00', 30, 1000.00),
(3, 'Wednesday', '09:00:00', '17:00:00', 30, 1000.00),
(3, 'Thursday', '09:00:00', '17:00:00', 30, 1000.00);

-- Sample Wards
INSERT INTO wards (ward_name, ward_code, department_id, ward_type, floor_number, total_beds, available_beds, charge_per_day) VALUES
('General Ward A', 'GW-A', 1, 'General', 1, 20, 20, 2000.00),
('General Ward B', 'GW-B', 1, 'General', 1, 20, 20, 2000.00),
('Semi-Private Ward', 'SP-W', 1, 'Semi-Private', 2, 10, 10, 5000.00),
('Private Ward', 'PV-W', 1, 'Private', 2, 5, 5, 10000.00),
('ICU-1', 'ICU-1', 1, 'ICU', 3, 8, 8, 25000.00),
('ICU-2', 'ICU-2', 1, 'ICU', 3, 8, 8, 25000.00),
('Emergency Ward', 'ER-W', 5, 'Emergency', 1, 15, 15, 3000.00),
('Pediatric Ward', 'PED-W', 3, 'General', 2, 15, 15, 2500.00),
('Gynecology Ward', 'GYN-W', 4, 'General', 3, 12, 12, 3000.00);

-- Sample Beds
INSERT INTO beds (ward_id, bed_number, bed_type, daily_rate) VALUES
(1, 'A-01', 'General', 2000.00),
(1, 'A-02', 'General', 2000.00),
(1, 'A-03', 'General', 2000.00),
(2, 'B-01', 'General', 2000.00),
(2, 'B-02', 'General', 2000.00),
(3, 'SP-01', 'Semi-Private', 5000.00),
(3, 'SP-02', 'Semi-Private', 5000.00),
(4, 'PV-01', 'Private', 10000.00),
(4, 'PV-02', 'Private', 10000.00),
(5, 'ICU-01', 'ICU', 25000.00),
(5, 'ICU-02', 'ICU', 25000.00),
(6, 'ICU-03', 'ICU', 25000.00),
(6, 'ICU-04', 'ICU', 25000.00),
(7, 'ER-01', 'Emergency', 3000.00),
(7, 'ER-02', 'Emergency', 3000.00);

-- Sample OT Rooms
INSERT INTO ot_rooms (ot_name, ot_code, ot_type, capacity, equipment_list) VALUES
('Operation Theater 1', 'OT-1', 'Major', 1, 'Surgical table, Anesthesia machine, Monitor, Defibrillator'),
('Operation Theater 2', 'OT-2', 'Major', 1, 'Surgical table, Anesthesia machine, Monitor, Defibrillator'),
('Operation Theater 3', 'OT-3', 'Minor', 1, 'Surgical table, Basic monitoring'),
('Cardiac OT', 'COT-1', 'Cardiac', 1, 'Cardiac surgical table, Heart-lung machine, Advanced monitoring'),
('Emergency OT', 'EOT-1', 'Emergency', 1, 'Surgical table, Emergency equipment, Rapid access');

-- Sample Staff Roster
INSERT INTO staff_roster (staff_id, roster_date, shift_type, start_time, end_time, ward_id, department_id) VALUES
(3, CURDATE(), 'Day', '08:00:00', '16:00:00', 1, 1),
(4, CURDATE(), 'Day', '08:00:00', '16:00:00', 1, 1),
(5, CURDATE(), 'Day', '08:00:00', '16:00:00', 5, 1),
(6, CURDATE(), 'Day', '08:00:00', '16:00:00', 7, 5),
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'Day', '08:00:00', '16:00:00', 1, 1),
(4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'Night', '20:00:00', '08:00:00', 1, 1);

-- Sample Leave Balance
INSERT INTO leave_balance (staff_id, leave_type, total_entitled, used_leaves, year) VALUES
(3, 'Casual', 10, 2, 2025),
(3, 'Sick', 15, 1, 2025),
(3, 'Annual', 20, 5, 2025),
(4, 'Casual', 10, 1, 2025),
(4, 'Sick', 15, 0, 2025),
(4, 'Annual', 20, 3, 2025);

-- Sample Drug Categories
INSERT INTO drug_categories (category_name, description) VALUES
('Analgesics', 'Pain relieving medications'),
('Antibiotics', 'Anti-bacterial medications'),
('Antihypertensives', 'Blood pressure medications'),
('Antidiabetics', 'Diabetes medications'),
('Antacids', 'Acid reflux medications'),
('Vitamins', 'Vitamin supplements'),
('Antipyretics', 'Fever reducing medications'),
('Antihistamines', 'Allergy medications'),
('Corticosteroids', 'Anti-inflammatory medications'),
('Anticoagulants', 'Blood thinning medications');

-- Sample Drug Manufacturers
INSERT INTO drug_manufacturers (manufacturer_name, contact_person, phone, email, address, license_number) VALUES
('Beximco Pharmaceuticals Ltd', 'Mr. Ahmed Khan', '+880-2-1234001', 'ahmed@beximco.com', 'Dhaka, Bangladesh', 'DGDA-001'),
('Square Pharmaceuticals Ltd', 'Ms. Fatima Rahman', '+880-2-1234002', 'fatima@square.com', 'Dhaka, Bangladesh', 'DGDA-002'),
('Incepta Pharmaceuticals Ltd', 'Mr. Karim Ali', '+880-2-1234003', 'karim@incepta.com', 'Dhaka, Bangladesh', 'DGDA-003'),
('Popular Pharmaceuticals Ltd', 'Ms. Ayesha Begum', '+880-2-1234004', 'ayesha@popular.com', 'Dhaka, Bangladesh', 'DGDA-004'),
('Eskayef Pharmaceuticals Ltd', 'Mr. Sajid Hossain', '+880-2-1234005', 'sajid@eskayef.com', 'Dhaka, Bangladesh', 'DGDA-005'),
('Opsonin Pharmaceuticals Ltd', 'Ms. Nusrat Jahan', '+880-2-1234006', 'nusrat@opsonin.com', 'Dhaka, Bangladesh', 'DGDA-006');

-- Sample Pharmacy Items (Enhanced)
INSERT INTO pharmacy_items (item_code, item_name, generic_name, brand_name, category_id, manufacturer_id, dosage_form, strength, pack_size, therapeutic_class, unit_cost, markup_percentage, reorder_level, reorder_quantity) VALUES
('MED001', 'Paracetamol 500mg', 'Paracetamol', 'Napa', 1, 1, 'Tablet', '500mg', '10 tablets', 'Analgesic', 0.50, 20.00, 100, 500),
('MED002', 'Amoxicillin 500mg', 'Amoxicillin', 'Amoxicap', 2, 2, 'Capsule', '500mg', '10 capsules', 'Antibiotic', 2.00, 25.00, 50, 200),
('MED003', 'Omeprazole 20mg', 'Omeprazole', 'Omez', 5, 3, 'Capsule', '20mg', '14 capsules', 'Antacid', 3.00, 30.00, 30, 150),
('MED004', 'Metformin 500mg', 'Metformin', 'Metfor', 4, 1, 'Tablet', '500mg', '30 tablets', 'Antidiabetic', 1.50, 25.00, 80, 300),
('MED005', 'Amlodipine 5mg', 'Amlodipine', 'Amlong', 3, 2, 'Tablet', '5mg', '30 tablets', 'Antihypertensive', 2.50, 30.00, 40, 200),
('MED006', 'Saline 0.9%', 'Sodium Chloride', 'Normal Saline', 1, 4, 'Injection', '0.9%', '500ml', 'IV Fluid', 15.00, 15.00, 20, 100),
('MED007', 'Insulin Regular', 'Insulin', 'Humulin R', 4, 5, 'Injection', '100 IU/ml', '10ml vial', 'Antidiabetic', 150.00, 20.00, 10, 50),
('MED008', 'Vitamin C 500mg', 'Ascorbic Acid', 'Cevit', 6, 6, 'Tablet', '500mg', '30 tablets', 'Vitamin', 0.80, 25.00, 60, 250),
('MED009', 'Cetirizine 10mg', 'Cetirizine', 'Alatrol', 8, 1, 'Tablet', '10mg', '10 tablets', 'Antihistamine', 1.20, 20.00, 40, 150),
('MED010', 'Prednisolone 5mg', 'Prednisolone', 'Prednisol', 9, 2, 'Tablet', '5mg', '20 tablets', 'Corticosteroid', 0.60, 30.00, 30, 100);

-- Sample Drug Stock
INSERT INTO drug_stock (item_id, batch_number, expiry_date, manufacturing_date, quantity_received, quantity_available, unit_cost, supplier_id, received_date, received_by, quality_check_status) VALUES
(1, 'BEX-2024-001', '2026-12-31', '2024-01-15', 1000, 1000, 0.50, 1, '2024-01-20', 7, 'Passed'),
(2, 'SQR-2024-002', '2025-06-30', '2024-02-01', 500, 500, 2.00, 2, '2024-02-05', 7, 'Passed'),
(3, 'INC-2024-003', '2025-12-31', '2024-01-10', 300, 300, 3.00, 3, '2024-01-25', 7, 'Passed'),
(4, 'BEX-2024-004', '2025-08-31', '2024-02-15', 800, 800, 1.50, 1, '2024-02-20', 7, 'Passed'),
(5, 'SQR-2024-005', '2025-10-31', '2024-01-20', 400, 400, 2.50, 2, '2024-01-30', 7, 'Passed');

-- Sample Drug Interactions
INSERT INTO drug_interactions (drug1_id, drug2_id, interaction_type, interaction_description, recommendation, severity_level) VALUES
(2, 3, 'Moderate', 'Amoxicillin may reduce the effectiveness of omeprazole', 'Monitor for reduced efficacy', 'Medium'),
(4, 5, 'Minor', 'Metformin and amlodipine may have additive effects on blood pressure', 'Monitor blood pressure closely', 'Low'),
(1, 8, 'Minor', 'Paracetamol and vitamin C have no significant interaction', 'No special precautions needed', 'Low');

-- Sample Drug Allergies
INSERT INTO drug_allergies (drug_id, allergy_name, allergy_type, severity, symptoms) VALUES
(2, 'Penicillin Allergy', 'Drug', 'Severe', 'Rash, swelling, difficulty breathing'),
(3, 'Sulfa Allergy', 'Ingredient', 'Moderate', 'Skin rash, itching'),
(7, 'Insulin Allergy', 'Drug', 'Moderate', 'Injection site reactions');

-- =========================
-- 16. Indexes for Performance
-- =========================

-- Patient indexes
CREATE INDEX idx_patients_nid ON patients(nid_number);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_created_at ON patients(created_at);

-- Appointment indexes
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Bill indexes
CREATE INDEX idx_bills_patient ON bills(patient_id);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_date ON bills(bill_date);

-- Lab order indexes
CREATE INDEX idx_lab_orders_patient ON lab_orders(patient_id);
CREATE INDEX idx_lab_orders_status ON lab_orders(status);
CREATE INDEX idx_lab_orders_date ON lab_orders(order_date);

-- Pharmacy indexes
CREATE INDEX idx_pharmacy_items_name ON pharmacy_items(item_name);
CREATE INDEX idx_pharmacy_items_category ON pharmacy_items(category);
CREATE INDEX idx_pharmacy_items_expiry ON pharmacy_items(expiry_date);

-- Audit log indexes
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_time ON audit_logs(action_time);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);

-- IPD and Ward indexes
CREATE INDEX idx_wards_department ON wards(department_id);
CREATE INDEX idx_wards_type ON wards(ward_type);
CREATE INDEX idx_beds_ward ON beds(ward_id);
CREATE INDEX idx_beds_status ON beds(status);
CREATE INDEX idx_ipd_admissions_patient ON ipd_admissions(patient_id);
CREATE INDEX idx_ipd_admissions_bed ON ipd_admissions(bed_id);
CREATE INDEX idx_ipd_admissions_status ON ipd_admissions(status);
CREATE INDEX idx_ipd_admissions_date ON ipd_admissions(admission_date);

-- OT and Surgery indexes
CREATE INDEX idx_ot_rooms_type ON ot_rooms(ot_type);
CREATE INDEX idx_surgery_schedule_patient ON surgery_schedule(patient_id);
CREATE INDEX idx_surgery_schedule_ot ON surgery_schedule(ot_id);
CREATE INDEX idx_surgery_schedule_date ON surgery_schedule(surgery_date);
CREATE INDEX idx_surgery_schedule_status ON surgery_schedule(status);

-- Emergency indexes
CREATE INDEX idx_emergency_triage_patient ON emergency_triage(patient_id);
CREATE INDEX idx_emergency_triage_category ON emergency_triage(triage_category);
CREATE INDEX idx_emergency_triage_status ON emergency_triage(status);

-- Roster and Leave indexes
CREATE INDEX idx_staff_roster_staff ON staff_roster(staff_id);
CREATE INDEX idx_staff_roster_date ON staff_roster(roster_date);
CREATE INDEX idx_staff_roster_shift ON staff_roster(shift_type);
CREATE INDEX idx_leave_requests_staff ON leave_requests(staff_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_date ON leave_requests(start_date);

-- OPD Queue indexes
CREATE INDEX idx_opd_queue_patient ON opd_queue(patient_id);
CREATE INDEX idx_opd_queue_date ON opd_queue(queue_date);
CREATE INDEX idx_opd_queue_status ON opd_queue(status);

-- Pharmacy indexes
CREATE INDEX idx_pharmacy_items_code ON pharmacy_items(item_code);
CREATE INDEX idx_pharmacy_items_category ON pharmacy_items(category_id);
CREATE INDEX idx_pharmacy_items_manufacturer ON pharmacy_items(manufacturer_id);
CREATE INDEX idx_pharmacy_items_controlled ON pharmacy_items(is_controlled_substance);
CREATE INDEX idx_drug_stock_item ON drug_stock(item_id);
CREATE INDEX idx_drug_stock_batch ON drug_stock(batch_number);
CREATE INDEX idx_drug_stock_expiry ON drug_stock(expiry_date);
CREATE INDEX idx_drug_stock_status ON drug_stock(status);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor ON prescriptions(doctor_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescription_items_prescription ON prescription_items(prescription_id);
CREATE INDEX idx_prescription_items_status ON prescription_items(dispensing_status);
CREATE INDEX idx_dispensing_records_patient ON dispensing_records(patient_id);
CREATE INDEX idx_dispensing_records_date ON dispensing_records(dispensing_date);
CREATE INDEX idx_pharmacy_bills_patient ON pharmacy_bills(patient_id);
CREATE INDEX idx_pharmacy_bills_status ON pharmacy_bills(status);
CREATE INDEX idx_drug_interactions_drug1 ON drug_interactions(drug1_id);
CREATE INDEX idx_drug_interactions_drug2 ON drug_interactions(drug2_id);
CREATE INDEX idx_drug_allergies_drug ON drug_allergies(drug_id);

-- =========================
-- 17. Views for Common Queries
-- =========================

-- Patient Summary View
CREATE VIEW patient_summary AS
SELECT 
    p.patient_id,
    p.patient_code,
    p.full_name,
    p.nid_number,
    p.phone,
    p.blood_group,
    p.gender,
    p.dob,
    p.status,
    COUNT(DISTINCT a.appointment_id) as total_appointments,
    COUNT(DISTINCT pr.prescription_id) as total_prescriptions,
    COUNT(DISTINCT lo.order_id) as total_lab_orders,
    MAX(a.appointment_date) as last_visit
FROM patients p
LEFT JOIN appointments a ON p.patient_id = a.patient_id
LEFT JOIN prescriptions pr ON p.patient_id = pr.patient_id
LEFT JOIN lab_orders lo ON p.patient_id = lo.patient_id
GROUP BY p.patient_id;

-- Daily Revenue Summary
CREATE VIEW daily_revenue AS
SELECT 
    DATE(b.created_at) as date,
    COUNT(DISTINCT b.bill_id) as total_bills,
    SUM(b.total_amount) as total_revenue,
    SUM(b.paid_amount) as total_collected,
    SUM(b.outstanding_amount) as total_outstanding
FROM bills b
GROUP BY DATE(b.created_at);

-- Lab Test Summary
CREATE VIEW lab_test_summary AS
SELECT 
    lt.test_name,
    lt.category,
    COUNT(loi.order_item_id) as total_orders,
    COUNT(CASE WHEN loi.status = 'COMPLETED' THEN 1 END) as completed_tests,
    AVG(lt.price) as avg_price
FROM lab_tests lt
LEFT JOIN lab_order_items loi ON lt.test_id = loi.test_id
GROUP BY lt.test_id;

-- Ward Occupancy Summary
CREATE VIEW ward_occupancy_summary AS
SELECT 
    w.ward_name,
    w.ward_type,
    w.total_beds,
    w.available_beds,
    (w.total_beds - w.available_beds) as occupied_beds,
    ROUND(((w.total_beds - w.available_beds) / w.total_beds) * 100, 2) as occupancy_percentage,
    w.charge_per_day
FROM wards w
WHERE w.is_active = TRUE;

-- IPD Patient Summary
CREATE VIEW ipd_patient_summary AS
SELECT 
    ia.admission_id,
    p.patient_code,
    p.full_name,
    w.ward_name,
    b.bed_number,
    ia.admission_date,
    ia.discharge_date,
    ia.total_days,
    ia.status,
    u.full_name as admitting_doctor
FROM ipd_admissions ia
JOIN patients p ON ia.patient_id = p.patient_id
JOIN beds b ON ia.bed_id = b.bed_id
JOIN wards w ON b.ward_id = w.ward_id
JOIN users u ON ia.admitting_doctor_id = u.user_id;

-- Surgery Schedule Summary
CREATE VIEW surgery_schedule_summary AS
SELECT 
    ss.surgery_id,
    p.patient_code,
    p.full_name,
    ss.surgery_type,
    ot.ot_name,
    ss.surgery_date,
    ss.status,
    u.full_name as surgeon,
    ss.estimated_cost,
    ss.actual_cost
FROM surgery_schedule ss
JOIN patients p ON ss.patient_id = p.patient_id
JOIN ot_rooms ot ON ss.ot_id = ot.ot_id
JOIN users u ON ss.surgeon_id = u.user_id;

-- Staff Roster Summary
CREATE VIEW staff_roster_summary AS
SELECT 
    sr.roster_date,
    u.full_name as staff_name,
    r.role_name,
    sr.shift_type,
    sr.start_time,
    sr.end_time,
    w.ward_name,
    d.department_name,
    sr.status
FROM staff_roster sr
JOIN users u ON sr.staff_id = u.user_id
JOIN roles r ON u.role_id = r.role_id
LEFT JOIN wards w ON sr.ward_id = w.ward_id
LEFT JOIN departments d ON sr.department_id = d.department_id;

-- Emergency Triage Summary
CREATE VIEW emergency_triage_summary AS
SELECT 
    et.triage_id,
    p.patient_code,
    p.full_name,
    et.triage_category,
    et.chief_complaint,
    et.status,
    et.triage_date,
    u.full_name as assigned_doctor
FROM emergency_triage et
JOIN patients p ON et.patient_id = p.patient_id
LEFT JOIN users u ON et.assigned_doctor_id = u.user_id;

-- OPD Queue Summary
CREATE VIEW opd_queue_summary AS
SELECT 
    oq.queue_id,
    p.patient_code,
    p.full_name,
    oq.queue_number,
    d.department_name,
    oq.status,
    oq.estimated_wait_time,
    oq.actual_wait_time,
    oq.queue_date
FROM opd_queue oq
JOIN patients p ON oq.patient_id = p.patient_id
JOIN departments d ON oq.department_id = d.department_id;

-- Pharmacy Inventory Summary
CREATE VIEW pharmacy_inventory_summary AS
SELECT 
    pi.item_code,
    pi.item_name,
    pi.generic_name,
    pi.brand_name,
    dc.category_name,
    dm.manufacturer_name,
    pi.dosage_form,
    pi.strength,
    pi.pack_size,
    pi.selling_price,
    COALESCE(SUM(ds.quantity_available), 0) as total_stock,
    pi.reorder_level,
    pi.reorder_quantity,
    CASE 
        WHEN COALESCE(SUM(ds.quantity_available), 0) <= pi.reorder_level THEN 'Low Stock'
        WHEN COALESCE(SUM(ds.quantity_available), 0) = 0 THEN 'Out of Stock'
        ELSE 'In Stock'
    END as stock_status
FROM pharmacy_items pi
LEFT JOIN drug_categories dc ON pi.category_id = dc.category_id
LEFT JOIN drug_manufacturers dm ON pi.manufacturer_id = dm.manufacturer_id
LEFT JOIN drug_stock ds ON pi.item_id = ds.item_id AND ds.status = 'Active'
GROUP BY pi.item_id;

-- Prescription Summary
CREATE VIEW prescription_summary AS
SELECT 
    pr.prescription_number,
    p.patient_code,
    p.full_name,
    u.full_name as doctor_name,
    pr.prescription_date,
    pr.diagnosis,
    pr.status,
    pr.total_items,
    pr.total_amount,
    pr.expiry_date
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN users u ON pr.doctor_id = u.user_id;

-- Drug Stock Expiry Summary
CREATE VIEW drug_stock_expiry_summary AS
SELECT 
    pi.item_name,
    pi.item_code,
    ds.batch_number,
    ds.expiry_date,
    ds.quantity_available,
    DATEDIFF(ds.expiry_date, CURDATE()) as days_until_expiry,
    CASE 
        WHEN DATEDIFF(ds.expiry_date, CURDATE()) <= 30 THEN 'Expiring Soon'
        WHEN DATEDIFF(ds.expiry_date, CURDATE()) <= 90 THEN 'Warning'
        ELSE 'Safe'
    END as expiry_status
FROM drug_stock ds
JOIN pharmacy_items pi ON ds.item_id = pi.item_id
WHERE ds.status = 'Active' AND ds.quantity_available > 0
ORDER BY ds.expiry_date;

-- Pharmacy Revenue Summary
CREATE VIEW pharmacy_revenue_summary AS
SELECT 
    DATE(pb.bill_date) as date,
    COUNT(DISTINCT pb.pharmacy_bill_id) as total_bills,
    SUM(pb.subtotal) as total_subtotal,
    SUM(pb.discount_amount) as total_discounts,
    SUM(pb.vat_amount) as total_vat,
    SUM(pb.total_amount) as total_revenue,
    SUM(pb.paid_amount) as total_collected,
    SUM(pb.outstanding_amount) as total_outstanding
FROM pharmacy_bills pb
GROUP BY DATE(pb.bill_date);

-- Drug Interaction Summary
CREATE VIEW drug_interaction_summary AS
SELECT 
    pi1.item_name as drug1_name,
    pi2.item_name as drug2_name,
    di.interaction_type,
    di.severity_level,
    di.interaction_description,
    di.recommendation
FROM drug_interactions di
JOIN pharmacy_items pi1 ON di.drug1_id = pi1.item_id
JOIN pharmacy_items pi2 ON di.drug2_id = pi2.item_id;

-- =========================
-- 18. Triggers for Data Integrity
-- =========================

-- Trigger to update patient status based on last activity
DELIMITER //
CREATE TRIGGER update_patient_status
AFTER INSERT ON appointments
FOR EACH ROW
BEGIN
    UPDATE patients 
    SET status = 'Active' 
    WHERE patient_id = NEW.patient_id AND status = 'Inactive';
END//
DELIMITER ;

-- Trigger to log audit trail for patient updates
DELIMITER //
CREATE TRIGGER audit_patient_changes
AFTER UPDATE ON patients
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
        @current_user_id,
        'UPDATE',
        'patients',
        NEW.patient_id,
        JSON_OBJECT(
            'full_name', OLD.full_name,
            'phone', OLD.phone,
            'status', OLD.status
        ),
        JSON_OBJECT(
            'full_name', NEW.full_name,
            'phone', NEW.phone,
            'status', NEW.status
        )
    );
END//
DELIMITER ;

-- Trigger to update bill outstanding amount
DELIMITER //
CREATE TRIGGER update_bill_outstanding
AFTER UPDATE ON bills
FOR EACH ROW
BEGIN
    IF NEW.paid_amount != OLD.paid_amount THEN
        UPDATE bills 
        SET outstanding_amount = total_amount - NEW.paid_amount
        WHERE bill_id = NEW.bill_id;
    END IF;
END//
DELIMITER ;

-- Trigger to update bed status when patient is admitted
DELIMITER //
CREATE TRIGGER update_bed_status_on_admission
AFTER INSERT ON ipd_admissions
FOR EACH ROW
BEGIN
    UPDATE beds 
    SET status = 'Occupied', current_patient_id = NEW.patient_id
    WHERE bed_id = NEW.bed_id;
    
    UPDATE wards w
    JOIN beds b ON w.ward_id = b.ward_id
    SET w.available_beds = w.available_beds - 1
    WHERE b.bed_id = NEW.bed_id;
END//
DELIMITER ;

-- Trigger to update bed status when patient is discharged
DELIMITER //
CREATE TRIGGER update_bed_status_on_discharge
AFTER UPDATE ON ipd_admissions
FOR EACH ROW
BEGIN
    IF NEW.status = 'Discharged' AND OLD.status != 'Discharged' THEN
        UPDATE beds 
        SET status = 'Available', current_patient_id = NULL
        WHERE bed_id = NEW.bed_id;
        
        UPDATE wards w
        JOIN beds b ON w.ward_id = b.ward_id
        SET w.available_beds = w.available_beds + 1
        WHERE b.bed_id = NEW.bed_id;
    END IF;
END//
DELIMITER ;

-- Trigger to update leave balance when leave is approved
DELIMITER //
CREATE TRIGGER update_leave_balance_on_approval
AFTER UPDATE ON leave_requests
FOR EACH ROW
BEGIN
    IF NEW.status = 'Approved' AND OLD.status != 'Approved' THEN
        UPDATE leave_balance 
        SET used_leaves = used_leaves + NEW.total_days
        WHERE staff_id = NEW.staff_id 
        AND leave_type = NEW.leave_type 
        AND year = YEAR(NEW.start_date);
    END IF;
END//
DELIMITER ;

-- Trigger to update drug stock when dispensing
DELIMITER //
CREATE TRIGGER update_drug_stock_on_dispensing
AFTER INSERT ON dispensing_records
FOR EACH ROW
BEGIN
    -- Update drug stock quantity
    UPDATE drug_stock 
    SET quantity_available = quantity_available - NEW.quantity_dispensed,
        quantity_dispensed = quantity_dispensed + NEW.quantity_dispensed
    WHERE item_id = NEW.item_id 
    AND batch_number = NEW.batch_number 
    AND status = 'Active';
    
    -- Update prescription item status
    UPDATE prescription_items 
    SET quantity_dispensed = quantity_dispensed + NEW.quantity_dispensed,
        dispensing_status = CASE 
            WHEN (quantity_dispensed + NEW.quantity_dispensed) >= quantity_required THEN 'Complete'
            ELSE 'Partial'
        END
    WHERE prescription_item_id = NEW.prescription_item_id;
END//
DELIMITER ;

-- Trigger to create stock alerts for low stock
DELIMITER //
CREATE TRIGGER create_low_stock_alert
AFTER UPDATE ON drug_stock
FOR EACH ROW
BEGIN
    DECLARE reorder_level INT;
    DECLARE total_available INT;
    
    -- Get reorder level for the item
    SELECT pi.reorder_level INTO reorder_level
    FROM pharmacy_items pi WHERE pi.item_id = NEW.item_id;
    
    -- Calculate total available stock
    SELECT COALESCE(SUM(ds.quantity_available), 0) INTO total_available
    FROM drug_stock ds WHERE ds.item_id = NEW.item_id AND ds.status = 'Active';
    
    -- Create alert if stock is low
    IF total_available <= reorder_level AND total_available > 0 THEN
        INSERT INTO drug_stock_alerts (item_id, alert_type, alert_message, threshold_value, current_value)
        VALUES (NEW.item_id, 'Low Stock', 
                CONCAT('Low stock alert for item ID: ', NEW.item_id, '. Current stock: ', total_available, ', Reorder level: ', reorder_level),
                reorder_level, total_available);
    END IF;
    
    -- Create alert if out of stock
    IF total_available = 0 THEN
        INSERT INTO drug_stock_alerts (item_id, alert_type, alert_message, threshold_value, current_value)
        VALUES (NEW.item_id, 'Out of Stock', 
                CONCAT('Out of stock alert for item ID: ', NEW.item_id),
                0, 0);
    END IF;
END//
DELIMITER ;

-- Trigger to create expiry alerts
DELIMITER //
CREATE TRIGGER create_expiry_alert
AFTER INSERT ON drug_stock
FOR EACH ROW
BEGIN
    -- Create alert for drugs expiring within 30 days
    IF DATEDIFF(NEW.expiry_date, CURDATE()) <= 30 AND DATEDIFF(NEW.expiry_date, CURDATE()) > 0 THEN
        INSERT INTO drug_stock_alerts (item_id, alert_type, alert_message, threshold_value, current_value)
        VALUES (NEW.item_id, 'Expiry Warning', 
                CONCAT('Drug expiring on ', NEW.expiry_date, '. Batch: ', NEW.batch_number),
                30, DATEDIFF(NEW.expiry_date, CURDATE()));
    END IF;
END//
DELIMITER ;

