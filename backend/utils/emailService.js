import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendEmail = async (to, subject, template, data) => {
    try {
        const mailOptions = {
            from: process.env.FROM_EMAIL || 'noreply@vendorstreet.com',
            to,
            subject,
            html: generateEmailTemplate(template, data)
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};

const generateEmailTemplate = (template, data) => {
    const templates = {
        welcome: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to VendorStreet!</h2>
                <p>Hello ${data.firstName},</p>
                <p>Thank you for joining VendorStreet. We're excited to have you on board!</p>
                <p>Best regards,<br>The VendorStreet Team</p>
            </div>
        `,
        vendorApproval: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Vendor Application ${data.status}</h2>
                <p>Hello ${data.firstName},</p>
                <p>Your vendor application has been ${data.status}.</p>
                ${data.notes ? `<p>Notes: ${data.notes}</p>` : ''}
                <p>Best regards,<br>The VendorStreet Team</p>
            </div>
        `
    };

    return templates[template] || `<p>${data.message}</p>`;
};