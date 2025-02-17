import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import basicAuth from "express-basic-auth"

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Api Documention - Modern Shortner Url Application",
            version: "1.0.0",
            description: "API documentation for Modern URL Shortner For The Alter Office",
        }
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use(
        "/api-docs",
        basicAuth({
            users: { admin: "password123" },
            challenge: true,
        }),
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec)
    );
};

export default setupSwagger;