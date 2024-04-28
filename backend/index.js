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

// Set up multer and specify the destination for uploaded files

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


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

function generateReport(data) {
    let report = `Jenis Serangan: ${data.attack_type}\n`;
    report += `Tags: ${data.tags}\n`;
    report += `Severity: ${data.severity}\n`;
    report += `Description: ${data.description}\n`;
    report += `Action: ${data.action}\n`;
    report += `Recommendations: ${data.recommendations}\n`;
    report += `Details: ${data.details}\n`;
    // report += `Evidence: <img src="${data.evidence.filename}"/>\n`; 
    // report += data.base64img;
    return report;
}



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