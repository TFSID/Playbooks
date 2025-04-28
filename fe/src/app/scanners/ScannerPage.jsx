"use client";

import { useState, useEffect } from "react";
import ScannerButton from "@/components/scanners/ScannerButton";
import ExternalScannerButton from "@/components/scanners/ExternalScannerButton";
import DefaultBreadcrumb from "@/components/DefaultBreadcumb";
import LayoutWithTittle from "@/components/layouts/LayoutWithTitle";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ScannersPage() {
  const [recentDomains, setRecentDomains] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState("");
  const [resultsTitle, setResultsTitle] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    // Load recent domains from localStorage
    const storedDomains = localStorage.getItem("recentDomains");
    if (storedDomains) {
      setRecentDomains(JSON.parse(storedDomains));
    }
  }, []);

  const submitCheckIp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/scanner/check-ip");
      const data = await response.json();

      if (data.success) {
        toast.success("IP has been checked", {
          description: (
            <div className="flex items-center justify-between gap-2 w-[300px] ">
              <span>{data?.data?.ip}</span>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(data?.data?.ip);
                  toast.info("IP copied to clipboard");
                }}
                className="text-xs px-2 py-1"
              >
                Copy
              </Button>
            </div>
          ),
        });
        console.log(data?.data?.ip);
      }
    } catch (error) {
      console.error("Error fetching IP:", error);
      toast.error("Error fetching IP");
    }
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleDomainInputClick = () => {
    setShowSuggestions(recentDomains.length > 0);
  };

  const selectSuggestion = (domain) => {
    setShowSuggestions(false);
  };

  const saveDomain = (domain) => {
    if (!domain) return;

    let updatedDomains = [domain, ...recentDomains.filter((d) => d !== domain)];
    updatedDomains = updatedDomains.slice(0, 5);

    localStorage.setItem("recentDomains", JSON.stringify(updatedDomains));
    setRecentDomains(updatedDomains);
  };

  const validateDomain = (domain) => {
    const domainRegex =
      /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const displayResults = (scannerType, results) => {
    setResultsTitle(
      `${
        scannerType.charAt(0).toUpperCase() + scannerType.slice(1)
      } Scan Results`
    );
    setResults(
      typeof results === "object" ? JSON.stringify(results, null, 2) : results
    );
    setShowResults(true);
  };

  const closeResults = () => {
    setShowResults(false);
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
    <>
      <DefaultBreadcrumb title={"Scanner Tools"} />
      <LayoutWithTittle
        title={"Scanner Tools"}
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur libero laboriosam rem minus labore quasi necessitatibus eos perferendis vitae porro asperiores, est ducimus nesciunt eligendi officiis eveniet, quam repudiandae id!"
        }
      >
        <div className="space-y-3">
          <div>
            <h5 className="card-title neon-heading-sm">Select Category</h5>
            <div className="result-input-container relative mb-3">
              <select
                className="w-full p-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary neon-input-focus"
                onChange={handleSelectChange}
                value={selectedOption}
              >
                <option value="">Select Domain Type</option>
                <option value="single">Single Domain</option>
                <option value="multiple">Multiple Domain</option>
              </select>
            </div>
          </div>

          {/* Conditional Rendering berdasarkan pilihan */}
          {selectedOption === "single" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Target Domain Single */}
              <div>
                <h5 className="card-title neon-heading-sm">Target Domain</h5>
                <div className="domain-input-container relative mb-3">
                  <input
                    style={{ height: "3rem" }}
                    className="w-full p-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary neon-input-focus"
                    name="target_domain"
                    type="text"
                    placeholder="e.g examples.com"
                    onClick={handleDomainInputClick}
                  />
                  {showSuggestions && (
                    <div
                      id="domain-suggestions"
                      className="domain-suggestions absolute top-full left-0 right-0 bg-background border border-border rounded-md z-50 max-h-48 overflow-y-auto shadow-lg"
                    >
                      {recentDomains.map((domain) => (
                        <div
                          key={domain}
                          className="domain-suggestion p-2 border-b border-border cursor-pointer hover:bg-secondary/20"
                          onClick={() => selectSuggestion(domain)}
                        >
                          {domain}
                        </div>
                      ))}
                    </div>
                  )}
                  <small
                    id="domain-feedback"
                    className={`form-text mt-1 ${
                      feedback.type === "error"
                        ? "text-destructive"
                        : feedback.type === "success"
                        ? "text-primary"
                        : "text-muted"
                    }`}
                  >
                    {feedback.message}
                  </small>
                </div>
              </div>

              {/* Output Name */}
              <div>
                <h5 className="card-title neon-heading-sm">Output Name</h5>
                <div className="result-input-container relative mb-3">
                  <input
                    style={{ height: "3rem" }}
                    className="w-full p-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary neon-input-focus"
                    name="output_name"
                    type="text"
                    placeholder="e.g subdomain-nuclei-scan-result.txt"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedOption === "multiple" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* File Upload */}
              <div>
                <h5 className="card-title neon-heading-sm">File Upload</h5>
                <div className="result-input-container relative mb-3">
                  <input
                    style={{ height: "3rem" }}
                    className="file-input-custom focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary neon-input-focus"
                    name="output_name"
                    type="file"
                    placeholder="e.g subdomain-nuclei-scan-result.txt"
                  />
                </div>
              </div>

              {/* Output Name */}
              <div>
                <h5 className="card-title neon-heading-sm">Output Name</h5>
                <div className="result-input-container relative mb-3">
                  <input
                    style={{ height: "3rem" }}
                    className="w-full p-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary neon-input-focus"
                    name="output_name"
                    type="text"
                    placeholder="e.g subdomain-nuclei-scan-result.txt"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bagian scanner tetap muncul */}
        <div>
          <h5 className="card-title neon-heading-sm">Available Scanners</h5>
          <p className="card-text">
            Select a scanner to begin your security assessment.
          </p>

          {/* grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className=" h-full neon-box-glow-sm hover:neon-box-glow rounded-lg transition-all">
              <div className="card-body">
                <h5 className="card-title neon-heading-sm">Check Backend IP</h5>
                <p className="card-text mb-5">
                  Check The Backend IP Before Performing Scanners.
                </p>
                {/* <CustomBtn
                  buttonText="Check Now"
                  externalUrl="http://10.20.20.99:5000/check-ip"
                /> */}
                <Button
                  variant="outline"
                  className="btn btn-outline-primary mt-2 hover:neon-glow-sm"
                  onClick={submitCheckIp}
                >
                  Check Ip
                </Button>
              </div>
            </div>

            <div className=" h-full neon-box-glow-sm hover:neon-box-glow rounded-lg transition-all">
              <div className="card-body">
                <h5 className="card-title neon-heading-sm">Nuclei Scanner</h5>
                <p className="card-text mb-5">
                  Scan for known vulnerabilities in your systems.
                </p>
                <ExternalScannerButton
                  scannerType="vulnerability"
                  externalUrl="http://127.0.0.1:5000/nuclei-scan"
                  label="Run External Scan"
                />
              </div>
            </div>

            <div className=" h-full neon-box-glow-sm hover:neon-box-glow rounded-lg transition-all">
              <div className="card-body">
                <h5 className="card-title neon-heading-sm">
                  Dirsearch Scanner
                </h5>
                <p className="card-text">
                  Finding Directories/API From Endpoints.
                </p>
                <br />
                <ExternalScannerButton
                  scannerType="vulnerability"
                  externalUrl="http://127.0.0.1:5000/dirsearch-scan"
                  label="Run External Scan"
                />
              </div>
            </div>

            <div className=" h-full neon-box-glow-sm hover:neon-box-glow rounded-lg transition-all">
              <div className="card-body">
                <h5 className="card-title neon-heading-sm">
                  One Click Scanner
                </h5>
                <p className="card-text">All in One Click Automated Scanner.</p>
                <br />
                <div className="flex items-center space-x-2 justify-center mt-5">
                  <ScannerButton scannerType="autoscan" className="w-1/2" />
                  <ExternalScannerButton
                    scannerType="vulnerability"
                    externalUrl="http://127.0.0.1:5000/auto-scan"
                    label="Run External Scan"
                    className="w-1/2"
                  />
                </div>
              </div>
            </div>

            <div className=" h-full neon-box-glow-sm hover:neon-box-glow rounded-lg transition-all">
              <div className="card-body">
                <h5 className="card-title neon-heading-sm">
                  Subdomain Finder + HTTPX
                </h5>
                <p className="card-text mb-5">
                  Finds Active Subdomains with subfinder and HTTPX combinations.
                </p>
                <ExternalScannerButton
                  scannerType="vulnerability"
                  externalUrl="http://127.0.0.1:5000/subdomain-scan"
                  label="Run External Scan"
                />
              </div>
            </div>

            <div className=" h-full neon-box-glow-sm hover:neon-box-glow rounded-lg transition-all">
              <div className="card-body">
                <h5 className="card-title neon-heading-sm">
                  Get IP From Domain
                </h5>
                <p className="card-text">
                  Discover IP Address from the target domain.
                </p>
                <div className="flex items-center space-x-2 justify-center mt-5">
                  <ScannerButton scannerType="ip" />
                  <ExternalScannerButton
                    scannerType="vulnerability"
                    externalUrl="http://127.0.0.1:5000/ip-scan"
                    label="Run External Scan"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results container */}
        {showResults && (
          <div id="results-container" className="mt-4">
            <div className="card neon-box-glow">
              <div className="card-header flex justify-between items-center">
                <h5 className="mb-0 neon-heading-sm">{resultsTitle}</h5>
                <button
                  onClick={closeResults}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Close
                </button>
              </div>
              <div className="card-body">
                <div
                  id="results-content"
                  className="overflow-auto max-h-96 bg-secondary/10 p-4 rounded"
                >
                  <pre className="whitespace-pre-wrap">{results}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </LayoutWithTittle>
    </>
  );
}
