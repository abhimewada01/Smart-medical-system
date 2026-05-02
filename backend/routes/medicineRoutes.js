const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/medicines - Get all medicines with pagination and search
router.get('/', medicineController.getAllMedicines);

// GET /api/medicines/:id - Get medicine by ID
router.get('/:id', medicineController.getMedicineById);

// POST /api/medicines - Create new medicine
router.post('/', medicineController.createMedicine);

// PUT /api/medicines/:id - Update medicine
router.put('/:id', medicineController.updateMedicine);

// DELETE /api/medicines/:id - Delete medicine
router.delete('/:id', medicineController.deleteMedicine);

// GET /api/medicines/low-stock - Get low stock medicines
router.get('/low-stock', medicineController.getLowStockMedicines);

// GET /api/medicines/expiring-soon - Get expiring medicines
router.get('/expiring-soon', medicineController.getExpiringSoonMedicines);

module.exports = router;
