import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Construction,
  Landmark,
  Building2,
  Train,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const About = () => {
  // Slider images from public/about folder
  const sliderImages = [
    {
      src: "/images/curve-layer.png",
      title: "Design Layer Creation",
      description: "Create and manage multiple design layers seamlessly",
    },
    {
      src: "/about/17_Volume_cut_area.png",
      title: "Cutting Operation",
      description: "Calculate volume cuts with advanced 3D visualization",
    },
    {
      src: "/about/10_Material Line - 1 Created or added.png",
      title: "Material Filing",
      description: "Track material lines and additions with accuracy",
    },

    {
      src: "/images/target-set.png",
      title: "Planning & Work Targets",
      description:
        "Chainage-wise work targets are defined with clear timelines. Contractors are assigned tasks, and drone monitoring is planned in advance.",
    },
    {
      src: "/about/target-set.png",
      title: "Target Setting",
      description: "Define precise targets for your construction projects",
    },
    {
      src: "/about/road-analysis.png",
      title: "Work Progress Analysis",
      description:
        "Comprehensive road condition analysis with precision mapping",
    },
    {
      src: "/about/periodic-graph.png",
      title: "Periodic Graphs",
      description:
        "Comprehensive road condition analysis with precision mapping",
    },
    {
      src: "/images/bridge.jpg",
      title: "Bridge Construction",
      description: "Comprehensive bridge construction with precision mapping",
    },
    {
      src: "/about/Picture1 (1).jpg",
      title: "Bridge Construction",
      description: "Comprehensive bridge construction with precision mapping",
    },
    {
      src: "/about/drone-verification.png",
      title: "Drone Verification",
      description:
        "Independent drone-based verification of construction progress and quality",
    },
    {
      src: "/about/drone-mapping-periodic-surveys.png",
      title: "Drone Mapping & Periodic Surveys",
      description:
        "Regular drone surveys for comprehensive site mapping and progress tracking",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Visibility detection to pause animation when not in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Preload first 3 images initially, lazy load the rest
  useEffect(() => {
    const preloadImages = async () => {
      // Only preload first 3 images immediately
      const initialImages = sliderImages.slice(0, 3);
      const promises = initialImages.map((image) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = image.src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(promises);
      setImagesLoaded(true);
      
      // Lazy load remaining images after initial load
      sliderImages.slice(3).forEach((image) => {
        const img = new Image();
        img.src = image.src;
      });
    };
    preloadImages();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
  }, [sliderImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
    );
  }, [sliderImages.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-play functionality - only when visible
  useEffect(() => {
    if (!isAutoPlaying || !imagesLoaded || !isVisible) return;
    const interval = setInterval(nextSlide, 2000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, imagesLoaded, isVisible]);

  const useCases = [
    {
      icon: Construction,
      title: "Road Construction",
      description:
        "Track earthwork, material filling, and surface progress with precision point-cloud analysis.",
    },
    {
      icon: Landmark,
      title: "Bridge & Flyovers",
      description:
        "Monitor structural progress, pier construction, and deck laying across all stages.",
    },
    {
      icon: Building2,
      title: "Building Projects",
      description:
        "Floor-by-floor progress tracking with accurate measurement and deviation detection.",
    },
    {
      icon: Train,
      title: "Railway Infrastructure",
      description:
        "Track laying, station construction, and platform development monitoring.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      id="about"
      className="section bg-stone-100 dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-200 dark:from-black via-stone-100 dark:via-[#0a0a0a] to-stone-50 dark:to-[#111111] transition-colors duration-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.span
              variants={itemVariants}
              className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 block"
            >
              Our Approach
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            >
              What is <span className="text-gradient">3D Bharat</span>?
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300"
            >
              <p>
                3D Bharat is a{" "}
                <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">
                  unified digital platform
                </span>{" "}
                designed for planning, measurement, execution, and periodic
                monitoring of all construction projects.
              </p>
              <p>
                By combining{" "}
                <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">
                  3D digital design, tablet-based field data, and drone imagery
                </span>
                , we provide a complete picture of project progress that
                traditional methods cannot match.
              </p>
            </motion.div>

            {/* Features list */}
            <motion.ul variants={itemVariants} className="mt-8 space-y-3">
              {[
                "Single reference point for all project data",
                "Same-day visibility of actual work progress",
                "Visual and independent confirmation via drones",
                "Role-based access for all stakeholders",
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  <span className="w-1.5 h-1.5 bg-gray-700 dark:bg-white rounded-full transition-colors duration-300" />
                  {feature}
                </li>
              ))}
            </motion.ul>

            {/* Use Case Cards */}
            <motion.div
              variants={itemVariants}
              className="mt-12 grid sm:grid-cols-2 gap-4"
            >
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  className="glass-theme p-5 rounded-xl card-hover group"
                  whileHover={{ scale: 1.02 }}
                >
                  <useCase.icon className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 tracking-wide transition-colors duration-300 text-sm">
                    {useCase.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {useCase.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Creative Image Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Main Slider Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/40">
              {/* Animated Gradient Border */}
              <div className="absolute -inset-[2px] rounded-2xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 animate-spin-slow opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    backgroundSize: "400% 400%",
                    animation: "gradient-rotate 8s linear infinite",
                  }}
                />
              </div>

              {/* Slider */}
              <div className="relative rounded-2xl overflow-hidden bg-black/5 dark:bg-black/20 aspect-[4/3]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 will-change-transform"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <img
                      src={sliderImages[currentIndex].src}
                      alt={sliderImages[currentIndex].title}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110 z-10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110 z-10"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Slide Info Badge */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="glass-theme backdrop-blur-md bg-white/10 dark:bg-black/40 px-5 py-4 rounded-xl border border-white/20"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-white text-sm font-semibold tracking-wide">
                          {sliderImages[currentIndex].title}
                        </span>
                      </div>
                      <p className="text-white/70 text-xs leading-relaxed">
                        {sliderImages[currentIndex].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Progress Dots */}
                <div className="absolute bottom-4 right-6 flex items-center gap-2 z-10">
                  {sliderImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`relative transition-all duration-300 ${
                        index === currentIndex
                          ? "w-8 h-2"
                          : "w-2 h-2 hover:scale-125"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      <span
                        className={`absolute inset-0 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "bg-gradient-to-r from-emerald-400 to-blue-400"
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                      />
                      {index === currentIndex && (
                        <motion.span
                          layoutId="activeSlide"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            {/* <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -right-4 top-8 glass-theme backdrop-blur-md bg-white/90 dark:bg-black/60 px-4 py-3 rounded-xl shadow-lg border border-white/30 dark:border-white/10 hover:scale-105 transition-transform"
            >
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">98%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy Rate</div>
            </motion.div> */}

            {/* <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -left-4 bottom-24 glass-theme backdrop-blur-md bg-white/90 dark:bg-black/60 px-4 py-3 rounded-xl shadow-lg border border-white/30 dark:border-white/10 hover:scale-105 transition-transform"
            >
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">24/7</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Monitoring</div>
            </motion.div> */}

            {/* Slide Counter */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 glass-theme backdrop-blur-md bg-white/90 dark:bg-black/60 px-4 py-2 rounded-full shadow-lg border border-white/30 dark:border-white/10"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="text-emerald-500 font-bold">
                  {currentIndex + 1}
                </span>
                <span className="text-gray-400 mx-1">/</span>
                <span>{sliderImages.length}</span>
              </span>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none transition-colors duration-300" />
            <div className="absolute -z-10 top-0 right-0 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -z-10 bottom-0 left-0 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
