"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MouseTrail } from "@/components/Motion";

const ConditionalMouseTrail = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <MouseTrail />;
};

export default ConditionalMouseTrail;


