import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Train,
  Building2,
  Route,
  Zap,
  Gauge,
  Building,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Ruler,
  ArrowUpDown,
  ArrowLeftRight,
  Columns,
  Box,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import MeasurementHeader from "./MeasurementHeader";

const Measurement = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(
    ["railway", "bridge", "road"].includes(categoryParam)
      ? categoryParam
      : "railway",
  );
  const [activeRailwayTab, setActiveRailwayTab] = useState("ohe");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [bridgeSlideIndex, setBridgeSlideIndex] = useState(0);
  const [railwaySlideIndex, setRailwaySlideIndex] = useState(0);
  const [roadSlideIndex, setRoadSlideIndex] = useState(0);

  // Railway OHE Mast images
  const oheImages = [
    {
      src: "/measurenment/Railway/Ohe pole Measurements.png",
      title: "OHE Pole Measurements",
      description:
        "Complete height and angle measurements of OHE mask measurement",
      icon: Zap,
    },
    {
      src: "/measurenment/Railway/Catenary to rail.png",
      title: "Catenary to Rail",
      description: "Vertical distance from catenary wire to track",
      icon: ArrowUpDown,
    },
    {
      src: "/measurenment/Railway/Contact to rail.png",
      title: "Contact to Rail",
      description: "Contact wire height above rail level",
      icon: ArrowUpDown,
    },
    {
      src: "/measurenment/Railway/Catenary_to_contact.png",
      title: "Catenary to Contact",
      description: "Distance between catenary and contact wire",
      icon: Ruler,
    },
  ];

  // Railway Track images
  const trackImages = [
    {
      src: "/measurenment/Railway/Interchenging point.png",
      title: "Interchanging Point",
      description: "Track switching point angle measurement",
      icon: Gauge,
    },
    {
      src: "/measurenment/Railway/defect angle on cant road.png",
      title: "Cant Angle Defect",
      description: "Track curving and cant angle analysis",
      icon: AlertTriangle,
    },
    {
      src: "/measurenment/Railway/Distance_btn_2_tracks.png",
      title: "Distance Between Tracks",
      description: "Precise measurement between parallel tracks",
      icon: ArrowLeftRight,
    },
  ];

  // Railway Station images
  const stationImages = [
    {
      src: "/measurenment/Railway/footover bridge height.png",
      title: "Footover Bridge Height",
      description: "Vertical clearance measurement",
      icon: ArrowUpDown,
    },
    {
      src: "/measurenment/Railway/Footover bridge width.png",
      title: "Footover Bridge Width",
      description: "Bridge span and width dimensions",
      icon: ArrowLeftRight,
    },
    {
      src: "/measurenment/Railway/Footover bridge area and volume.png",
      title: "Bridge Area & Volume",
      description: "Complete volumetric analysis",
      icon: Box,
    },
    {
      src: "/measurenment/Railway/u shape pole measurements.png",
      title: "U-Shape OHE Pole",
      description: "Special pole structure dimensions",
      icon: Columns,
    },
    {
      src: "/measurenment/Railway/platform measurements.png",
      title: "Platform Measurements",
      description: "Complete platform dimension analysis",
      icon: Ruler,
    },
    {
      src: "/measurenment/Railway/platform track distance.png",
      title: "Platform to Track",
      description: "Safety gap measurement",
      icon: ArrowLeftRight,
    },
    {
      src: "/measurenment/Railway/platform wall measurements.png",
      title: "Platform Wall",
      description: "Wall height and thickness analysis",
      icon: Building,
    },
  ];

  // Bridge images
  const bridgeImages = [
    {
      src: "/measurenment/Bridge/Bridge Height.png",
      title: "Bridge Height",
      description: "Vertical clearance and structural height",
      icon: ArrowUpDown,
    },
    {
      src: "/measurenment/Bridge/Bridge Width.png",
      title: "Bridge Width",
      description: "Total deck width measurement",
      icon: ArrowLeftRight,
    },
    {
      src: "/measurenment/Bridge/Bridge Length.png",
      title: "Bridge Length",
      description: "Total span length",
      icon: Ruler,
    },
    {
      src: "/measurenment/Bridge/Span between pillars.png",
      title: "Pillar Span",
      description: "Distance between supporting pillars",
      icon: Columns,
    },
    {
      src: "/measurenment/Bridge/Bridge Pillar Measurements.png",
      title: "Pillar Dimensions",
      description: "Complete pillar measurements including volume",
      icon: Box,
    },
  ];

  // Road images
  const roadImages = [
    {
      src: "/measurenment/Road/Road Length.png",
      title: "Road Length",
      description: "Total road stretch measurement",
      icon: Ruler,
    },
    {
      src: "/measurenment/Road/Road Width.png",
      title: "Road Width",
      description: "Carriageway width analysis",
      icon: ArrowLeftRight,
    },
    {
      src: "/measurenment/Road/pothole.png",
      title: "Pothole Analysis",
      description: "Defect detection and measurement",
      icon: AlertTriangle,
    },
    {
      src: "/measurenment/Road/Street light Pole height.png",
      title: "Street Light Pole",
      description: "Pole height for filling material calculation",
      icon: Lightbulb,
    },
  ];

  // Auto-cycle bridge images
  useEffect(() => {
    if (activeCategory !== "bridge") return;
    const interval = setInterval(() => {
      setBridgeSlideIndex((prev) => (prev + 1) % bridgeImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeCategory, bridgeImages.length]);

  const categories = [
    { id: "railway", label: "Railway", icon: Train, count: 14 },
    { id: "bridge", label: "Bridge", icon: Building2, count: 5 },
    { id: "road", label: "Road", icon: Route, count: 4 },
  ];

  const railwayTabs = [
    { id: "ohe", label: "OHE Mask measurement", count: 4 },
    { id: "track", label: "Track", count: 3 },
    { id: "station", label: "Station", count: 7 },
  ];

  const getCurrentRailwayImages = () => {
    switch (activeRailwayTab) {
      case "ohe":
        return oheImages;
      case "track":
        return trackImages;
      case "station":
        return stationImages;
      default:
        return oheImages;
    }
  };

  // Auto-cycle railway images based on active tab
  const currentRailwayImages = getCurrentRailwayImages();
  useEffect(() => {
    if (activeCategory !== "railway") return;
    const interval = setInterval(() => {
      setRailwaySlideIndex((prev) => (prev + 1) % currentRailwayImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeCategory, activeRailwayTab, currentRailwayImages.length]);

  // Reset railway slide index when tab changes
  useEffect(() => {
    setRailwaySlideIndex(0);
  }, [activeRailwayTab]);

  // Auto-cycle road images
  useEffect(() => {
    if (activeCategory !== "road") return;
    const interval = setInterval(() => {
      setRoadSlideIndex((prev) => (prev + 1) % roadImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeCategory, roadImages.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="">
      {/* Hero Section - Separate Component */}
      <MeasurementHeader />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 -translate-y-1"
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:-translate-y-0.5"
              }`}
            >
              <cat.icon className="w-5 h-5" />
              <span>{cat.label}</span>
              <span
                className={`px-2 py-0.5 rounded-lg text-xs ${activeCategory === cat.id ? "bg-white/20" : "bg-black/5 dark:bg-white/10"}`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {/* Railway Section */}
          {activeCategory === "railway" && (
            <motion.div
              key="railway"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Railway Sub-tabs */}
              <div className="flex justify-center gap-2 mb-8">
                {railwayTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRailwayTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                      activeRailwayTab === tab.id
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : "text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${activeRailwayTab === tab.id ? "bg-white/20 dark:bg-black/10" : "bg-black/5 dark:bg-white/10"}`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Railway Slider UI (same as Bridge) */}
              <div className="flex flex-col gap-6">
                {/* Main Featured Image */}
                <div className="relative rounded-3xl overflow-hidden lg:h-[80vh] bg-black aspect-video">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${activeRailwayTab}-${railwaySlideIndex}`}
                      src={currentRailwayImages[railwaySlideIndex]?.src}
                      alt={currentRailwayImages[railwaySlideIndex]?.title}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      onClick={() =>
                        setLightboxImage(
                          currentRailwayImages[railwaySlideIndex],
                        )
                      }
                      className="w-full h-full  object-cover cursor-pointer"
                    />
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <button
                    onClick={() =>
                      setRailwaySlideIndex(
                        (prev) =>
                          (prev - 1 + currentRailwayImages.length) %
                          currentRailwayImages.length,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-900 shadow-lg transition-all hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setRailwaySlideIndex(
                        (prev) => (prev + 1) % currentRailwayImages.length,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-900 shadow-lg transition-all hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      {(() => {
                        const Icon =
                          currentRailwayImages[railwaySlideIndex]?.icon;
                        return Icon ? <Icon className="w-6 h-6" /> : null;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        {currentRailwayImages[railwaySlideIndex]?.title}
                      </h3>
                      <p className="text-white/70">
                        {currentRailwayImages[railwaySlideIndex]?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {currentRailwayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setRailwaySlideIndex(index)}
                      className={`flex-shrink-0 w-36 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 ${
                        railwaySlideIndex === index
                          ? "border-blue-500 shadow-lg shadow-blue-500/40"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-2 bg-black/80 text-white text-xs font-medium text-center truncate">
                        {image.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Bridge Section */}
          {activeCategory === "bridge" && (
            <motion.div
              key="bridge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col gap-6">
                {/* Main Featured Image */}
                <div className="relative rounded-3xl overflow-hidden lg:h-[80vh] bg-black aspect-video">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={bridgeSlideIndex}
                      src={bridgeImages[bridgeSlideIndex].src}
                      alt={bridgeImages[bridgeSlideIndex].title}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      onClick={() =>
                        setLightboxImage(bridgeImages[bridgeSlideIndex])
                      }
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <button
                    onClick={() =>
                      setBridgeSlideIndex(
                        (prev) =>
                          (prev - 1 + bridgeImages.length) %
                          bridgeImages.length,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-900 shadow-lg transition-all hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setBridgeSlideIndex(
                        (prev) => (prev + 1) % bridgeImages.length,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-900 shadow-lg transition-all hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      {(() => {
                        const Icon = bridgeImages[bridgeSlideIndex].icon;
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        {bridgeImages[bridgeSlideIndex].title}
                      </h3>
                      <p className="text-white/70">
                        {bridgeImages[bridgeSlideIndex].description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {bridgeImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setBridgeSlideIndex(index)}
                      className={`flex-shrink-0 w-36 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 ${
                        bridgeSlideIndex === index
                          ? "border-blue-500 shadow-lg shadow-blue-500/40"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-2 bg-black/80 text-white text-xs font-medium text-center truncate">
                        {image.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Road Section */}
          {activeCategory === "road" && (
            <motion.div
              key="road"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col gap-6">
                {/* Main Featured Image */}
                <div className="relative rounded-3xl overflow-hidden lg:h-[80vh] bg-black aspect-video">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={roadSlideIndex}
                      src={roadImages[roadSlideIndex].src}
                      alt={roadImages[roadSlideIndex].title}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      onClick={() =>
                        setLightboxImage(roadImages[roadSlideIndex])
                      }
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <button
                    onClick={() =>
                      setRoadSlideIndex(
                        (prev) =>
                          (prev - 1 + roadImages.length) % roadImages.length,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-900 shadow-lg transition-all hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setRoadSlideIndex(
                        (prev) => (prev + 1) % roadImages.length,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-900 shadow-lg transition-all hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      {(() => {
                        const Icon = roadImages[roadSlideIndex].icon;
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        {roadImages[roadSlideIndex].title}
                      </h3>
                      <p className="text-white/70">
                        {roadImages[roadSlideIndex].description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {roadImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setRoadSlideIndex(index)}
                      className={`flex-shrink-0 w-36 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 ${
                        roadSlideIndex === index
                          ? "border-blue-500 shadow-lg shadow-blue-500/40"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-2 bg-black/80 text-white text-xs font-medium text-center truncate">
                        {image.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-8"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-w-full max-h-[80vh] rounded-2xl object-contain"
              />
              <div className="text-center mt-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {lightboxImage.title}
                </h3>
                <p className="text-white/70">{lightboxImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Measurement;
