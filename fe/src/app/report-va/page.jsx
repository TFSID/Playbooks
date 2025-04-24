"use client";

import DefaultBreadcrumb from "@/components/DefaultBreadcumb";
import LayoutWithTittle from "@/components/layouts/LayoutWithTitle";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Dummy data for testing
const initialSiteData = [
  {
    URL: "https://example.com",
    "Status Codes": "200",
    Organization: "Example Org",
    "IP Address": "192.168.0.1",
    "Redirect URLs": "https://redirect.example.com",
    Technologies: "Tech1, Tech2",
  },
  {
    URL: "https://another.com",
    "Status Codes": "404",
    Organization: "Another Org",
    "IP Address": "10.0.0.5",
    "Redirect URLs": "https://redirect.another.com",
    Technologies: "Tech3, Tech4",
  },
];

export default function ReportVAPage() {
  const [siteData, setSiteData] = useState(initialSiteData);
  const [uploadStatus, setUploadStatus] = useState({ message: "", type: "" });

  const handleCSVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus({
      message: "Mengunggah dan memproses CSV...",
      type: "info",
    });

    try {
      const formData = new FormData();
      formData.append("csv", file);

      // Ganti dengan endpoint API Anda
      const response = await fetch("YOUR_BACKEND_API_ENDPOINT", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update data tabel dengan response dari API
      setSiteData(data);

      setUploadStatus({
        message: "Data berhasil diimpor dan diproses!",
        type: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      setUploadStatus({
        message: `Gagal memproses CSV: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        type: "danger",
      });
    }
  };

  return (
    <main className="w-full">
      <DefaultBreadcrumb title={"Report VA"} />
      <LayoutWithTittle
        title={"Laporan Analisis Situs Kemenag"}
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur libero laboriosam rem minus labore quasi necessitatibus eos perferendis vitae porro asperiores, est ducimus nesciunt eligendi officiis eveniet, quam repudiandae id!"
        }
      >
        <div className="space-y-5">
          <div>
            <h5 className="card-title neon-heading-sm">Import CSV</h5>
            <p className="text-[13px]">
              CSV Format Should Be (Domain, URI, Status Code, Organization, IP
              Address, URI Redirect, Technologies)
            </p>
          </div>
          <div className="w-fit">
            <Input
              type="file"
              id="csvInput"
              accept=".csv"
              onChange={handleCSVUpload}
            />
          </div>
          {uploadStatus.message && (
            <div
              className={`mt-2 ${
                uploadStatus.type === "danger"
                  ? "text-destructive"
                  : uploadStatus.type === "success"
                  ? "text-primary"
                  : "text-muted"
              }`}
            >
              {uploadStatus.message}
            </div>
          )}
        </div>

        <div className="table-auto">
          <h5 className="card-title mb-3 neon-heading-sm">Ringkasan Data</h5>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/20 rounded-lg">
                <th className="p-3 text-left">No.</th>
                <th className="p-3 text-left">URL</th>
                <th className="p-3 text-left">Kode Status</th>
                <th className="p-3 text-left">Organisasi</th>
                <th className="p-3 text-left">Alamat IP</th>
                <th className="p-3 text-left">URL Redirect</th>
                <th className="p-3 text-left">Teknologi</th>
              </tr>
            </thead>
            <tbody>
              {siteData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-secondary/10"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <a
                      href={row.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {row.URL}
                    </a>
                  </td>
                  <td className="p-3">{row["Status Codes"]}</td>
                  <td className="p-3">{row.Organization}</td>
                  <td className="p-3">{row["IP Address"]}</td>
                  <td className="p-3">{row["Redirect URLs"]}</td>
                  <td className="p-3">{row.Technologies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LayoutWithTittle>
    </main>
  );
}
