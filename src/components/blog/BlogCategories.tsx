"use client";

import { motion } from "framer-motion";
import { Code, Database, Palette, Globe, Zap, Brain } from "lucide-react";
import React from "react";

const BlogCategories = () => {
  const categories = [
    {
      name: "React",
      slug: "react",
      icon: <Code size={24} />,
      color: "from-blue-500 to-cyan-500",
      count: 12,
      description: "Frontend frameworks and libraries"
    },
    {
      name: "Python",
      slug: "python", 
      icon: <Zap size={24} />,
      color: "from-yellow-500 to-orange-500",
      count: 8,
      description: "Backend development and automation"
    },
    {
      name: "Rust",
      slug: "rust",
      icon: <Brain size={24} />,
      color: "from-orange-600 to-red-600", 
      count: 5,
      description: "Systems programming and performance"
    },
    {
      name: "Database",
      slug: "database",
      icon: <Database size={24} />,
      color: "from-green-500 to-emerald-500",
      count: 6,
      description: "Data storage and optimization"
    },
    {
      name: "Frontend",
      slug: "frontend",
      icon: <Palette size={24} />,
      color: "from-purple-500 to-pink-500",
      count: 15,
      description: "UI/UX and modern web design"
    },
    {
      name: "SEO",
      slug: "seo",
      icon: <Globe size={24} />,
      color: "from-indigo-500 to-blue-600",
      count: 4,
      description: "Search engine optimization"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 bg-slate-900 relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Explore Topics
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Dive deep into the technologies and concepts that matter most in modern software development
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.slug}
              variants={cardVariants}
              className="group cursor-pointer"
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-gray-700/50 p-6 hover:bg-white/10 hover:border-gray-600 transition-all duration-500">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} mb-4 shadow-lg`}>
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <span className="text-sm text-gray-400 bg-gray-800/50 rounded-full px-3 py-1">
                      {category.count} posts
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {category.description}
                  </p>

                  {/* Hover Indicator */}
                  <div className="mt-4 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-sm font-medium">Explore articles</span>
                    <motion.div
                      className="ml-2"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-blue-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogCategories; 