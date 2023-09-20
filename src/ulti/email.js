const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: '25',
        auth: {
            user: 'c4e8a51c3cacb4',
            pass: '80dbb3da61743f',
        },    
    });

    const emailOptions = {
        from: 'huybequy@hqb.com',
        to: option.email,
        subject: option.subject,
        text: option.message,
    };

    await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
