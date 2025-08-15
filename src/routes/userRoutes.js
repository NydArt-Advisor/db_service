const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create a new user
router.post('/', userController.createUser);

// Get user by ID
router.get('/:id', userController.getUserById);

// Get user by email
router.get('/email/:email', userController.getUserByEmail);

// Get user by username
router.get('/username/:username', userController.getUserByUsername);

// Update user
router.patch('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

// Get user by social login ID
router.get('/social/:provider/:socialId', userController.getUserBySocialId);

// Get user by reset token
router.get('/reset-token/:token', userController.getUserByResetToken);

module.exports = router; 