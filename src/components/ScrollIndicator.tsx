"use client";
import React from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

interface ScrollIndicatorProps {
  scrollYProgress: MotionValue<number>;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  scrollYProgress,
}) => {
  const pathLength = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  const letters = "Projects".split("");
  const letterOpacities = letters.map((_, i) => {
    const start = 0.15 + i * 0.02;
    const end = 0.17 + i * 0.02;
    return useTransform(scrollYProgress, [start, end], [0, 1]);
  });
  const arrowheadOpacity = useTransform(scrollYProgress, [0.38, 0.4], [0, 1]);

  return (
    <div className="absolute top-0 right-0 h-full w-1/4 z-20 pointer-events-none">
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 400"
        preserveAspectRatio="xMaxYMin meet"
        className="text-gray-500/50"
      >
        <defs>
          <motion.path
            id="projects-arrow-curve"
            d="M95 10 C -10 100, 110 250, 75 390"
            stroke="transparent"
            fill="transparent"
          />
        </defs>

        <motion.path
          d="M95 10 C -10 100, 110 250, 75 390"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
          style={{ pathLength }}
        />

        <motion.path
          d="M82.5 381.5 L 75 390 L 72.5 379"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
          style={{ opacity: arrowheadOpacity }}
        />

        <text fill="currentColor" dy="-5">
          <textPath
            href="#projects-arrow-curve"
            startOffset="50%"
            textAnchor="middle"
          >
            {letters.map((char, i) => (
              <motion.tspan
                key={i}
                style={{ opacity: letterOpacities[i] }}
                className="font-mono text-lg tracking-wider uppercase"
              >
                {char}
              </motion.tspan>
            ))}
          </textPath>
        </text>
      </motion.svg>
    </div>
  );
};

export default ScrollIndicator; 