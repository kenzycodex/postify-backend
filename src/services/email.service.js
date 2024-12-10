const nodemailer = require('nodemailer');
const { getConfig } = require('../config/environment');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: getConfig().email.host,
      port: getConfig().email.port,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendVerificationEmail(email, token) {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    await this.transporter.sendMail({
      from: '"Your App" <noreply@yourapp.com>',
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      `
    });
  }

  // Additional email methods...
}

module.exports = new EmailService();