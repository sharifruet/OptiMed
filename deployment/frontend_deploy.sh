#!/bin/bash

# Frontend Deployment Script for Hospital Management System
# Domain: hms.bandhanhara.com

echo "=========================================="
echo "Hospital Management System - Frontend Deployment"
echo "=========================================="
echo "Frontend URL: https://hms.bandhanhara.com"
echo "Backend API: https://hmsapi.bandhanhara.com/api"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the frontend deployment directory."
    exit 1
fi

echo "✅ Frontend files found:"
ls -la

echo ""
echo "📋 Deployment Checklist:"
echo "1. Upload all files to your web hosting root directory"
echo "2. Ensure .htaccess is uploaded and working"
echo "3. Verify SSL certificate is active"
echo "4. Test the application at https://hms.bandhanhara.com"
echo "5. Check browser console for any errors"
echo "6. Test login functionality"
echo "7. Verify API calls are working"

echo ""
echo "🚀 Ready for deployment!"
echo "Upload the following files to your web hosting:"
echo "- index.html"
echo "- .htaccess"
echo "- asset-manifest.json"
echo "- static/ (entire folder)"
echo ""
echo "📁 File structure should be:"
echo "public_html/"
echo "├── index.html"
echo "├── .htaccess"
echo "├── asset-manifest.json"
echo "└── static/"
echo "    ├── css/"
echo "    ├── js/"
echo "    └── media/"
echo ""
echo "🔧 Server Requirements:"
echo "- Apache with mod_rewrite enabled"
echo "- mod_headers enabled"
echo "- mod_deflate enabled"
echo "- mod_expires enabled"
echo ""
echo "✅ Deployment package is ready!"

