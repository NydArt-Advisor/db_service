const Analysis = require('../models/Analysis');
const Artwork = require('../models/Artwork');

// Get analysis by ID
exports.getAnalysis = async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.analysisId)
            .populate('artworkId', 'title imageUrl description')
            .populate('userId', 'username email');
            
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        
        // Handle case where artworkId doesn't exist
        const artworkData = analysis.artworkId || {
            _id: analysis.artworkId || 'unknown',
            title: 'Untitled Artwork',
            imageUrl: analysis.imageUrl || 'unknown',
            description: 'No description available'
        };
        
        res.json({
            analysis: analysis,
            artwork: artworkData,
            user: analysis.userId
        });
    } catch (error) {
        console.error('Error in getAnalysis:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get analyses for a specific artwork
exports.getArtworkAnalyses = async (req, res) => {
    try {
        const analyses = await Analysis.find({ artworkId: req.params.artworkId })
            .populate('artworkId', 'title imageUrl description')
            .sort({ createdAt: -1 });
        
        // Transform the data to handle missing artwork references
        const transformedAnalyses = analyses.map(analysis => {
            const artworkData = analysis.artworkId || {
                _id: analysis.artworkId || 'unknown',
                title: 'Untitled Artwork',
                imageUrl: analysis.imageUrl || 'unknown'
            };

            return {
                id: analysis._id,
                artworkId: artworkData._id,
                artworkTitle: artworkData.title,
                imageUrl: artworkData.imageUrl,
                type: analysis.analysisType,
                date: analysis.createdAt,
                results: analysis.results,
                learningResources: analysis.learningResources,
                analysis: analysis.analysis,
                suggestions: analysis.suggestions,
                modelUsed: analysis.modelUsed,
                filename: analysis.filename
            };
        });
        
        res.json({
            analyses: transformedAnalyses,
            total: transformedAnalyses.length
        });
    } catch (error) {
        console.error('Error in getArtworkAnalyses:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get recent analyses for the authenticated user
exports.getUserAnalyses = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const analyses = await Analysis.find({ userId: req.user.id })
            .populate('artworkId', 'title imageUrl description')
            .sort({ createdAt: -1 })
            .limit(limit);
        
        // Transform the data to match the expected format
        const transformedAnalyses = analyses.map(analysis => {
            // Handle case where artworkId doesn't exist
            const artworkData = analysis.artworkId || {
                _id: analysis.artworkId || 'unknown',
                title: 'Untitled Artwork',
                imageUrl: analysis.imageUrl || 'unknown'
            };

            return {
                id: analysis._id,
                artworkId: artworkData._id,
                artworkTitle: artworkData.title,
                imageUrl: artworkData.imageUrl,
                type: analysis.analysisType,
                date: analysis.createdAt,
                results: analysis.results,
                learningResources: analysis.learningResources,
                analysis: analysis.analysis,
                suggestions: analysis.suggestions,
                modelUsed: analysis.modelUsed,
                filename: analysis.filename
            };
        });
            
        res.json({
            analyses: transformedAnalyses,
            total: transformedAnalyses.length
        });
    } catch (error) {
        console.error('Error in getUserAnalyses:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete an analysis
exports.deleteAnalysis = async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.analysisId);
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        
        await Analysis.findByIdAndDelete(req.params.analysisId);
        res.json({ message: 'Analysis deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new analysis
exports.createAnalysis = async (req, res) => {
    try {
        const analysis = new Analysis(req.body);
        const savedAnalysis = await analysis.save();
        res.status(201).json(savedAnalysis);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an analysis
exports.updateAnalysis = async (req, res) => {
    try {
        const analysis = await Analysis.findByIdAndUpdate(
            req.params.analysisId,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        
        res.json(analysis);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 