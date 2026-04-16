// pre web-worker
// import { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import VideoShowcase from "./VideoShowcase";
// import { useRegistrationModal } from "../context/RegistrationModalContext";
// import ModulesShowcase from "./ModulesShowcase";
// import MeasurementStats from "./MeasurementStats";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import VideoShowcase from "./VideoShowcase";
import { useRegistrationModal } from "../context/RegistrationModalContext";
import ModulesShowcase from "./ModulesShowcase";
import MeasurementStats from "./MeasurementStats";
import useVideoWorker from "../hooks/useVideoWorker";

const backgroundVideos = [
  "/video/header-video1.mp4",
  "/video/header-video2.mp4",
];

const Hero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const { openModal } = useRegistrationModal();

  // Load videos in background thread
  const blobUrls = useVideoWorker(backgroundVideos);

  // Handle background video end - switch to next video
  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % backgroundVideos.length);
  };

  // Play the current background video and pause the other
  useEffect(() => {
    if (currentVideoIndex === 0) {
      if (video1Ref.current) {
        video1Ref.current.currentTime = 0;
        video1Ref.current.play().catch(() => {});
      }
      if (video2Ref.current) {
        video2Ref.current.pause();
      }
    } else {
      if (video2Ref.current) {
        video2Ref.current.currentTime = 0;
        video2Ref.current.play().catch(() => {});
      }
      if (video1Ref.current) {
        video1Ref.current.pause();
      }
    }
  }, [currentVideoIndex]);

  // Preload background video 2 on mount
  useEffect(() => {
    if (video2Ref.current) {
      video2Ref.current.load();
    }
  }, []);

  return (
    <section
      id="home"
      className="relative pt-24 min-h-screen flex items-center justify-center overflow-hidden bg-stone-200 dark:bg-black transition-colors duration-300"
    >
      {/* Video Background - Dual video crossfade for smooth transitions */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Video 1 - Primary video with auto preload for LCP */}
        {/*
          // pre web-worker
          <video
            ref={video1Ref}
            src={backgroundVideos[0]}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnd}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentVideoIndex === 0 ? 1 : 0 }}
          />
        */}
        <video
          ref={video1Ref}
          src={blobUrls[backgroundVideos[0]] || ""}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: currentVideoIndex === 0 && blobUrls[backgroundVideos[0]] ? 1 : 0 }}
        />
        {/* Video 2 - Secondary video with metadata preload */}
        {/*
          // pre web-worker
          <video
            ref={video2Ref}
            src={backgroundVideos[1]}
            muted
            playsInline
            preload="metadata"
            onEnded={handleVideoEnd}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentVideoIndex === 1 ? 1 : 0 }}
          />
        */}
        <video
          ref={video2Ref}
          src={blobUrls[backgroundVideos[1]] || ""}
          muted
          playsInline
          preload="metadata"
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: currentVideoIndex === 1 && blobUrls[backgroundVideos[1]] ? 1 : 0 }}
        />
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/60" />
      </div>

      {/* Gradient overlays - dark for video readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-5 md:gap-3 px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500/80 via-orange-500/80 to-red-500/80 border-2 border-white/40 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.5)] ">
            <span className="text-white text-xl md:text-2xl font-bold tracking-wider uppercase drop-shadow-lg">
              To Achieve
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              Precise Work
            </span>
            <span className="block text-white drop-shadow-lg">
              Progress Monitoring
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 md:mb-5 leading-relaxed tracking-wide"
        >
          A unified digital platform for planning, measurement, execution, and
          periodic monitoring of all construction projects across India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="/#features"
            className="btn-primary px-8 flex justify-center items-center rounded-xl font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Platform{" "}
          </motion.a>
          <motion.a
            href="#challenges"
            className="px-8 py-3 border border-white/50 text-white rounded-xl font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.a>
           {/* ── Modules Button ── */}
  <ModulesShowcase />


        </motion.div>

        {/* ── Measurement Stats Section ── */}
        <MeasurementStats />
      </div>

      {/* Video Showcase - Fixed Position Component */}
      <VideoShowcase />
    </section>
  );
};

export default Hero;
