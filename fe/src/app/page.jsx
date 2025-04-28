import MultiFormStep from "@/app/MultiStepFormPage";
import { generateDynamicMetadata } from "@/components/seo/DynamicMetadata";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Multi-Step Form",
    description:
      "Perform various security scans including Nuclei, Dirsearch, and Subdomain scanning",
    keywords: "scanner, security scan, nuclei, dirsearch, subdomain",
  });
}

const page = () => {
  return (
    <>
      <MultiFormStep />
    </>
  );
};
export default page;
