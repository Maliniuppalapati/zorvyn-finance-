const express = require('express');
const router = express.Router();
const { addTransaction, getSummary } = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// 1. Requirement #4: Access Control - Both roles can VIEW
router.get('/summary', protect, getSummary);

// 2. Requirement #4: Access Control - ONLY Admin can CREATE
// This will no longer crash because addTransaction is now defined in the controller
router.post('/add', protect, authorize('Admin'), addTransaction);

module.exports = router;