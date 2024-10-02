const { updateUserPassword } = require('../services/changePassService');
const jwt = require('jsonwebtoken');

const patchUserPassword = async (req, res) => {
    const { authorization } = req.headers;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check if authorization header exists and is properly formatted
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed.' });
    }

    const token = authorization.split(' ')[1]; // Extract the token from the header

    try {
        // Verify and decode the token to get the user ID
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = decodedToken; // Extract the user ID from the token

        // Check if currentPassword, newPassword, and confirmPassword are provided
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Current password, new password, and confirmation are required.' });
        }

        // Check if newPassword and confirmPassword match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirmation do not match.' });
        }

        // Call the service to update the password
        const updatedUser = await updateUserPassword(id, currentPassword, newPassword);

        // Handle case where the user is not found
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Respond with success message
        res.json({ message: 'Password updated successfully.' });
    }   catch (error) {
        console.error('Error processing request:', error);

        // Handle specific case where the current password is incorrect
        if (error.message === 'Current password is incorrect.') {
            return res.status(400).json({ message: error.message });
        }

        // Return a generic error response for other errors
        res.status(500).json({ message: 'Failed to update password.', error: error.message });
    }
};

module.exports = patchUserPassword;

