import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import fs from "fs/promises"
import { exec } from "child_process" // Added missing import
// import { createRequire } from "module"

// swagger
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from "./swagger.js"
// import swaggerDocument from "./routes/api.json"
// import { middlewareObj } from "./middleware/middleware-name1.js"

import pkg from "swagger-generator-express"
const { validation } = pkg;


dotenv.config()

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const useBasePath = true;
// const require = createRequire(import.meta.url)
const swaggerDocument = JSON.parse(await fs.readFile('./routes/api.json', 'utf-8'));

// app.js or index.js
// const express = require('express');
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./swagger'); // path to swagger.js

const app = express();
const router = express.Router();
const port = 5000;

const middlewareObj = {
    'middleware-name1': JSON.parse(await fs.readFile('./routes/api.json', 'utf-8'))
};


app.use(express.json());

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Example route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello Swagger!' });
});

// router.use('/api-docs', swaggerUi.serve)
// router.get('/api-docs', swaggerUi.setup(swaggerDocument));

// swaggerUi.setUpRoutes(middlewareObj, app, swaggerDocument, useBasePath);


const specs = swaggerSpec;
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});
