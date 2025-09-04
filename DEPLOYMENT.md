# Hospital Management System - FastComet Shared Hosting Deployment Guide

## Prerequisites

1. **FastComet Shared Hosting Account** with Node.js support
2. **Domain Name** pointing to your hosting
3. **MySQL Database** created in your hosting control panel
4. **SSH Access** (recommended) or File Manager access

## Step 1: Database Setup

### 1.1 Create MySQL Database
1. Log into your FastComet control panel
2. Go to **MySQL Databases**
3. Create a new database (e.g., `yourdomain_hms`)
4. Create a database user with full privileges
5. Note down the database credentials

### 1.2 Import Database Schema
1. Use phpMyAdmin or MySQL command line
2. Import the `requirement/dbscript.sql` file
3. Verify all tables are created successfully

## Step 2: Backend Deployment

### 2.1 Upload Backend Files
1. Connect via SSH or use File Manager
2. Navigate to your domain's root directory
3. Create a folder for the backend (e.g., `api` or `backend`)
4. Upload all backend files to this folder

### 2.2 Configure Environment Variables
1. Create `.env` file in the backend directory
2. Copy from `env.example` and update with your values:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
NODE_PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_PORT=3306
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=30d

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_MAX=100

# Application Settings
APP_NAME=Hospital Management System
APP_URL=https://yourdomain.com
```

### 2.3 Install Dependencies
```bash
cd /path/to/your/backend
npm install --production
```

### 2.4 Start the Application
```bash
npm start
```

## Step 3: Frontend Deployment

### 3.1 Build Frontend for Production
```bash
cd /path/to/your/frontend
npm install
npm run build:prod
```

### 3.2 Configure Frontend for Production
1. Update `frontend/package.json` homepage to your domain
2. Set environment variable in frontend:
   ```bash
   REACT_APP_API_URL=https://yourdomain.com/api
   ```

### 3.3 Upload Frontend Files
1. Upload the `build` folder contents to your domain's public_html directory
2. Ensure `index.html` is in the root of public_html

## Step 4: Domain Configuration

### 4.1 Configure Subdomain (Recommended)
1. Create a subdomain for API (e.g., `api.yourdomain.com`)
2. Point it to your backend directory
3. Update CORS settings in backend `.env`:
   ```env
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

### 4.2 Alternative: Use Subdirectory
1. Place backend in a subdirectory (e.g., `/api`)
2. Configure your web server to proxy requests

## Step 5: Web Server Configuration

### 5.1 Apache Configuration (.htaccess)
Create `.htaccess` in your backend directory:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ server.js [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

### 5.2 Nginx Configuration (if available)
```nginx
location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## Step 6: Process Management

### 6.1 Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start your application
pm2 start server.js --name "hms-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 6.2 Using Forever
```bash
# Install Forever globally
npm install -g forever

# Start your application
forever start server.js
```

## Step 7: SSL Configuration

### 7.1 Enable SSL Certificate
1. In FastComet control panel, enable SSL for your domain
2. Update your frontend API URL to use HTTPS
3. Update CORS settings to include HTTPS URLs

## Step 8: Testing

### 8.1 Test API Endpoints
```bash
# Health check
curl https://yourdomain.com/api/health

# Test login
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"password"}'
```

### 8.2 Test Frontend
1. Visit your domain in browser
2. Try logging in with admin credentials
3. Test all major features

## Step 9: Monitoring and Maintenance

### 9.1 Log Monitoring
```bash
# View application logs
pm2 logs hms-backend

# Monitor application status
pm2 status
```

### 9.2 Database Backup
1. Set up automated database backups
2. Test backup restoration process
3. Monitor database performance

### 9.3 Security Updates
1. Regularly update Node.js dependencies
2. Monitor security advisories
3. Keep SSL certificates updated

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Check if another application is using port 5000
   - Change port in `.env` file

2. **Database Connection Failed**
   - Verify database credentials
   - Check if database server is running
   - Ensure database user has proper permissions

3. **CORS Errors**
   - Verify ALLOWED_ORIGINS in backend `.env`
   - Check if frontend URL is included in allowed origins

4. **Static Files Not Loading**
   - Ensure build files are in correct directory
   - Check file permissions
   - Verify web server configuration

### Performance Optimization

1. **Enable Compression**
   - Already configured in backend
   - Monitor compression ratios

2. **Database Optimization**
   - Add indexes to frequently queried columns
   - Monitor slow queries
   - Optimize database queries

3. **Caching**
   - Implement Redis caching (if available)
   - Use browser caching for static assets

## Support

For issues specific to FastComet hosting:
1. Check FastComet knowledge base
2. Contact FastComet support
3. Check Node.js version compatibility

For application-specific issues:
1. Check application logs
2. Review error messages
3. Test in development environment first
