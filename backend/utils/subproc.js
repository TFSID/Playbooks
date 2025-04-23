import { exec, spawn } from "child_process" // Added missing import

function runScan(scriptPath, target, resultFile, res) {
  const command = `bash ${scriptPath} "${target}" "${resultFile}" >> ./logs/bash_scan_activity.log 2>&1`
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return res.status(500).send(error.message)
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`)
    }
    console.log(`Stdout: ${stdout}`)
    // res.send("")
    // Send file for download
    res.download(path.join(__dirname, resultFile), (err) => {
      if (err) {
        console.error("Error sending file: ", err)
      }
    res.send(`Result - stdout: ${stdout}, stderr: ${stderr}`);
    })
  })
}

function spawnDirSearchProccess(scriptPath, target, resultFile, res) {
  const outLog = fs.createWriteStream("./logs/dirsearch_scan_activity.log", { flags: "a" })
  const result = fs.createWriteStream(`${resultFile}`, { flags: "a" })
  const process = spawn("python3", [scriptPath, "--target", target, "--output", resultFile]);

  process.stdout.pipe(result);
  process.stderr.pipe(outLog);

  let stdout = "";
  process.stdout.on("data", (data) => {
    stdout += data.toString();
  });
  process.stderr.on("data", (data) => {
    console.error(`Stderr: ${data}`);
  });
  process.on("close", (code) => {
    if (code !== 0) {
      console.error(`Process exited with code ${code}`);
      return res.status(500).send(`Process exited with code ${code}`);
    }
    console.log(`Process completed successfully. Stdout: ${stdout}`);
    res.send(`Result - stdout: ${stdout}`);
    // Send file for download
    // res.download(path.join(__dirname, resultFile), (err) => {
    //   if (err) {
    //     console.error("Error sending file: ", err)
    //   }
    //   res.send(`Result - stdout: ${stdout}`);
    // })
  });
}

function runDirSearchProccess(scriptPath, target, resultFile, res) {
    const outLog = fs.createWriteStream("./logs/dirsearch_scan_activity.log", { flags: "a" })
    const logFile = "./logs/dirsearch_scan_activity.log"
    const command = `python3 ${scriptPath} --target "${target}" --output "${resultFile}" >> ./logs/dirsearch_scan_activity.log 2>&1`
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        return res.status(500).send(error.message)
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`)
      }
      console.log(`Result - stdout: ${stdout}, stderr: ${stderr}`)
      res.send(`Result - stdout: ${stdout}, stderr: ${stderr}`);
      // res.send("")
      // Send file for download
      // res.download(path.join(__dirname, logFile), (err) => {
      //   if (err) {
      //     console.error("Error sending file: ", err)
      //   }
      // })
      // res.download(path.join(__dirname, resultFile), (err) => {
      //   if (err) {
      //     console.error("Error sending file: ", err)
      //   }
      // res.send(`Result - stdout: ${stdout}, stderr: ${stderr}`);
      // })
    })
  }

function runPyProcess(scriptPath, target, resultFile, res) {
  const command = `python3 ${scriptPath} --target "${target}" --output "${resultFile}" >> ./logs/scan_activity.log 2>&1`
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return res.status(500).send(error.message)
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`)
    }
    console.log(`Stdout: ${stdout}`)
    // res.send("")
    // Send file for download
    res.download(path.join(__dirname, resultFile), (err) => {
      if (err) {
        console.error("Error sending file: ", err)
      }
    res.send(`Result - stdout: ${stdout}, stderr: ${stderr}`);
    })
  })
}

function checkIP(res) {
  const command = `curl ifconfig.me`
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return res.status(500).send(error.message)
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`)
    }
    console.log(`Stdout: ${stdout}`)
    // let result = `Your Backend IP Is: ${stdout}\n`
    let result = `{"backend_ip": "${stdout}"}`
    // result += `stderr: ${stderr}`
    // res.send(`${result}`);
    res.json({
      message: `Your Backend IP Is: ${stdout}`,
      success: true,
      data: {
        ip: `"${stdout}"`
      }
    })
  })
}