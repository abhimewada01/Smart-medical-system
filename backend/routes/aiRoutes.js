const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to AI routes
router.use(authenticateToken);

// GET /api/ai/recommendations - Get AI recommendations
router.get('/recommendations', aiController.getRecommendations);

module.exports = router;
