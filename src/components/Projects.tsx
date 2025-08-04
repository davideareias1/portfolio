"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

import { projects } from "@/data/projects";

import ProjectSlide from "./ProjectSlide";


const Projects = () => {


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

  // Effect to handle snap-scrolling
  useEffect(() => {
    if (!mainRef.current) return;

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



  return (
    <section ref={mainRef} id="projects" className="relative z-0" style={{ height: `${projects.length * 100}vh` }}>
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
    </section>
  );


};

export default Projects;
