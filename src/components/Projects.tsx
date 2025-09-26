"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";

import { projects } from "@/data/projects";

import ProjectSlide from "./ProjectSlide";


const Projects = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const smoothScrollTo = (targetY: number, duration = 800) => {
    if (typeof window === "undefined") return;
    
    // Temporarily disable CSS smooth scrolling to prevent conflicts
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    
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
      } else {
        // Restore original scroll behavior after animation completes
        document.documentElement.style.scrollBehavior = originalScrollBehavior;
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


  const [currentProject, setCurrentProject] = useState(0);

  // Define key animation boundaries based on scroll progress
  const horizontalScrollStart = 0;
  const horizontalScrollEnd = 0.9;

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
    return activeProjectIndex.on("change", (latest) => {
      const newIndex = Math.round(latest);
      if (newIndex !== currentProject) {
        setCurrentProject(newIndex);
      }
    });
  }, [activeProjectIndex, currentProject]);

  // Effect to handle snap-scrolling (disabled on mobile)
  useEffect(() => {
    if (!mainRef.current || isMobile) return;

    const handleScrollEnd = () => {
      if (!mainRef.current) return;

      const latestIndex = activeProjectIndex.get();
      const targetIndex = Math.round(latestIndex);

      // Prevent snapping if already very close to a target or if scroll distance is minimal
      if (Math.abs(latestIndex - targetIndex) < 0.05) {
        return;
      }
      
      // Calculate the corresponding scroll position and check if movement is minimal
      const totalProjects = projects.length - 1;
      const targetProgress =
        horizontalScrollStart +
        (targetIndex / totalProjects) * (horizontalScrollEnd - horizontalScrollStart);
      const scrollableHeight = mainRef.current.scrollHeight - window.innerHeight;
      const targetScrollY = mainRef.current.offsetTop + targetProgress * scrollableHeight;
      
             // Don't animate if the scroll distance is very small (less than 10px)
       if (Math.abs(window.scrollY - targetScrollY) < 10) {
         return;
       }

      // Programmatically scroll to the target position
      smoothScrollTo(targetScrollY, 800);
    };

    const unsubscribe = activeProjectIndex.on("change", () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      // Use a shorter timeout for better responsiveness, especially in Chrome
      const timeoutDuration = navigator.userAgent.includes('Chrome') ? 100 : 150;
      scrollTimeout.current = setTimeout(handleScrollEnd, timeoutDuration);
    });

    return () => {
      unsubscribe();
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [activeProjectIndex, horizontalScrollStart, horizontalScrollEnd, isMobile]);

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



  return (
    <section 
      ref={mainRef} 
      id="projects" 
      className="relative z-0" 
      style={{ 
        height: isMobile ? 'auto' : `${projects.length * 100}vh`,
        minHeight: isMobile ? '100vh' : 'auto'
      }}
    >
      {isMobile ? (
        // Mobile: Vertical stack of projects
        <div className="bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
          <div className="container mx-auto px-4 py-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Featured Projects
            </motion.h2>
            <div className="space-y-16">
              {projects.map((project, index) => (
                <motion.div
                  key={project.name}
                  className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Project Image */}
                  <div className="relative h-48 sm:h-64 overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.name}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Project Number */}
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 bg-white/25 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/40">
                        <span className="text-lg font-bold text-white">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    
                    {/* Technologies on image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10">
                        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-white/10 text-gray-200 rounded-md text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      {project.name}
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {project.outcome && (
                      <div className="bg-gradient-to-br from-white/8 to-white/4 rounded-xl p-4 border border-white/10 mb-4">
                        <h4 className="text-lg font-semibold text-blue-400 mb-2">
                          Key Achievement
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {project.outcome}
                        </p>
                      </div>
                    )}
                    
                    {project.testimonial && (
                      <blockquote className="border-l-4 border-blue-400 pl-4 py-3 bg-gradient-to-r from-white/8 to-transparent rounded-r-xl mb-4">
                        <p className="text-base italic text-gray-300">
                          &quot;{project.testimonial}&quot;
                        </p>
                        {project.testimonialName && (
                          <p className="text-sm text-gray-400 mt-2 font-medium">
                            — {project.testimonialName}
                          </p>
                        )}
                      </blockquote>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium transition-all duration-300 hover:bg-blue-600"
                        >
                          <ExternalLink size={18} />
                          View Project
                        </a>
                      )}
                      {project.codeUrl && (
                        <a
                          href={project.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 px-6 py-3 border border-white/20 text-gray-300 rounded-xl font-medium bg-white/8 backdrop-blur-sm hover:bg-white/12"
                        >
                          <Github size={18} />
                          View Code
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Desktop: Horizontal scroll experience
        <div className="sticky top-0 h-screen w-full">
          {/* Projects Showcase */}
          <motion.div
            className="relative z-0 h-full"
            style={{
              background: backgroundStyle
            }}
          >
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
      )}
    </section>
  );


};

export default Projects;
