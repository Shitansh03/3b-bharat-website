import { useState, useEffect, Suspense, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, FileX, Eye, Puzzle } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import ChaosParticles from "./three/ChaosParticles";
import { useTheme } from "../context/ThemeContext";

// Move static data outside component to prevent recreation on each render
const CHALLENGES = [
  {
    icon: AlertTriangle,
    title: "Scattered Information",
    description:
      "Project data spread across multiple sources makes tracking daily work progress difficult and time-consuming.",
  },
  {
    icon: FileX,
    title: "Delayed Decision-Making",
    description:
      "Without real-time visibility, critical decisions are often delayed, impacting project timelines and budgets.",
  },
  {
    icon: Eye,
    title: "Limited Visibility",
    description:
      "Site visits and paper reports provide incomplete snapshots, missing crucial details for comprehensive monitoring.",
  },
  {
    icon: Puzzle,
    title: "Fragmented Tools",
    description:
      "Relying on isolated digital tools doesn't provide a complete or reliable picture of actual progress.",
  },
];

const Challenges = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { isDark } = useTheme(); // Use context instead of MutationObserver
  const rafRef = useRef(null);
  const sectionRef = useRef(null);
  // const [isVisible, setIsVisible] = useState(false);

  // Use framer-motion's useInView instead of custom IntersectionObserver
  const isVisible = useInView(sectionRef, { threshold: 0.1, margin: "-50px" });

  /* before using framer motions UseInView
  // Visibility detection to pause Three.js when not in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  */

  // Throttled mouse tracking with RAF
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        setMouse({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1,
        });
        rafRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="challenges"
      className="relative min-h-screen overflow-hidden transition-colors duration-500"
      style={{ perspective: "1000px" }}
    >
      {/* Full-screen Three.js Canvas Background - Only render when visible */}
      {isVisible && (
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 12], fov: 60 }}
            dpr={[1, 1.5]}
            frameloop="demand"
            gl={{ 
              antialias: false, 
              alpha: true,
              powerPreference: "high-performance",
            }}
            style={{ background: "transparent" }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={0.5} />
              <ChaosParticles isDark={isDark} mouse={mouse} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Gradient overlays for depth */}
      <div
        className={`absolute inset-0 z-[1] pointer-events-none transition-opacity duration-500 ${
          isDark
            ? "bg-gradient-to-b from-black/60 via-transparent to-black/80"
            : "bg-gradient-to-b from-stone-200/80 via-transparent to-stone-200/90"
        }`}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.span
              variants={itemVariants}
              className="inline-block text-xs uppercase tracking-[0.4em] text-red-500 dark:text-red-400 mb-6 font-medium"
            >
              ⚠️ Present Challenges
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
              style={{
                textShadow: isDark
                  ? "0 0 40px rgba(239, 68, 68, 0.3)"
                  : "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              The Problem with{" "}
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
                Traditional Monitoring
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Across construction projects of all types, it is difficult to
              track work progress clearly and on time. Information is scattered,
              and decision-making is delayed.
            </motion.p>
          </motion.div>

          {/* Challenge Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {CHALLENGES.map((challenge, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className={`group relative p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 ${
                  isDark
                    ? "bg-black/40 border-red-900/30 hover:border-red-500/50 hover:bg-black/60"
                    : "bg-white/60 border-red-200/50 hover:border-red-400/70 hover:bg-white/80"
                }`}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                style={{
                  boxShadow: isDark
                    ? "0 0 30px rgba(239, 68, 68, 0.1), inset 0 0 60px rgba(239, 68, 68, 0.05)"
                    : "0 10px 40px rgba(0,0,0,0.1)",
                }}
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    isDark
                      ? "bg-gradient-to-br from-red-500/10 to-orange-500/5"
                      : "bg-gradient-to-br from-red-100/50 to-orange-100/30"
                  }`}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isDark
                        ? "bg-gradient-to-br from-red-500/20 to-orange-500/10 group-hover:from-red-500/30 group-hover:to-orange-500/20"
                        : "bg-gradient-to-br from-red-100 to-orange-50 group-hover:from-red-200 group-hover:to-orange-100"
                    }`}
                    style={{
                      boxShadow: isDark
                        ? "0 0 20px rgba(239, 68, 68, 0.2)"
                        : "0 4px 15px rgba(239, 68, 68, 0.15)",
                    }}
                  >
                    <challenge.icon
                      className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${
                        isDark ? "text-red-400" : "text-red-600"
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-xl font-bold mb-4 text-center tracking-wide transition-colors duration-300 ${
                      isDark
                        ? "text-white group-hover:text-red-100"
                        : "text-gray-900"
                    }`}
                  >
                    {challenge.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm text-center leading-relaxed ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {challenge.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Quote */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <motion.div
              variants={itemVariants}
              className={`relative inline-block px-8 py-6 rounded-2xl backdrop-blur-md ${
                isDark
                  ? "bg-black/30 border border-gray-800/50"
                  : "bg-white/50 border border-gray-200/50"
              }`}
            >
              <p
                className={`text-lg md:text-xl italic max-w-2xl mx-auto ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
                style={{
                  textShadow: isDark ? "0 0 20px rgba(0,0,0,0.5)" : "none",
                }}
              >
                "Relying only on site visits, paper reports, or isolated digital
                tools does not provide a complete or reliable picture of
                progress."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Challenges;
