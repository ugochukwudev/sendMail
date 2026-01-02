const { transporter, defaultFrom } = require('../config/email');

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

  // Retry logic for production
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to send email (attempt ${attempt}/${maxRetries})...`);
      const info = await transporter.sendMail(mailOptions);
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
      } else {
        // For other errors or last attempt, throw immediately
        throw error;
      }
    }
  }

  // If all retries failed
  throw lastError;
}

module.exports = {
  sendEmail
};