// resetPasswordController.js

const jwt = require('jsonwebtoken');
const { resetPassword } = require('../services/resetPasswordService');

// Secret for JWT verification (ensure this matches the secret in your other controllers)
const JWT_SECRET = 'your-secret-key';

// Controller to reset the password
const resetPasswordController = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const token = req.headers.authorization; // Get token from Authorization header

    // Step 1: Validate input
    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'New password and confirm password are required.' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing.' });
    }

    try {
        // Step 2: Decode the JWT to get the assistant code
        const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET); // Extract the token after "Bearer"
        const { assisstant_code } = decoded;

        // Step 3: Call the service to reset the password
        const result = await resetPassword(assisstant_code, newPassword);

        // Step 4: Send response back
        res.status(200).json(result);
    } catch (error) {
        console.error('Error resetting password:', error);
        
        // Handle specific error messages
        if (error.message === 'User not found.') {
            return res.status(404).json({ message: error.message });
        }
        
        res.status(500).json({ message: 'Failed to reset password.', error: error.message });
    }
};

module.exports = resetPasswordController;
