const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Service to verify the code
const verifyCode = async (assisstant_code, verification_code) => {
    try {
        // Step 1: Fetch the assistant based on the assistant code
        const assistant = await prisma.assisstant.findUnique({
            where: { assisstant_code }
        });

        // Step 2: Check if the assistant exists
        if (!assistant) {
            throw new Error('Assistant not found.');
        }

        // Step 3: Check if the provided verification code matches the one in the database
        if (assistant.verification_code !== verification_code) {
            throw new Error('Invalid verification code.');
        }

        // Step 4: Code is valid, return success
        return { valid: true, message: 'Verification code is correct.' };
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Verification failed.');
    }
};

module.exports = { verifyCode };
