import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import Globe from "./three/Globe";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();
  const footerLinks = {
    Platform: [
      "Design Framework",
      "Field Data Entry",
      "Drone Upload",
      "Web Monitoring",
    ],
    Solutions: [
      "Road Construction",
      "Bridge Projects",
      "Building Works",
      "Railway Infrastructure",
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <footer className="bg-stone-200 dark:bg-black border-t border-gray-300 dark:border-white/10 transition-colors duration-300 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 mb-10">
          {/* Left Section - Brand & Links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12"
          >
            {/* Brand */}
            <motion.div
              variants={itemVariants}
              className="col-span-2 sm:col-span-1"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
                3D <span className="text-gray-500">Bharat</span>
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
                Universal construction monitoring platform for planning,
                measurement, and execution.
              </p>
              {/* Social icons */}
              <div className="flex gap-3">
                {["LinkedIn", "Twitter", "GitHub"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-gray-300/50 dark:bg-white/5 flex items-center justify-center
                             hover:bg-gray-400/50 dark:hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-xs text-gray-500 group-hover:text-gray-800 dark:group-hover:text-white transition-colors">
                      {social[0]}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <motion.div key={category} variants={itemVariants}>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider mb-4 transition-colors duration-300">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-500 text-sm hover:text-gray-800 dark:hover:text-white transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Section - Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col items-center justify-center w-72 shrink-0"
          >
            {/* Globe Label */}
            <span className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
              Around the Globe Coverage
            </span>

            {/* Globe Container - Larger size to prevent edge clipping */}
            <div className="w-64 h-64 relative overflow-visible">
              <Canvas
                camera={{ position: [0, 0, 6.5], fov: 35 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.3} />
                  <pointLight position={[10, 10, 10]} intensity={0.4} />
                  <Globe isDark={isDark} />
                </Suspense>
              </Canvas>

              {/* Glow effect behind globe */}
              <div className="absolute inset-6 -z-10 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-xl" />
            </div>

            {/* Stats below globe */}
            <div className="flex gap-8 mt-3">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  500+
                </div>
                <div className="text-xs text-gray-500">Projects</div>
              </div>
              <div className="w-px bg-gray-300 dark:bg-gray-700" />
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  28
                </div>
                <div className="text-xs text-gray-500">States</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-400/30 dark:via-white/10 to-transparent mb-6" />

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 dark:text-gray-600 text-sm transition-colors duration-300">
            © 2026 3D Bharat — All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-stone-300 dark:from-gray-900 via-stone-400 dark:via-gray-700 to-stone-300 dark:to-gray-900 transition-colors duration-300" />
    </footer>
  );
};

export default Footer;
