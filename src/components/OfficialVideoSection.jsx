import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from "lucide-react";

const OfficialVideoSection = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const progressInterval = useRef(null);

  const videoId = "7ij2WXuIWGM";

  // Load YouTube IFrame API
  /* 
  // before deferring YouTube API load based on scroll
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    // Load the API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // API ready callback
    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };
  }, []);
  */

  // Load YouTube IFrame API only when section is near the viewport
  useEffect(() => {
    if (!isInView) return;

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    // Load the API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    // API ready callback
    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };
  }, [isInView]);

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
  }


  const initPlayer = () => {
    const newPlayer = new window.YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        autoplay: 0, // Disabled default autoplay so we can trigger it via scroll (isInView)
        mute: 1,
        loop: 1,
        playlist: videoId,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        enablejsapi: 1,
      },
      events: {
        onReady: (event) => {
          // Just save the player instance when ready, wait for scroll hook to trigger play
          setPlayer(event.target);
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            startProgressTracking(event.target);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            stopProgressTracking();
          }
        },
      },
    });
  };

  const startProgressTracking = (playerInstance) => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    progressInterval.current = setInterval(() => {
      if (playerInstance && playerInstance.getCurrentTime) {
        const currentTime = playerInstance.getCurrentTime();
        const duration = playerInstance.getDuration();
        if (duration > 0) {
          setProgress((currentTime / duration) * 100);
        }
      }
    }, 100);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  useEffect(() => {
    return () => stopProgressTracking();
  }, []);

  // Watch for both the YouTube player to be ready AND the section to scroll into view.
  // When both conditions are met, trigger the video to play automatically.
  useEffect(() => {
    if (player && isInView) {
      player.playVideo();
    }
  }, [player, isInView]);

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const handleProgressClick = (e) => {
    if (!player) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const duration = player.getDuration();
    player.seekTo(percentage * duration, true);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-stone-100 dark:from-black dark:via-zinc-950 dark:to-black transition-colors duration-300"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 dark:from-red-500/10 dark:to-pink-500/10 blur-3xl"
          />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-500/20 dark:border-amber-500/30 mb-6"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Official Presentation
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gray-800 dark:text-white">Discover </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
                3D Bharat
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Experience India's most advanced infrastructure monitoring platform through our official showcase video
            </p>
          </motion.div>

          {/* Video Container */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative group max-w-5xl mx-auto"
          >
            {/* Glow Effect Behind Video */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-red-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Video Frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/50 border border-gray-200/50 dark:border-white/10 bg-black">
              {/* Decorative Corner Accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-amber-500/50 rounded-tl-2xl z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-orange-500/50 rounded-tr-2xl z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-orange-500/50 rounded-bl-2xl z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-red-500/50 rounded-br-2xl z-20 pointer-events-none" />

              {/* Video Element */}
              <div className="relative aspect-video">
                {/* YouTube Player */}
                <div
                  id="youtube-player"
                  className="w-full h-full"
                />

                {/* Custom Controls Overlay - Always Visible */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Gradient overlay for controls visibility */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* Controls Bar */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 pointer-events-auto">
                    {/* Progress Bar */}
                    <div
                      className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer group/progress overflow-hidden"
                      onClick={handleProgressClick}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full relative"
                        style={{ width: `${progress}%` }}
                      >
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" />
                      </motion.div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={togglePlay}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleMute}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                          )}
                        </motion.button>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFullscreen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                      >
                        <Maximize2 className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* 3D Bharat Branding */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                    <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                      3D BHARAT
                    </span>
                  </div>
                </div>

                {/* Official Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm shadow-lg">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Official Video
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Infrastructure Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">3D Visualization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Precision Measurement</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <iframe
              src="https://www.youtube.com/embed/7ij2WXuIWGM?autoplay=1&controls=1&modestbranding=1&rel=0"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="3D Bharat Official Video - Fullscreen"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfficialVideoSection;
