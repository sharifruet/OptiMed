#!/bin/bash

# Hospital Management System - Startup Script for Shared Hosting
# This script should be run from the backend directory

echo "Starting Hospital Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "Error: Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "Node.js version: $(node -v)"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Creating from example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "Please update .env file with your configuration before starting the application."
        exit 1
    else
        echo "Error: Neither .env nor env.example file found."
        exit 1
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies"
        exit 1
    fi
fi

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo "PM2 found. Starting with PM2..."
    
    # Stop existing process if running
    pm2 stop hms-backend 2>/dev/null
    pm2 delete hms-backend 2>/dev/null
    
    # Start with PM2
    pm2 start server.js --name "hms-backend" --env production
    
    # Save PM2 configuration
    pm2 save
    
    echo "Application started with PM2. Use 'pm2 status' to check status."
    echo "Use 'pm2 logs hms-backend' to view logs."
    
else
    echo "PM2 not found. Starting with Node.js directly..."
    
    # Check if port is already in use
    PORT=$(grep "^PORT=" .env | cut -d'=' -f2)
    if [ -z "$PORT" ]; then
        PORT=5000
    fi
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
        echo "Error: Port $PORT is already in use"
        exit 1
    fi
    
    # Start the application
    NODE_ENV=production node server.js
fi

echo "Startup script completed."
