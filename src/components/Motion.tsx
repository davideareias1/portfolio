"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  timestamp: number;
}

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  isScrolling: boolean;
  isTyping: boolean;
  hoverTarget: string | null;
  typingSpeed: number;
}

interface TypingEffect {
  x: number;
  y: number;
  id: number;
  char: string;
  timestamp: number;
}

const MouseTrail = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    isScrolling: false,
    isTyping: false,
    hoverTarget: null,
    typingSpeed: 0,
  });
  
  // Optimized cursor movement with faster response
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 15, stiffness: 350, mass: 0.1 });
  const cursorY = useSpring(mouseY, { damping: 15, stiffness: 350, mass: 0.1 });
  
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastKeyTime = useRef<number>(0);
  const keyCount = useRef<number>(0);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [typingEffects, setTypingEffects] = useState<TypingEffect[]>([]);
  
  // Enhanced mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactiveElement = target.closest('a, button, [role="button"]');
    
    let finalX = e.clientX;
    let finalY = e.clientY;
    
    // Magnetic effect for interactive elements
    if (interactiveElement) {
      const rect = interactiveElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
      
      const magnetRange = 80;
      const magnetStrength = 0.3;
      
      if (distance < magnetRange) {
        const strength = Math.max(0, 1 - distance / magnetRange) * magnetStrength;
        finalX += (centerX - e.clientX) * strength;
        finalY += (centerY - e.clientY) * strength;
      }
    }
    
    // Get creative message based on element type and content
    const getCreativeMessage = (element: Element): string => {
      const tagName = element.tagName.toLowerCase();
      const text = element.textContent?.trim() || '';
      const href = element.getAttribute('href');
      const type = element.getAttribute('type');
      
      // Check for specific portfolio elements
      switch (tagName) {
        case 'a':
          // Navigation links
          if (href === '#home' || text === 'DA') return '🏠 Back to top';
          if (href === '#projects') return '💻 See my work';
          if (href === '#contact') return '📫 Get in touch';
          
          // Social and external links
          if (href?.includes('linkedin')) return '💼 Professional profile';
          if (href?.includes('github')) return '🐙 Code repositories';
          if (href?.includes('mailto:')) return '📧 Send me an email';
          if (href === '/cv.pdf') return '📄 Download my CV';
          
          // Project links
          if (text.toLowerCase().includes('view project')) return '🚀 See it live';
          if (text.toLowerCase().includes('view code')) return '👨‍💻 Check the code';
          
          // Fallback for other links
          return '🔗 Explore this';
        
        case 'button':
          if (type === 'submit') return '🚀 Send message';
          if (text.toLowerCase().includes('submit')) return '📨 Send it over';
          if (text.toLowerCase().includes('download')) return '⬇️ Get my CV';
          return '✨ Click me';
        
        case 'input':
          if (type === 'email') return '📧 Your email';
          if (type === 'text') return '✏️ Your name';
          return '💭 Type here';
        
        case 'textarea':
          return '📝 Your message';
        
        default:
          // Check for interactive roles
          if (element.getAttribute('role') === 'button') return '🎯 Interact';
          
          // Check for common portfolio elements by text content
          if (text.toLowerCase().includes('project')) return '💻 Explore project';
          if (text.toLowerCase().includes('contact')) return '💬 Let\'s connect';
          if (text.toLowerCase().includes('about')) return '👋 Learn about me';
          if (text.toLowerCase().includes('skill')) return '🛠️ My expertise';
          if (text.toLowerCase().includes('experience')) return '💼 My journey';
          
          return '👆 Click to interact';
      }
    };
    
    if (interactiveElement) {
      setCursorState(prev => ({ 
        ...prev, 
        isHovering: true, 
        hoverTarget: getCreativeMessage(interactiveElement)
      }));
    } else {
      setCursorState(prev => ({ ...prev, isHovering: false, hoverTarget: null }));
    }
    
    // Optimized cursor movement with immediate updates
    mouseX.set(finalX);
    mouseY.set(finalY);
    
    // Enhanced trail with better performance
    setTrail(prevTrail => {
      const now = Date.now();
      const newPoint = { x: finalX, y: finalY, id: now, timestamp: now };
      const maxTrailLength = 15; // Shorter trail in inputs
      return [newPoint, ...prevTrail.slice(0, maxTrailLength)].filter(point => now - point.timestamp < 800);
    });
  }, [mouseX, mouseY]);

  // Typing animation handler
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const now = Date.now();
    const timeSinceLastKey = now - lastKeyTime.current;
    
    // Calculate typing speed
    if (timeSinceLastKey < 200) {
      keyCount.current++;
    } else {
      keyCount.current = 1;
    }
    
    const typingSpeed = Math.min(keyCount.current / 5, 1); // Normalize to 0-1
    
    setCursorState(prev => ({ 
      ...prev, 
      isTyping: true, 
      typingSpeed 
    }));
    
    // Create typing effect particles near cursor
    if (e.key.length === 1 && /[\w\s]/.test(e.key)) { // Only for visible characters
      const effectX = mouseX.get() + (Math.random() - 0.5) * 40;
      const effectY = mouseY.get() + (Math.random() - 0.5) * 40;
      
      const newEffect: TypingEffect = {
        x: effectX,
        y: effectY,
        id: now,
        char: e.key,
        timestamp: now,
      };
      
      setTypingEffects(prev => [...prev, newEffect]);
      
      // Clean up old effects
      setTimeout(() => {
        setTypingEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
      }, 1000);
    }
    
    lastKeyTime.current = now;
    
    // Reset typing state
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }
    typingTimeout.current = setTimeout(() => {
      setCursorState(prev => ({ ...prev, isTyping: false, typingSpeed: 0 }));
      keyCount.current = 0;
    }, 300);
    
    if (e.key === 'Escape') {
      setCursorState(prev => ({ ...prev, isHovering: false, hoverTarget: null }));
    }
  }, [mouseX, mouseY]);

  // Click handler with ripple effect
  const handleClick = useCallback((e: MouseEvent) => {
    setCursorState(prev => ({ ...prev, isClicking: true }));
    
    // Create ripple effect
    const newRipple = { x: e.clientX, y: e.clientY, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 800);
    
    setTimeout(() => {
      setCursorState(prev => ({ ...prev, isClicking: false }));
    }, 150);
  }, []);

  // Scroll handler
  const handleScroll = useCallback(() => {
    setCursorState(prev => ({ ...prev, isScrolling: true }));
    
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setCursorState(prev => ({ ...prev, isScrolling: false }));
    }, 150);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyPress); // Add keydown listener
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyPress); // Remove keydown listener
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [handleMouseMove, handleClick, handleScroll, handleKeyPress]);

  // Dynamic cursor variants
  const getCursorVariant = () => {
    if (cursorState.isClicking) return "clicking";
    if (cursorState.isTyping) return "typing";
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
    typing: {
      scale: 0.5 + cursorState.typingSpeed * 0.3,
      backgroundColor: `rgba(59, 130, 246, ${0.3 + cursorState.typingSpeed * 0.3})`,
      borderColor: `rgba(59, 130, 246, ${0.6 + cursorState.typingSpeed * 0.4})`,
      width: 12 + cursorState.typingSpeed * 8,
      height: 12 + cursorState.typingSpeed * 8,
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
      {/* Main Cursor with GPU acceleration */}
      <motion.div
        className="fixed pointer-events-none z-50 rounded-full border-2 backdrop-blur-sm will-change-transform"
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
          transform: "translate3d(0, 0, 0)", // Force GPU acceleration
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

      {/* Enhanced Trail Particles */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <AnimatePresence>
          {trail.map((point, index) => {
            const age = Date.now() - point.timestamp;
            const opacity = Math.max(0, 1 - age / 800);
            const scale = Math.max(0.1, 1 - index / trail.length);
            
            // Dynamic particle behavior
            let particleColor = "rgba(59, 130, 246, 0.6)";
            let particleSize = 8;
            
            if (cursorState.isScrolling) {
              particleColor = "rgba(156, 163, 175, 0.5)";
              particleSize = 6;
            } else if (cursorState.isHovering) {
              particleColor = "rgba(59, 130, 246, 0.8)";
              particleSize = 10;
            }
            
            // Add typing intensity effect
            if (cursorState.isTyping) {
              particleSize += cursorState.typingSpeed * 4;
              particleColor = `rgba(59, 130, 246, ${0.4 + cursorState.typingSpeed * 0.4})`;
            }
            
            return (
              <motion.div
                key={point.id}
                className="absolute rounded-full will-change-transform"
                style={{
                  left: point.x - particleSize / 2,
                  top: point.y - particleSize / 2,
                  width: particleSize,
                  height: particleSize,
                  background: `radial-gradient(circle, ${particleColor} 0%, transparent 70%)`,
                  transform: "translate3d(0, 0, 0)",
                }}
                initial={{ opacity: 0.8, scale: 1, filter: "blur(0px)" }}
                animate={{ 
                  opacity: opacity * 0.7, 
                  scale: scale,
                  filter: `blur(${index * 0.3}px)`,
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0,
                  transition: { duration: 0.2 }
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Click Ripples */}
      <div className="fixed inset-0 pointer-events-none z-45">
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute rounded-full border-2 border-blue-400 will-change-transform"
              style={{
                left: ripple.x,
                top: ripple.y,
                x: "-50%",
                y: "-50%",
                transform: "translate3d(0, 0, 0)",
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

      {/* Typing Effects */}
      <div className="fixed inset-0 pointer-events-none z-45">
        <AnimatePresence>
          {typingEffects.map((effect) => {
            const age = Date.now() - effect.timestamp;
            return (
              <motion.div
                key={effect.id}
                className="absolute text-blue-400 font-mono text-sm font-bold pointer-events-none will-change-transform"
                style={{
                  left: effect.x,
                  top: effect.y,
                  transform: "translate3d(-50%, -50%, 0)",
                }}
                initial={{ 
                  opacity: 0.8, 
                  scale: 0.5, 
                  y: 0,
                  rotate: Math.random() * 20 - 10
                }}
                animate={{ 
                  opacity: Math.max(0, 0.8 - age / 1000), 
                  scale: 1 + (age / 1000) * 0.5,
                  y: -(age / 1000) * 30,
                  rotate: (Math.random() * 40 - 20) * (age / 1000)
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 1.5,
                  y: -40
                }}
                transition={{
                  duration: 1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {effect.char}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Context Indicator */}
      {cursorState.hoverTarget && (
        <motion.div
          className="fixed pointer-events-none z-45 px-2 py-1 text-xs text-white bg-blue-500/80 rounded backdrop-blur-sm will-change-transform"
          style={{
            left: cursorX,
            top: cursorY,
            x: "20px",
            y: "-40px",
            transform: "translate3d(0, 0, 0)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {cursorState.hoverTarget}
        </motion.div>
      )}
    </>
  );
};

// Enhanced scroll progress with dynamic styling
const ScrollProgress = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(scrollTop / docHeight, 1);
      setScrollY(scrollPercent);
      
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 origin-left z-50 will-change-transform"
      animate={{
        height: isScrolling ? 4 : 2,
        background: isScrolling 
          ? "linear-gradient(to right, #3b82f6, #60a5fa, #93c5fd)" 
          : "linear-gradient(to right, #3b82f6, #60a5fa)",
      }}
      style={{
        scaleX: scrollY,
        transform: "translate3d(0, 0, 0)",
      }}
      transition={{ 
        height: { duration: 0.2 },
        background: { duration: 0.3 },
        scaleX: { duration: 0.1 }
      }}
    />
  );
};

// Page transition wrapper with advanced animations
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export { MouseTrail, ScrollProgress, PageTransition };
