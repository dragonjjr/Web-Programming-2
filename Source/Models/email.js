const nodemailer = require('nodemailer');

async function send(to, subject, content,htmlContent) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME || 'testweb18ck1@gmail.com',
            pass: process.env.EMAIL_PASSWORD || 'Abcxyz123',
        }
    });

    return transporter.sendMail({
        from: process.env.EMAIL_USERNAME || 'testweb18ck1@gmail.com',
        to,
        subject,
        text: content,
        html: htmlContent
    });

};

module.exports = { send };
