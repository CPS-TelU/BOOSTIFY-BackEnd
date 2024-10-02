const { sendVerificationCode } = require('../services/verificationService');
const jwt = require('jsonwebtoken');

// Secret for JWT signing (use environment variables in production)
const JWT_SECRET = 'your-secret-key';

// Controller to request verification code
const requestVerificationCode = async (req, res) => {
    const { assisstant_code, email } = req.body;

    if (!assisstant_code || !email) {
        return res.status(400).json({ message: 'Assistant code and email are required.' });
    }

    try {
        // Send the verification code via email
        await sendVerificationCode(assisstant_code, email);

        // Step 1: Generate a JWT with the assistant code
        const token = jwt.sign({ assisstant_code }, JWT_SECRET, { expiresIn: '15m' });

        // Return the token to the user
        res.json({ message: 'Verification code sent to your email.', token });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ message: 'Failed to send verification code.' });
    }
};

module.exports = requestVerificationCode;
