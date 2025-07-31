"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, easeOut } from "framer-motion";
import { Github, Linkedin, FileDown, Briefcase, GraduationCap, Code2, MapPin } from "lucide-react";
import Image from "next/image";
import ScrollIndicator from "./ScrollIndicator";

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const [viewportHeight, setViewportHeight] = useState(800);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use window scroll for parallax (works with sticky positioning)
  const { scrollY } = useScroll();

  // Transform window scroll into progress for this section
  const scrollYProgress = useTransform(scrollY, [0, viewportHeight], [0, 1]);

  // Apple-style section scaling and parallax effects
  const sectionScale = useTransform(scrollYProgress, [0, 1], [1, 0.8], { ease: easeOut });
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0], { ease: easeOut });
  const sectionPointerEvents = useTransform(sectionOpacity, (v) => (v === 0 ? "none" : "auto"));
  const sectionRotateX = useTransform(scrollYProgress, [0, 1], [0, 15], { ease: easeOut });


  // Staggered parallax layers with different speeds
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"], { ease: easeOut });
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0], { ease: easeOut });

  const headerY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"], { ease: easeOut });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0], { ease: easeOut });

  const bioY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"], { ease: easeOut });
  const bioOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0], { ease: easeOut });

  const badgesY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"], { ease: easeOut });
  const badgesOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0], { ease: easeOut });

  const ctaY = useTransform(scrollYProgress, [0, 1], ["0%", "0%"], { ease: easeOut });
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0], { ease: easeOut });

  // Background parallax effects
  const bgBlur1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"], { ease: easeOut });
  const bgBlur2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"], { ease: easeOut });
  const bgGradientY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"], { ease: easeOut });
  const bgCenterY = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"], { ease: easeOut });

  const badges = [
    {
      icon: <GraduationCap size={18} className="text-blue-400" />,
      text: "Master's in Software Eng.",
    },
    {
      icon: <Briefcase size={18} className="text-blue-400" />,
      text: "3+ Years Full-Stack",
    },
    {
      icon: <Code2 size={18} className="text-blue-400" />,
      text: "React • Python • Rust",
    },
    {
      icon: <MapPin size={18} className="text-blue-400" />,
      text: "Europe • Remote",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const nameContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.5,
      },
    },
  };

  const nameLetterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
        delay: 0.2,
      },
    },
  };

  return (
    <div style={{ perspective: '1000px' }} className="h-screen sticky top-0 z-10">
      <motion.section
        id="home"
        ref={ref}
        className="h-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden px-4 sm:px-6"
        style={{
          scale: sectionScale,
          opacity: sectionOpacity,
          rotateX: sectionRotateX,
          transformOrigin: "center",
          pointerEvents: sectionPointerEvents
        }}
      >
        <ScrollIndicator scrollYProgress={scrollYProgress} />

        {/* Animated background elements with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: bgGradientY }}
        >
          <motion.div
            className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
            style={{ y: bgBlur1Y }}
          ></motion.div>
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-gray-500/5 rounded-full blur-3xl animate-pulse delay-1000"
            style={{ y: bgBlur2Y }}
          ></motion.div>
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-gradient-to-r from-blue-500/3 to-gray-500/3 rounded-full blur-3xl"
            style={{ y: bgCenterY }}
          />
        </motion.div>

        <motion.div
          className="mx-auto max-w-4xl py-16 sm:py-20 md:py-24 relative z-10 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center text-center gap-y-6 sm:gap-y-8">
            {/* Photo Section */}
            <motion.div variants={imageVariants} style={{ y: imageY, opacity: imageOpacity }}>
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 to-sky-500 via-indigo-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-all duration-1000 animate-aurora"></div>
                <Image
                  src="/me.png"
                  alt="Davide Areias"
                  width={160}
                  height={160}
                  className="relative object-cover object-top rounded-full shadow-2xl w-32 h-32 sm:w-40 sm:h-40 border-4 border-slate-800"
                  priority
                />
              </div>
            </motion.div>

            {/* Header Section */}
            <motion.div variants={itemVariants} className="space-y-3" style={{ y: headerY, opacity: headerOpacity }}>
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight"
                variants={nameContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {"Davide Areias".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={nameLetterVariants}
                    className="inline-block"
                  >
                    {char === " " ? "\u00a0" : char}
                  </motion.span>
                ))}
              </motion.h1>
              <div className="flex items-center justify-center gap-3">
                <div className="h-0.5 w-10 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                <p className="text-lg sm:text-xl text-blue-400 font-semibold">
                  Software Engineer
                </p>
                <div className="h-0.5 w-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.p
              variants={itemVariants}
              className="max-w-xl text-base sm:text-lg text-gray-300 font-light"
              style={{ y: bioY, opacity: bioOpacity }}
            >
              A Full-Stack Developer with a Master's degree, creating high-quality, scalable solutions with a focus on clean code and modern technologies.
            </motion.p>

            {/* Badges */}
            <motion.div
              variants={containerVariants}
              className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2"
              style={{ y: badgesY, opacity: badgesOpacity }}
            >
              {badges.map((badge, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-gray-700/50 px-4 py-2 hover:bg-white/10 transition-colors duration-300"
                  whileHover={{ y: -3, transition: { type: 'spring' as const, stiffness: 300 } }}
                >
                  {badge.icon}
                  <span className="text-sm sm:text-base text-gray-200 font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
              style={{ y: ctaY, opacity: ctaOpacity }}
            >
              <a
                className="group relative flex-grow sm:flex-grow-0 flex items-center justify-center gap-3 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-700 px-8 py-3.5 text-base sm:text-lg font-semibold text-white shadow-lg overflow-hidden"
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <motion.div
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 20 }}
                  className="flex items-center gap-3 relative z-10"
                >
                  <FileDown size={20} />
                  <span>Download CV</span>
                </motion.div>
              </a>

              <div className="flex gap-4 justify-center">
                <motion.a
                  href="https://www.linkedin.com/in/davide-areias/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-lg bg-white/5 text-white border border-gray-700 hover:bg-white/10 hover:border-gray-600 transition-all duration-300 flex-1 sm:flex-none flex justify-center"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={22} />
                </motion.a>
                <motion.a
                  href="https://github.com/davideareias1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-lg bg-white/5 text-white border border-gray-700 hover:bg-white/10 hover:border-gray-600 transition-all duration-300 flex-1 sm:flex-none flex justify-center"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={22} />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Hero;
