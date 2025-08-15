const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['email', 'sms', 'in_app', 'push'],
        required: true
    },
    category: {
        type: String,
        enum: [
            'welcome',
            'password_reset',
            'security_alert',
            'analysis_complete',
            'analysis_failed',
            'account_update',
            'subscription',
            'system_alert',
            'artwork_added',
            'artwork_updated'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed', 'read'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    scheduledFor: {
        type: Date,
        default: Date.now
    },
    sentAt: {
        type: Date
    },
    readAt: {
        type: Date
    },
    retryCount: {
        type: Number,
        default: 0
    },
    maxRetries: {
        type: Number,
        default: 3
    },
    errorMessage: {
        type: String
    }
}, {
    timestamps: true
});

// Index for efficient queries
notificationSchema.index({ userId: 1, status: 1, createdAt: -1 });
notificationSchema.index({ scheduledFor: 1, status: 'pending' });
notificationSchema.index({ category: 1, status: 1 });

// Virtual for formatted date
notificationSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString();
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
    this.status = 'read';
    this.readAt = new Date();
    return this.save();
};

// Method to mark as sent
notificationSchema.methods.markAsSent = function() {
    this.status = 'sent';
    this.sentAt = new Date();
    return this.save();
};

// Method to mark as failed
notificationSchema.methods.markAsFailed = function(errorMessage) {
    this.status = 'failed';
    this.errorMessage = errorMessage;
    this.retryCount += 1;
    return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema); 