import ScannersPage from "@/app/scanners/ScannerPage";
import { generateDynamicMetadata } from "@/components/seo/DynamicMetadata";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Scanner Tools",
    description:
      "Perform various security scans including Nuclei, Dirsearch, and Subdomain scanning",
    keywords: "scanner, security scan, nuclei, dirsearch, subdomain",
  });
}

const page = () => {
  return (
    <div>
      <ScannersPage />
    </div>
  );
};
export default page;
