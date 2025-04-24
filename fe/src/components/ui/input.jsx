import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  // Tambahkan class khusus untuk type file
  const fileInputClasses =
    type === "file"
      ? cn("custom-file-input", className)
      : cn(
          "flex h-9 w-full rounded-md border border-primary bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        );

  return (
    <input type={type} className={fileInputClasses} ref={ref} {...props} />
  );
});
Input.displayName = "Input";

export { Input };
