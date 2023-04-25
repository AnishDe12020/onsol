"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { siteConfig } from "@/config/site";

import { Icons } from "@/components/icons";

import { cn } from "@/utils/tailwind";

export const DesktopNav = () => {
  const pathname = usePathname();

  return (
    <div className="hidden mr-4 md:flex">
      <Link href="/" className="flex items-center mr-6 space-x-2">
        <Icons.logo className="w-6 h-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/docs"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/docs" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Documentation
        </Link>
      </nav>
    </div>
  );
};