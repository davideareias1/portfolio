"use client";

import {
    motion,
    useTransform,
    MotionValue,
} from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import React from "react";

import { projects } from "@/data/projects";

type Project = (typeof projects)[0];

interface ProjectSlideProps {
    project: Project;
    index: number;
    activeProjectIndex: MotionValue<number>;
    currentProject: number;
    parallaxX: MotionValue<number>;
    mainRef: React.RefObject<HTMLDivElement | null>;
}

const springConfig = {
    type: "spring" as const,
    stiffness: 400,
    damping: 50,
    mass: 1.2,
    restDelta: 0.001,
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
        filter: "blur(4px)",
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
            mass: 0.8,
        },
    },
};

const imageVariants = {
    hidden: {
        scale: 1.1,
        opacity: 0,
        filter: "blur(8px)",
    },
    visible: {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
    },
};

const projectBackgrounds = [
    "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
    "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    "linear-gradient(135deg, #16213e 0%, #0f3460 50%, #0e4b99 100%)",
    "linear-gradient(135deg, #0f3460 0%, #0e4b99 50%, #2e8b57 100%)",
];

const ProjectSlide: React.FC<ProjectSlideProps> = ({
    project,
    index,
    activeProjectIndex,
    currentProject,
    parallaxX,
    mainRef,
}) => {
    const rotateY = useTransform(
        activeProjectIndex,
        [index - 1, index, index + 1],
        [45, 0, -45]
    );

    const opacity = useTransform(
        activeProjectIndex,
        [index - 1, index - 0.5, index, index + 0.5, index + 1],
        [0.3, 0.5, 1, 0.5, 0.3]
    );

    return (
        <motion.div
            key={project.name}
            className="project-container h-full flex flex-col md:flex-row"
            style={{
                width: "100vw",
                rotateY,
                opacity,
                position: "relative",
            }}
        >
            {/* Enhanced Image Section with Parallax and dynamic overlays */}
            <motion.div
                className="relative w-full h-1/2 md:w-[40%] md:h-full overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%), ${projectBackgrounds[index % projectBackgrounds.length]
                        }`,
                }}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, root: mainRef }}
                animate={{
                    scale: index === currentProject ? 1.02 : 1,
                    filter:
                        index === currentProject ? "brightness(1.1)" : "brightness(0.9)",
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div
                    variants={imageVariants}
                    className="absolute inset-0"
                    style={{
                        x: parallaxX,
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

                {/* Subtle dark vignette overlay */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0.3) 100%)`
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, root: mainRef }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                />

                {/* Floating project number */}
                <motion.div
                    className="absolute top-4 left-4 sm:top-8 sm:left-8"
                    variants={itemVariants}
                >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/25 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/40 shadow-lg">
                        <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                    </div>
                </motion.div>

                {/* Subtle edge gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 pointer-events-none hidden md:block"></div>

                {/* Technologies */}
                <motion.div
                    className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, root: mainRef }}
                    transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                >
                    <div className="bg-black/40 backdrop-blur-md p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2 sm:mb-3">
                            Technologies
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
                </motion.div>
            </motion.div>

            {/* Enhanced Content Section */}
            <motion.div
                className="relative w-full h-1/2 md:w-[60%] md:h-full flex items-start md:items-center justify-center px-3 sm:px-6 md:px-8 py-4 md:py-6 overflow-y-auto bg-[color:var(--color-background)] md:bg-transparent"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ root: mainRef, once: true }}
            >
                <div className="max-w-2xl w-full space-y-3 md:space-y-4 lg:space-y-5">
                    {/* Project title with reveal animation */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-3 md:space-y-4"
                    >
                        <motion.h3
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[color:var(--color-foreground)] leading-tight"
                            initial={{ opacity: 0, y: 40, clipPath: "inset(100% 0 0 0)" }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                clipPath: "inset(0% 0 0 0)",
                            }}
                            viewport={{ once: true, root: mainRef }}
                            transition={{
                                duration: 1.0,
                                delay: 0.3,
                                ease: [0.25, 0.1, 0.25, 1],
                            }}
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
                            className="relative bg-gradient-to-br from-white/8 to-white/4 rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/10 backdrop-blur-sm"
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.02,
                                backgroundColor: "rgba(255,255,255,0.12)",
                                borderColor: "rgba(255,255,255,0.2)",
                            }}
                            transition={springConfig}
                        >
                            <h4 className="text-md sm:text-lg font-semibold text-[color:var(--color-primary)] mb-1.5 md:mb-2">
                                Key Achievement
                            </h4>
                            <p className="text-gray-300 text-sm sm:text-base">
                                {project.outcome}
                            </p>
                        </motion.div>
                    )}

                    {/* Enhanced testimonial */}
                    {project.testimonial && (
                        <motion.blockquote
                            className="relative border-l-4 border-[color:var(--color-primary)] pl-3 md:pl-4 py-2 md:py-3 bg-gradient-to-r from-white/8 to-transparent rounded-r-xl md:rounded-r-2xl"
                            variants={itemVariants}
                            whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.12)" }}
                            transition={springConfig}
                        >
                            <p className="text-base sm:text-lg italic text-gray-300">
                                &quot;{project.testimonial}&quot;
                            </p>
                            {project.testimonialName && (
                                <p className="text-sm text-gray-400 mt-2 font-medium">
                                    — {project.testimonialName}
                                </p>
                            )}
                        </motion.blockquote>
                    )}

                    {/* Enhanced tech stack and actions */}
                    <motion.div
                        className="space-y-4 md:space-y-5"
                        variants={itemVariants}
                    >
                        {/* Enhanced action buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1 md:pt-2"
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
                                        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={springConfig}
                                >
                                    <ExternalLink
                                        size={20}
                                        className="group-hover:rotate-12 transition-transform duration-300"
                                    />
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
                                        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={springConfig}
                                >
                                    <Github
                                        size={20}
                                        className="group-hover:rotate-12 transition-transform duration-300"
                                    />
                                    View Code
                                </motion.a>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProjectSlide; 