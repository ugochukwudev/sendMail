const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const https = require("https");

// Load environment variables
dotenv.config();

// Import configurations
const { swaggerDocument, swaggerDocs } = require('./src/config/swagger');

// Import routes
const emailRoutes = require('./src/routes/emailRoutes');

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(morgan("dev"));
app.use(cors());

// CORS headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Routes
app.use('/', emailRoutes);

// Health check interval
const healthCheckInterval = setInterval(() => {
  https.get("https://techxmail.onrender.com/health", (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
      console.log(`Health check passed: ${data}`);
    });
  }).on("error", (error) => {
    console.error("Health check failed:", error.message);
  });
}, 120000);

// Cleanup on shutdown
process.on('SIGINT', () => {
  clearInterval(healthCheckInterval);
  console.log('Health check interval cleared.');
  process.exit();
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));