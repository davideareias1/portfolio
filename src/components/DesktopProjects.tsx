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
import { Project } from "@/data/projects";

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

interface DesktopProjectsProps {
  projects: Project[];
}

const DesktopProjects: React.FC<DesktopProjectsProps> = ({ projects }) => {
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
  }, [activeProjectIndex, projects.length, horizontalScrollStart, horizontalScrollEnd]);

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

  // Pre-compute transforms for each project to avoid calling hooks inside map
  const project0RotateY = useTransform(activeProjectIndex, [-1, 0, 1], [45, 0, -45]);
  const project0Opacity = useTransform(activeProjectIndex, [-1, -0.5, 0, 0.5, 1], [0.3, 0.5, 1, 0.5, 0.3]);
  
  const project1RotateY = useTransform(activeProjectIndex, [0, 1, 2], [45, 0, -45]);
  const project1Opacity = useTransform(activeProjectIndex, [0, 0.5, 1, 1.5, 2], [0.3, 0.5, 1, 0.5, 0.3]);
  
  const project2RotateY = useTransform(activeProjectIndex, [1, 2, 3], [45, 0, -45]);
  const project2Opacity = useTransform(activeProjectIndex, [1, 1.5, 2, 2.5, 3], [0.3, 0.5, 1, 0.5, 0.3]);
  
  const projectTransforms = [
    { rotateY: project0RotateY, opacity: project0Opacity },
    { rotateY: project1RotateY, opacity: project1Opacity },
    { rotateY: project2RotateY, opacity: project2Opacity },
  ];

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
    <section ref={mainRef} id="projects" className="relative" style={{ height: `${projects.length * 100}vh` }}>
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
                  Explore my featured work through an immersive experience
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
                  const { rotateY, opacity } = projectTransforms[index];
                  
                  return (
                  <motion.div
                    key={project.name}
                    className="project-container h-full flex flex-col md:flex-row"
                    style={{ 
                      width: "100vw",
                      rotateY,
                      opacity,
                      position: 'relative'
                    }}
                  >
                    {/* Enhanced Image Section with Parallax and dynamic overlays */}
                    <motion.div
                      className="relative w-full h-1/2 md:w-1/2 md:h-full overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%), ${projectBackgrounds[index % projectBackgrounds.length]}`
                      }}
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, root: mainRef }}
                      animate={{
                        scale: index === currentProject ? 1.02 : 1,
                        filter: index === currentProject ? "brightness(1.1)" : "brightness(0.9)"
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <motion.div
                        variants={imageVariants}
                        className="absolute inset-0"
                        style={{
                          x: parallaxX
                        }}
                      >
                        <Image
                          src={project.imageUrl}
                          alt={project.name}
                          fill
                          className="object-cover"
                          sizes="45vw"
                        />
                      </motion.div>
                      
                      {/* Dynamic gradient overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, root: mainRef }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      />
                      
                      {/* Floating project number */}
                      <motion.div
                        className="absolute top-4 left-4 sm:top-8 sm:left-8"
                        variants={itemVariants}
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/20">
                          <span className="text-xl sm:text-2xl font-bold text-white">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                      </motion.div>

                      {/* Enhanced floating icon with micro-interactions */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        variants={itemVariants}
                      >
                        <motion.div
                          className="w-20 h-20 sm:w-24 sm:h-24 bg-white/15 backdrop-blur-md rounded-2xl sm:rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl"
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(255,255,255,0.25)",
                            borderColor: "rgba(255,255,255,0.4)",
                            rotate: 5
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={springConfig}
                        >
                          <span className="text-3xl sm:text-4xl">🚀</span>
                        </motion.div>
                      </motion.div>

                      {/* Subtle edge gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 pointer-events-none hidden md:block"></div>
                    </motion.div>

                    {/* Enhanced Content Section */}
                    <motion.div
                      className="relative w-full h-1/2 md:w-1/2 md:h-full flex items-start md:items-center justify-center px-4 sm:px-8 md:px-16 py-8 md:py-12 overflow-y-auto bg-[color:var(--color-background)] md:bg-transparent"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ root: mainRef, once: true }}
                    >
                      <div className="max-w-xl w-full space-y-4 md:space-y-6 lg:space-y-8">
                        {/* Project title with reveal animation */}
                        <motion.div variants={itemVariants} className="space-y-4 md:space-y-6">
                          <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, root: mainRef }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          >
                            <span className="text-xs sm:text-sm font-semibold text-[color:var(--color-primary)] uppercase tracking-wider">
                              Project {String(index + 1).padStart(2, '0')}
                            </span>
                          </motion.div>
                          
                          <motion.h3
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[color:var(--color-foreground)] leading-tight"
                            initial={{ opacity: 0, y: 40, clipPath: "inset(100% 0 0 0)" }}
                            whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
                            viewport={{ once: true, root: mainRef }}
                            transition={{ duration: 1.0, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          >
                            {project.name}
                          </motion.h3>
                          
                          <motion.p
                            className="text-base sm:text-lg md:text-xl text-gray-300 md:text-gray-400 leading-relaxed"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, root: mainRef }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                          >
                            {project.description}
                          </motion.p>
                        </motion.div>

                        {/* Enhanced outcome section */}
                        {project.outcome && (
                          <motion.div
                            className="relative bg-gradient-to-br from-white/8 to-white/4 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 backdrop-blur-sm"
                            variants={itemVariants}
                            whileHover={{
                              scale: 1.02,
                              backgroundColor: "rgba(255,255,255,0.12)",
                              borderColor: "rgba(255,255,255,0.2)"
                            }}
                            transition={springConfig}
                          >
                            <h4 className="text-md sm:text-lg font-semibold text-[color:var(--color-primary)] mb-2 md:mb-3">
                              Key Achievement
                            </h4>
                            <p className="text-gray-300 text-sm sm:text-base">{project.outcome}</p>
                          </motion.div>
                        )}

                        {/* Enhanced testimonial */}
                        {project.testimonial && (
                          <motion.blockquote
                            className="relative border-l-4 border-[color:var(--color-primary)] pl-4 md:pl-6 py-3 md:py-4 bg-gradient-to-r from-white/8 to-transparent rounded-r-xl md:rounded-r-2xl"
                            variants={itemVariants}
                            whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.12)" }}
                            transition={springConfig}
                          >
                            <p className="text-base sm:text-lg italic text-gray-300">
                              &ldquo;{project.testimonial}&rdquo;
                            </p>
                          </motion.blockquote>
                        )}

                        {/* Enhanced tech stack and actions */}
                        <motion.div className="space-y-6 md:space-y-8" variants={itemVariants}>
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                              Technologies Used
                            </h4>
                            <motion.div
                              className="flex flex-wrap gap-2 sm:gap-3"
                              variants={containerVariants}
                            >
                              {project.tech.map((tech: string, techIndex: number) => (
                                <motion.span
                                  key={tech}
                                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/8 text-gray-300 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-white/10 backdrop-blur-sm"
                                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                  viewport={{ once: true, root: mainRef }}
                                  transition={{ delay: 0.7 + techIndex * 0.1, ...springConfig }}
                                  whileHover={{
                                    scale: 1.05,
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderColor: "rgba(255,255,255,0.3)",
                                    y: -2
                                  }}
                                >
                                  {tech}
                                </motion.span>
                              ))}
                            </motion.div>
                          </div>

                          {/* Enhanced action buttons */}
                          <motion.div
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 md:pt-4"
                            variants={containerVariants}
                          >
                            {project.projectUrl && (
                              <motion.a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-[color:var(--color-primary)] text-white rounded-xl sm:rounded-2xl font-medium transition-all duration-300 shadow-lg"
                                variants={itemVariants}
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: "var(--color-primary-hover)",
                                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={springConfig}
                              >
                                <ExternalLink size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                                View Project
                              </motion.a>
                            )}
                            {project.codeUrl && (
                              <motion.a
                                href={project.codeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-3 px-6 py-3 sm:px-8 sm:py-4 border border-white/20 text-gray-300 rounded-xl sm:rounded-2xl font-medium bg-white/8 backdrop-blur-sm hover:bg-white/12"
                                variants={itemVariants}
                                whileHover={{
                                  scale: 1.05,
                                  borderColor: "rgba(255,255,255,0.4)",
                                  boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={springConfig}
                              >
                                <Github size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                                View Code
                              </motion.a>
                            )}
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                )})}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DesktopProjects; 