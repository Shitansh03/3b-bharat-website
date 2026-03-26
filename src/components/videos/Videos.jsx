import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  X,
  Palette,
  Hammer,
  Layers,
  Train,
  Building2,
  Route,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  SkipBack,
  SkipForward,
  Navigation,
} from "lucide-react";
import VideosHeader from "./VideosHeader";

const Videos = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoDurations, setVideoDurations] = useState({});
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const progressBarRef = useRef(null);

  // Format time helper function
  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  // Handle video metadata loaded (for modal)
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle card video metadata loaded (for duration display)
  const handleCardMetadataLoaded = (videoId, videoElement) => {
    if (
      videoElement &&
      videoElement.duration &&
      !isNaN(videoElement.duration)
    ) {
      setVideoDurations((prev) => ({
        ...prev,
        [videoId]: formatTime(videoElement.duration),
      }));
    }
  };

  // Handle progress bar click to seek
  const handleProgressClick = (e) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };

  // Video data organized by categories
  // Sequence: Railway (2D then 3D) → Bridge → Road → Design → Material → Merger
  const videos = [
    // Railway 3D Videos
    {
      id: 4,
      category: "railway",
      subCategory: "3d",
      title: "Track Section - Interchange Points",
      description:
        "3D visualization of track switching point angles and defect detection analysis",
      url: "https://3dbharat.com/storage/videos/track_section-intercheniging_point_&_cant_angle.mp4",
      duration: "5:10",
    },
    {
      id: 5,
      category: "railway",
      subCategory: "3d",
      title: "Electrical Section - OHE Measurements",
      description:
        "3D overhead electrical equipment mask measurements and wire analysis",
      url: "https://3dbharat.com/storage/videos/railway_section-ohe_pole_&_wire_measurements.mp4",
      duration: "4:35",
    },
    {
      id: 6,
      category: "railway",
      subCategory: "3d",
      title: "Station & Footover Bridge",
      description:
        "analysis of railway station and footover bridge infrastructure",
      url: "https://3dbharat.com/storage/videos/construction_&_infrastructure_section-platform_measurement.mp4",
      duration: "6:15",
    },
    {
      id: 18,
      category: "railway",
      subCategory: "3d",
      title: "Construction & Infrastructure - Station",
      description:
        "3D visualization of station and footover bridge construction infrastructure",
      url: "https://3dbharat.com/storage/videos/construction_and_infrastructure_section_-station&_footover_bridge.mp4",
      duration: "5:00",
    },
    {
      id: 19,
      category: "railway",
      subCategory: "3d",
      title: "Electrical Section - OHE Mask",
      description:
        "3D overhead electrical equipment mask measurements and analysis",
      url: "https://3dbharat.com/storage/videos/electrical_section-ohe_mask_measurements.mp4",
      duration: "4:30",
    },
    {
      id: 20,
      category: "railway",
      subCategory: "3d",
      title: "Track Section - Angle of Defect",
      description:
        "3D analysis of interchange points and angle of defect detection",
      url: "https://3dbharat.com/storage/videos/track_section-interchenging_points_angle_of_defect.mp4",
      duration: "4:45",
    },
    // Bridge Videos
    {
      id: 7,
      category: "bridge",
      title: "Bridge Section - Full Measurements",
      description:
        "Height, width, length, span, and pillar dimension measurements",
      url: "https://3dbharat.com/storage/videos/bridge_section-height,width,length,span,pillar_dimension.mp4",
      duration: "5:40",
    },
    {
      id: 22,
      category: "bridge",
      title: "Bridge Inspection & Mapping",
      description:
        "Comprehensive bridge inspection and 3D measurement workflow — span, piller, and deck analysis with point-cloud based mapping.",
      url: "https://3dbharat.miscos.in/storage/videos/Bridge_Video.mp4",
      duration: "4:20",
    },
    // Road Videos
    {
      id: 8,
      category: "road",
      title: "Road Section - Defect Analysis",
      description:
        "Pothole detection, road height, and width measurement analysis",
      url: "https://3dbharat.com/storage/videos/road_section-potholes,road_height,width.mp4",
      duration: "4:50",
    },
    {
      id: 23,
      category: "road",
      title: "Road Asset Mapping",
      description:
        "Asset mapping for road infrastructure — signage, markings and asset mapping street light signal pole on lane.",
      url: "https://3dbharat.miscos.in/storage/videos/Asset_Mapping_Video.mp4",
      duration: "3:50",
    },
    {
      id: 9,
      category: "road",
      title: "Tollbooth Section",
      description:
        "Complete tollbooth infrastructure and lane measurement analysis",
      url: "https://3dbharat.com/storage/videos/tollbooth_section.mp4",
      duration: "3:25",
    },
    // Design Videos
    {
      id: 1,
      category: "design",
      title: "Road Construction Design",
      description:
        "Complete 3D visualization of road construction design process and layer planning",
      url: "https://3dbharat.com/storage/videos/road_construction_design.mp4",
      duration: "3:45",
    },
    // Material Videos
    {
      id: 2,
      category: "material",
      title: "Road Construction Material Filling",
      description:
        "Detailed analysis of material filling layers and volume calculations",
      url: "https://3dbharat.com/storage/videos/road_construction_material_filling.mp4",
      duration: "4:20",
    },
    // Merger Videos
    {
      id: 3,
      category: "merger",
      title: "Merger Layer Visualization",
      description:
        "Multi-layer merging and integration for unified 3D infrastructure view",
      url: "https://3dbharat.com/storage/videos/merger_layer.mp4",
      duration: "2:55",
    },
    // Tracking Videos
    {
      id: 21,
      category: "road",
      title: "Rolling GPS Tracking System",
      description:
        "Roller simulation tracking with real-time GPS positioning and movement analysis",
      url: "https://3dbharat.com/storage/videos/Roller_Simulation_Tracking.mp4",
      duration: "3:00",
    },
    // Metro Videos
    {
      id: 24,
      category: "metro",
      title: "Metro Bridge Video",
      description:
        "3D visualization and measurement analysis of metro bridge infrastructure, structural dimensions, and span details",
      url: "https://3dbharat.miscos.in/storage/videos/Metro_Bridge_Video_2.mp4",
      duration: "4:00",
    },
  ];

  const categories = [
    {
      id: "all",
      label: "All Videos",
      icon: Play,
      count: videos.length,
      color: "from-gray-500 to-gray-600",
    },
    {
      id: "railway",
      label: "Railway",
      icon: Train,
      count: videos.filter((v) => v.category === "railway").length,
      color: "from-cyan-500 to-sky-500",
    },
    {
      id: "bridge",
      label: "Bridge",
      icon: Building2,
      count: videos.filter((v) => v.category === "bridge").length,
      color: "from-violet-500 to-purple-500",
    },
    {
      id: "road",
      label: "Road",
      icon: Route,
      count: videos.filter((v) => v.category === "road").length,
      color: "from-lime-500 to-green-500",
    },
    {
      id: "design",
      label: "Design",
      icon: Palette,
      count: videos.filter((v) => v.category === "design").length,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "material",
      label: "Material",
      icon: Hammer,
      count: videos.filter((v) => v.category === "material").length,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "merger",
      label: "Merger Layer",
      icon: Layers,
      count: videos.filter((v) => v.category === "merger").length,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "metro",
      label: "Metro",
      icon: Navigation,
      count: videos.filter((v) => v.category === "metro").length,
      color: "from-blue-500 to-indigo-500",
    },
  ];

  const filteredVideos =
    activeCategory === "all"
      ? videos
      : videos.filter((v) => v.category === activeCategory);

  const getCategoryColor = (categoryId) => {
    return (
      categories.find((c) => c.id === categoryId)?.color ||
      "from-gray-500 to-gray-600"
    );
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current
          .requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
          })
          .catch((err) => console.log(err));
      } else {
        document
          .exitFullscreen()
          .then(() => {
            setIsFullscreen(false);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10,
      );
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10,
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="min-h-screen">
      {/* Hero Header */}
      <VideosHeader />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-purple-500/25`
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              <span>{cat.label}</span>
              <span
                className={`px-2 py-0.5 rounded-lg text-xs ${activeCategory === cat.id ? "bg-white/20" : "bg-black/5 dark:bg-white/10"}`}
              >
                {cat.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Video Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => handleVideoClick(video)}
                className="group relative bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 cursor-pointer border border-gray-200 dark:border-white/10"
              >
                {/* Video Preview Container */}
                <div className="relative aspect-video overflow-hidden">
                  <video
                    src={video.url}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    muted
                    preload="metadata"
                    playsInline
                    onLoadedMetadata={(e) =>
                      handleCardMetadataLoaded(video.id, e.target)
                    }
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Company Logo Watermark - Small Size for Cards */}
                  <div className="absolute bottom-2 right-2 z-10">
                    <img
                      src="/images/mtss_logo_2.png"
                      alt="MTSS Logo"
                      className="w-12 h-auto opacity-80 drop-shadow-lg"
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                      }}
                    />
                  </div>

                  {/* Play Button */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${getCategoryColor(video.category)} flex items-center justify-center shadow-2xl shadow-black/30 group-hover:shadow-purple-500/40 transition-all`}
                    >
                      <Play className="w-7 h-7 text-white ml-1" fill="white" />
                    </motion.div>
                  </motion.div>

                  {/* Duration Badge - Uses real duration if available, falls back to static */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-semibold backdrop-blur-sm">
                    {videoDurations[video.id] || video.duration}
                  </div>

                  {/* Category Badge */}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-gradient-to-r ${getCategoryColor(video.category)} text-white text-xs font-semibold shadow-lg capitalize`}
                  >
                    {video.category === "merger"
                      ? "Merger Layer"
                      : video.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {video.description}
                  </p>
                </div>

                {/* Bottom Glow Effect */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryColor(video.category)} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No videos found in this category.
            </p>
          </motion.div>
        )}
      </div>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-6"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-5xl max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={closeModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-14 right-0 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-20"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Video Player Container */}
              <div
                ref={videoContainerRef}
                className={`relative rounded-2xl overflow-hidden bg-black shadow-2xl ${isFullscreen ? "flex items-center justify-center" : ""}`}
              >
                <video
                  ref={videoRef}
                  src={selectedVideo.url}
                  className={`w-full object-contain ${isFullscreen ? "max-h-screen" : "max-h-[60vh]"}`}
                  onClick={togglePlay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  controlsList="nodownload"
                />

                {/* Company Logo Watermark - Responsive sizing for modal and fullscreen */}
                <div
                  className={`absolute z-10 pointer-events-none ${isFullscreen ? "bottom-28 right-6" : "bottom-24 right-4"}`}
                >
                  <img
                    src="/images/mtss_logo_2.png"
                    alt="MTSS Logo"
                    className={`h-auto opacity-75 ${isFullscreen ? "w-32 md:w-40" : "w-20 md:w-24"}`}
                    style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}
                  />
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  {/* Progress Bar */}
                  <div
                    ref={progressBarRef}
                    className="w-full h-2 bg-white/20 rounded-full mb-4 cursor-pointer group/progress"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative transition-all"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Time Display and Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={skipBackward}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                        title="Skip back 10s"
                      >
                        <SkipBack className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={skipForward}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                        title="Skip forward 10s"
                      >
                        <SkipForward className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleMute}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </motion.button>

                      {/* Time Display */}
                      <div className="ml-3 text-white text-sm font-medium tabular-nums">
                        <span>{formatTime(currentTime)}</span>
                        <span className="text-white/50 mx-1">/</span>
                        <span className="text-white/70">
                          {formatTime(duration)}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleFullscreen}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Play Button Overlay (when paused) */}
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={togglePlay}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-20 h-20 rounded-full bg-gradient-to-r ${getCategoryColor(selectedVideo.category)} flex items-center justify-center shadow-2xl`}
                    >
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Video Info */}
              <div className="mt-4 text-center">
                <div
                  className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${getCategoryColor(selectedVideo.category)} text-white text-xs font-semibold mb-2 capitalize`}
                >
                  {selectedVideo.category === "merger"
                    ? "Merger Layer"
                    : selectedVideo.category}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {selectedVideo.title}
                </h3>
                <p className="text-gray-400 text-sm max-w-xl mx-auto line-clamp-2">
                  {selectedVideo.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Videos;
