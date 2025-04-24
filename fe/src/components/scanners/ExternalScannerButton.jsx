"use client";

import { Button } from "../ui/button";

export default function ExternalScannerButton({
  scannerType,
  externalUrl,
  label = "Launch External Scanner",
  className = "",
}) {
  const buttonId = `external-${scannerType}-btn`;

  const runExternalScanner = async (scannerType, externalUrl) => {
    const domainInput = document.querySelector('input[name="target_domain"]');
    if (!domainInput) {
      console.error("Domain input not found");
      return;
    }

    const domain = domainInput.value.trim();
    const buttonId = `external-${scannerType}-btn`;

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
      const response = await fetch(externalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSOify({ domain }),
      });

      const data = await response.json();

      // Display results
      if (typeof window !== "undefined" && window.displayResults) {
        window.displayResults(`external-${scannerType}`, data);
      }

      console.log(`External ${scannerType} scan results:`, data);
    } catch (error) {
      console.error(`Error during external ${scannerType} scan:`, error);
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
      variant="outline"
      id={buttonId}
      className={` ${className} btn btn-outline-primary hover:neon-glow-sm`}
      data-scanner-type={scannerType}
      data-external-url={externalUrl}
      onClick={() => runExternalScanner(scannerType, externalUrl)}
    >
      {label}
    </Button>
  );
}
