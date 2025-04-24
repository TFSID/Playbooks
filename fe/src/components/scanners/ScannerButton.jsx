"use client";

import { Button } from "../ui/button";

export default function ScannerButton({
  scannerType,
  label = "Launch Scanner",
  className = "",
}) {
  const buttonId = `${scannerType}-btn`;

  const runScanner = async (scannerType) => {
    const domainInput = document.querySelector('input[name="target_domain"]');
    if (!domainInput) {
      console.error("Domain input not found");
      return;
    }

    const domain = domainInput.value.trim();
    const buttonId = `${scannerType}-btn`;

    // Validate domain
    if (!domain) {
      alert("Please enter a target domain first");
      domainInput.focus();
      return;
    }

    const domainRegex =
      /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      alert("Please enter a valid domain");
      domainInput.focus();
      return;
    }

    // Set button to loading state
    setButtonLoading(buttonId, true);

    try {
      // Call your API here
      const response = await fetch(`/api/scanners/${scannerType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();

      // Display results (you'll need to implement this in your page component)
      if (typeof window !== "undefined" && window.displayResults) {
        window.displayResults(scannerType, data);
      }

      console.log(`${scannerType} scan results:`, data);
    } catch (error) {
      console.error(`Error during ${scannerType} scan:`, error);
    } finally {
      // Reset button state
      setButtonLoading(buttonId, false);
    }
  };

  const setButtonLoading = (buttonId, isLoading) => {
    const button = document.getElementById(buttonId);
    if (!button) return;

    if (isLoading) {
      const originalText = button.textContent;
      button.setAttribute("data-original-text", originalText || "");
      button.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="ms-1">Scanning...</span>
      `;
      button.disabled = true;
    } else {
      const originalText =
        button.getAttribute("data-original-text") || "Launch Scanner";
      button.innerHTML = originalText;
      button.disabled = false;
    }
  };

  return (
    <Button
      variant="default"
      id={buttonId}
      className={`btn btn-primary ${className} neon-glow-sm hover:neon-glow`}
      data-scanner-type={scannerType}
      onClick={() => runScanner(scannerType)}
    >
      {label}
    </Button>
  );
}
