"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { MouseTrail } from "@/components/Motion";

const ConditionalMouseTrail = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't show mouse trail on admin pages or mobile devices
  if (pathname?.startsWith("/admin") || isMobile) {
    return null;
  }

  return <MouseTrail />;
};

export default ConditionalMouseTrail;


