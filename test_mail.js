const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chjagadeesh.gdvl@gmail.com',
        pass: 'gfuz bafd thps hyxc'
    }
});

transporter.verify((error) => {
    if (error) {
        console.log('MAIL_ERROR:', error.message);
    } else {
        console.log('MAIL_SUCCESS: Server is ready to take our messages');
    }
});
