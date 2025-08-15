const mongoose = require('mongoose');

const learningResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    url: String,
    type: {
        type: String,
        enum: ['youtube', 'article', 'book', 'course', 'tutorial'],
        default: 'article'
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    }
});

const analysisSchema = new mongoose.Schema({
    // Reference to the artwork this analysis belongs to
    artworkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
        required: true
    },
    
    // Reference to the user who owns this analysis
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Analysis metadata
    filename: {
        type: String,
        required: true
    },
    analysisType: {
        type: String,
        enum: ['general', 'technique', 'composition', 'color', 'style'],
        default: 'general'
    },
    modelUsed: {
        type: String,
        default: 'gpt-4o'
    },
    
    // File information
    fileSize: Number,
    contentType: String,
    imageUrl: String,
    
    // Analysis results
    analysis: {
        type: String,
        required: true
    },
    suggestions: [String],
    learningResources: [learningResourceSchema],
    
    // Structured analysis results
    results: {
        technicalQuality: String,
        strengths: String,
        areasForImprovement: String,
        composition: String,
        colorTheory: String,
        styleContext: String
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
analysisSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Index for efficient queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ artworkId: 1 });
analysisSchema.index({ analysisType: 1 });

module.exports = mongoose.model('Analysis', analysisSchema); 