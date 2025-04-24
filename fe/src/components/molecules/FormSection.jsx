"use client";

import { useEffect } from "react";
import Button from "../atoms/Button";

export default function FormSection({
  id,
  title,
  isVisible = false,
  nextSectionId,
  isLastSection = false,
  children,
  onNext,
}) {
  useEffect(() => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = isVisible ? "block" : "none";
    }
  }, [id, isVisible]);

  const handleNextSection = () => {
    const currentSection = document.getElementById(id);
    if (currentSection) {
      currentSection.style.display = "none";
    }

    if (onNext) {
      onNext();
    }
  };

  return (
    <div
      id={id}
      className="mb-8 neon-box-glow-sm rounded-lg overflow-hidden"
      style={{ display: "none" }}
    >
      <div className="bg-background/80 backdrop-blur-sm">
        <div className="p-4 border-b border-primary/20">
          <h3 className="text-xl font-semibold neon-heading">{title}</h3>
        </div>
        <div className="p-6">
          {children}
          <div className="flex justify-end mt-6">
            {!isLastSection ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNextSection}
                className="neon-glow-sm hover:neon-glow"
              >
                Next
              </Button>
            ) : (
              <Button type="submit" className="neon-glow hover:neon-glow">
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
