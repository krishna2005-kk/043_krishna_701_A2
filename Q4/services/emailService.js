const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendEmployeeCredentials(to, empId, plainPassword) {
  const mail = {
    from: process.env.FROM_EMAIL || process.env.MAIL_USER,
    to,
    subject: 'Welcome! Your Employee Credentials',
    text: `Hello,\nYour Employee ID: ${empId}\nPassword: ${plainPassword}\n\nPlease login and change your password.`
  };
  await transporter.sendMail(mail);
}

module.exports = { sendEmployeeCredentials };
