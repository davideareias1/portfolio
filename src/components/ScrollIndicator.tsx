"use client";
import { motion, useScroll } from "framer-motion";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const ScrollIndicator = ({ sections }: { sections: string[] }) => {
  const activeSection = useScrollSpy(sections);
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed top-1/2 right-4 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-4">
      <div className="flex flex-col gap-y-4">
        {sections.map((section) => (
          <a
            href={`#${section}`}
            key={section}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${activeSection === section ? "bg-blue-500" : "bg-gray-400"
              }`}
          />
        ))}
      </div>
      <motion.div
        className="w-0.5 h-24 bg-blue-500 origin-top"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  );
};

export default ScrollIndicator; 