import { motion } from "framer-motion";
import {
  Train,
  Building2,
  Route,
  Ruler,
  ArrowUpDown,
  ArrowLeftRight,
  Gauge,
  Box,
  Columns,
} from "lucide-react";

const MeasurementHeader = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-[85vh] overflow-hidden"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://www.shutterstock.com/image-photo/hightech-environment-featuring-hand-interacting-600nw-2591732581.jpg" 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
      </div>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-gray-500/15 via-gray-600/10 via-50% to-gray-500/15 rounded-full blur-3xl opacity-40"
        />
      </div>

      {/* Floating Measurement Icons */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {[Ruler, ArrowUpDown, ArrowLeftRight, Gauge, Box, Columns].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${15 + (index * 14)}%`,
              top: `${20 + Math.sin(index * 1.5) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              delay: index * 0.3,
              ease: "easeInOut",
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-500/20 dark:border-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6 text-gray-300 dark:text-gray-200" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center py-28 px-4">
        {/* Precision Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-gradient-to-r from-gray-700/20 to-gray-800/20 border border-gray-500/30 backdrop-blur-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <span className="absolute inset-0 w-3 h-3 rounded-full bg-white/60 blur-sm" />
            <span className="relative block w-3 h-3 rounded-full bg-white" />
          </motion.div>
          <span className="text-sm font-medium text-gray-200 uppercase tracking-widest">
            Precision Engineering
          </span>
          <div className="w-px h-4 bg-gray-500 dark:bg-white/30" />
          <span className="text-xs font-medium text-gray-400 dark:text-gray-300">±0.001mm Accuracy</span>
        </motion.div>

        {/* Main Title with Animated Highlight */}
        <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          <span className="relative inline-block">
            <span className="relative z-10 text-white drop-shadow-sm">
              Measurement
            </span>
            <motion.span 
              className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-gray-400/30 to-gray-500/30 blur-xl"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </span>
          <br />
          <span className="text-gray-300 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)] dark:drop-shadow-none">Analytics Hub</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
          Advanced 3D measurement capabilities delivering 
          <span className="text-white dark:text-white font-semibold underline decoration-gray-400/50 underline-offset-4"> sub-millimeter precision </span> 
          for Railway, Bridge, and Road infrastructure analysis.
        </motion.p>

        {/* Interactive Elements Row */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6">
          {/* Technology Tags */}
          <div className="flex gap-2">
            {["LiDAR", "Point Cloud", "3D Scanning"].map((tech) => (
              <span key={tech} className="px-3 py-1.5 text-xs font-semibold text-gray-300 dark:text-gray-400 bg-gray-800/50 dark:bg-white/5 rounded-lg border border-gray-600/30 dark:border-white/10 hover:border-gray-400 hover:text-white transition-all cursor-default shadow-sm">
                {tech}
              </span>
            ))}
          </div>
          
          <div className="w-px h-6 bg-white/30 dark:bg-white/10 hidden md:block" />
          
          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-gray-300 dark:text-gray-500 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated: Jan 2026</span>
          </div>
        </motion.div>
      </div>

      {/* Creative Bottom Border Structure */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Main Wave Border with Enhanced Visibility */}
        <svg 
          className="w-full h-32" 
          viewBox="0 0 1200 100" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="waveFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="40%" stopColor="#6b7280" stopOpacity="0.1" />
              <stop offset="100%" className="[stop-color:#e7e5e4] dark:[stop-color:#000]" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Wave fill area */}
          <path 
            d="M0,50 Q200,20 400,50 T800,50 T1200,50 L1200,100 L0,100 Z" 
            fill="url(#waveFill)"
          />
          
          {/* Main glowing wave line */}
          <path 
            d="M0,50 Q200,20 400,50 T800,50 T1200,50" 
            fill="none" 
            stroke="url(#waveGradient)" 
            strokeWidth="3"
            filter="url(#glow)"
          />
          
          {/* Measurement tick marks */}
          {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200].map((x, i) => (
            <g key={i}>
              <line 
                x1={x} y1="50" x2={x} y2={i % 2 === 0 ? "65" : "58"} 
                stroke="#9ca3af" 
                strokeWidth={i % 2 === 0 ? "2" : "1"}
                opacity="0.7"
              />
              {i % 2 === 0 && (
                <circle cx={x} cy="50" r="4" fill="#ffffff" filter="url(#glow)" />
              )}
            </g>
          ))}
        </svg>

        {/* Floating Category Icons - More Prominent */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-24 md:gap-40">
          {[Train, Building2, Route].map((Icon, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
              className="relative group"
            >
              {/* Glow effect behind icon */}
              <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
              
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
                className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-2xl shadow-gray-700/50 border border-gray-500/30"
              >
                <Icon className="w-7 h-7 text-white" />
              </motion.div>
              
              {/* Connecting line to wave */}
              <motion.div 
                className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-gray-400 to-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MeasurementHeader;
