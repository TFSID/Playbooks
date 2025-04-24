"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LanguageToggleButton({
  englishText,
  indonesianText,
  id = `lang-toggle-${Math.random().toString(36).substring(2, 9)}`,
  className,
}) {
  const [isEnglish, setIsEnglish] = useState(true);

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  return (
    <div className={`${className}`}>
      <Button
        onClick={toggleLanguage}
        variant="outline"
        className="neon-box-glow-sm hover:neon-box-glow mb-2"
      >
        {isEnglish ? "Switch to Indonesian" : "Switch to English"}
      </Button>
      <div
        id={id}
        className={`p-4 rounded-lg border border-primary/20 neon-box-glow-sm ${
          isEnglish ? "lang-en" : "lang-id"
        }`}
      >
        <p className="neon-text-sm">
          {isEnglish ? englishText : indonesianText}
        </p>
      </div>
    </div>
  );
}
