const { transporter, defaultFrom } = require('../config/email');
const { uploadBuffer, cloudinary } = require('../config/cloudinary');

async function sendEmail({ mail, subject, text, html, files }) {
  // Upload files to Cloudinary if present
  const attachments = [];
  if (files && files.length > 0) {
    for (const file of files) {
      try {
        // Just use the buffer directly from multer
        attachments.push({
          filename: file.originalname,
          content: file.buffer
        });
      } catch (error) {
        console.error('File handling error:', error);
        throw new Error('File processing failed');
      }
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

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, response: info.response };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

module.exports = {
  sendEmail
};