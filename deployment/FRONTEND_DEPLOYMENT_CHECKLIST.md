# Frontend Deployment Checklist - Hospital Management System

## Pre-Deployment Setup

### 1. Domain Configuration
- [ ] Domain: `hms.bandhanhara.com` is configured
- [ ] SSL certificate is installed and active
- [ ] DNS records are properly configured

### 2. File Upload
Upload the following files to your web hosting root directory (usually `public_html` or `www`):

**Essential Files:**
- [ ] `index.html` - Main entry point
- [ ] `static/` folder - Contains all CSS, JS, and assets
- [ ] `.htaccess` - Apache configuration for routing and security
- [ ] `manifest.json` - PWA manifest (if present)
- [ ] `favicon.ico` - Site icon

**File Structure:**
```
public_html/
├── index.html
├── .htaccess
├── manifest.json
├── favicon.ico
└── static/
    ├── css/
    ├── js/
    └── media/
```

### 3. Server Configuration

#### Apache Configuration
- [ ] `.htaccess` file is uploaded and working
- [ ] `mod_rewrite` is enabled
- [ ] `mod_headers` is enabled
- [ ] `mod_deflate` is enabled (for compression)
- [ ] `mod_expires` is enabled (for caching)

#### Nginx Configuration (Alternative)
If using Nginx, add this configuration:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}

# Security headers
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";

# CORS headers
add_header Access-Control-Allow-Origin "*";
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With";
```

### 4. Environment Configuration
- [ ] Backend API URL is correctly set: `https://hmsapi.bandhanhara.com/api`
- [ ] Frontend URL is correctly set: `https://hms.bandhanhara.com`
- [ ] CORS is properly configured on backend

## Deployment Steps

### Step 1: Upload Files
1. Connect to your hosting via FTP/SFTP or File Manager
2. Navigate to the web root directory
3. Upload all files from the `deployment/frontend/` folder
4. Ensure file permissions are set correctly (644 for files, 755 for directories)

### Step 2: Test Basic Functionality
1. Visit `https://hms.bandhanhara.com`
2. Verify the page loads without errors
3. Check browser console for any JavaScript errors
4. Test navigation between pages
5. Verify static assets (CSS, JS, images) load correctly

### Step 3: Test API Integration
1. Try to log in with test credentials
2. Verify API calls are going to the correct backend URL
3. Check that authentication tokens are being sent correctly
4. Test a few key features (viewing patients, appointments, etc.)

### Step 4: Performance Optimization
1. Enable Gzip compression (handled by `.htaccess`)
2. Enable browser caching (handled by `.htaccess`)
3. Verify images are optimized
4. Check page load times

## Post-Deployment Verification

### 1. Functionality Tests
- [ ] Login/logout works correctly
- [ ] Navigation between pages works
- [ ] All forms submit correctly
- [ ] Data displays properly
- [ ] Search and filter functions work
- [ ] File uploads work (if any)
- [ ] Print functionality works (if any)

### 2. Security Tests
- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] Sensitive files are not accessible
- [ ] CORS is properly configured
- [ ] No sensitive information in source code

### 3. Performance Tests
- [ ] Page load times are acceptable (< 3 seconds)
- [ ] Images and assets are cached
- [ ] JavaScript bundles are optimized
- [ ] No console errors

### 4. Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Common Issues and Solutions

### Issue 1: 404 Errors on Page Refresh
**Solution:** Ensure `.htaccess` is properly configured and `mod_rewrite` is enabled.

### Issue 2: API Calls Failing
**Solution:** 
- Check CORS configuration on backend
- Verify API URL is correct
- Check browser console for errors

### Issue 3: Assets Not Loading
**Solution:**
- Check file permissions
- Verify file paths in `index.html`
- Check server error logs

### Issue 4: Slow Loading
**Solution:**
- Enable compression
- Optimize images
- Check for large JavaScript bundles
- Enable caching

### Issue 5: SSL/HTTPS Issues
**Solution:**
- Verify SSL certificate is valid
- Check for mixed content warnings
- Update all URLs to use HTTPS

## Monitoring and Maintenance

### 1. Regular Checks
- [ ] Monitor error logs
- [ ] Check page load times
- [ ] Verify API connectivity
- [ ] Test critical user flows

### 2. Updates
- [ ] Keep dependencies updated
- [ ] Monitor for security vulnerabilities
- [ ] Test updates in staging environment first

### 3. Backup
- [ ] Regular backups of frontend files
- [ ] Version control for configuration changes
- [ ] Document any custom configurations

## Support Information

- **Frontend URL:** https://hms.bandhanhara.com
- **Backend API:** https://hmsapi.bandhanhara.com/api
- **Build Date:** $(date)
- **Version:** 1.0.0

## Emergency Contacts
- Hosting Provider Support
- Domain Registrar Support
- SSL Certificate Provider Support

