"use client";

import { Button } from "../ui/button";

export default function CustomBtn({ externalUrl, buttonText, className = "" }) {
  return (
    <Button
      variant="outline"
      className={`btn btn-outline-primary mt-2 ${className} hover:neon-glow-sm`}
      data-external-url={externalUrl}
    >
      <a href={externalUrl} className="no-underline">
        {buttonText}
      </a>
    </Button>
  );
}
