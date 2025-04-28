import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import fs from "fs"
// import { exec, spawn } from "child_process" // Added missing import
import { createRequire } from "module"
// import "swagger-ui-express"
import { checkIP, runScan, spawnDirSearchProccess } from "./utils/subproc.js"
import { generateReport } from "./utils/playbooks.js"

import { Http2ServerRequest } from "http2"
import { error } from "console"

// Configure environment variables
dotenv.config()

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

// Swagger libs

// const swaggerUi = require('swagger-ui-express')
// const swaggerSpec = require('./swagger.js')

// Initialize Express app
const app = express()
const http = require('http');
const port = 5000
const host = '0.0.0.0'

// CORS configuration - properly configured middleware
const corsOptions = {
  origin: ["http://localhost:4321", "http://127.0.0.1", "http://127.0.0.1:4321"], // Allow multiple origins
  // origin: ["*"], // Allow All origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true, // Allow cookies
  maxAge: 86400, // Cache preflight request results for 1 day (in seconds)
}

// Apply CORS middleware to all routes
app.use(cors(corsOptions))

// Other middleware
app.use(cookieParser())
app.use(express.json())

// Configure multer for file uploads
const multer = require("multer")
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/")
  },
  filename: (req, file, callback) => {
    callback(null, "insiden_" + "_" + file.originalname)
  },
})
const upload = multer({ storage: storage })

// Serve static files
app.use("/uploads", express.static("uploads"))



function displayScanResult(file) {
  return file
}

// Function to run bash scripts

// Routes
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/index.html"))
// })

app.get("/", (req, res) => {
  let targetUrl = 'http://localhost:3000';
  http.get(targetUrl, (response) => {
    if (response.statusCode === 200) {
      res.redirect(targetUrl);
    } else {
      res.status(response.statusCode).send('Failed to redirect');
    }
  }).on('error', (err) => {
    // Handle errors if the GET requests fails
    console.error('Error making GET requests:', err);
    console.log('Error making GET requests:', err);
    res.status(500).send('Internal Server Error');
  });
});

// app.get("/scanners", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/scanners.html"))
// })

function decideTargetType(target) {
  // Check if the target is a valid IP address
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  if (ipRegex.test(target)) {
    return "ip"
  } else {
    return "domain"
  }
}

// function checkTargetType(target) {
//   const {target_type, target, domain} = req.body
//   if (!["multi", "single"].includes(target_type)) {
//     return res.status(400).send("Invalid target_type. Use 'multi' or 'single'.")
//   }

//   const input = target_type === "multi" ? target : domain
//   if (!input) {
//     return res.status(400).send("Target is required.")
//   }

//   if (!Array.isArray(input) && typeof input !== "string") {
//     return res.status(400).send("Target must be a string or an array.")
//   }

//   const targetType = decideTargetType(input)
//   if (targetType === "ip") {
//     return res.status(400).send("IP address is not allowed.")
//   }
//   return targetType
// }


// Scanner routes
app.post("/subdomain-scan", upload.single("target_list"), (req, res) => {
  // Expecting the request body to contain a "domain" field
  // Example: { "domain": "example.com" }
  // Expecting the request body to contain a "target_type" field
  // Example: { "target_type": "multi" or "single" }
  // Expecting the request body to contain a "target" field

  // upload.single("evidence")

  const target_type = req.body.target_type
  if (target_type === "multi") {
    const target_list = `uploads/${req.file.filename}`
    // If target_type is "multi", we expect a list of domains
    runScan("./scripts/subfinder_httpx_multi.sh", target_list, `./results/${target}_subfinder_result.txt`, res)
  }
  else if (target_type === "single") {
    // If target_type is "single", we expect a single domain
    const target = req.body.domain
    runScan("./scripts/subfinder_httpx.sh", target, `./results/${target}_subfinder_result.txt`, res)
  } else {
    // Handle invalid target_type
    return res.status(400).send("Invalid target_type. Use 'multi' or 'single'.")
  }
})

app.post("/get-ip-from-domain", (req, res) => {
  const target = req.body.domain
  runScan("./scripts/get-ip-from-domain.sh", target, "./results/getip_result.txt", res)
})


app.post("/dirsearch-scan", (req, res) => {
  const target = req.body.domain
  // runScan("./scripts/dirsearch-scan.sh", target, "./results/dirsearch_result.txt", res)
  spawnDirSearchProccess("./scripts/dirsearch_multi.py", target, `./results/${target}_dirsearch_result.txt`, res)
})

app.post("/auto-scan", (req, res) => {
  const target = req.body.domain
  runScan("python3 ./scripts/dirsearch-scan.sh", target, "./results/dirsearch_result.txt", res)
})

app.post("/nuclei-scan", (req, res) => {
  const target = req.body.domain
  const output = req.body.output
  runScan("./scripts/nuclei_scan_target.sh", target, `./results/${target}_nuclei_result.log`, res)
})

app.get("/check-ip", (req, res) => {
  checkIP(res)
})

app.post("/save-to-file", upload.single("result"), (req, res) => {
  const data = req.body
  const tanggal_waktu = new Date().toISOString().slice(0, 19).replace(/:/g, "_")
  res.send
})

app.post("/rce", (req, res) => {
  let command = 'pwd'
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return res.status(500).send(error.message)
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`)
    }
    console.log(`Stdout: ${stdout}`)
    // Send file for download
    res.send(`<script>alert('Stdout: ${stdout}');</script>`);
  })
})

// Form submission route
app.post("/submit", upload.single("evidence"), (req, res) => {
  if (req.file) {
    // Convert the request body to a string
    const generate_report = JSON.stringify(req.body)
    const tanggal_waktu = new Date().toISOString().slice(0, 19).replace(/:/g, "_")
    const file = JSON.stringify(req.body)
    // Write the data to a .txt file
    fs.writeFile(`./uploads/insiden ${req.body.title}-${tanggal_waktu}.json`, generate_report, (err) => {
      if (err) throw err
      console.log("Data written to file")
    })
    generateReport(req, res)
  } else {
    res.send("Please upload a file for evidence.")
  }
})

// Base64 image upload route
app.post("/upload", (req, res) => {
  const base64Image = req.body.base64Image
  const imageBuffer = Buffer.from(base64Image, "base64")

  fs.writeFile("image.jpg", imageBuffer, (err) => {
    if (err) {
      console.error(err)
      return res.status(500).send(err)
    }
    res.send("Image uploaded successfully")
  })
})

// Start the server
app.listen(port,host, () => console.log(`Server running at port ${port} in ${host}`))

