const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        // Set default values for new users
        const userData = {
            ...req.body,
            status: req.body.status || 'active',
            role: req.body.role || 'user',
            emailVerified: req.body.emailVerified || false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // If it's a social login user, set emailVerified to true
        if (userData.socialLogin && userData.socialLogin.provider) {
            userData.emailVerified = true;
        }

        const user = new User(userData);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        
        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];
            
            if (field === 'email') {
                return res.status(409).json({
                    message: 'User already exists with this email',
                    error: 'Email already registered'
                });
            } else if (field === 'username') {
                return res.status(409).json({
                    message: 'Username already taken',
                    error: 'Username already exists'
                });
            } else {
                return res.status(409).json({
                    message: `Duplicate ${field} value`,
                    error: `${field} already exists`
                });
            }
        }
        
        res.status(400).json({
            message: 'Error creating user',
            error: error.message
        });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error finding user by ID:', error);
        res.status(500).json({
            message: 'Error finding user',
            error: error.message
        });
    }
};

// Get user by email
exports.getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error finding user by email:', error);
        res.status(500).json({
            message: 'Error finding user',
            error: error.message
        });
    }
};

// Get user by username
exports.getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error finding user by username:', error);
        res.status(500).json({
            message: 'Error finding user',
            error: error.message
        });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
};

// Get user by social login ID
exports.getUserBySocialId = async (req, res) => {
    try {
        const { provider, socialId } = req.params;
        const user = await User.findOne({
            'socialLogin.provider': provider,
            'socialLogin.socialId': socialId
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error finding user by social ID:', error);
        res.status(500).json({
            message: 'Error finding user',
            error: error.message
        });
    }
};

// Get user by reset token
exports.getUserByResetToken = async (req, res) => {
    try {
        const user = await User.findOne({
            passwordResetToken: req.params.token,
            passwordResetExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired reset token' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error finding user by reset token:', error);
        res.status(500).json({
            message: 'Error finding user',
            error: error.message
        });
    }
}; 