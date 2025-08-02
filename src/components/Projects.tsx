"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "@/data/projects";
import ProjectSlide from "./ProjectSlide";


const Projects = () => {


  const smoothScrollTo = (targetY: number, duration = 800) => {
    if (typeof window === "undefined") return;
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * easedProgress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };


  const mainRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });
  const isInView = useInView(mainRef, { amount: 0.1, once: false });

  const [currentProject, setCurrentProject] = useState(0);

  // Define key animation boundaries based on scroll progress
  const introFadeEnd = 0.15;
  const horizontalScrollStart = 0.25;
  const horizontalScrollEnd = 0.9;

  const introOpacity = useTransform(
    scrollYProgress,
    [0, introFadeEnd],
    [1, 0]
  );
  const introPointerEvents = useTransform(scrollYProgress, (v) =>
    v > introFadeEnd ? "none" : "auto"
  );

  const projectBackgrounds = [
    'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    'linear-gradient(135deg, #16213e 0%, #0f3460 50%, #0e4b99 100%)',
    'linear-gradient(135deg, #0f3460 0%, #0e4b99 50%, #2e8b57 100%)',
  ];

  const activeProjectIndex = useTransform(
    scrollYProgress,
    [horizontalScrollStart, horizontalScrollEnd],
    [0, projects.length - 1],
    { clamp: true }
  );

  useEffect(() => {
    const unsubscribe = activeProjectIndex.on("change", (latest) => {
      const newIndex = Math.round(latest);
      if (newIndex !== currentProject) {
        setCurrentProject(newIndex);
      }
    });
    return unsubscribe;
  }, [activeProjectIndex, currentProject]);

  // Effect to handle snap-scrolling
  useEffect(() => {
    if (!mainRef.current) return;

    const handleScrollEnd = () => {
      if (!mainRef.current) return;

      const latestIndex = activeProjectIndex.get();
      const targetIndex = Math.round(latestIndex);

      // Prevent snapping if already very close to a target
      if (Math.abs(latestIndex - targetIndex) < 0.05) {
        return;
      }

      const totalProjects = projects.length - 1;

      // Calculate the target scrollYProgress value
      const targetProgress =
        horizontalScrollStart +
        (targetIndex / totalProjects) * (horizontalScrollEnd - horizontalScrollStart);

      // Calculate the corresponding scroll position in pixels
      const scrollableHeight = mainRef.current.scrollHeight - window.innerHeight;
      const targetScrollY = mainRef.current.offsetTop + targetProgress * scrollableHeight;

      // Programmatically scroll to the target position
      smoothScrollTo(targetScrollY, 800);
    };

    const unsubscribe = activeProjectIndex.on("change", () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(handleScrollEnd, 150); // Adjust timeout as needed
    });

    return () => {
      unsubscribe();
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [activeProjectIndex, horizontalScrollStart, horizontalScrollEnd]);

  const backgroundStyle = useTransform(
    activeProjectIndex,
    Array.from({ length: projects.length }, (_, i) => i),
    projects.map((_, index) => projectBackgrounds[index % projectBackgrounds.length])
  );

  const parallaxX = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const x = useTransform(activeProjectIndex, (latest) => `${-latest * 100}vw`);
  const smoothX = useSpring(x, {
    stiffness: 200,
    damping: 40,
    mass: 1,
    restDelta: 0.001
  });

  const scaleInputRange = Array.from({ length: projects.length * 2 - 1 }, (_, i) => i * 0.5);
  const scaleOutputRange = scaleInputRange.map(v => (v % 1 === 0) ? 1 : 0.8);
  const scale = useSpring(useTransform(activeProjectIndex, scaleInputRange, scaleOutputRange) as MotionValue<number>, {
    stiffness: 200,
    damping: 30,
    mass: 1,
  });

  const springConfig = {
    type: "spring" as const,
    stiffness: 400,
    damping: 50,
    mass: 1.2,
    restDelta: 0.001
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.98,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
  };

  const imageVariants = {
    hidden: {
      scale: 1.1,
      opacity: 0,
      filter: "blur(8px)"
    },
    visible: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)"
    },
  };

  return (
    <section ref={mainRef} id="projects" className="relative z-0" style={{ height: `${projects.length * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full">
        {/* Fading Intro */}
        <motion.div
          className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-[color:var(--color-background)]"
          style={{
            opacity: introOpacity,
            pointerEvents: introPointerEvents,
          }}
        >
          <div className="text-center max-w-4xl mx-auto px-4 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.2
              }}
              className="space-y-8"
            >
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[color:var(--color-foreground)] leading-tight tracking-tight"
                initial={{ opacity: 0, y: 40, clipPath: "inset(100% 0 0 0)" }}
                whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                Projects
              </motion.h1>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <p className="text-lg sm:text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  Explore my featured work
                </p>

                <motion.div
                  className="flex items-center justify-center gap-4 text-sm text-gray-500 uppercase tracking-wider"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <motion.div
                    className="w-12 h-px bg-gradient-to-r from-transparent to-[color:var(--color-primary)]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: 1.4 }}
                  />
                  <span>Scroll to explore</span>
                  <motion.div
                    className="w-12 h-px bg-gradient-to-l from-transparent to-[color:var(--color-primary)]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: 1.4 }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <motion.div
                className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center"
                animate={{
                  borderColor: ["rgba(255,255,255,0.2)", "#3B82F6", "rgba(255,255,255,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="w-1 h-3 bg-[color:var(--color-primary)] rounded-full mt-2"
                  animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Projects Showcase */}
        <motion.div
          className="relative z-0 h-full"
          style={{
            background: backgroundStyle
          }}
        >
          {/* Enhanced Scroll Progress Indicator */}
          <motion.div
            className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-50"
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: isInView ? 1 : 0,
              x: isInView ? 0 : 20,
              pointerEvents: isInView ? 'auto' : 'none'
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="h-32 w-1 bg-white/10 rounded-full relative">
              <motion.div
                className="absolute top-0 left-0 w-full rounded-full origin-top bg-[color:var(--color-primary)]"
                style={{
                  scaleY: useTransform(scrollYProgress, [0, 1], [0, 1])
                }}
              />
            </div>
          </motion.div>

          <div className="h-screen overflow-hidden flex items-center" style={{ perspective: "1200px" }}>
            <motion.div
              className="h-full"
              style={{ scale }}
            >
              <motion.div
                style={{ x: smoothX, transformStyle: "preserve-3d" }}
                className="flex h-full items-center"
              >
                {projects.map((project, index) => {
                  return (
                    <ProjectSlide
                      key={project.name}
                      project={project}
                      index={index}
                      activeProjectIndex={activeProjectIndex}
                      currentProject={currentProject}
                      parallaxX={parallaxX}
                      mainRef={mainRef}
                    />
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );


};

export default Projects;
