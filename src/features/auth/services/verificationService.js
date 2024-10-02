const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let verificationCodes = {}; // In-memory storage for verification codes

// Service to send verification code
const sendVerificationCode = async (assisstant_code, email) => {
    try {
        // Step 1: Find the assistant using the provided assisstant_code
        const assistant = await prisma.assisstant.findUnique({
            where: { assisstant_code },
        });

        if (!assistant) {
            throw new Error('Assistant with this code not found.');
        }

        // Step 2: Check if the provided email matches the one in the database
        if (assistant.email !== email) {
            throw new Error('Email does not match our records.');
        }

        // Step 3: Generate a verification code
        const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        // Step 4: Send the verification code via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sayyidizzuddin56@gmail.com',
                pass: 'tavx qmij harx yqcs', // Consider using environment variables to store sensitive info
            },
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Change Verification Code',
            text: `Your verification code is: ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);

        // Step 5: Store the code in the database
        await prisma.assisstant.update({
            where: { assisstant_code },
            data: { verification_code: verificationCode },
        });

        // Step 6: Store the code in memory with expiration (optional if needed)
        verificationCodes[email] = {
            code: verificationCode,
            expiresAt: Date.now() + 15 * 60 * 1000, // Code expires in 15 minutes
        };

        return { message: 'Verification code sent successfully.' };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to send verification code.');
    }
};

module.exports = { sendVerificationCode };
