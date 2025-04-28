import express from "express";
import path from "path";
import { runScan, spawnDirSearchProccess } from "../utils/subproc.js";
import { upload } from "../utils/storage.js";

const router = express.Router();

function decideTargetType(target) {
  // Check if the target is a valid IP address
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipRegex.test(target)) {
    return "ip";
  } else {
    return "domain";
  }
}

// Scanner routes
router.post("/subdomain-scan", upload.single("target_list"), (req, res) => {
  const target_type = req.body.target_type;
  if (target_type === "multi") {
    const target_list = `uploads/${req.file.filename}`;
    runScan(
      "./scripts/subfinder_httpx_multi.sh",
      target_list,
      `./results/${target_list}_subfinder_result.txt`,
      res
    );
  } else if (target_type === "single") {
    const target = req.body.domain;
    runScan(
      "./scripts/subfinder_httpx.sh",
      target,
      `./results/${target}_subfinder_result.txt`,
      res
    );
  } else {
    return res.status(400).send("Invalid target_type. Use 'multi' or 'single'.");
  }
});

router.post("/get-ip-from-domain", (req, res) => {
  const target = req.body.domain;
  runScan(
    "./scripts/get-ip-from-domain.sh",
    target,
    "./results/getip_result.txt",
    res
  );
});

router.post("/dirsearch-scan", (req, res) => {
  const target = req.body.domain;
  spawnDirSearchProccess(
    "./scripts/dirsearch_multi.py",
    target,
    `./results/${target}_dirsearch_result.txt`,
    res
  );
});

router.post("/auto-scan", (req, res) => {
  const target = req.body.domain;
  runScan(
    "python3 ./scripts/dirsearch-scan.sh",
    target,
    "./results/dirsearch_result.txt",
    res
  );
});

router.post("/nuclei-scan", (req, res) => {
  const target = req.body.domain;
  runScan(
    "./scripts/nuclei_scan_target.sh",
    target,
    `./results/${target}_nuclei_result.log`,
    res
  );
});

export default router;