const swaggerJsDoc = require("swagger-jsdoc");
const swaggerDocument = require("../../swagger.json");

// Dynamically set swagger host based on environment
const isProd = process.env.NODE_ENV === 'production';
swaggerDocument.host = isProd ? 'techxmail.onrender.com' : 'localhost:3000';
swaggerDocument.schemes = isProd ? ['https'] : ['http'];

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

module.exports = {
  swaggerDocument,
  swaggerDocs
};
