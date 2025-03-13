import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import fs from "fs"
import { exec } from "child_process" // Added missing import
import { createRequire } from "module"
import { Http2ServerRequest } from "http2"

// Configure environment variables
dotenv.config()

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

// Initialize Express app
const app = express()
const http = require('http');

// CORS configuration - properly configured middleware
const corsOptions = {
  origin: ["http://localhost:4321", "https://127.0.0.1", "https://127.0.0.1:4321"], // Allow multiple origins
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

// Report generation function
function generateReport(data) {
  let report = `Jenis Serangan: ${data.attack_type}\n`
  report += `Tags: ${data.tags}\n`
  report += `Severity: ${data.severity}\n`
  report += `Description: ${data.description}\n`
  report += `Action: ${data.action}\n`
  report += `Recommendations: ${data.recommendations}\n`
  report += `Details: ${data.details}\n`
  report += `\n\n\n`
  report += `Markdowns Preview\n\n`
  report += `# ${data.title}\n\n`
  report += `**Jenis Serangan**: ${data.attack_type}\n\n`
  report += `**Tags**: ${data.tags}\n\n`
  report += `**Severity**: ${data.severity}\n\n`
  report += `**Description**: ${data.description}\n\n`
  report += `**Action**: ${data.action}\n\n`
  report += `**Recommendations**: ${data.recommendations}\n\n`
  report += `**uuid**: ${data.uuid}\n\n`
  report += `**Search Query**: \`\`\` ${data.query} \`\`\`\n\n`
  report += `# Future Details\n`
  report += `\`\`\` ${data.details}\`\`\`\n`
  return report
}



// Function to run bash scripts
function runScan(scriptPath, target, resultFile, res) {
  const command = `bash ${scriptPath} "${target}"`
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
    res.download(path.join(__dirname, resultFile), (err) => {
      if (err) {
        console.error("Error sending file: ", err)
      }
    res.send(`Result - stdout: ${stdout}, stderr: ${stderr}`);
    })
  })
}

// Routes
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/index.html"))
// })

app.get("/", (req, res) => {
  let targetUrl = 'http://localhost:4321';
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

app.get("/scanners", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/scanners.html"))
})

// Scanner routes
app.post("/subfinder-scan", (req, res) => {
  const target = req.body.domain
  runScan("./scripts/subfinder-scan.sh", target, "./results/subfinder_result.txt", res)
})

app.post("/get-ip-from-domain", (req, res) => {
  const target = req.body.domain
  runScan("./scripts/get-ip-from-domain.sh", target, "./results/getip_result.txt", res)
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

app.post("/dirsearch-scan", (req, res) => {
  const target = req.body.domain
  runScan("./scripts/dirsearch-scan.sh", target, "./results/dirsearch_result.txt", res)
})

app.post("/nuclei-scan", (req, res) => {
  const target = req.body.domain
  runScan("./scripts/nuclei_scan_target.sh", target, `./results/${target}_nuclei_result.log`, res)
})

// Form submission route
app.post("/submit", upload.single("evidence"), (req, res) => {
  const data = req.body.domain
  const report = generateReport(data)
  res.send(`<pre>${report}</pre>` + `<img src="/uploads/${req.file.filename}" />`)

  // Convert the request body to a string
  const generate_report = JSON.stringify(req.body)
  const tanggal_waktu = new Date().toISOString().slice(0, 19).replace(/:/g, "_")

  // Write the data to a .txt file
  fs.writeFile(`./uploads/insiden ${data.title}-${tanggal_waktu}.json`, generate_report, (err) => {
    if (err) throw err
    console.log("Data written to file")
  })
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
app.listen(5000, () => console.log("Server running at port 5000"))

