"use client";

import { useEffect, useState } from "react";
import FormSection from "@/components/molecules/FormSection";
import FormField from "@/components/molecules/FormField";
import FileUploader from "@/components/molecules/FileUploader";
import LanguageToggleButton from "@/components/LanguageToggleButton";
import { ArrowRight } from "lucide-react";
import DefaultBreadcrumb from "@/components/DefaultBreadcumb";
import { useId } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SECTIONS = [
  { id: "section1", label: "Report Data Audit" },
  { id: "section2", label: "Upload Evidence" },
  { id: "section3", label: "Recommendations" },
];

export default function MultiFormStep() {
  const [activeSection, setActiveSection] = useState("section1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    attack_type: "",
    tags: "",
    severity: "",
    uuid: "",
    description: "",
    query: "",
    action: "",
    evidence: null,
    recommendations: "",
    details: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    showSection(activeSection);
  }, [activeSection]);

  const sectionValidations = {
    section1: () => {
      const newErrors = {};
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.attack_type.trim())
        newErrors.attack_type = "Attack type is required";
      if (!formData.tags.trim()) newErrors.tags = "Tags are required";
      if (!formData.severity.trim())
        newErrors.severity = "Severity is required";
      if (!formData.uuid.trim()) newErrors.uuid = "UUID is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
      if (!formData.query.trim()) newErrors.query = "Search query is required";
      if (!formData.action.trim()) newErrors.action = "Action is required";
      return newErrors;
    },
    section2: () => {
      const newErrors = {};
      if (!formData.evidence || !(formData.evidence instanceof File)) {
        newErrors.evidence = "Evidence file is required";
      }
      return newErrors;
    },
    section3: () => {
      const newErrors = {};
      if (!formData.recommendations.trim())
        newErrors.recommendations = "Recommendations are required";
      if (!formData.details.trim()) newErrors.details = "Details are required";
      return newErrors;
    },
  };

  const validateSection = (sectionId) => {
    const validationFn = sectionValidations[sectionId];
    const newErrors = validationFn ? validationFn() : {};
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      evidence: file || null,
    }));

    if (errors.evidence) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.evidence;
        return newErrors;
      });
    }
  };

  const showSection = (sectionId) => {
    const targetIndex = SECTIONS.findIndex((s) => s.id === sectionId);
    const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);

    if (targetIndex > currentIndex) {
      for (let i = 0; i <= targetIndex - 1; i++) {
        const isValid = validateSection(SECTIONS[i].id);
        if (!isValid) {
          toast.error("Please complete previous section before proceeding");
          return;
        }
      }
    }

    SECTIONS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) {
        section.style.display = id === sectionId ? "block" : "none";
      }
    });
    setActiveSection(sectionId);
  };

  const goToNextSection = () => {
    if (!validateSection(activeSection)) {
      toast.error("Please fill all required fields before proceeding");
      return;
    }

    const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
    if (currentIndex < SECTIONS.length - 1) {
      const next = SECTIONS[currentIndex + 1].id;
      showSection(next);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!validateSection(activeSection)) {
      toast.error("Please complete all required fields before submitting");
      return;
    }

    setIsSubmitting(true);
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });

    console.log(formDataToSend);

    try {
      const response = await fetch("/api/scanner/multi-step-form", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Submission failed");
      }

      toast.success("Form submitted successfully!", {
        action: {
          label: "View Report",
          onClick: () => router.push(`/reports/${data.data.data.uuid}`),
        },
      });

      setFormData({
        title: "",
        attack_type: "",
        tags: "",
        severity: "",
        uuid: "",
        description: "",
        query: "",
        action: "",
        evidence: null,
        recommendations: "",
        details: "",
      });

      showSection("section1");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <DefaultBreadcrumb title={"Multi-Step Form"} />
      <div className="container mx-auto pb-8">
        <LanguageToggleButton
          id={useId()}
          englishText="This page serves as a centralized platform..."
          indonesianText="Halaman ini berfungsi sebagai platform terpusat..."
          className="neon-box-glow mb-20 p-6 rounded-lg"
        />

        <div className="flex items-center justify-center mb-8 gap-10 ">
          {SECTIONS.map((section, index) => (
            <div key={section.id} className="flex relative items-center">
              <div
                className="relative flex flex-col items-center cursor-pointer group"
                onClick={() => showSection(section.id)}
              >
                <ArrowRight
                  className={`w-6 h-6 rounded-full p-1 transition-all z-10
                    ${
                      activeSection === section.id
                        ? "bg-primary text-background shadow-md shadow-cyan-400 scale-110"
                        : "bg-muted-foreground text-background/70 group-hover:bg-primary/60"
                    }`}
                />
                <span
                  className={`mt-1 text-sm whitespace-nowrap transition-all ${
                    activeSection === section.id
                      ? "text-primary neon-glow"
                      : "text-muted-foreground group-hover:text-primary"
                  }`}
                >
                  {section.label}
                </span>
              </div>

              {index !== SECTIONS.length - 1 && (
                <div className="w-8 h-[2px] mx-2 absolute top-3 -right-10 flex items-center">
                  <div
                    className={`w-full h-[2px] transition-all 
                      ${
                        activeSection === section.id
                          ? "bg-primary shadow-[0_0_8px_hsl(191_100%_50%)]"
                          : "bg-muted-foreground/50"
                      }`}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={submitForm} className="neon-box-glow rounded-lg ">
          {/* Section 1: Report Data Audit */}
          <FormSection
            isSubmitting={isSubmitting}
            id="section1"
            title="Report Data Audit"
            nextSectionId="section2"
            onNext={goToNextSection}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Title/Judul Insiden:"
                id="title"
                name="title"
                onChange={handleInputChange}
                value={formData.title}
                error={errors.title}
              />
              <FormField
                label="Jenis Serangan:"
                id="attack_type"
                name="attack_type"
                onChange={handleInputChange}
                value={formData.attack_type}
                error={errors.attack_type}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormField
                label="Tags:"
                id="tags"
                name="tags"
                onChange={handleInputChange}
                value={formData.tags}
                error={errors.tags}
              />
              <FormField
                label="Severity:"
                id="severity"
                name="severity"
                onChange={handleInputChange}
                value={formData.severity}
                error={errors.severity}
              />
              <FormField
                label="UUID:"
                id="uuid"
                name="uuid"
                onChange={handleInputChange}
                value={formData.uuid}
                error={errors.uuid}
              />
            </div>

            <div className="mb-4">
              <FormField
                label="Description:"
                id="description"
                name="description"
                rows={4}
                onChange={handleInputChange}
                value={formData.description}
                error={errors.description}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Search Query:"
                id="query"
                name="query"
                onChange={handleInputChange}
                value={formData.query}
                error={errors.query}
              />
              <FormField
                label="Action:"
                id="action"
                name="action"
                onChange={handleInputChange}
                value={formData.action}
                error={errors.action}
              />
            </div>
          </FormSection>

          {/* Section 2: Upload Evidence */}
          <FormSection
            id="section2"
            title="Upload Evidence"
            nextSectionId="section3"
            onNext={goToNextSection}
          >
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
              <div className="md:col-span-8">
                <FileUploader
                  id="evidence"
                  name="evidence"
                  label="Upload Evidence:"
                  onChange={handleFileChange}
                  error={errors.evidence}
                  value={formData.evidence?.name}
                />
              </div>
            </div>
          </FormSection>

          {/* Section 3: Recommendations */}
          <FormSection
            id="section3"
            title="Recommendations"
            isLastSection={true}
          >
            <div className="mb-4">
              <FormField
                label="Recommendations:"
                id="recommendations"
                name="recommendations"
                rows={4}
                onChange={handleInputChange}
                value={formData.recommendations}
                error={errors.recommendations}
              />
            </div>
            <div>
              <FormField
                label="Details:"
                id="details"
                name="details"
                rows={5}
                onChange={handleInputChange}
                value={formData.details}
                error={errors.details}
              />
            </div>
          </FormSection>
        </form>
      </div>
    </div>
  );
}
