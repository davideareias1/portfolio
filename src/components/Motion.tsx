"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useScroll,
} from "framer-motion";
import { useMousePosition, usePrefersReducedMotion } from "@/hooks/useMotion";

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  isScrolling: boolean;
}

const MouseTrail = () => {
  const { x, y } = useMousePosition();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    isScrolling: false,
  });

  const cursorX = useSpring(x, {
    damping: 15,
    stiffness: 350,
    mass: 0.1,
  });
  const cursorY = useSpring(y, {
    damping: 15,
    stiffness: 350,
    mass: 0.1,
  });

  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactiveElement = target.closest('a, button, [role="button"]');
    setCursorState((prev) => ({ ...prev, isHovering: !!interactiveElement }));
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    setCursorState((prev) => ({ ...prev, isClicking: true }));
    const newRipple = { x: e.clientX, y: e.clientY, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 800);

    setTimeout(() => {
      setCursorState((prev) => ({ ...prev, isClicking: false }));
    }, 150);
  }, []);

  const handleScroll = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isScrolling: true }));
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setCursorState((prev) => ({ ...prev, isScrolling: false }));
    }, 150);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [handleMouseMove, handleClick, handleScroll]);

  if (prefersReducedMotion) {
    return null;
  }

  const getCursorVariant = () => {
    if (cursorState.isClicking) return "clicking";
    if (cursorState.isScrolling) return "scrolling";
    if (cursorState.isHovering) return "hovering";
    return "default";
  };

  const cursorVariants = {
    default: {
      scale: 1,
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      borderColor: "rgba(59, 130, 246, 0.3)",
      width: 20,
      height: 20,
    },
    hovering: {
      scale: 1.5,
      backgroundColor: "rgba(59, 130, 246, 0.25)",
      borderColor: "rgba(59, 130, 246, 0.5)",
      width: 32,
      height: 32,
    },
    clicking: {
      scale: 0.8,
      backgroundColor: "rgba(59, 130, 246, 0.4)",
      borderColor: "rgba(59, 130, 246, 0.8)",
      width: 16,
      height: 16,
    },
    scrolling: {
      scale: 1.2,
      backgroundColor: "rgba(156, 163, 175, 0.2)",
      borderColor: "rgba(156, 163, 175, 0.4)",
      width: 24,
      height: 24,
    },
  };

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-50 rounded-full border-2 backdrop-blur-sm"
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
        }}
        variants={cursorVariants}
        animate={getCursorVariant()}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 400,
          mass: 0.3,
        }}
      />

      <div className="fixed inset-0 pointer-events-none z-45">
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute rounded-full border-2 border-blue-400"
              style={{
                left: ripple.x,
                top: ripple.y,
                x: "-50%",
                y: "-50%",
              }}
              initial={{
                width: 0,
                height: 0,
                opacity: 0.8,
                borderWidth: 3,
              }}
              animate={{
                width: 120,
                height: 120,
                opacity: 0,
                borderWidth: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export { MouseTrail, ScrollProgress, PageTransition };
