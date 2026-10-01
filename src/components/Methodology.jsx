import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ArrowRight,
  Download,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Maximize2,
  Minimize2,
  GripVertical,
} from "lucide-react";
import { useLoginModal } from "../context/LoginModalContext";
import { useAuth } from "../context/AuthContext";

// The 7 methodology photos
const images = [
  "/intro.png",
  "/1.png",
  "/2.png",
  "/3.png",
  "/4.png",
  "/5.png",
  "/6.png",
  "/7.png",
];

export const DEFAULT_AUTO_PLAY_SECONDS = 10; 

export const IMAGE_PAUSE_TIMES = {
  0: 30, 
  1: 30,
  2: 60, 
  3: 45,
  4: 30, 
  5: 60,
  6: 30, 
  default: 30, 
};

const Methodology = () => {
  const { openModal: openLoginModal } = useLoginModal();
  const { isAuthenticated, user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_AUTO_PLAY_SECONDS);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const slideshowRef = useRef(null);

  // Total duration reference for the circular percentage calculation
  const totalDuration = isPaused
    ? IMAGE_PAUSE_TIMES[currentIndex] || IMAGE_PAUSE_TIMES.default
    : DEFAULT_AUTO_PLAY_SECONDS;

  useEffect(() => {
    document.title = "3D Bharat - To Achieve Precise Work Progress Monitoring";
  }, []);

  // Listen to browser fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (slideshowRef.current?.requestFullscreen) {
        slideshowRef.current.requestFullscreen();
      } else if (slideshowRef.current?.webkitRequestFullscreen) {
        slideshowRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }, []);

  const goToSlide = useCallback((newIndex) => {
    setCurrentIndex(newIndex);
    setIsPaused(false);
    setTimeLeft(DEFAULT_AUTO_PLAY_SECONDS);
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % images.length;
    goToSlide(nextIdx);
  }, [currentIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    goToSlide(prevIdx);
  }, [currentIndex, goToSlide]);

  // Pause / Play toggle handler
  const handleTogglePlayPause = useCallback(() => {
    if (isPaused) {
      // Resume normal automatic play
      setIsPaused(false);
      setTimeLeft(DEFAULT_AUTO_PLAY_SECONDS);
    } else {
      // Enter pause / hold mode with specific duration for this image
      const pauseDuration =
        IMAGE_PAUSE_TIMES[currentIndex] || IMAGE_PAUSE_TIMES.default;
      setIsPaused(true);
      setTimeLeft(pauseDuration);
    }
  }, [isPaused, currentIndex]);

  // Timer countdown effect (Handles both normal 10s auto-play and custom pause duration)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time finished -> move to next slide automatically
          const nextIdx = (currentIndex + 1) % images.length;
          setCurrentIndex(nextIdx);
          setIsPaused(false);
          return DEFAULT_AUTO_PLAY_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Keyboard navigation (Left / Right Arrow keys, Space for pause, F for fullscreen)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        handleTogglePlayPause();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullScreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, handleTogglePlayPause, toggleFullScreen]);

  // Calculate dynamic circular progress and color (Green -> Yellow -> Red)
  const progressRatio = Math.max(0, Math.min(1, timeLeft / totalDuration));
  const strokeCircumference = 138.23;
  const strokeDashoffset = strokeCircumference * (1 - progressRatio);

  // Dynamic color transition from Green (120 deg) to Red (0 deg) based on percentage
  const dynamicHue = Math.round(progressRatio * 120);
  const strokeColor = `hsl(${dynamicHue}, 90%, 48%)`;

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden bg-stone-100 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex flex-col pt-20 pb-2 px-3 sm:px-6">
      <div className="w-full max-w-6xl mx-auto flex-1 min-h-0 flex flex-col justify-between">
        {/* 1. Explore 3D Bharat Header Bar (Clean, Compact, Above Slideshow) */}
        <div className="w-full shrink-0 mb-1.5">
          <div className="w-full flex items-center justify-between gap-2 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl border border-gray-200 dark:border-white/10 py-1.5 px-3 sm:px-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-orange-500 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 shrink-0">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight">
                Explore 3D Bharat
              </h2>
            </div>

            {/* Action Buttons: View Document, Download Brochure, SignUp */}
            <div className="flex items-center gap-2">
              <a
                href="/3D-Bharat-Document.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-xs text-gray-800 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300 dark:border-white/20 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">View Document</span>
                <span className="sm:hidden">View</span>
              </a>

              <a
                href="/3D-Bharat-Document.pdf"
                download="3D-Bharat-Document.pdf"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-semibold text-xs text-white bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:opacity-95 shadow-sm shadow-orange-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download Brochure</span>
                <span className="sm:hidden">Brochure</span>
              </a>

              {/* Compact Glowing SignUp Button */}
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
                  <div className="relative rounded-full px-2 py-0.5 bg-white/90 dark:bg-gradient-to-r dark:from-[#2e1d10]/85 dark:via-[#1c2430]/85 dark:to-[#0f2c1d]/85 backdrop-blur-2xl flex items-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.35)] transition-colors duration-300">
                    <div className="w-4.5 h-4.5 rounded-full bg-gradient-to-br from-[#FF6B00] via-[#FF8500] to-[#00A859] p-0.5 shadow-[0_0_4px_rgba(255,107,0,0.4)] flex items-center justify-center shrink-0">
                      <User className="w-2.5 h-2.5 text-white fill-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]" />
                    </div>
                    <div className="w-[1px] h-3 bg-gray-300 dark:bg-white/20 rounded-full mx-1.5 shrink-0" />
                    <span className="text-gray-900 dark:text-white font-extrabold text-[11px] tracking-wider uppercase select-none mr-1.5">
                      {isAuthenticated ? (user?.user_name ? user.user_name.split(" ")[0] : "Account") : "SignUp"}
                    </span>
                    <div className="w-4.5 h-4.5 rounded-full bg-gray-100/90 dark:bg-white/10 border border-gray-200/80 dark:border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-gray-200 dark:group-hover:bg-white/20 group-hover:border-gray-300 dark:group-hover:border-white/30 shadow-[0_0_4px_rgba(0,230,118,0.18)]">
                      <ArrowRight className="w-2.5 h-2.5 text-gray-800 dark:text-white transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* 2. Main Slideshow Display (Image constrained to exact remaining height) */}
        <div
          ref={slideshowRef}
          className={`relative w-full ${
            isFullScreen
              ? "h-screen w-screen bg-black flex items-center justify-center p-0"
              : "flex-1 min-h-0 w-full flex items-center justify-center bg-black/95 rounded-2xl border border-white/20 dark:border-white/15 shadow-[0_0_30px_rgba(249,115,22,0.18),0_0_40px_rgba(16,185,129,0.18),0_15px_35px_rgba(0,0,0,0.5)]"
          } overflow-hidden select-none group`}
        >
          {/* Subtle Top & Bottom Glowing Laser Accent Lines (Visible only when not in fullscreen) */}
          {!isFullScreen && (
            <>
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/90 to-transparent pointer-events-none z-10 shadow-[0_0_12px_rgba(249,115,22,0.9)]" />
              <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/90 to-transparent pointer-events-none z-10 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
              {/* Corner ambient highlights */}
              <div className="absolute top-0 left-0 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            </>
          )}

          {/* Animated Clean Crossfade Image Slide (Fills container cleanly) */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden p-2">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                alt={`Methodology ${currentIndex + 1}`}
                loading="eager"
              />
            </AnimatePresence>
          </div>

          {/* Top-Right Fullscreen Toggle Button */}
          <button
            onClick={toggleFullScreen}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group"
            title={isFullScreen ? "Exit Fullscreen (Esc or F)" : "Fullscreen (F)"}
            aria-label="Toggle Fullscreen"
          >
            {isFullScreen ? (
              <Minimize2 className="w-5 h-5 group-hover:scale-95 transition-transform text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform text-white" />
            )}
          </button>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group"
            title="Previous (Left Arrow)"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group"
            title="Next (Right Arrow)"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Fullscreen Floating Controls Overlay - Right Side Ultra-Transparent Draggable Glassmorphic Panel */}
          {isFullScreen && (
            <motion.div
              drag
              dragConstraints={slideshowRef}
              dragElastic={0.08}
              dragMomentum={false}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute right-5 sm:right-8 bottom-6 z-30 flex items-center gap-2 bg-black/25 hover:bg-black/40 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20 hover:border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.15)] transition-colors duration-300 cursor-grab active:cursor-grabbing select-none"
              title="Drag to move panel anywhere on screen"
            >
              {/* Drag Grip Handle */}
              <div className="cursor-grab active:cursor-grabbing px-0.5 text-white/30 hover:text-white/60 transition-colors" title="Drag to move">
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              {/* Play / Pause Toggle Button */}
              <button
                onClick={handleTogglePlayPause}
                onPointerDownCapture={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Pause</span>
                  </>
                )}
              </button>

              {/* Circular Timer inside fullscreen (shows when paused) */}
              {isPaused && (
                <div className="flex items-center gap-2 pl-2 border-l border-white/15">
                  <div className="relative w-7 h-7 flex items-center justify-center">
                    <svg className="w-7 h-7 -rotate-90 transform" viewBox="0 0 54 54">
                      <circle cx="27" cy="27" r="22" stroke="currentColor" strokeWidth="4" fill="none" className="text-white/15" />
                      <circle cx="27" cy="27" r="22" stroke={strokeColor} strokeWidth="4" fill="none" strokeDasharray={strokeCircumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
                    </svg>
                    <span className={`absolute font-mono text-[9px] ${timeLeft <= 10 ? "text-red-400 font-extrabold animate-pulse" : "text-white font-bold"}`}>
                      {timeLeft}s
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-gray-300 hidden sm:inline">
                    {timeLeft <= 10 ? "Changing..." : "Paused"}
                  </span>
                </div>
              )}

              {/* Exit Fullscreen Button */}
              <button
                onClick={toggleFullScreen}
                onPointerDownCapture={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white/80 hover:text-white transition-all duration-200 ml-0.5 hover:scale-105 active:scale-95 cursor-pointer"
                title="Exit Fullscreen (Esc or F)"
              >
                <Minimize2 className="w-3 h-3 text-gray-300" />
                <span>Exit</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* 3. Bottom Controls (When NOT in Fullscreen): Full Screen, Play/Pause & Circular Countdown Timer */}
        {!isFullScreen && (
          <div className="w-full mt-1.5 shrink-0 flex items-center justify-end gap-2 px-1">
            {/* Fullscreen Button in control bar */}
            <button
              onClick={toggleFullScreen}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 text-gray-800 dark:text-white border border-gray-300 dark:border-white/10 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95"
              title="View Slideshow in Fullscreen (or press F)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full Screen</span>
            </button>

            {/* Pause / Play Button */}
            <button
              onClick={handleTogglePlayPause}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 text-gray-800 dark:text-white border border-gray-300 dark:border-white/10 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95"
              title={isPaused ? "Resume auto slideshow" : "Pause slideshow"}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Pause</span>
                </>
              )}
            </button>

            {/* Circular Countdown Timer (Visible ONLY when paused) */}
            <AnimatePresence>
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 bg-neutral-900/95 border border-white/15 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-xl"
                >
                  {/* Dynamic SVG Circular Ring */}
                  <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                    <svg
                      className="w-8 h-8 -rotate-90 transform"
                      viewBox="0 0 54 54"
                    >
                      {/* Background ring */}
                      <circle
                        cx="27"
                        cy="27"
                        r="22"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-white/15"
                      />
                      {/* Animated dynamic color progress ring */}
                      <circle
                        cx="27"
                        cy="27"
                        r="22"
                        stroke={strokeColor}
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={strokeCircumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>

                    {/* Centered Time text: White by default, Red when <= 10 seconds */}
                    <span
                      className={`absolute font-mono transition-colors duration-300 ${
                        timeLeft <= 10
                          ? "text-red-500 font-extrabold animate-pulse text-[10px]"
                          : "text-white font-bold text-[9px]"
                      }`}
                    >
                      {timeLeft}s
                    </span>
                  </div>

                  <div className="flex flex-col text-left pr-0.5">
                    <span className="text-[10px] font-bold text-white leading-tight">
                      Hold Time
                    </span>
                    <span
                      className={`text-[9px] transition-colors duration-300 ${
                        timeLeft <= 10 ? "text-red-400 font-semibold" : "text-gray-400"
                      }`}
                    >
                      {timeLeft <= 10 ? "Slide changing soon" : "Auto-advance"}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Methodology;


