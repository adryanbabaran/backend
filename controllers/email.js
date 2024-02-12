const nodemailer = require('nodemailer');

// Create Nodemailer transporter with your email service provider details
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "keynesabid@gmail.com",
      pass: "akfe utjx zrzs fczq",
    },
  });

// Function to send verification email
module.exports.sendVerificationEmail = async (toEmail) => {
	console.log(toEmail);
    try {
        const mailOptions = {
            from: 'keynesabid@gmail.com',
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

// Function to send verification email
module.exports.passwordUpdated = async (toEmail) => {
	console.log(toEmail);
    try {
        const mailOptions = {
            from: 'keynesabid@gmail.com',
            to: toEmail,
            subject: 'Password has been updated',
            text: "This is to notify that you have updated your password. If it's not you, please contact customer admin."
        };

        // Send email
        await transporter.sendMail(mailOptions);

        console.log('Verification email sent successfully.');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Error sending verification email');
    }
};

