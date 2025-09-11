"use client";

import { usePathname } from "next/navigation";
import React from "react";

import { MouseTrail } from "@/components/Motion";

const ConditionalMouseTrail = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <MouseTrail />;
};

export default ConditionalMouseTrail;


