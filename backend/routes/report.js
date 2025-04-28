import express from "express";
import fs from "fs";
import { generateReport } from "../utils/playbooks.js";
import { upload } from "../utils/storage.js";
import { createIncident } from "../database/prisma/controller/incidentController.js";
import { prisma } from '../libs/prisma-client.js';

const router = express.Router();


router.post("/save-to-file", upload.single("result"), (req, res) => {
  const data = req.body;
  const tanggal_waktu = new Date().toISOString().slice(0, 19).replace(/:/g, "_");
  res.send("File saved");
});

router.post("/submit", upload.single("evidence"), (req, res) => {
  if (req.file) {
    const generate_report = JSON.stringify(req.body);
    const tanggal_waktu = new Date().toISOString().slice(0, 19).replace(/:/g, "_");
    
    fs.writeFile(
      `./uploads/insiden ${req.body.title}-${tanggal_waktu}.json`,
      generate_report,
      (err) => {
        if (err) throw err;
        console.log("Data written to file");
      }
    );
    // generateReport(req, res);
    createIncident(req, res);
  } else {
    res.send("Please upload a file for evidence.");
  }
});

router.post("/upload", (req, res) => {
  const base64Image = req.body.base64Image;
  const imageBuffer = Buffer.from(base64Image, "base64");

  fs.writeFile("image.jpg", imageBuffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.send("Image uploaded successfully");
  });
});

export default router;