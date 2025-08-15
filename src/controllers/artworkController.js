const Artwork = require('../models/Artwork');

// Create new artwork
exports.createArtwork = async (req, res) => {
    try {
        const artworkData = {
            ...req.body,
            userId: req.user.id
        };
        const artwork = new Artwork(artworkData);
        const savedArtwork = await artwork.save();
        res.status(201).json(savedArtwork);
    } catch (error) {
        res.status(400).json({ message: 'Error creating artwork', error: error.message });
    }
};

// Get all artworks for the authenticated user
exports.getUserArtworks = async (req, res) => {
    try {
        const artworks = await Artwork.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(artworks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single artwork
exports.getArtwork = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        
        // Ensure user owns the artwork
        if (artwork.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to access this artwork' });
        }
        
        res.json(artwork);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update artwork
exports.updateArtwork = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }

        // Ensure user owns the artwork
        if (artwork.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this artwork' });
        }

        const updatedArtwork = await Artwork.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedArtwork);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete artwork
exports.deleteArtwork = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        
        // Ensure user owns the artwork
        if (artwork.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this artwork' });
        }
        
        await Artwork.deleteOne({ _id: req.params.id });
        res.json({ message: 'Artwork deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 