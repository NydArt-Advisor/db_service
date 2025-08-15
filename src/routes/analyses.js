const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const auth = require('../middleware/auth');

// Create a new analysis
router.post('/', auth, analysisController.createAnalysis);

// Get analyses for a specific artwork (must come before /:analysisId)
router.get('/artwork/:artworkId', auth, analysisController.getArtworkAnalyses);

// Get recent analyses for the authenticated user (must come before /:analysisId)
router.get('/user', auth, analysisController.getUserAnalyses);

// Get analysis by ID
router.get('/:analysisId', auth, analysisController.getAnalysis);

// Update an analysis
router.put('/:analysisId', auth, analysisController.updateAnalysis);

// Delete an analysis
router.delete('/:analysisId', auth, analysisController.deleteAnalysis);

module.exports = router; 