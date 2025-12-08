import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "API documentation for my Express backend",
    },
    servers: [
      {
        url: "https://ecombackend-vl7q.onrender.com", // Change to your real server URL
      },
    ],
  },

  // Path where your route files are located
  apis: ["./routers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };