const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function() {
            return !this.socialLogin; // Password required only if not social login
        }
    },
    socialLogin: {
        provider: {
            type: String,
            enum: ['google', null],
            default: null
        },
        socialId: String,
        accessToken: String
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'artist'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    phone: {
        number: {
            type: String,
            required: false,
            validate: {
                validator: function(v) {
                    if (!v) return true; // Allow empty
                    // Basic phone number validation (E.164 format)
                    const phoneRegex = /^\+[1-9]\d{1,14}$/;
                    return phoneRegex.test(v);
                },
                message: 'Phone number must be in E.164 format (e.g., +1234567890)'
            }
        },
        countryCode: {
            type: String,
            required: false
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    notificationPreferences: {
        email: {
            enabled: { type: Boolean, default: true },
            categories: {
                welcome: { type: Boolean, default: true },
                security_alert: { type: Boolean, default: true },
                analysis_complete: { type: Boolean, default: true },
                analysis_failed: { type: Boolean, default: true },
                account_update: { type: Boolean, default: true },
                subscription: { type: Boolean, default: true },
                artwork_added: { type: Boolean, default: true },
                artwork_updated: { type: Boolean, default: true },
                system_alert: { type: Boolean, default: true }
            }
        },
        sms: {
            enabled: { type: Boolean, default: false },
            categories: {
                security_alert: { type: Boolean, default: true },
                analysis_complete: { type: Boolean, default: true },
                analysis_failed: { type: Boolean, default: true },
                account_update: { type: Boolean, default: false },
                subscription: { type: Boolean, default: true },
                system_alert: { type: Boolean, default: true }
            }
        },
        inApp: {
            enabled: { type: Boolean, default: true },
            categories: {
                welcome: { type: Boolean, default: true },
                security_alert: { type: Boolean, default: true },
                analysis_complete: { type: Boolean, default: true },
                analysis_failed: { type: Boolean, default: true },
                account_update: { type: Boolean, default: true },
                subscription: { type: Boolean, default: true },
                artwork_added: { type: Boolean, default: true },
                artwork_updated: { type: Boolean, default: true },
                system_alert: { type: Boolean, default: true }
            }
        }
    },
    subscription: {
        type: {
            type: String,
            enum: ['free', 'basic', 'premium'],
            default: 'free'
        },
        startDate: Date,
        endDate: Date,
        analysisCredits: {
            type: Number,
            default: 5 // Free users get 5 analyses per month
        }
    },
    profile: {
        name: String,
        bio: String,
        avatar: String,
        socialLinks: {
            instagram: String,
            twitter: String,
            website: String
        }
    },
    refreshToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerified: {
        type: Boolean,
        default: false
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String,
        default: null
    },
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    currentPlan: {
        type: String,
        default: 'free'
    }
});

// Update the updatedAt field on save
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('User', userSchema); 