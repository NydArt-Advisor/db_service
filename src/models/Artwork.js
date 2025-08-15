const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        required: true
    },
    metadata: {
        size: {
            type: String,
            enum: ['small', 'medium', 'large'],
            default: 'medium'
        },
        medium: {
            type: String,
            enum: ['digital', 'oil', 'acrylic', 'watercolor', 'pencil', 'charcoal', 'mixed-media', 'other'],
            default: 'digital'
        },
        style: {
            type: String,
            enum: ['realistic', 'abstract', 'impressionistic', 'surrealistic', 'minimalistic', 'pop-art', 'other'],
            default: 'other'
        },
        dateCreated: Date,
        dimensions: {
            width: Number,
            height: Number,
            unit: {
                type: String,
                enum: ['px', 'cm', 'in'],
                default: 'px'
            }
        }
    },
    tags: [String],
    isPublic: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
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
artworkSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual for formatted date
artworkSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString();
});

// Ensure virtuals are included in JSON output
artworkSchema.set('toJSON', { virtuals: true });
artworkSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Artwork', artworkSchema); 