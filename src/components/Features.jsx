import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Layers,
  Box,
  Ruler,
  GitMerge,
  Calendar,
  Users,
  Tablet,
  Globe,
  BarChart3,
  Shield,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Features = () => {
  const { isDark } = useTheme();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [workflowSlideIndex, setWorkflowSlideIndex] = useState(0);
  // const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Use framer-motion's useInView instead of custom IntersectionObserver
  const isVisible = useInView(sectionRef, { threshold: 0.1, margin: "-50px" });

  const designLayerImages = [
    {
      src: "/images/curve-layer.png",
      alt: "Primary Frame Layer - Curve Road Design",
      title: "Primary Frame Layer",
      description: "Core framework with chainage scale visualization",
      color: "from-cyan-500 to-blue-500",
    },
    {
      src: "/images/5_Design Layer Creation.png",
      alt: "Primary Frame Layer - Straight Road Design",
      title: "Primary Frame Layer",
      description: "Core framework with chainage scale visualization",
      color: "from-cyan-500 to-blue-500",
    },
    {
      src: "/images/10_Material Line - 1 Created or added.png",
      alt: "Material Layer - Road Construction Layers",
      title: "Material Layer",
      description: "Detailed material mapping for road construction",
      color: "from-purple-500 to-pink-500",
    },
    {
      src: "/images/17_Volume_cut_area.png",
      alt: "Measurement Layer - Volume Cut Area Calculation",
      title: "Measurement Layer",
      description: "Precise volume calculation and cut/fill analysis",
      color: "from-green-500 to-emerald-500",
    },
  ];

  /* before using framer motions UseInView
  // Visibility detection to pause animations when not in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  */

  // Combined interval for both slideshows - only runs when visible
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % designLayerImages.length);
      setWorkflowSlideIndex((prev) => (prev + 1) % 2);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible, designLayerImages.length]);

  const designLayers = [
    {
      icon: Layers,
      title: "Primary Frame Layer",
      description:
        "The main structural layout defining the core framework of your construction project.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Box,
      title: "Material Layer",
      description:
        "Detailed materials and construction components mapped to each structural element.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Ruler,
      title: "Measurement Layer",
      description:
        "Precise rules for quantity calculation and progress measurement standards.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const workflowFeatures = [
    {
      icon: Calendar,
      title: "Planning & Work Targets",
      description:
        "Chainage-wise work targets are defined with clear timelines. Contractors are assigned tasks, and drone monitoring is planned in advance.",
      bgImage: "/images/target-set.png",
    },
    {
      icon: Tablet,
      title: "Tablet-Based Field Entry",
      description:
        "Engineers record work execution using tablets. fortnightly, monthly, or quarterly. Reports are generated automatically.",
      bgImages: [
        "/images/road-construction-monitoring.png",
        "/images/progress.png",
      ],
    },
    {
      icon: Globe,
      title: "Web-Based Drone Upload",
      description:
        "Drone teams upload panoramic images and 3D point cloud data through a web interface, providing visual confirmation of progress.",
      bgImage: "/about/road-analysis.png",
    },
    {
      icon: BarChart3,
      title: "Periodic Web Monitoring",
      description:
        "Authorities view targets versus progress, access dashboards on web or tablet, and monitor multiple projects without site visits.",
      bgImage: "/images/periodic-graph.png",
    },
    {
      icon: Users,
      title: "Multi-User Management",
      description:
        "Role-based access for all stakeholders ensures accurate measurement, clear planning, and daily accountability.",
      bgImage: "/images/multi-user-management.png",
    },
    {
      icon: Shield,
      title: "Data Security",
      description:
        "Enterprise-grade security with encrypted data transmission and secure storage for all project information.",
      bgImage:
        "https://www.goanywhere.com/sites/default/files/styles/og_image/public/goanywhere/ga-the-data-security-lifecycle-blog-850x330.jpg.webp?itok=vL8t-n_n",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="features"
      className="section bg-stone-50 dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-100 dark:from-black via-stone-50 dark:via-[#0a0a0a] to-stone-100 dark:to-[#111111] transition-colors duration-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.span
            variants={itemVariants}
            className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 block"
          >
            Design & Measurement Framework
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            3D <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">Design Tool</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-300"
          >
            Every project begins with a structured 3D digital design that
            becomes the single reference point for planning, execution, and
            monitoring.
          </motion.p>
        </motion.div>

        {/* Design Framework - 3 Layers with 3D Visualization */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          {/* Left - Design Layer Images Slideshow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1 h-[350px] md:h-[400px]"
          >
            {/* Image Slideshow Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              {designLayerImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeImageIndex === index ? 1 : 0,
                    scale: activeImageIndex === index ? 1 : 1.05,
                  }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full bg-gradient-to-r ${image.color} shadow-lg`}
                      ></div>
                      <span className="text-white font-bold text-lg">
                        {image.title}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mt-2">
                      {image.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Indicator dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {designLayerImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeImageIndex === index
                      ? `bg-gradient-to-r ${image.color} scale-125`
                      : "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500"
                  }`}
                  aria-label={`View ${image.title}`}
                />
              ))}
            </div>

            {/* Background glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-500/10 dark:bg-white/5 rounded-full blur-3xl pointer-events-none -z-10" />
          </motion.div>

          {/* Right - Layer Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6 order-1 lg:order-2"
          >
            {designLayers.map((layer, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-theme p-6 rounded-xl card-hover group relative overflow-hidden"
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${layer.color}`}
                />
                <div className="flex items-start gap-4 pl-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-200/50 dark:bg-white/5 flex items-center justify-center group-hover:bg-gray-300/50 dark:group-hover:bg-white/10 transition-colors flex-shrink-0">
                    <layer.icon className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 tracking-wide transition-colors duration-300">
                      {layer.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {layer.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Merger Layer Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mb-4"
            >
              <GitMerge className="w-6 h-6 text-gray-500" />
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Visualization
              </span>
            </motion.div>
            <motion.h3
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-6 tracking-tight"
            >
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">Merger Layer</span>
            </motion.h3>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 transition-colors duration-300"
            >
              Multiple Design layers are merged into a single visual view,
              making project status easy to understand at a glance.
            </motion.p>
            <motion.ul variants={itemVariants} className="space-y-3">
              {[
                "Real-time data synchronization",
                "Unified visual dashboard",
                "Cross-reference verification",
                "Automated discrepancy detection",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  <span className="w-1.5 h-1.5 bg-gray-700 dark:bg-white rounded-full" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right - Merger Layer Image Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative group">
              {/* Subtle floating shadow layers */}
              <div className="absolute -inset-4 bg-gray-400/40 dark:bg-white/5 rounded-3xl blur-2xl transition-opacity duration-500 group-hover:opacity-80" />

              {/* Image Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/50 border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-900">
                {/* Window header bar */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                    Merger Mode — All Layers Combined
                  </span>
                </div>

                {/* The Image */}
                <img
                  src="/images/merger 2.png"
                  alt="Merger Layer Visualization - Combined 3D Design Layers"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />

                {/* Bottom status bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white animate-pulse" />
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                      Layers Synced
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Chainage: 101+000
                  </span>
                </div>
              </div>

              {/* Floating layer indicators */}
              <div className="absolute -right-2 top-1/4 z-10 hidden lg:block">
                <div className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold shadow-lg">
                  Primary
                </div>
              </div>
              <div className="absolute -left-2 top-1/2 z-10 hidden lg:block">
                <div className="px-3 py-1.5 rounded-lg bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 text-xs font-semibold shadow-lg">
                  Material
                </div>
              </div>
              <div className="absolute -right-2 bottom-1/4 z-10 hidden lg:block">
                <div className="px-3 py-1.5 rounded-lg bg-gray-500 text-white text-xs font-semibold shadow-lg">
                  Measurement
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Workflow Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <motion.span
            variants={itemVariants}
            className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 block"
          >
            Complete Workflow
          </motion.span>
          <motion.h3
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6 tracking-tight"
          >
            Precise Work{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">Progress Monitoring Flow</span>
          </motion.h3>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {workflowFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl card-hover group min-h-[280px]"
              whileHover={{ scale: 1.02 }}
            >
              {/* Background Image(s) */}
              {feature.bgImages ? (
                // Slideshow for multiple images
                feature.bgImages.map((img, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${img})`,
                      opacity: workflowSlideIndex === imgIndex ? 1 : 0,
                      transform:
                        workflowSlideIndex === imgIndex
                          ? "scale(1)"
                          : "scale(1.05)",
                    }}
                  />
                ))
              ) : (
                // Single background image
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${feature.bgImage})` }}
                />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:from-black/95 group-hover:via-black/70 transition-all duration-300" />

              {/* Slideshow indicators for cards with multiple images */}
              {feature.bgImages && (
                <div className="absolute top-4 right-4 flex gap-1.5 z-20">
                  {feature.bgImages.map((_, dotIndex) => (
                    <span
                      key={dotIndex}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        workflowSlideIndex === dotIndex
                          ? "bg-white scale-125"
                          : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <div className="w-14 h-14 mb-6 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-white/80 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-3 tracking-wide">
                  {feature.title}
                </h4>
                <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
