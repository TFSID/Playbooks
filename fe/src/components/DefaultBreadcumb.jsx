"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import React from "react";
import { ChevronRight } from "lucide-react"; // jangan lupa import ini!

const DefaultBreadcrumb = ({ title }) => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((path) => path);

  return (
    <div className="flex items-center gap-5 mb-16">
      <h1 className="text-base lg:text-2xl font-bold uppercase neon-heading">
        {title}
      </h1>

      <Breadcrumb>
        <BreadcrumbList className="flex items-center space-x-2">
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-muted-foreground">
            <ChevronRight className="w-3.5 h-3.5" />
          </BreadcrumbSeparator>
          {pathnames.map((name, index) => {
            const href = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return (
              <React.Fragment key={name}>
                {isLast ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-primary font-medium capitalize">
                      {name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-muted-foreground">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </BreadcrumbSeparator>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default DefaultBreadcrumb;
