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
            from: 'boostifycps@gmail.com',
            to: email,
            subject: 'Password Change Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; max-width: 600px; margin: auto;">
                    <div style="text-align: center;">
                        <img src="https://ik.imagekit.io/mitchel/Boostifylogo.png?updatedAt=1727863972552" alt="Boostify Logo" style="width: 150px; margin-bottom: 20px;">
                    </div>
                    <h2 style="color: #333;">Password Change Verification</h2>
                    <p>Dear valued user,</p>
                    <p>We received a request to change the password for your Boostify account. Please use the following verification code to proceed with the password change:</p>
                    <div style="font-size: 24px; font-weight: bold; padding: 10px 0; color: #333;">${verificationCode}</div>
                    <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
                    <p>Thank you for choosing Boostify!</p>
                    <p style="margin-top: 20px;">Best regards,<br>Boostify Support Team</p>
                    <hr style="margin-top: 40px; border: none; border-top: 1px solid #e0e0e0;">
                    <p style="font-size: 12px; color: #666;">If you have any questions, please feel free to contact us at <a href="mailto:boostifycps@gmail.com" style="color: #0073e6;">boostifycps@gmail.com</a> or visit our website at <a href="https://boostify-fe.vercel.app/" style="color: #0073e6;">https://boostify-fe.vercel.app/</a></p>
                </div>
            `,
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
