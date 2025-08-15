const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');
const auth = require('../middleware/auth');

// Create a new artwork
router.post('/', auth, artworkController.createArtwork);

// Get all artworks for the authenticated user
router.get('/user', auth, artworkController.getUserArtworks);

// Get a single artwork
router.get('/:id', auth, artworkController.getArtwork);

// Update an artwork
router.put('/:id', auth, artworkController.updateArtwork);

// Delete an artwork
router.delete('/:id', auth, artworkController.deleteArtwork);

module.exports = router; 