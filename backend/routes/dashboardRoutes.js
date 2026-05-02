const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to dashboard routes
router.use(authenticateToken);

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
