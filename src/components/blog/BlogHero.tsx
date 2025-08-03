"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, easeOut } from "framer-motion";

const BlogHero = () => {
  const ref = useRef<HTMLElement>(null);
  const [viewportHeight, setViewportHeight] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, [0, viewportHeight / 1.5], [0, 1]);

  // Parallax effects similar to main hero
  const sectionScale = useTransform(scrollYProgress, [0, 1], [1, 0.85], { ease: easeOut });
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0], { ease: easeOut });
  const sectionPointerEvents = useTransform(sectionOpacity, (v) => (v === 0 ? "none" : "auto"));
  const sectionRotateX = useTransform(scrollYProgress, [0, 1], [0, 12], { ease: easeOut });

  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"], { ease: easeOut });
  const subtitleY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"], { ease: easeOut });

  // Background parallax
  const bgBlur1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"], { ease: easeOut });
  const bgBlur2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"], { ease: easeOut });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      style={{
        perspective: '1000px',
        pointerEvents: sectionPointerEvents
      }}
      className="h-screen sticky top-0 z-10"
    >
      <motion.section
        ref={ref}
        className="h-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden px-4 sm:px-6"
        style={{
          scale: sectionScale,
          opacity: sectionOpacity,
          rotateX: sectionRotateX,
          transformOrigin: "center",
        }}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse"
          style={{ y: bgBlur1Y }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-indigo-500/6 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ y: bgBlur2Y }}
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <motion.div
          className="mx-auto max-w-5xl py-16 sm:py-20 md:py-24 relative z-10 w-full text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Title */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-tight mb-6"
            style={{ y: titleY }}
            variants={itemVariants}
          >
            Technical
            <br />
            <span className="text-blue-400">Blog</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            style={{ y: subtitleY }}
            variants={itemVariants}
          >
            Deep dives into software engineering, modern web development, and the technologies shaping our digital future
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center"
              animate={{
                borderColor: ["rgba(255,255,255,0.2)", "#3B82F6", "rgba(255,255,255,0.2)"]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-1 h-3 bg-blue-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default BlogHero; 