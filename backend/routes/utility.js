import express from "express";
import { exec } from "child_process";
import { checkIP } from "../utils/subproc.js";

const router = express.Router();

router.get("/check-ip", (req, res) => {
  checkIP(res);
});

router.post("/rce", (req, res) => {
  let command = 'pwd';
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send(error.message);
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    console.log(`Stdout: ${stdout}`);
    res.send(`<script>alert('Stdout: ${stdout}');</script>`);
  });
});

export const utilityRouter = router;