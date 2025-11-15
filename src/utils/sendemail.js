import nodemailer from 'nodemailer';
import 'dotenv/config';
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendEmail({ to, subject, html }) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    });
}

// Function to send email with attachment
async function sendEmailWithAttachment({ to, subject, text, filename, content, contentType }) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        attachments: [
            {
                filename,
                content,
                contentType
            }
        ]
    });
}

// Export both functions
export { sendEmail, sendEmailWithAttachment };