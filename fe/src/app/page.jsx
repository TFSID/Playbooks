"use client";

import { useEffect, useState } from "react";
import FormSection from "@/components/molecules/FormSection";
import FormField from "@/components/molecules/FormField";
import FileUploader from "@/components/molecules/FileUploader";
import LanguageToggleButton from "@/components/LanguageToggleButton";
import { ArrowRight } from "lucide-react";
import DefaultBreadcrumb from "@/components/DefaultBreadcumb";
import { useId } from "react";

const SECTIONS = [
  { id: "section1", label: "Report Data Audit" },
  { id: "section2", label: "Upload Evidence" },
  { id: "section3", label: "Recommendations" },
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("section1");

  // Show the first section by default
  useEffect(() => {
    showSection(activeSection);
  }, []);

  const showSection = (sectionId) => {
    SECTIONS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) {
        section.style.display = id === sectionId ? "block" : "none";
      }
    });
    setActiveSection(sectionId);
  };

  const goToNextSection = () => {
    const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
    if (currentIndex < SECTIONS.length - 1) {
      const next = SECTIONS[currentIndex + 1].id;
      showSection(next);
    }
  };

  return (
    <>
      <DefaultBreadcrumb title={"Multi-Step Form"} />
      <div className="container mx-auto pb-8">
        <LanguageToggleButton
          id={useId()}
          englishText="This page serves as a centralized platform..."
          indonesianText="Halaman ini berfungsi sebagai platform terpusat..."
          className=" neon-box-glow mb-20 p-6 rounded-lg "
        />

        {/* Breadcrumb */}
        <div className="flex items-center justify-center mb-8 gap-10">
          {SECTIONS.map((section, index) => (
            <div key={section.id} className="flex relative items-center ">
              {/* Bullet / Arrow Icon */}
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

                {/* Label */}
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

              {/* Garis Penghubung */}
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

        {/* Form */}
        <form
          action="/submit"
          method="post"
          encType="multipart/form-data"
          className="neon-box-glow rounded-lg "
        >
          {/* Section 1: Report Data Audit */}
          <FormSection
            id="section1"
            title="Report Data Audit"
            nextSectionId="section2"
            onNext={goToNextSection}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Title/Judul Insiden:" id="title" name="title" />
              <FormField
                label="Jenis Serangan:"
                id="attack_type"
                name="attack_type"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormField label="Tags:" id="tags" name="tags" />
              <FormField label="Severity:" id="severity" name="severity" />
              <FormField label="UUID:" id="uuid" name="uuid" />
            </div>

            <div className="mb-4">
              <FormField
                label="Description:"
                id="description"
                name="description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Search Query:" id="query" name="query" />
              <FormField label="Action:" id="action" name="action" />
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
                  id="evidenceFile"
                  name="evidence"
                  label="Upload Evidence:"
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
                id="recommendationsInput"
                name="recommendations"
              />
            </div>
            <div>
              <FormField
                label="Details:"
                id="details"
                name="details"
                rows={5}
              />
            </div>
          </FormSection>
        </form>
      </div>
    </>
  );
}
