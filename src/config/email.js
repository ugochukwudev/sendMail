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
  // Connection timeout settings
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  // Retry settings
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
  // TLS options
  tls: {
    rejectUnauthorized: false
  }
};

const transporter = nodemailer.createTransport(emailConfig);

// Verify connection on startup
transporter.verify(function (error, success) {
  if (error) {
    console.log('Email transporter verification error:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

module.exports = {
  transporter,
  defaultFrom: "Techx Mail Service"
};