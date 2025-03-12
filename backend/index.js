import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";


// import path from "path";
// import db from "./config/database.js";
// import user from "./routes/UserRoutes.js";
dotenv.config();
const app = express();
// const path = require('path');
 
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
// app.use(user);

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const multer  = require('multer');
const storage = multer.diskStorage({
destination: function(req, file, callback) {
  callback(null, 'uploads/');
},
filename: function (req, file, callback) {
  callback(null, 'insiden_' + "_" + file.originalname);
}
});
const upload = multer({ storage: storage });




  function generateReport(data) {
    let report = `Jenis Serangan: ${data.attack_type}\n`;
    report += `Tags: ${data.tags}\n`;
    report += `Severity: ${data.severity}\n`;
    report += `Description: ${data.description}\n`;
    report += `Action: ${data.action}\n`;
    report += `Recommendations: ${data.recommendations}\n`;
    report += `Details: ${data.details}\n`;
    report += `\n\n\n`;
    report += `Markdowns Preview\n\n`;
    report += `# ${data.title}\n\n`;
    report += `**Jenis Serangan**: ${data.attack_type}\n\n`;
    report += `**Tags**: ${data.tags}\n\n`;
    report += `**Severity**: ${data.severity}\n\n`;
    report += `**Description**: ${data.description}\n\n`;
    report += `**Action**: ${data.action}\n\n`;
    report += `**Recommendations**: ${data.recommendations}\n\n`;
    report += `**uuid**: ${data.uuid}\n\n`;
    report += `**Search Query**: \`\`\` ${data.query} \`\`\`\n\n`;
    report += `# Future Details\n`;
    report += `\`\`\` ${data.details}\`\`\`\n`;
    // report += `Evidence: <img src="${data.evidence.filename}"/>\n`; 
    // report += data.base64img;
    return report;
}


// Fungsi untuk menjalankan bash script dengan parameter dari input target
function runScan(scriptPath, target, resultFile, res) {
    // Misalnya, target berupa string (bisa juga target.input atau properti lain sesuai struktur req.body)
    const command = `bash ${scriptPath} "${target}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send(error.message);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(`Stdout: ${stdout}`);
      // Kirim file hasil untuk di-download
      res.download(path.join(__dirname, resultFile), (err) => {
        if (err) {
          console.error("Error sending file: ", err);
        }
      });
    });
  }

// Set up multer and specify the destination for uploaded files

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/scanners', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/scanners.html'));
});


///

app.post("/subfinder-scan", (req, res) => {
    let target = req.body;
    // Contoh: script berada di ./scripts/subfinder-scan.sh dan hasilnya disimpan di ./results/subfinder_result.txt
    runScan("./scripts/subfinder-scan.sh", target, "./results/subfinder_result.txt", res);
  });
  
  app.post("/get-ip-from-domain", (req, res) => {
    let target = req.body;
    // Contoh: script berada di ./scripts/get-ip-from-domain.sh dan hasilnya di ./results/getip_result.txt
    runScan("./scripts/get-ip-from-domain.sh", target, "./results/getip_result.txt", res);
  });
  
  app.post("/dirsearch-scan", (req, res) => {
    let target = req.body;
    // Contoh: script berada di ./scripts/dirsearch-scan.sh dan hasilnya di ./results/dirsearch_result.txt
    runScan("./scripts/dirsearch-scan.sh", target, "./results/dirsearch_result.txt", res);
  });
  
  app.post("/nuclei-scan", (req, res) => {
    let target = req.body;
    // Contoh: script berada di ./scripts/nuclei-scan.sh dan hasilnya di ./results/nuclei_result.txt
    runScan("./scripts/nuclei-scan.sh", target, "./results/nuclei_result.txt", res);
  });


///

app.post('/submit', upload.single('evidence'), (req, res) => {
    
    let data = req.body;
    let report = generateReport(data);
    res.send(`<pre>${report}</pre>`+`<img src="/uploads/${req.file.filename}" />`);
    // Convert the request body to a string
    const generate_report = JSON.stringify(req.body);
    const tanggal_waktu = new Date().toISOString().slice(0,19).replace(/:/g, '_');

    // Write the data to a .txt file
    fs.writeFile(`./uploads/insiden ${data.title}-${tanggal_waktu}.json`, generate_report, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    // res.send(`<img src="/uploads/${req.file.filename}" />`);
    // res.send("test");
});

// Assuming you have a route that accepts a POST request with a Base64 image
app.post('/upload', (req, res) => {
    let base64Image = req.body.base64Image;
    let imageBuffer = Buffer.from(base64Image, 'base64');

    fs.writeFile('image.jpg', imageBuffer, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.send('Image uploaded successfully');
    });
});



app.listen(5000, ()=> console.log('Server running at port 5000'));