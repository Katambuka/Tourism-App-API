// routes/tourismSites.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const tourismSitesController = require('../controllers/tourismSitesController');

// Route to get tourism sites (protected by authentication middleware)
router.get('/tourism-sites', authMiddleware, tourismSitesController.getTourismSites);

module.exports = router;
