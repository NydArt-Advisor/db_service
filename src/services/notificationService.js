const Notification = require('../models/Notification');

class NotificationService {
    // Create a notification for analysis completion
    static async createAnalysisCompleteNotification(userId, artworkName) {
        try {
            await Notification.create({
                userId,
                type: 'in_app',
                category: 'analysis_complete',
                title: 'Analysis Complete!',
                message: `Your artwork "${artworkName}" has been analyzed successfully. Check out the detailed results!`,
                priority: 'normal',
                status: 'pending'
            });
            console.log(`✅ Created analysis complete notification for user ${userId}`);
        } catch (error) {
            console.error('❌ Error creating analysis complete notification:', error);
        }
    }

    // Create a notification for analysis failure
    static async createAnalysisFailedNotification(userId, artworkName, error) {
        try {
            await Notification.create({
                userId,
                type: 'in_app',
                category: 'analysis_failed',
                title: 'Analysis Failed',
                message: `Analysis of "${artworkName}" failed. Please try again or contact support if the issue persists.`,
                priority: 'high',
                status: 'pending',
                data: { error: error.message }
            });
            console.log(`✅ Created analysis failed notification for user ${userId}`);
        } catch (error) {
            console.error('❌ Error creating analysis failed notification:', error);
        }
    }

    // Create a notification for artwork added
    static async createArtworkAddedNotification(userId, artworkName) {
        try {
            await Notification.create({
                userId,
                type: 'in_app',
                category: 'artwork_added',
                title: 'Artwork Added Successfully',
                message: `Your artwork "${artworkName}" has been added to your collection.`,
                priority: 'low',
                status: 'pending'
            });
            console.log(`✅ Created artwork added notification for user ${userId}`);
        } catch (error) {
            console.error('❌ Error creating artwork added notification:', error);
        }
    }

    // Create a notification for security alert
    static async createSecurityAlertNotification(userId, alertType, details) {
        try {
            let title, message;
            
            switch (alertType) {
                case 'new_login':
                    title = 'New Login Detected';
                    message = 'We detected a new login to your account from a new device. If this wasn\'t you, please secure your account.';
                    break;
                case 'password_change':
                    title = 'Password Changed';
                    message = 'Your password has been changed successfully.';
                    break;
                case '2fa_enabled':
                    title = 'Two-Factor Authentication Enabled';
                    message = 'Two-factor authentication has been enabled for your account.';
                    break;
                case '2fa_disabled':
                    title = 'Two-Factor Authentication Disabled';
                    message = 'Two-factor authentication has been disabled for your account.';
                    break;
                default:
                    title = 'Security Alert';
                    message = details || 'A security-related action was performed on your account.';
            }

            await Notification.create({
                userId,
                type: 'in_app',
                category: 'security_alert',
                title,
                message,
                priority: 'high',
                status: 'pending',
                data: { alertType, details }
            });
            console.log(`✅ Created security alert notification for user ${userId}`);
        } catch (error) {
            console.error('❌ Error creating security alert notification:', error);
        }
    }

    // Create a notification for account update
    static async createAccountUpdateNotification(userId, updateType) {
        try {
            let title, message;
            
            switch (updateType) {
                case 'profile':
                    title = 'Profile Updated';
                    message = 'Your profile information has been updated successfully.';
                    break;
                case 'settings':
                    title = 'Settings Updated';
                    message = 'Your account settings have been updated successfully.';
                    break;
                default:
                    title = 'Account Updated';
                    message = 'Your account has been updated successfully.';
            }

            await Notification.create({
                userId,
                type: 'in_app',
                category: 'account_update',
                title,
                message,
                priority: 'low',
                status: 'pending',
                data: { updateType }
            });
            console.log(`✅ Created account update notification for user ${userId}`);
        } catch (error) {
            console.error('❌ Error creating account update notification:', error);
        }
    }

    // Create a welcome notification for new users
    static async createWelcomeNotification(userId) {
        try {
            await Notification.create({
                userId,
                type: 'in_app',
                category: 'welcome',
                title: 'Welcome to NydArt Advisor!',
                message: 'Thank you for joining our community. Start by analyzing your first artwork!',
                priority: 'normal',
                status: 'pending'
            });
            console.log(`✅ Created welcome notification for user ${userId}`);
        } catch (error) {
            console.error('❌ Error creating welcome notification:', error);
        }
    }

    // Get unread notification count for a user
    static async getUnreadCount(userId) {
        try {
            const count = await Notification.countDocuments({
                userId,
                status: { $ne: 'read' }
            });
            return count;
        } catch (error) {
            console.error('❌ Error getting unread count:', error);
            return 0;
        }
    }

    // Mark all notifications as read for a user
    static async markAllAsRead(userId) {
        try {
            await Notification.updateMany(
                { userId, status: { $ne: 'read' } },
                { status: 'read', readAt: new Date() }
            );
            console.log(`✅ Marked all notifications as read for user ${userId}`);
        } catch (error) {
            console.error('❌ Error marking all notifications as read:', error);
        }
    }
}

module.exports = NotificationService;
