// pre web-worker
// import { useState, useRef, useMemo } from "react";
// import { motion } from "framer-motion";
import { useState, useRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import useVideoWorker from "../hooks/useVideoWorker";
import { Play, Pause, Monitor, ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";

// Showcase videos from Videos component
const showcaseVideos = [
  {
    id: 4,
    category: "railway",
    title: "Track Section - Interchange Points",
    url: "https://3dbharat.com/storage/videos/track_section-intercheniging_point_&_cant_angle.mp4",
  },
  {
    id: 5,
    category: "railway",
    title: "Electrical Section - OHE Measurements",
    url: "https://3dbharat.com/storage/videos/railway_section-ohe_pole_&_wire_measurements.mp4",
  },
  {
    id: 6,
    category: "railway",
    title: "Station & Footover Bridge",
    url: "https://3dbharat.com/storage/videos/construction_&_infrastructure_section-platform_measurement.mp4",
  },
  {
    id: 7,
    category: "bridge",
    title: "Bridge Section - Full Measurements",
    url: "https://3dbharat.com/storage/videos/bridge_section-height,width,length,span,pillar_dimension.mp4",
  },
  {
    id: 8,
    category: "road",
    title: "Road Section - Defect Analysis",
    url: "https://3dbharat.com/storage/videos/road_section-potholes,road_height,width.mp4",
  },
  {
    id: 9,
    category: "road",
    title: "Tollbooth Section",
    url: "https://3dbharat.com/storage/videos/tollbooth_section.mp4",
  },
  {
    id: 1,
    category: "design",
    title: "Road Construction Design",
    url: "https://3dbharat.com/storage/videos/road_construction_design.mp4",
  },
  {
    id: 2,
    category: "material",
    title: "Road Construction Material Filling",
    url: "https://3dbharat.com/storage/videos/road_construction_material_filling.mp4",
  },
  {
    id: 3,
    category: "merger",
    title: "Merger Layer Visualization",
    url: "https://3dbharat.com/storage/videos/merger_layer.mp4",
  },
  {
    id: 21,
    category: "road",
    title: "Rolling GPS Tracking System",
    url: "https://3dbharat.com/storage/videos/Roller_Simulation_Tracking.mp4",
  },
];

// Category color mapping
const getCategoryColor = (category) => {
  const colors = {
    railway: "from-cyan-500 to-sky-500",
    bridge: "from-violet-500 to-purple-500",
    road: "from-lime-500 to-green-500",
    design: "from-pink-500 to-rose-500",
    material: "from-amber-500 to-orange-500",
    merger: "from-emerald-500 to-teal-500",
  };
  return colors[category] || "from-gray-500 to-gray-600";
};

const VideoShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef(null);

  // Select a random showcase video on mount
  const randomVideo = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * showcaseVideos.length);
    return showcaseVideos[randomIndex];
  }, []);

  // Use web worker to fetch the random video in background
  const blobUrls = useVideoWorker([randomVideo.url]);

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Close the showcase
  const handleClose = () => {
    setIsVisible(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 100 }}
      transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
      className="fixed bottom-4 right-4 z-50 hidden md:block"
    >
      <div className="relative group">
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full bg-black/80 hover:bg-red-500 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all shadow-lg"
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>

        {/* Main Container with larger dimensions */}
        <div className="relative w-80 lg:w-96 rounded-2xl overflow-hidden bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/50">
          
          {/* Top Bar - Transparent overlay on video */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/70 via-black/40 to-transparent">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-white/90 truncate max-w-[160px] drop-shadow-lg">
                {randomVideo.title}
              </span>
            </div>
            <div className={`px-2 py-0.5 rounded-md bg-gradient-to-r ${getCategoryColor(randomVideo.category)} text-white text-[10px] font-semibold uppercase shadow-md`}>
              {randomVideo.category}
            </div>
          </div>

          {/* Video Container - Larger aspect ratio */}
          <div className="relative" style={{ aspectRatio: '16/10' }}>
            {/*
              // pre web-worker
              <video
                ref={videoRef}
                src={randomVideo.url}
                autoPlay
                muted
                loop
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover"
              />
            */}
            <video
              ref={videoRef}
              src={blobUrls[randomVideo.url] || randomVideo.url}
              autoPlay
              muted
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />
            
            {/* Play/Pause Overlay - Visible on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-xl"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </motion.button>
            </div>

            {/* MTSS Logo Watermark */}
            <div className="absolute bottom-12 right-3 z-10">
              <img
                src="/images/mtss_logo_2.png"
                alt="MTSS Logo"
                className="w-12 h-auto opacity-60"
                style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))' }}
              />
            </div>
          </div>

          {/* Bottom Controls - Transparent overlay on video */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-green-400' : 'bg-amber-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="text-[11px] text-white/80 font-medium drop-shadow-lg">
                {isPlaying ? 'Live Preview' : 'Paused'}
              </span>
            </div>
            
            <Link to="/videos">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-semibold shadow-lg transition-all"
              >
                <span>See More</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </motion.div>
            </Link>
          </div>

          {/* Glow Effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r ${getCategoryColor(randomVideo.category)} rounded-2xl blur-xl opacity-25 -z-10`} />
        </div>
      </div>
    </motion.div>
  );
};

export default VideoShowcase;
