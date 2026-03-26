import { motion } from "framer-motion";
import {
  Play,
  Film,
  Clapperboard,
  Video,
  Layers,
  Palette,
  Hammer,
  Train,
  Building2,
  Route,
} from "lucide-react";

const VideosHeader = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const categoryIcons = [Palette, Hammer, Layers, Train, Building2, Route];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-[85vh] overflow-hidden"
    >
      {/* Background Video/Image Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Rotating Gradient Orb */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-conic from-gray-500/15 via-gray-600/10 via-50% to-gray-500/15 rounded-full blur-3xl opacity-40"
        />
        
        {/* Secondary Orb */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-gray-400/15 via-gray-500/10 via-50% to-gray-400/15 rounded-full blur-3xl opacity-30"
        />
      </div>

      {/* Floating Video/Play Icons */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {[Play, Film, Clapperboard, Video, Play, Film].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${12 + (index * 15)}%`,
              top: `${18 + Math.sin(index * 1.2) * 28}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 8, -8, 0],
              opacity: [0.25, 0.55, 0.25],
            }}
            transition={{
              duration: 5 + index * 0.6,
              repeat: Infinity,
              delay: index * 0.4,
              ease: "easeInOut",
            }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-500/20 dark:border-white/15 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Icon className="w-7 h-7 text-gray-300 dark:text-gray-200" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center py-32 px-4">
        {/* Video Hub Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-gradient-to-r from-gray-700/20 to-gray-800/20 border border-gray-500/30 backdrop-blur-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <span className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-white/60 blur-sm" />
            <span className="relative block w-3.5 h-3.5 rounded-full bg-white" />
          </motion.div>
          <span className="text-sm font-medium text-gray-200 uppercase tracking-widest">
            Video Gallery
          </span>
          <div className="w-px h-4 bg-white/30" />
          <span className="text-xs font-medium text-gray-400">9 Videos • 6 Categories</span>
        </motion.div>

        {/* Main Title with Animated Highlight */}
        <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          <span className="relative inline-block">
            <span className="relative z-10 text-white drop-shadow-sm">
              Infrastructure
            </span>
            <motion.span 
              className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-gray-400/30 to-gray-500/30 blur-xl"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </span>
          <br />
          <span className="text-gray-300 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)] dark:drop-shadow-none">Video Showcase</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
          Explore detailed video demonstrations of 
          <span className="text-white font-semibold underline decoration-gray-400/50 underline-offset-4"> 3D analysis </span> 
          showcasing Design, Material, Merger Layer, and complete infrastructure workflows.
        </motion.p>

        {/* Category Preview Tags */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
          {[
            { name: "Design", icon: Palette },
            { name: "Material", icon: Hammer },
            { name: "Merger Layer", icon: Layers },
            { name: "Railway", icon: Train },
            { name: "Bridge", icon: Building2 },
            { name: "Road", icon: Route },
          ].map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/80 border border-gray-600/50 text-gray-200 text-sm font-semibold shadow-lg cursor-default hover:bg-gray-700/80 hover:border-gray-500/50 transition-colors"
            >
              <cat.icon className="w-4 h-4 text-gray-300" />
              {cat.name}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Creative Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg 
          className="w-full h-32" 
          viewBox="0 0 1200 100" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="videoWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="videoWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="40%" stopColor="#6b7280" stopOpacity="0.1" />
              <stop offset="100%" className="[stop-color:#e7e5e4] dark:[stop-color:#000]" />
            </linearGradient>
            <filter id="videoGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <path 
            d="M0,60 Q300,20 600,60 T1200,60 L1200,100 L0,100 Z" 
            fill="url(#videoWaveFill)"
          />
          
          <path 
            d="M0,60 Q300,20 600,60 T1200,60" 
            fill="none" 
            stroke="url(#videoWaveGradient)" 
            strokeWidth="3"
            filter="url(#videoGlow)"
          />
          
          {[0, 150, 300, 450, 600, 750, 900, 1050, 1200].map((x, i) => (
            <g key={i}>
              <circle 
                cx={x} 
                cy={60 + Math.sin(x / 100) * 15} 
                r={i % 2 === 0 ? 5 : 3} 
                fill={i % 2 === 0 ? "#ffffff" : "#9ca3af"} 
                filter="url(#videoGlow)" 
              />
            </g>
          ))}
        </svg>
      </div>
    </motion.div>
  );
};

export default VideosHeader;
