const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const nodemailer = require("nodemailer");
const https = require("https"); // Import the https module

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(session({ secret: "secret" }));

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Techx mail API",
      version: "1.0.0",
    },
  },
  apis: ["/nodemailer/swagger.json"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.get("/health", (req, res) => {
  res.status(200).send(" sendmail backend is up and running");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.status(200).send(`<h1>Welcome to techxmail</h1>`);
});

app.get("*", (req, res) => {
  res.status(200).send(`<b>Not found</b>`);
});

// Email validation function using regex
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

app.post("/sendmail", (req, res) => {
  const { mail, subject, text, html, name } = req.body;

  // Validate email format
  if (!isValidEmail(mail)) {
    res.status(400).send({ message: "Invalid email format" });
    return;
  }

  if (!mail || !subject || !name) {
    res.status(400).send({ message: "Incomplete data" });
    return;
  }

  var transporter = nodemailer.createTransport({
    service: "gmail", // name of email provider
    auth: {
      user: "managetechx@gmail.com", // sender's gmail id
      pass: process.env.pass, // sender password
    },
  });

  const from = `Techx Mail Service`;
  var mailOptions = {
    from: from,
    to: mail,
    subject: `${subject} `,
    text: text || null,
    html: html || null,
  };

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send({ message: "Email sent successfully" });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message });
  }
});

// Function to check the health of the server every 2 minutes using https
const healthCheckInterval = setInterval(() => {
  https.get("https://techxmail.onrender.com/health", (resp) => {
    let data = '';

    // A chunk of data has been received
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received
    resp.on('end', () => {
      console.log(`Health check passed: ${data}`);
    });

  }).on("error", (error) => {
    console.error("Health check failed:", error.message);
    // You can add a response or log the error here
  });
}, 120000); // 120000 milliseconds = 2 minutes

// Clearing the interval on server shutdown
process.on('SIGINT', () => {
  clearInterval(healthCheckInterval);
  console.log('Health check interval cleared.');
  process.exit();
});

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server running on port ${port}`));
