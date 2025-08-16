const mongoose = require('mongoose');
const User = require('../models/User');

// Migration script to update existing users with new required fields
async function updateExistingUsers() {
    try {
        console.log('Starting migration: Update existing users with new fields...');
        
        // Find all users that don't have the new fields
        const usersToUpdate = await User.find({
            $or: [
                { status: { $exists: false } },
                { role: { $exists: false } },
                { emailVerified: { $exists: false } },
                { updatedAt: { $exists: false } }
            ]
        });

        console.log(`Found ${usersToUpdate.length} users to update`);

        if (usersToUpdate.length === 0) {
            console.log('No users need updating. Migration complete.');
            return;
        }

        // Update each user with the missing fields
        for (const user of usersToUpdate) {
            const updateData = {};

            // Add missing fields with default values
            if (!user.status) {
                updateData.status = 'active';
            }
            if (!user.role) {
                updateData.role = 'user';
            }
            if (!user.emailVerified) {
                updateData.emailVerified = false;
            }
            if (!user.updatedAt) {
                updateData.updatedAt = user.createdAt || new Date();
            }

            // Update the user
            await User.findByIdAndUpdate(user._id, { $set: updateData });
            console.log(`Updated user: ${user.email} (${user._id})`);
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            return updateExistingUsers();
        })
        .then(() => {
            console.log('Migration completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}

module.exports = { updateExistingUsers }; 