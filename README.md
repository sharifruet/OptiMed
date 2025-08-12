# Hospital Management System

A comprehensive hospital management system designed specifically for Bangladesh healthcare context, built with Node.js, React, and MySQL.

## Features

### Core Modules
- **Patient Management**: Complete patient registration, history, and records
- **Appointment System**: Scheduling and management of patient appointments
- **Doctor Management**: Doctor profiles, specializations, and schedules
- **Pharmacy Management**: Drug inventory, prescriptions, and dispensing
- **Laboratory Management**: Lab tests, reports, and sample tracking
- **Billing & Financial**: Patient billing, payments, and financial reports
- **IPD Management**: Inpatient department operations
- **Emergency Management**: Emergency triage and critical care
- **Operation Theater**: Surgery scheduling and management
- **ICU Management**: Intensive care unit operations
- **Staff Roster**: Employee scheduling and leave management
- **Reports & Analytics**: Comprehensive reporting system

### Bangladesh-Specific Features
- Multi-language support (Bengali/English)
- Local payment methods (bKash, Nagad, Rocket)
- NID (National ID) integration
- Administrative divisions (Division, District, Upazila)
- BMDC (Bangladesh Medical & Dental Council) compliance
- DGHS (Directorate General of Health Services) integration
- Local currency (৳) support

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL 8.0** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **Winston** for logging
- **Express Validator** for input validation

### Frontend
- **React 18** with functional components
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Hook Form** for forms
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Infrastructure
- **Docker** and **Docker Compose** for containerization
- **MySQL** database with persistent storage
- **phpMyAdmin** for database management (optional)

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hospital
```

### 2. Start with Docker Compose (Recommended)
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **phpMyAdmin**: http://localhost:8080 (optional)
- **Database**: localhost:3306

### 4. Default Credentials
- **Email**: admin@hospital.com
- **Password**: password

## Development Setup

### 1. Install Dependencies
```bash
# Install all dependencies (root, backend, frontend)
npm run install-all

# Or install individually
npm install
cd backend && npm install
cd frontend && npm install
```

### 2. Environment Configuration
Create `.env` files in the backend directory:

```env
# Backend .env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hospital_management
DB_USER=hms_user
DB_PASSWORD=hms_password
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h
```

### 3. Database Setup
```bash
# Start MySQL (if using Docker)
docker-compose up mysql -d

# Run database migrations
cd backend
npm run migrate

# Seed initial data
npm run seed
```

### 4. Start Development Servers
```bash
# Start both backend and frontend
npm run dev

# Or start individually
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## Project Structure

```
hospital/
├── requirement/
│   ├── brd.md              # Business Requirements Document
│   └── dbscript.sql        # Database schema and sample data
├── backend/
│   ├── config/             # Database and app configuration
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json
├── docker-compose.yml      # Docker services configuration
└── package.json           # Root package.json
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Patient Endpoints
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Other Modules
- `/api/appointments` - Appointment management
- `/api/doctors` - Doctor management
- `/api/pharmacy` - Pharmacy operations
- `/api/laboratory` - Laboratory management
- `/api/billing` - Billing and payments
- `/api/ipd` - IPD management
- `/api/emergency` - Emergency management
- `/api/ot` - Operation theater
- `/api/icu` - ICU management
- `/api/roster` - Staff roster
- `/api/reports` - Reports and analytics

## Database Schema

The system includes comprehensive database tables for:
- Users and authentication
- Patient management
- Medical records
- Appointments and scheduling
- Pharmacy and drug management
- Laboratory tests and reports
- Billing and financial records
- IPD, Emergency, OT, and ICU management
- Staff roster and leave management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.

## Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with external healthcare systems
- [ ] AI-powered diagnosis assistance
- [ ] Telemedicine features
- [ ] Advanced reporting and business intelligence 