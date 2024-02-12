const nodemailer = require('nodemailer');

// Create Nodemailer transporter with your email service provider details
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'lesmurfacct@gmail.com',
        pass: '123werk!'
    }
});

// Function to send verification email
module.exports.sendVerificationEmail = async (toEmail) => {
	console.log(toEmail);
    try {
        const mailOptions = {
            from: 'lesmurfacct@gmail.com',
            to: toEmail,
            subject: 'Registration Success',
            text: 'This is to notify that you have created your account successfully.'
        };

        // Send email
        await transporter.sendMail(mailOptions);

        console.log('Verification email sent successfully.');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Error sending verification email');
    }
};


