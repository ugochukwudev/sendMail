const { transporter, defaultFrom } = require('../config/email');
const nodemailer = require('nodemailer');

// Create a fallback transporter with SSL (port 465)
const createFallbackTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "managetechx@gmail.com",
      pass: process.env.pass,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    tls: {
      rejectUnauthorized: false
    }
  });
};

async function sendEmail({ mail, subject, text, html, files }) {
  // Prepare attachments if files were uploaded
  const attachments = [];
  if (files && files.length > 0) {
    for (const file of files) {
      attachments.push({
        filename: file.originalname,
        content: file.buffer
      });
    }
  }

  const mailOptions = {
    from: defaultFrom,
    to: mail,
    subject: `${subject}`,
    text: text || null,
    html: html || null,
    attachments
  };

  // Try primary transporter first, then fallback to SSL
  const transporters = [transporter];
  
  // Retry logic with multiple transporter options
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // On second attempt, try SSL port
    if (attempt === 2) {
      console.log('Trying SSL connection (port 465)...');
      transporters.push(createFallbackTransporter());
    }

    for (const currentTransporter of transporters) {
      try {
        console.log(`Attempting to send email (attempt ${attempt}/${maxRetries})...`);
        const info = await currentTransporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return { success: true, response: info.response };
      } catch (error) {
        lastError = error;
        console.error(`Email sending attempt ${attempt} failed:`, error.message);
        
        // If it's a connection timeout and not the last attempt, wait before retrying
        if (attempt < maxRetries && (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET' || error.code === 'ESOCKETTIMEDOUT')) {
          const waitTime = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
          console.log(`Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          break; // Break out of transporter loop to retry
        }
      }
    }
  }

  // If all retries failed
  throw lastError;
}

module.exports = {
  sendEmail
};