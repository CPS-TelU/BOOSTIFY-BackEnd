// resetPasswordService.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const resetPassword = async (assisstant_code, newPassword) => {
    try {
        // Find the user by assisstant code (corrected field name)
        const user = await prisma.assisstant.findUnique({
            where: { assisstant_code } // Use the correct field name here
        });

        if (!user) {
            throw new Error('User not found.');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await prisma.assisstant.update({
            where: { assisstant_code }, // Use the correct field name here
            data: { password: hashedPassword }
        });

        return { success: true, message: 'Password reset successfully.' };
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};

module.exports = { resetPassword };
