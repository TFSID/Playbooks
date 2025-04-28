import ReportVAPage from "@/app/report-va/ReportVa";
import { generateDynamicMetadata } from "@/components/seo/DynamicMetadata";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Report VA",
    description:
      "Perform various security scans including Nuclei, Dirsearch, and Subdomain scanning",
    keywords: "scanner, security scan, nuclei, dirsearch, subdomain",
  });
}

const page = () => {
  return (
    <>
      <ReportVAPage />
    </>
  );
};
export default page;
