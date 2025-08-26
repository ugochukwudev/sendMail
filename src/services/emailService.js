const { transporter, defaultFrom } = require('../config/email');
const { cleanupFiles } = require('../utils/validation');

async function sendEmail({ mail, subject, text, html, files }) {
  const attachments = files ? files.map(file => ({
    filename: file.originalname,
    path: file.path
  })) : [];

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
    cleanupFiles(files);
    return { success: true, response: info.response };
  } catch (error) {
    cleanupFiles(files);
    throw error;
  }
}

module.exports = {
  sendEmail
};
