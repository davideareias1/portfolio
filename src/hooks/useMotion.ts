"use client";
import { useMotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const getInitialState = () => {
    if (typeof window === "undefined") {
        return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] =
        useState(getInitialState);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleChange = () => {
            setPrefersReducedMotion(mediaQuery.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return prefersReducedMotion;
};

export const useRaf = (callback: () => void) => {
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const loop = () => {
            callback();
            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [callback]);
};

export const useMousePosition = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            x.set(event.clientX);
            y.set(event.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [x, y]);

    return { x, y };
}; 