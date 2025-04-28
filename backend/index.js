import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import multer from "multer"
import http from "http"
import { createRequire } from "module"

// Import routers
import scannerRouter from "./routes/scanner.js"
import { utilityRouter } from "./routes/utility.js"
import reportRouter from "./routes/report.js"

// Configure environment variables
dotenv.config()

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

// Initialize Express app
const app = express()
const port = 5000
const host = '0.0.0.0'

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:4321", "http://127.0.0.1", "http://127.0.0.1:4321"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  maxAge: 86400,
}

// Apply middleware
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

// Root route
app.get("/", (req, res) => {
  let targetUrl = 'http://localhost:3000';
  http.get(targetUrl, (response) => {
    if (response.statusCode === 200) {
      res.redirect(targetUrl);
    } else {
      res.status(response.statusCode).send('Failed to redirect');
    }
  }).on('error', (err) => {
    console.error('Error making GET requests:', err);
    res.status(500).send('Internal Server Error');
  });
});

// Before Routers
app.use("/", scannerRouter);
app.use("/", utilityRouter);
app.use("/", reportRouter);

// Use routers
// app.use("/api/scanner", scannerRouter);
// app.use("/api/utility", utilityRouter);
// app.use("/api/report", reportRouter);

// Start the server
app.listen(port, host, () => console.log(`Server running at port ${port} in ${host}`))