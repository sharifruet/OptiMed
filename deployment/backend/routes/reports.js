const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock reports data
const reports = [
  {
    id: 1,
    title: 'Monthly Patient Admissions',
    type: 'Analytics',
    category: 'Patient Care',
    lastGenerated: '2024-01-20',
    status: 'Generated',
    format: 'PDF',
    size: '2.3 MB',
    description: 'Comprehensive report of patient admissions for the current month'
  },
  {
    id: 2,
    title: 'Revenue Analysis Report',
    type: 'Financial',
    category: 'Finance',
    lastGenerated: '2024-01-19',
    status: 'Generated',
    format: 'Excel',
    size: '1.8 MB',
    description: 'Detailed financial analysis including revenue, expenses, and profitability'
  },
  {
    id: 3,
    title: 'Staff Performance Report',
    type: 'HR',
    category: 'Human Resources',
    lastGenerated: '2024-01-18',
    status: 'Pending',
    format: 'PDF',
    size: '3.1 MB',
    description: 'Staff performance metrics and productivity analysis'
  },
  {
    id: 4,
    title: 'Inventory Status Report',
    type: 'Inventory',
    category: 'Operations',
    lastGenerated: '2024-01-17',
    status: 'Generated',
    format: 'Excel',
    size: '1.2 MB',
    description: 'Current inventory levels and stock management analysis'
  },
  {
    id: 5,
    title: 'Quality Metrics Report',
    type: 'Quality',
    category: 'Quality Assurance',
    lastGenerated: '2024-01-16',
    status: 'Generated',
    format: 'PDF',
    size: '2.7 MB',
    description: 'Quality indicators and patient satisfaction metrics'
  },
  {
    id: 6,
    title: 'Emergency Department Report',
    type: 'Clinical',
    category: 'Emergency',
    lastGenerated: '2024-01-15',
    status: 'Generated',
    format: 'PDF',
    size: '1.9 MB',
    description: 'Emergency department statistics and response times'
  }
];

const reportCategories = [
  'Patient Care',
  'Finance',
  'Human Resources',
  'Operations',
  'Quality Assurance',
  'Emergency',
  'Laboratory',
  'Pharmacy'
];

const reportTypes = [
  'Analytics',
  'Financial',
  'HR',
  'Inventory',
  'Quality',
  'Clinical',
  'Operational',
  'Compliance'
];

const overviewData = {
  patientAdmissions: {
    current: 245,
    previous: 220,
    change: '+11.4%',
    trend: 'up'
  },
  revenue: {
    current: 1250000,
    previous: 1180000,
    change: '+5.9%',
    trend: 'up'
  },
  bedOccupancy: {
    current: 85,
    previous: 78,
    change: '+9.0%',
    trend: 'up'
  },
  staffSatisfaction: {
    current: 4.2,
    previous: 4.0,
    change: '+5.0%',
    trend: 'up'
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
router.get('/:id', protect, (req, res) => {
  try {
    const report = reports.find(r => r.id === parseInt(req.params.id));
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Generate new report
// @route   POST /api/reports
// @access  Private
router.post('/', protect, (req, res) => {
  try {
    const {
      title,
      type,
      category,
      format,
      dateRange,
      includeCharts,
      description
    } = req.body;

    // Validate required fields
    if (!title || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, type, and category'
      });
    }

    const newReport = {
      id: reports.length + 1,
      title,
      type,
      category,
      lastGenerated: new Date().toISOString().split('T')[0],
      status: 'Generated',
      format: format || 'PDF',
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      description: description || 'Generated report'
    };

    reports.push(newReport);

    res.status(201).json({
      success: true,
      message: 'Report generated successfully',
      data: newReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get overview data
// @route   GET /api/reports/overview
// @access  Private
router.get('/overview/data', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: overviewData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get report categories
// @route   GET /api/reports/categories
// @access  Private
router.get('/categories/list', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: reportCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get report types
// @route   GET /api/reports/types
// @access  Private
router.get('/types/list', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: reportTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get reports by category
// @route   GET /api/reports/category/:category
// @access  Private
router.get('/category/:category', protect, (req, res) => {
  try {
    const categoryReports = reports.filter(report => 
      report.category.toLowerCase() === req.params.category.toLowerCase()
    );

    res.json({
      success: true,
      data: categoryReports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get reports by type
// @route   GET /api/reports/type/:type
// @access  Private
router.get('/type/:type', protect, (req, res) => {
  try {
    const typeReports = reports.filter(report => 
      report.type.toLowerCase() === req.params.type.toLowerCase()
    );

    res.json({
      success: true,
      data: typeReports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get reports statistics
// @route   GET /api/reports/stats
// @access  Private
router.get('/stats/overview', protect, (req, res) => {
  try {
    const stats = {
      totalReports: reports.length,
      generatedToday: reports.filter(r => r.status === 'Generated').length,
      pendingReports: reports.filter(r => r.status === 'Pending').length,
      failedReports: reports.filter(r => r.status === 'Failed').length,
      byFormat: {
        PDF: reports.filter(r => r.format === 'PDF').length,
        Excel: reports.filter(r => r.format === 'Excel').length,
        CSV: reports.filter(r => r.format === 'CSV').length
      },
      byCategory: reportCategories.reduce((acc, category) => {
        acc[category] = reports.filter(r => r.category === category).length;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Download report
// @route   GET /api/reports/:id/download
// @access  Private
router.get('/:id/download', protect, (req, res) => {
  try {
    const report = reports.find(r => r.id === parseInt(req.params.id));
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Simulate file download
    res.json({
      success: true,
      message: 'Report download initiated',
      data: {
        reportId: report.id,
        title: report.title,
        format: report.format,
        size: report.size,
        downloadUrl: `/api/reports/${report.id}/file`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Schedule report
// @route   POST /api/reports/:id/schedule
// @access  Private
router.post('/:id/schedule', protect, (req, res) => {
  try {
    const report = reports.find(r => r.id === parseInt(req.params.id));
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const { schedule, frequency, recipients } = req.body;

    res.json({
      success: true,
      message: 'Report scheduled successfully',
      data: {
        reportId: report.id,
        schedule,
        frequency,
        recipients
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 