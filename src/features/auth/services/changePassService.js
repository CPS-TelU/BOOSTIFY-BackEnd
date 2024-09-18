const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const updateUserPassword = async (id, currentPassword, newPassword) => {
    try {
        // Fetch the current password hash from the database
        const user = await prisma.assisstant.findUnique({
            where: { id }
        });

        if (!user) {
            throw new Error('User not found.');
        }

        // Check if the current password matches
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect.');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        const updatedUser = await prisma.assisstant.update({
            where: { id },
            data: { password: hashedPassword }
        });

        return updatedUser;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};

module.exports = {
    updateUserPassword,
};
