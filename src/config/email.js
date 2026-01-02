const nodemailer = require("nodemailer");

const emailConfig = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "managetechx@gmail.com",
    pass: process.env.pass,
  },
  // Connection timeout settings - increased for production
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000,
  socketTimeout: 30000,
  // Retry settings
  pool: false, // Disable pooling for better compatibility
  // TLS options
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  // Debug mode (set to false in production)
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development'
};

const transporter = nodemailer.createTransport(emailConfig);

// Don't verify on startup - verify only when sending
// This prevents connection timeout errors on server startup

module.exports = {
  transporter,
  defaultFrom: "Techx Mail Service"
};