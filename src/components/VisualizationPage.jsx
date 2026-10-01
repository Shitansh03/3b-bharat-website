import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Globe,
  Glasses,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  User,
  ExternalLink,
  Layers,
  Compass,
  MonitorCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";

const webVisualizationPoints = [
  "View the 3D design of Road, Bridge, Metro, and Tunnel on the web.",
  "Compare the Design Data with Ground Data in one place.",
  "Easily observe the differences between the planned design and actual ground condition.",
  "This helps in monitoring construction progress and checking the actual work with the planned design.",
];

const vrVisualizationPoints = [
  "Experience the 3D construction design in a real-like VR environment.",
  "Explore Road, Bridge, Metro, and Tunnel designs in 3D.",
  "Get a better understanding of how the project will look in the real world.",
  "VR makes the design more interactive and easy to understand.",
];

const VisualizationPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { openModal: openLoginModal } = useLoginModal();

  const handleVisualizeClick = () => {
    if (!isAuthenticated) return;
    // Redirect to visualizer module
    window.location.href = "/visualize";
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-black text-gray-800 dark:text-white transition-colors duration-300 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Comprehensive <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">Visualization</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Experience next-generation infrastructure monitoring with synchronized web point-clouds and immersive virtual reality environments.
          </p>
        </motion.div>

        {/* 1. Main Hero Image Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 bg-gray-900 mb-12 group"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
            <img
              src="/images/visualization-banner.jpg"
              alt="3D Bharat Web & VR Visualization for Road, Bridge, Metro, Tunnel"
              className="w-full h-full object-cover object-center transform group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              loading="eager"
            />
            {/* Subtle gradient vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
            
            {/* Bottom floating badge inside image */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg backdrop-blur-md bg-black/60 border border-white/20 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg">
                <MonitorCheck className="w-4 h-4 text-emerald-400" />
                Live 3D & VR Synchronized Models
              </span>
            </div>
          </div>
        </motion.div>

        {/* 2. Web Visualization & VR Visualization Info Cards (Stacked vertically: ek ke niche ek) */}
        <div className="flex flex-col gap-8 mb-14">
          {/* 1. Web Visualization Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 bg-white/95 dark:bg-white/[0.04] backdrop-blur-xl border border-gray-200/90 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 via-amber-500/15 to-orange-600/10 border border-orange-500/30 flex items-center justify-center text-orange-500 dark:text-orange-400 shrink-0 shadow-inner">
                  <Globe className="w-7 h-7" />
                </div>
                <div>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/20 px-2.5 py-0.5 rounded-full mb-1">
                    Browser Based
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    Web Visualization
                  </h2>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-white/5 border border-orange-200/60 dark:border-white/10 text-xs font-semibold text-orange-800 dark:text-orange-300 self-start md:self-auto">
                <Layers className="w-4 h-4 text-orange-500" />
                <span>Road • Bridge • Metro • Tunnel</span>
              </div>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {webVisualizationPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-colors duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 2. VR Visualization Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 bg-white/95 dark:bg-white/[0.04] backdrop-blur-xl border border-gray-200/90 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0 shadow-inner">
                  <Glasses className="w-7 h-7" />
                </div>
                <div>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-0.5 rounded-full mb-1">
                    Virtual Reality
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    VR Visualization
                  </h2>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-white/5 border border-emerald-200/60 dark:border-white/10 text-xs font-semibold text-emerald-800 dark:text-emerald-300 self-start md:self-auto">
                <Compass className="w-4 h-4 text-emerald-500" />
                <span>Immersive 3D Spatial Walkthroughs</span>
              </div>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {vrVisualizationPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-colors duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* 3. Action Section: Visualize Button & SignUp Button (Hidden when logged in) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-emerald-500/5 border border-orange-500/20 dark:border-white/10 text-center flex flex-col items-center justify-center gap-6"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              Ready to explore 3D Bharat Visualizer?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl mx-auto">
              {isAuthenticated
                ? "You have been Signed In! Click 'Visualize Now' to launch the visualizer platform."
                : "Sign in with your account to unlock full 3D point cloud comparison & visualization access."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {/* 1. Visualize Button */}
            {isAuthenticated ? (
              <motion.button
                onClick={handleVisualizeClick}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-base text-white bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 shadow-xl shadow-orange-500/30 transition-all duration-300 cursor-pointer select-none"
              >
                <Sparkles className="w-5 h-5 animate-pulse text-amber-200" />
                <span>Visualize Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <div className="relative group">
                <button
                  type="button"
                  disabled
                  className="relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-gray-400 dark:text-gray-500 bg-gray-200/90 dark:bg-white/5 border border-gray-300/80 dark:border-white/10 cursor-not-allowed select-none shadow-inner"
                  title="Login to enable Visualize"
                >
                  <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span>Visualize</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-300/70 dark:bg-white/10 text-gray-600 dark:text-gray-400 ml-1">
                    Login Required
                  </span>
                </button>
              </div>
            )}

            {/* 2. SignUp / Login Button: ONLY SHOWN IF NOT LOGGED IN */}
            {!isAuthenticated && (
              <motion.button
                type="button"
                onClick={openLoginModal}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative inline-block group cursor-pointer select-none shrink-0"
              >
                <div
                  className="absolute -inset-0.5 rounded-full opacity-60 dark:opacity-75 blur-sm group-hover:opacity-90 dark:group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#FF7A00] via-[#FF9900]/30 to-[#00E676] pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative rounded-full p-[1px] bg-gradient-to-r from-[#FF7A00] via-[#A3C038]/60 to-[#00E676] shadow-[-3px_0_8px_rgba(255,122,0,0.2),3px_0_8px_rgba(0,230,118,0.2)]">
                  <div className="relative rounded-full px-3 py-1.5 bg-white/95 dark:bg-gradient-to-r dark:from-[#2e1d10]/90 dark:via-[#1c2430]/90 dark:to-[#0f2c1d]/90 backdrop-blur-2xl flex items-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.35)] transition-colors duration-300">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF6B00] via-[#FF8500] to-[#00A859] p-0.5 shadow-[0_0_4px_rgba(255,107,0,0.4)] flex items-center justify-center shrink-0">
                      <User className="w-3 h-3 text-white fill-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]" />
                    </div>
                    <div className="w-[1px] h-3.5 bg-gray-300 dark:bg-white/20 rounded-full mx-2 shrink-0" />
                    <span className="text-gray-900 dark:text-white font-extrabold text-xs tracking-wider uppercase select-none mr-2">
                      SignUp
                    </span>
                    <div className="w-5 h-5 rounded-full bg-gray-100/90 dark:bg-white/10 border border-gray-200/80 dark:border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-gray-200 dark:group-hover:bg-white/20 group-hover:border-gray-300 dark:group-hover:border-white/30 shadow-[0_0_4px_rgba(0,230,118,0.18)]">
                      <ArrowRight className="w-3 h-3 text-gray-800 dark:text-white transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </motion.button>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default VisualizationPage;
