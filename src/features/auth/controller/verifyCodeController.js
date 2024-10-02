const { verifyCode } = require('../services/verifyCodeService');
const jwt = require('jsonwebtoken');

// Secret for JWT verification (ensure this matches the secret in your other controllers)
const JWT_SECRET = 'your-secret-key';

// Controller to verify the verification code
const verifyVerificationCode = async (req, res) => {
    const { verification_code } = req.body;
    const token = req.headers.authorization; // Get token from Authorization header

    // Step 1: Validate input
    if (!verification_code) {
        return res.status(400).json({ message: 'Verification code is required.' });
    }

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing.' });
    }

    try {
        // Step 2: Decode the JWT to get the assistant code
        const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);  // Extract the token after "Bearer"
        const { assisstant_code } = decoded;

        // Step 3: Use the service to verify the code
        const result = await verifyCode(assisstant_code, verification_code);

        // Step 4: Send response back
        res.status(200).json(result);
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = verifyVerificationCode;
