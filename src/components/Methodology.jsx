import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ArrowRight,
  ArrowLeft,
  Download,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Maximize2,
  Minimize2,
  GripVertical,
  Volume2,
  VolumeX,
  Bug,
  CheckCircle2,
  AlertTriangle,
  X,
  Film,
  RotateCcw,
  RotateCw,
  Sun,
  Volume1,
  MessageSquare,
  Home,
} from "lucide-react";
import { useLoginModal } from "../context/LoginModalContext";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import ConnectModal from "./ConnectModal";
import Hls from "hls.js";
import { getActivePresentation } from "../services/presentationService";
import { BASE_URL } from "../services/api";

// The 12 methodology photos in slides_images folder

// The 12 sequence-numbered audio files in slides_audios folder matching each image 1 to 12

// 12 Sequential Slides strictly built from /slides_images and /slides_audios folders

export const DEFAULT_AUTO_PLAY_SECONDS = 51;

export const IMAGE_PAUSE_TIMES = {
  default: 30,
};

// 1 minute (60s) pause timer for all image slides
export const PAUSE_TIMER_SECONDS = 60;

const Methodology = ({ pptId: pptIdProp = null, onBack = null, backButtonLabel = null }) => {
  const navigate = useNavigate();
  const { openModal: openLoginModal } = useLoginModal();
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetPptId = pptIdProp || searchParams.get("ppt") || searchParams.get("wph_id") || 1;
  const initialSlideParam = searchParams.get("slide");
  const parsedInitialIndex = initialSlideParam !== null && !isNaN(Number(initialSlideParam))
    ? Math.max(0, Number(initialSlideParam) - 1)
    : 0;

  const [currentIndex, setCurrentIndex] = useState(parsedInitialIndex);

  // Intelligent back navigation:
  // If ppt was opened from Our Approach (technical or non-technical), returns to that category's cards view.
  // If ppt was opened from Openings module, returns to the Openings cards view.
  const handleBackNavigation = useCallback((e) => {
    if (e) e.stopPropagation();

    // 1. If explicit onBack prop provided (e.g. from OurApproachShowcase), invoke it
    if (typeof onBack === "function") {
      onBack();
      return;
    }

    // 2. If category param is present in URL, return to that category's card view
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      navigate(`/our-approach?category=${categoryParam}`);
      return;
    }

    // 3. If from=openings is in URL, return to /openings
    const fromParam = searchParams.get("from");
    if (fromParam === "openings") {
      navigate("/openings");
      return;
    }

    // 4. Default fallback: go back in history if possible, else /openings
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/openings");
    }
  }, [onBack, searchParams, navigate]);

  // Dynamic presentation data state
  const [slides, setSlides] = useState([]);
  const [presentationHeader, setPresentationHeader] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Active slides list from dynamic database
  const activeSlides = slides || [];

  // Current active slide object (initialized early for callback references)
  const currentSlide = activeSlides[currentIndex] || activeSlides[0] || {};
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_AUTO_PLAY_SECONDS);
  // 1-minute pause timer state (runs when user pauses an image slide)
  const [pauseTimeLeft, setPauseTimeLeft] = useState(PAUSE_TIMER_SECONDS);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // New audio and debug modal states
  const [isMuted, setIsMuted] = useState(false);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  // Persistent global state for Debug button visibility: remains visible across slide changes until manually clicked on the dot again
  const [showDebugButton, setShowDebugButton] = useState(false);

  // Slide completion modal state (Prompts user to start again or go to next slide when ideal time / video ends)
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Connect with us popup modal state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Fullscreen auto-hide controls state & timer ref
  const [showControlsInFullScreen, setShowControlsInFullScreen] = useState(true);
  const [isPinnedOpenInFullScreen, setIsPinnedOpenInFullScreen] = useState(false);
  const hideTimerRef = useRef(null);

  const slideshowRef = useRef(null);
  const videoRef = useRef(null);
  // Active HLS instance reference
  const hlsRef = useRef(null);
  const audioRef = useRef(null);

  // Helper to reliably construct first-frame poster image URL for video slide thumbnails
  const getVideoPosterUrl = useCallback((slide) => {
    if (!slide) return null;
    const raw = slide.poster_location || slide.thumbnail || slide.poster || slide.image_location;
    if (raw && typeof raw === "string" && raw.trim().length > 0) {
      if (raw.includes("localhost:3000/server")) {
        return raw.replace(/http:\/\/localhost:3000\/server/g, BASE_URL);
      }
      if (raw.startsWith("/")) {
        return `${BASE_URL.replace(/\/server$/, "")}${raw}`;
      }
      return raw;
    }
    const wId = slide.wph_id || targetPptId;
    const sId = slide.slide_id || slide.id || slide.sequence;
    if (wId && sId) {
      return `${BASE_URL}/presentation/hls/${wId}/${sId}/poster.jpg`;
    }
    return null;
  }, [targetPptId]);
  // Instant Callback Ref Video Attachment: Auto-starts immediately with forcePlay on slide transitions & HLS manifest load
  const attachVideoSource = useCallback((videoElement, slide) => {
    if (!videoElement || !slide) return;
    const isVideoSlide = slide.type === 2 || slide.slide_type === 2;
    if (!isVideoSlide) return;

    const hlsSource = slide.hls_location || (slide.location?.includes(".m3u8") ? slide.location : null);
    const fallbackSource = slide.fallback_location || slide.video_location || slide.location;
    const targetSource = hlsSource || fallbackSource;

    const safePlay = (forcePlay = false) => {
      // If explicitly paused by the user on the CURRENT slide and not forced, respect pause
      if (isPaused && !forcePlay) return;
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("[Video Player] Autoplay blocked, falling back to muted play:", err.message);
          videoElement.muted = true;
          setIsMuted(true);
          videoElement.play().catch((e) => console.warn("[Video Player] Muted play failed:", e.message));
        });
      }
    };

    // If this exact source is already active on this element, sync play/pause
    if (videoElement._attachedSource === targetSource) {
      if (isPaused) {
        videoElement.pause();
      } else {
        safePlay(false);
      }
      return;
    }

    videoElement._attachedSource = targetSource;

    // Clean up previous HLS instance if any
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (hlsSource && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hlsRef.current = hls;
      hls.loadSource(hlsSource);
      hls.attachMedia(videoElement);
      // Force play immediately once manifest is parsed
      hls.on(Hls.Events.MANIFEST_PARSED, () => safePlay(true));
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.warn("[HLS Player] Fatal error, falling back to native MP4:", data);
          hls.destroy();
          hlsRef.current = null;
          videoElement.src = fallbackSource;
          safePlay(true);
        }
      });
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl") && hlsSource) {
      // Safari Native HLS
      videoElement.src = hlsSource;
      safePlay(true);
    } else if (fallbackSource) {
      // Direct MP4 Fallback
      videoElement.src = fallbackSource;
      safePlay(true);
    }
  }, [isPaused, isMuted]);

  // Clean up active HLS instance on component unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  // Global Presentation Video Pre-Bufferer: preloads all video HLS playlists & initial chunks for 0ms instant startup
  useEffect(() => {
    const slideList = slides && slides.length > 0 ? slides : activeSlides;
    if (!slideList || slideList.length === 0) return;

    const allVideoSlides = slideList.filter((s) => s.type === 2 || s.slide_type === 2);
    if (allVideoSlides.length === 0) return;

    allVideoSlides.forEach((vSlide) => {
      const playlistUrl = vSlide.hls_location || (vSlide.location?.includes(".m3u8") ? vSlide.location : null);
      if (!playlistUrl) return;

      fetch(playlistUrl, { cache: "force-cache" })
        .then((res) => (res.ok ? res.text() : null))
        .then((m3u8Text) => {
          if (!m3u8Text) return;
          const segments = m3u8Text
            .split("\n")
            .filter((line) => line.trim().endsWith(".ts"))
            .slice(0, 2); // Preload first 2 chunks (4 seconds of video)
          const baseUrl = playlistUrl.substring(0, playlistUrl.lastIndexOf("/") + 1);
          segments.forEach((seg) => {
            const segUrl = seg.startsWith("http") ? seg : baseUrl + seg;
            fetch(segUrl, { cache: "force-cache" }).catch(() => {});
          });
        })
        .catch(() => {});
    });
  }, [slides, activeSlides]);

  // Dedicated Image Slide Audio Player States
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isAudioScrubbing, setIsAudioScrubbing] = useState(false);
  const [audioHoverTime, setAudioHoverTime] = useState(null);
  const [audioHoverPosition, setAudioHoverPosition] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(!isPaused);
  const audioScrubBarRef = useRef(null);

  // Audio scrubber jump handler
  const handleAudioScrub = useCallback((e) => {
    if (!audioScrubBarRef.current || !audioRef.current) return;
    const rect = audioScrubBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    const targetDuration = audioDuration || audioRef.current.duration || 30;
    const newTime = Math.max(0, Math.min(targetDuration, percentage * targetDuration));

    audioRef.current.currentTime = newTime;
    setAudioCurrentTime(newTime);
  }, [audioDuration]);

  // Audio scrubber hover and drag handler
  const handleAudioScrubMouseMove = useCallback((e) => {
    if (!audioScrubBarRef.current) return;
    const rect = audioScrubBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    const targetDuration = audioDuration || audioRef.current?.duration || 30;
    setAudioHoverPosition(clickX);
    setAudioHoverTime(percentage * targetDuration);
    if (isAudioScrubbing) {
      handleAudioScrub(e);
    }
  }, [audioDuration, isAudioScrubbing, handleAudioScrub]);

  // Global mouseup to release audio scrubbing cleanly
  useEffect(() => {
    const handleMouseUp = () => {
      if (isAudioScrubbing) {
        setIsAudioScrubbing(false);
      }
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [isAudioScrubbing]);

  // Skip audio forward or backward by N seconds (e.g. -5s or +5s)
  const handleSkipAudio = useCallback((seconds) => {
    if (!audioRef.current) return;
    const targetDuration = audioDuration || audioRef.current.duration || 30;
    const newTime = Math.max(0, Math.min(targetDuration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setAudioCurrentTime(newTime);
  }, [audioDuration]);

  // Audio Play / Pause toggle
  const handleToggleAudioPlay = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => { });
      setIsAudioPlaying(true);
    } else {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  }, []);

  // Video hover auto-hide controls management
  const handleVideoMouseMove = useCallback(() => {
    setIsVideoControlsVisible(true);
    if (videoControlsTimerRef.current) clearTimeout(videoControlsTimerRef.current);
    if (!isPaused && !isScrubbing && !showSpeedMenu) {
      videoControlsTimerRef.current = setTimeout(() => {
        setIsVideoControlsVisible(false);
      }, 2500);
    }
  }, [isPaused, isScrubbing, showSpeedMenu]);

  const handleVideoMouseLeave = useCallback(() => {
    if (!isPaused && !isScrubbing && !showSpeedMenu) {
      setIsVideoControlsVisible(false);
    }
  }, [isPaused, isScrubbing, showSpeedMenu]);

  // Reveal video controls whenever paused
  useEffect(() => {
    if (isPaused) {
      setIsVideoControlsVisible(true);
      if (videoControlsTimerRef.current) clearTimeout(videoControlsTimerRef.current);
    }
  }, [isPaused]);

  // Synchronize audio and video elements whenever volume or mute state updates (clamped to HTML5 max 1.0)
  useEffect(() => {
    const effectiveVolume = isMuted ? 0 : Math.min(1, volume / 100);
    if (videoRef.current) {
      videoRef.current.volume = effectiveVolume;
      videoRef.current.muted = isMuted;
    }
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, currentIndex]);

  const prevMutedRef = useRef(isMuted);

  // Whenever unmuting at any slide (in normal view or fullscreen), restart the active slide's ideal duration and audio from 0s so no audio is skipped
  useEffect(() => {
    // Detect transition from muted (true) to unmuted (false)
    if (prevMutedRef.current && !isMuted) {
      const fullDuration = currentSlide.type === 2
        ? (currentSlide.video_duration || 30)
        : (isPaused
          ? currentSlide.pause_time || IMAGE_PAUSE_TIMES[currentIndex] || IMAGE_PAUSE_TIMES.default
          : currentSlide.ideal_time || DEFAULT_AUTO_PLAY_SECONDS);

      // Reset ideal countdown timer back to full duration so it plays completely from 0s
      setTimeLeft(fullDuration);

      if (currentSlide.type === 1 && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => { });
      } else if (currentSlide.type === 2 && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        setVideoCurrentTime(0);
        if (!isPaused) {
          videoRef.current.play().catch(() => { });
        }
      }
    }
    prevMutedRef.current = isMuted;
  }, [isMuted, currentSlide, isPaused, currentIndex]);

  // Total duration reference for the circular percentage calculation (supports video and image slides)
  const totalDuration = currentSlide.type === 2
    ? (currentSlide.video_duration || 30)
    : (isPaused
      ? PAUSE_TIMER_SECONDS
      : currentSlide.ideal_time || DEFAULT_AUTO_PLAY_SECONDS);

  // Dynamic presentation fetch effect keyed to targetPptId
  useEffect(() => {
    let isMounted = true;
    const fetchPresentation = async () => {
      try {
        const res = await getActivePresentation(targetPptId);
        if (isMounted && res) {
          if (res.slides && res.slides.length > 0) {
            setSlides(res.slides);
          }
          if (res.header) {
            setPresentationHeader(res.header);
            document.title = `${res.header?.web_ppt_name || "Presentation"} - 3D Bharat`;
          }
          if (res.documents) {
            setDocuments(res.documents);
          }
          // Reset currentIndex to 0 (or url slide param) whenever targetPptId changes
          const slideParam = searchParams.get("slide");
          const slideNum = slideParam !== null ? parseInt(slideParam, 10) : 1;
          const targetIndex = (!isNaN(slideNum) && slideNum >= 1)
            ? Math.max(0, Math.min(slideNum - 1, (res.slides?.length || 1) - 1))
            : 0;
          setCurrentIndex(targetIndex);
          setIsPaused(false);
          setShowCompletionModal(false);
        }
      } catch (err) {
        console.warn("[Methodology] Error fetching presentation from backend, using default fallback:", err);
        if (isMounted) {
            document.title = "3D Bharat - To Achieve Precise Work Progress Monitoring";
        }
      } finally {
        if (isMounted) {
          }
      }
    };

    fetchPresentation();
    return () => {
      isMounted = false;
    };
  }, [targetPptId]);

  // Update slide index if URL query param changes (e.g. navigation from Openings module with ?slide=2)
  // useEffect(() => {
  //   const slideParam = searchParams.get("slide");
  //   if (slideParam !== null && !isNaN(Number(slideParam))) {
  //     const idx = Math.max(0, Math.min(Number(slideParam) - 1, activeSlides.length - 1));
  //     setCurrentIndex(idx);
  //     setIsPaused(false);
  //     setShowCompletionModal(false);
  //     syncSlideBarToSlide(idx);
  //   }
  // }, [searchParams, activeSlides.length, syncSlideBarToSlide]);

  // Close modals & initialize duration when switching slides
  useEffect(() => {
    setIsDebugOpen(false);
    setShowCompletionModal(false);
    const targetSlide = activeSlides[currentIndex] || activeSlides[0];
    const initialDuration = targetSlide?.type === 2
      ? (targetSlide?.video_duration || 30)
      : (targetSlide?.ideal_time || DEFAULT_AUTO_PLAY_SECONDS);
    setTimeLeft(initialDuration);
  }, [currentIndex, activeSlides]);

  // Flag to ensure auto-fullscreen only triggers once on initial entry
  const hasAutoFullScreenTriggeredRef = useRef(false);

  // Dynamic Auto-fullscreen after 5 seconds based on presentationHeader.full_screen (1 = yes [auto 5s], 2 = no [manual only])
  useEffect(() => {
    if (hasAutoFullScreenTriggeredRef.current) return;

    // If full_screen is explicitly 2 (no), do not auto fullscreen
    if (presentationHeader && Number(presentationHeader.full_screen) === 2) {
      return;
    }

    const autoFsTimer = setTimeout(() => {
      if (hasAutoFullScreenTriggeredRef.current) return;
      // Double check full_screen setting before entering fullscreen
      if (presentationHeader && Number(presentationHeader.full_screen) === 2) return;
      hasAutoFullScreenTriggeredRef.current = true;

      // Automatically transition slides to full screen after 5 seconds
      setIsFullScreen(true);
      if (slideshowRef.current?.requestFullscreen) {
        slideshowRef.current.requestFullscreen().catch(() => {});
      } else if (slideshowRef.current?.webkitRequestFullscreen) {
        slideshowRef.current.webkitRequestFullscreen();
      }
    }, 5000);

    return () => clearTimeout(autoFsTimer);
  }, [presentationHeader?.full_screen]);

  // Listen to browser fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isDocFs = !!document.fullscreenElement;
      setIsFullScreen(isDocFs);
      if (!isDocFs) {
        hasAutoFullScreenTriggeredRef.current = true;
      }
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Prevent background page scrolling when fullscreen mode/overlay is active
  useEffect(() => {
    if (isFullScreen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isFullScreen]);

  // Auto-hide controls in Fullscreen mode after 2 seconds on initial entry, manual toggle via tabs
  useEffect(() => {
    if (!isFullScreen) {
      setShowControlsInFullScreen(true);
      setIsPinnedOpenInFullScreen(false);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      return;
    }

    // Keep bottom dock open if completion popup is showing
    if (showCompletionModal) {
      setShowControlsInFullScreen(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      return;
    }

    // On entering fullscreen: show bottom bar for initial 2 seconds, then auto-close
    setIsPinnedOpenInFullScreen(false);
    setShowControlsInFullScreen(true);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowControlsInFullScreen(false);
    }, 2000);

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isFullScreen, showCompletionModal]);

  // When slide completes in fullscreen, reveal bottom bar so the 2-button popup on the play/pause button is immediately visible
  useEffect(() => {
    if (showCompletionModal && isFullScreen) {
      setShowControlsInFullScreen(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [showCompletionModal, isFullScreen]);

  const toggleFullScreen = useCallback(() => {
    hasAutoFullScreenTriggeredRef.current = true; // User manually toggled fullscreen; do not override with auto-timer
    if (!document.fullscreenElement && !isFullScreen) {
      setIsFullScreen(true);
      if (slideshowRef.current?.requestFullscreen) {
        slideshowRef.current.requestFullscreen().catch(() => {});
      } else if (slideshowRef.current?.webkitRequestFullscreen) {
        slideshowRef.current.webkitRequestFullscreen();
      }
    } else {
      setIsFullScreen(false);
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }
  }, [isFullScreen]);

  // Refs for the horizontal scrollable slide thumbnail containers (normal view and fullscreen view)
  const normalThumbnailContainerRef = useRef(null);
  const fsThumbnailContainerRef = useRef(null);
  const thumbnailRefs = useRef({});
  const fsThumbnailRefs = useRef({});

  // Slide bar synchronization helper: keeps slide bar in sync when navigating slides or restarting
  const syncSlideBarToSlide = useCallback((targetIndex) => {
    [normalThumbnailContainerRef.current, fsThumbnailContainerRef.current].forEach((container) => {
      if (!container) return;
      if (targetIndex === 0) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const thumb = container === fsThumbnailContainerRef.current
          ? fsThumbnailRefs.current[targetIndex]
          : thumbnailRefs.current[targetIndex];
        if (thumb) {
          const containerWidth = container.clientWidth;
          const thumbLeft = thumb.offsetLeft;
          const thumbWidth = thumb.offsetWidth;
          const targetLeft = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
          container.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
        }
      }
    });
  }, []);

  // Update slide index if URL query param changes (e.g. navigation from Openings module with ?slide=2)
  useEffect(() => {
    const slideParam = searchParams.get("slide");
    if (slideParam !== null && !isNaN(Number(slideParam))) {
      const idx = Math.max(0, Math.min(Number(slideParam) - 1, activeSlides.length - 1));
      setCurrentIndex(idx);
      setIsPaused(false);
      setShowCompletionModal(false);
      syncSlideBarToSlide(idx);
    }
  }, [searchParams, activeSlides.length, syncSlideBarToSlide]);

  const goToSlide = useCallback((newIndex) => {
    setCurrentIndex(newIndex);
    setIsPaused(false);
    setShowCompletionModal(false);
    setPauseTimeLeft(PAUSE_TIMER_SECONDS);
    setVideoCurrentTime(0);
    setVideoDuration(0);
    setVideoBuffered(0);
    setIsVideoControlsVisible(true);
    setShowSpeedMenu(false);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setIsAudioPlaying(true);
    const targetSlide = activeSlides[newIndex] || activeSlides[0];
    const initialTime = targetSlide?.type === 2
      ? (targetSlide?.video_duration || 30)
      : (targetSlide?.ideal_time || DEFAULT_AUTO_PLAY_SECONDS);
    setTimeLeft(initialTime);

    // Keep slide bar in sync! When clicking restart / slide 1 or any slide, smoothly scroll slide bar to that slide
    syncSlideBarToSlide(newIndex);
  }, [syncSlideBarToSlide, activeSlides]);

  // Non-circular navigation: stop at slide 1 when going backward, stop at last slide when going forward
  const handleNext = useCallback(() => {
    if (currentIndex < activeSlides.length - 1) {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, goToSlide, activeSlides.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, goToSlide]);

  // Ultra-smooth, effortless momentum wheel scrolling and drag-to-scroll inside the slide bar anytime (instantly cancels any active smooth-scroll lock)
  useEffect(() => {
    const attachSlideBarWheel = (container) => {
      if (!container) return () => { };
      let velocity = 0;
      let animId = null;
      let isDragging = false;
      let startX = 0;
      let scrollStart = 0;
      let hasDragged = false;

      const stopProgrammaticScroll = () => {
        // Immediately halt any running browser smooth scroll so manual user input takes over instantly
        container.scrollTo({ left: container.scrollLeft, behavior: "auto" });
      };

      const updateScroll = () => {
        if (Math.abs(velocity) > 0.3) {
          container.scrollLeft += velocity;
          velocity *= 0.88; // Natural smooth inertia friction decay
          animId = requestAnimationFrame(updateScroll);
        } else {
          velocity = 0;
          animId = null;
        }
      };

      const onWheelHandler = (e) => {
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (Math.abs(delta) < 0.5) return;

        // Prevent vertical page scroll while scrolling inside the slide bar
        e.preventDefault();

        // Immediately cancel any smooth-scroll lock from restart so wheel can scroll right away
        stopProgrammaticScroll();

        // Responsive velocity boost so scrolling is fast, silky smooth, and effortless
        velocity += delta * 1.5;

        // Cap maximum velocity for smooth control
        velocity = Math.max(-80, Math.min(80, velocity));

        if (!animId) {
          animId = requestAnimationFrame(updateScroll);
        }
      };

      // Drag-to-scroll support for ultra-fluid panning with mouse
      const onMouseDown = (e) => {
        if (e.button !== 0) return;
        stopProgrammaticScroll();
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
        velocity = 0;
        isDragging = true;
        hasDragged = false;
        startX = e.clientX;
        scrollStart = container.scrollLeft;
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        if (Math.abs(deltaX) > 4) {
          hasDragged = true;
        }
        container.scrollLeft = scrollStart - (deltaX * 1.3);
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      // Prevent accidental slide click if user dragged the slide bar
      const onClickCapture = (e) => {
        if (hasDragged) {
          e.stopPropagation();
          e.preventDefault();
          hasDragged = false;
        }
      };

      const onDragStart = (e) => {
        e.preventDefault();
      };

      container.addEventListener("wheel", onWheelHandler, { passive: false });
      container.addEventListener("mousedown", onMouseDown);
      container.addEventListener("dragstart", onDragStart);
      container.addEventListener("click", onClickCapture, true);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      return () => {
        if (animId) cancelAnimationFrame(animId);
        container.removeEventListener("wheel", onWheelHandler);
        container.removeEventListener("mousedown", onMouseDown);
        container.removeEventListener("dragstart", onDragStart);
        container.removeEventListener("click", onClickCapture, true);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    };

    const cleanupNormal = attachSlideBarWheel(normalThumbnailContainerRef.current);
    const cleanupFs = attachSlideBarWheel(fsThumbnailContainerRef.current);

    return () => {
      cleanupNormal();
      cleanupFs();
    };
  }, [isFullScreen, showControlsInFullScreen]);

  // When active slide changes via controls, restart, or auto-play, smoothly scroll the container to keep active thumbnail in sync (index 0 goes straight to left: 0)
  useEffect(() => {
    syncSlideBarToSlide(currentIndex);
  }, [currentIndex, isFullScreen, showControlsInFullScreen, syncSlideBarToSlide]);

  // Start again (replay) handler for completion modal: restarts video or resets ideal duration and audio from 0s
  const handleStartAgain = useCallback(() => {
    setShowCompletionModal(false);
    setIsPaused(false);
    setPauseTimeLeft(PAUSE_TIMER_SECONDS);
    const duration = currentSlide.type === 2
      ? (currentSlide.video_duration || 30)
      : (currentSlide.ideal_time || DEFAULT_AUTO_PLAY_SECONDS);
    setTimeLeft(duration);
    setVideoCurrentTime(0);

    if (currentSlide.type === 2 && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => { });
    }

    if (currentSlide.type === 1 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(() => { });
    }
  }, [currentSlide, isMuted]);

  // Proceed to next slide from completion modal
  const handleNextFromModal = useCallback(() => {
    setShowCompletionModal(false);
    setIsPaused(false);
    setPauseTimeLeft(PAUSE_TIMER_SECONDS);
    handleNext();
  }, [handleNext]);

  // Pause / Play toggle handler: Pauses ideal image countdown timer, starts 1 min pause timer when paused; keeps image audio playing continuously without stopping (user can mute manually)
  const handleTogglePlayPause = useCallback(() => {
    if (isPaused) {
      // Resume normal play: unpause ideal countdown timer, reset 1 min pause timer
      setIsPaused(false);
      setShowCompletionModal(false);
      setPauseTimeLeft(PAUSE_TIMER_SECONDS);
      if (currentSlide.type === 2 && videoRef.current) {
        videoRef.current.play().catch(() => { });
      }
      if (currentSlide.type === 1 && audioRef.current) {
        audioRef.current.muted = isMuted;
        if (!isMuted && audioRef.current.paused && !audioRef.current.ended) {
          audioRef.current.play().catch(() => { });
        }
      }
    } else {
      // Enter pause / hold mode: pause ideal time of image slide, and start 1 min pause timer
      setIsPaused(true);
      setPauseTimeLeft(PAUSE_TIMER_SECONDS);
      if (currentSlide.type === 2 && videoRef.current) {
        videoRef.current.pause();
      }
      // For image slides (type === 1): Audio continues playing continuously; user can only mute it manually
    }
  }, [isPaused, currentSlide, isMuted]);

  // Restart audio and ideal time from start for current image slide (triggered by the Audio Restart button)
  const handleRestartAudioAndTimer = useCallback(() => {
    if (currentSlide.type === 1) {
      const fullDur = currentSlide.ideal_time || DEFAULT_AUTO_PLAY_SECONDS;
      setTimeLeft(fullDur);
      setPauseTimeLeft(PAUSE_TIMER_SECONDS);
      setIsPaused(false);
      setShowCompletionModal(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = isMuted;
        audioRef.current.play().catch(() => { });
      }
    }
  }, [currentSlide, isMuted]);

  // 1. Ideal Duration Countdown Effect: Active when slide is playing (!isPaused && !showCompletionModal)
  // When ideal time of active image slide is over:
  // - If NOT last slide: directly advances to the next slide automatically (no popup).
  // - If LAST slide: stops cleanly without looping back to the 1st slide.
  useEffect(() => {
    if (isPaused || showCompletionModal) return;

    // For video slides (type === 2), dedicated video player handles duration and events
    if (currentSlide.type === 2) {
      return;
    }

    if (timeLeft <= 0) {
      if (currentIndex < activeSlides.length - 1) {
        // Automatically start the next slide
        goToSlide(currentIndex + 1);
      } else {
        // Last slide: stop and do not start the 1st slide again
        setIsPaused(true);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        // Dynamic Connect With Us Popup on last slide: 1 = yes (open modal), 2 = no (do not open modal)
        if (Number(presentationHeader?.connect_with_us_popus) === 1) {
          setIsConnectModalOpen(true);
        }
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, showCompletionModal, currentSlide, activeSlides.length, goToSlide, timeLeft, presentationHeader]);

  // 2. 1-Minute Pause Timer Effect: Active when an image or video slide is paused (isPaused && !showCompletionModal)
  // When user pauses, a 60s timer starts. If 1 minute passes without user interaction, the Restart / Next Slide popup modal opens.
  useEffect(() => {
    if (!isPaused || showCompletionModal) return;

    if (pauseTimeLeft <= 0) {
      // 1 minute pause timer elapsed without action -> prompt user with Restart / Next Slide modal
      setShowCompletionModal(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }

    const timer = setTimeout(() => {
      setPauseTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPaused, showCompletionModal, currentSlide, pauseTimeLeft]);

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
      } else if (e.key === "Escape" && isFullScreen) {
        e.preventDefault();
        toggleFullScreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, handleTogglePlayPause, toggleFullScreen, isFullScreen]);

  // Calculate dynamic circular progress and color (Green -> Yellow -> Red)
  const activeCurrentTime = isPaused ? pauseTimeLeft : timeLeft;
  const activeTotalTime = isPaused ? PAUSE_TIMER_SECONDS : totalDuration;
  const progressRatio = Math.max(0, Math.min(1, activeCurrentTime / (activeTotalTime || 1)));
  const strokeCircumference = 138.23;
  const strokeDashoffset = strokeCircumference * (1 - progressRatio);

  // Dynamic color transition from Green (120 deg) to Red (0 deg) based on percentage
  const dynamicHue = Math.round(progressRatio * 120);
  const strokeColor = `hsl(${dynamicHue}, 90%, 48%)`;

  // Strictly non-circular visible slides calculation for bottom slider
  // 1. Right after '<', only Slide 1 shows (no wrapping to Slide 9 or Slide 10)
  // 2. Right before the Restart button, only the last slide shows (no wrapping to Slide 1)
  // 3. When active slide is the last slide, 1st slide is NOT shown; only the Restart button is presented
  const totalSlides = activeSlides.length;
  const isLastSlide = currentIndex === totalSlides - 1;

  // Attractive, Modern Glassmorphic Bottom Controls Dock (Non-circular, smoothly scrollable slide bar without affecting active slide)
  const renderBottomControls = (isFs = false) => (
    <div className="w-full flex items-center justify-between gap-2 sm:gap-3 select-none">
      {/* 3A. Modern Stretched Slides Thumbnail Bar */}
      <div
        className={`flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-2xl shadow-lg backdrop-blur-2xl transition-all ${isFs
          ? "bg-black/80 border border-white/20 shadow-2xl shadow-black/80"
          : "bg-white/90 dark:bg-neutral-900/90 border border-gray-200/90 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          }`}
      >

        {/* Left Arrow Button (Hidden on Slide 1 - Only shown when currentIndex > 0) */}
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className={`w-8 h-10 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${isFs
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-gray-100 hover:bg-gray-200/90 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 shadow-sm"
              }`}
            title="Previous Slide (<)"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Horizontally Scrollable Thumbnails Container - Smooth scrolling without changing active slide */}
        <div
          ref={isFs ? fsThumbnailContainerRef : normalThumbnailContainerRef}
          className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto py-1 sm:py-1.5 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none cursor-grab active:cursor-grabbing"
        >
          {activeSlides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <motion.button
                key={slide.id || `slide_${index}`}
                ref={(el) => {
                  if (el) {
                    if (isFs) {
                      fsThumbnailRefs.current[index] = el;
                    } else {
                      thumbnailRefs.current[index] = el;
                    }
                  }
                }}
                type="button"
                onClick={() => {
                  setIsPaused(false);
                  goToSlide(index);
                }}
                whileHover={{ scale: isActive ? 1.06 : 1.02 }}
                whileTap={{ scale: 0.96 }}
                className={`relative rounded-xl overflow-hidden transition-all duration-300 shrink-0 cursor-pointer select-none ${isActive
                  ? "w-24 sm:w-28 md:w-32 h-[44px] sm:h-[48px] border-2 border-orange-500 ring-2 ring-orange-500/50 shadow-[0_0_18px_rgba(249,115,22,0.5)] z-20 opacity-100 scale-105"
                  : "w-20 sm:w-24 md:w-28 h-[38px] sm:h-[42px] border border-gray-300 dark:border-white/15 opacity-70 hover:opacity-100 hover:border-gray-400 dark:hover:border-white/30"
                  }`}
                title={`Slide ${index + 1}: ${slide.title} (${slide.type === 2 ? "Video" : "Image"})`}
              >
                {slide.type === 2 ? (
                  <div className="w-full h-full bg-neutral-900 relative flex items-center justify-center overflow-hidden">
                    {getVideoPosterUrl(slide) ? (
                      <img
                        src={getVideoPosterUrl(slide)}
                        alt={slide.title}
                        draggable={false}
                        className="w-full h-full object-cover pointer-events-none select-none"
                        loading="eager"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 text-neutral-500 fill-neutral-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                      <div className="w-4.5 h-4.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow">
                        <Play className="w-2 h-2 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0.5 right-1 px-1 py-0.5 rounded bg-black/75 text-[7px] font-mono font-bold text-white/90 pointer-events-none">
                      VID
                    </div>
                  </div>
                ) : (
                  <img
                    src={slide.location}
                    alt={slide.title}
                    draggable={false}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="eager"
                  />
                )}

                {/* Slide Sequence Number Badge at top-left corner */}
                <div className="absolute top-1 left-1 z-10 px-1 sm:px-1.5 py-0.5 rounded-md bg-black/75 dark:bg-black/85 backdrop-blur-sm border border-white/20 shadow-sm flex items-center justify-center pointer-events-none leading-none">
                  <span className="font-mono font-black text-[8px] sm:text-[9px] text-white select-none">
                    {slide.sequence || index + 1}
                  </span>
                </div>

                {/* Status Dot on thumbnail (Blue for warning, Green for ok) */}
                <span
                  className={`absolute top-1 right-1 w-2 h-2 rounded-full ring-1 ring-black/40 z-10 ${slide.status === "ok" ? "bg-emerald-400 shadow-[0_0_4px_#34d399]" : "bg-sky-400 shadow-[0_0_4px_#38bdf8]"
                    }`}
                />

                {/* Active Center Badge (Modern pill gradient) */}
                {isActive && (
                  <div className="absolute inset-x-0 bottom-0.5 flex justify-center pointer-events-none z-10">
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[7.5px] font-black tracking-widest uppercase shadow-sm">
                      ACTIVE
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right Action Button: Home icon on last slide to go to 1st slide, or Next Slide (>) button */}
        {isLastSlide ? (
          <button
            type="button"
            onClick={() => {
              setIsPaused(false);
              goToSlide(0);
            }}
            className={`w-8 h-10 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${isFs
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-gray-100 hover:bg-gray-200/90 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 shadow-sm"
              }`}
            title="Return to First Slide (Home)"
            aria-label="Return to First Slide"
          >
            <Home className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className={`w-8 h-10 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${isFs
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-gray-100 hover:bg-gray-200/90 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 shadow-sm"
              }`}
            title="Next Slide (>)"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3B. Refined Play Bar & Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Play Bar (Audio Toggle + Play/Pause Button + Countdown Ring) */}
        <div
          className={`flex items-center gap-1.5 p-1.5 rounded-2xl shadow-lg backdrop-blur-2xl transition-all ${isFs
            ? "bg-black/80 border border-white/20 shadow-2xl shadow-black/80"
            : "bg-white/90 dark:bg-neutral-900/90 border border-gray-200/90 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            }`}
        >

          {/* 1. Audio Sound Toggle (Mute / Unmute for all slides - Icon Only) */}
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${isMuted
              ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10"
              : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
              }`}
            title={isMuted ? "Sound Muted (Click to Unmute for all slides)" : "Sound ON (Click to Mute all slides)"}
            aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            )}
          </button>

          {/* 2. 5 sec Backward Button (Rewind 5s with backward arrow, non-circular) */}
          {currentSlide.type === 1 && (
            <button
              type="button"
              onClick={() => handleSkipAudio(-5)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 group ${isFs
                ? "bg-white/10 hover:bg-white/20 text-amber-400 border border-white/20 shadow-sm"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10"
                }`}
              title="Rewind 5 seconds"
              aria-label="Rewind 5 seconds"
            >
              <div className="flex items-center justify-center leading-none text-amber-600 dark:text-amber-400">
                <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5] -mr-0.5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[9px] font-mono font-bold">5s</span>
              </div>
            </button>
          )}

          {/* 3. Audio & Slide Time Restart Button (Visible only on image slides; resets ideal duration & starts audio from start) */}
          {currentSlide.type === 1 && (
            <button
              type="button"
              onClick={handleRestartAudioAndTimer}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${isFs
                ? "bg-white/10 hover:bg-white/20 text-amber-400 border border-white/20 shadow-sm"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10"
                }`}
              title="Restart Audio & Slide Time from start"
              aria-label="Restart Audio and Slide Time"
            >
              <RotateCcw className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </button>
          )}

          {/* 4. 5 sec Forward Button (Forward 5s with forward arrow, non-circular) */}
          {currentSlide.type === 1 && (
            <button
              type="button"
              onClick={() => handleSkipAudio(5)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 group ${isFs
                ? "bg-white/10 hover:bg-white/20 text-amber-400 border border-white/20 shadow-sm"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10"
                }`}
              title="Forward 5 seconds"
              aria-label="Forward 5 seconds"
            >
              <div className="flex items-center justify-center leading-none text-amber-600 dark:text-amber-400">
                <span className="text-[9px] font-mono font-bold">5s</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] -ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          )}

          {/* Play / Pause Toggle Button Container with Floating 2-Option Completion Popup */}
          <div className="relative flex items-center justify-center">
            {/* Small 2-Option Popup (Restart & Next Slide) positioned directly and accurately above Play/Pause Button when slide ends */}
            <AnimatePresence>
              {showCompletionModal && (
                <div
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-900/95 dark:bg-black/95 text-white border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-xl whitespace-nowrap"
                  >
                    {/* 1. Restart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartAgain();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                      title="Restart current slide from beginning"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Restart</span>
                    </button>

                    {/* 2. Next Slide Button (Light, soft color flow, hidden on last slide) */}
                    {currentIndex < activeSlides.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextFromModal();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400 hover:opacity-95 shadow-md shadow-orange-400/25 border border-orange-300/40 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                        title="Proceed to next slide"
                      >
                        <span>Next Slide</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </button>
                    )}

                    {/* Downward Caret pointing directly to Play/Pause button center */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-900/95 dark:bg-black/95 border-b border-r border-white/20 rotate-45 pointer-events-none" />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={handleTogglePlayPause}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${isPaused
                ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white border-emerald-400/40 shadow-md shadow-emerald-500/30 hover:opacity-95"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-sm shadow-amber-500/10"
                }`}
              title={isPaused ? "Resume auto slideshow" : "Pause slideshow (Hold slide)"}
              aria-label={isPaused ? "Resume Slideshow" : "Pause Slideshow"}
            >
              {isPaused ? (
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              ) : (
                <Pause className="w-4 h-4 text-amber-500 fill-amber-500" />
              )}
            </button>
          </div>

          {/* Circular Countdown Timer (Visible when paused - clear & bold in both normal and fullscreen modes) */}
          {isPaused && (
            <div className={`flex items-center gap-1.5 pl-1.5 border-l ${isFs ? "border-white/20" : "border-gray-300 dark:border-white/15"}`}>
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 -rotate-90 transform" viewBox="0 0 54 54">
                  <circle cx="27" cy="27" r="22" stroke="currentColor" strokeWidth="4" fill="none" className={isFs ? "text-white/20" : "text-gray-300 dark:text-white/15"} />
                  <circle cx="27" cy="27" r="22" stroke={strokeColor} strokeWidth="4" fill="none" strokeDasharray={strokeCircumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
                </svg>
                <span className={`absolute font-mono text-[9px] sm:text-[10px] ${pauseTimeLeft <= 10 ? "text-red-500 font-extrabold animate-pulse" : (isFs ? "text-white font-extrabold" : "text-gray-800 dark:text-white font-bold")}`}>
                  {pauseTimeLeft}s
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3C. Refined Debug Inspector Button (Only shown when showDebugButton is true, toggled by clicking green/blue dot) */}
        <AnimatePresence>
          {showDebugButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: "auto" }}
              exit={{ opacity: 0, scale: 0.9, width: 0 }}
              transition={{ duration: 0.2 }}
              type="button"
              onClick={() => setIsDebugOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border shadow-lg backdrop-blur-2xl transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer ${isFs
                ? "bg-black/80 hover:bg-black/95 text-white border-white/20 shadow-2xl shadow-black/80"
                : "bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 text-gray-800 dark:text-white border-gray-200/90 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                }`}
              title="Inspect slide data, assets and verification status"
            >
              <Bug className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform duration-200" />
              <span className="hidden sm:inline">Debug</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ring-1 ring-black/20 ${currentSlide.status === "ok" ? "bg-emerald-400 shadow-[0_0_6px_#10b981]" : "bg-sky-400 shadow-[0_0_6px_#0ea5e9]"
                  }`}
              />
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </div>
  );

  // Reusable Slide Diagnostic & Health Inspector Modal (Can be displayed inside Fullscreen or outside in normal document)
  const renderDebugModal = (inFs = false) => (
    <AnimatePresence>
      {isDebugOpen && (
        <motion.div
          key="debug-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${inFs ? "absolute inset-0" : "fixed inset-0"
            } z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md pointer-events-auto`}
          onClick={() => setIsDebugOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/15 rounded-2xl shadow-2xl p-5 space-y-4 pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    Slide Data Inspector & Diagnostics
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Slide {currentIndex + 1} of {activeSlides.length} (Sequence #{currentSlide.sequence || currentIndex + 1})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDebugOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Banner */}
            {currentSlide.status === "ok" ? (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Green Dot: All Data Verified
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Everything is OK. All assets, duration, and dependencies for this slide are verified.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30">
                <AlertTriangle className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-sky-800 dark:text-sky-300">
                    Blue Dot: Asset / Stream Alert
                  </p>
                  <p className="text-[11px] text-sky-700 dark:text-sky-400 mt-0.5">
                    {currentSlide.debugInfo}
                  </p>
                </div>
              </div>
            )}

            {/* Diagnostics Table */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-medium shrink-0">Slide Title</span>
                <span className="font-bold text-gray-800 dark:text-white truncate ml-2 text-right">
                  {currentSlide.title || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-medium shrink-0">Media Type</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {currentSlide.type === 1 ? "Image (Type 1)" : "Video (Type 2)"}
                </span>
              </div>

              {/* File Location - Clear dedicated box with complete URL and wrap/break */}
              <div className="py-2 px-3 rounded-lg bg-gray-50 dark:bg-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">File Location</span>
                  {currentSlide.location && (
                    <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                      {currentSlide.location.split("/").pop()}
                    </span>
                  )}
                </div>
                <div
                  className="font-mono text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 break-all select-all leading-relaxed"
                  title={currentSlide.location}
                >
                  {currentSlide.location || "None"}
                </div>
              </div>

              {/* Audio Location - Clear dedicated box with complete URL, no text collision */}
              <div className="py-2 px-3 rounded-lg bg-gray-50 dark:bg-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Audio Location</span>
                  {currentSlide.audio_location && (
                    <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400">
                      {currentSlide.audio_location.split("/").pop()}
                    </span>
                  )}
                </div>
                <div
                  className={`font-mono text-[10px] p-2 rounded-lg border break-all select-all leading-relaxed ${
                    currentSlide.audio_location
                      ? "text-sky-600 dark:text-sky-400 bg-sky-500/5 dark:bg-sky-500/10 border-sky-500/20"
                      : "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10"
                  }`}
                  title={currentSlide.audio_location || "None (Static)"}
                >
                  {currentSlide.audio_location || "None (Static)"}
                </div>
              </div>

              <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-medium shrink-0">Ideal Duration</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {currentSlide.ideal_time || currentSlide.video_duration || 30}s
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-medium shrink-0">Sound Output</span>
                <span className={`font-bold ${isMuted ? "text-red-500" : "text-emerald-500"}`}>
                  {isMuted ? "Globally Muted" : "Active / Unmuted"}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsDebugOpen(false)}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all duration-200 cursor-pointer"
            >
              Close Inspector
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`w-full h-screen max-h-screen overflow-hidden bg-stone-100 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex flex-col ${isFullScreen ? "p-0" : "pt-20 pb-2 px-3 sm:px-6"}`}>
      <div className={`w-full mx-auto flex-1 min-h-0 flex flex-col justify-between ${isFullScreen ? "max-w-none p-0" : "max-w-6xl"}`}>
        {/* 1. Explore 3D Bharat Header Bar (Clean, Compact, Above Slideshow) - Hidden in Fullscreen */}
        {!isFullScreen && (
          <div className="w-full shrink-0 mb-1.5">
          <div className="w-full flex items-center justify-between gap-2 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl border border-gray-200 dark:border-white/10 py-1.5 px-3 sm:px-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              {/* Optional onBack button to return to domain cards / categories */}
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300/80 dark:border-white/15 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer mr-0.5 shrink-0"
                  title={backButtonLabel || "Back"}
                  aria-label={backButtonLabel || "Back"}
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">{backButtonLabel || "Back"}</span>
                  <span className="sm:hidden">Back</span>
                </button>
              )}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-orange-500 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 shrink-0">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight">
                {presentationHeader?.web_ppt_name || "3DB Approach"}
              </h2>
            </div>

            {/* Action Buttons: View Document, Download Brochure, SignUp */}
            <div className="flex items-center gap-2">
              <a
                href={documents && documents.length > 0 && documents[0].doc_location ? documents[0].doc_location : "/3D-Bharat-Document.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-xs text-gray-800 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300 dark:border-white/20 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Document</span>
                <span className="sm:hidden">View</span>
              </a>

              {/* Connect with us Button -> Opens ConnectModal popup (Light, soft color flow) */}
              <button
                type="button"
                onClick={() => setIsConnectModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-bold text-xs text-white bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400 hover:opacity-95 shadow-sm shadow-orange-400/20 border border-white/20 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
                title="Connect with us"
                aria-label="Connect with us"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Connect with us</span>
                <span className="sm:hidden">Connect</span>
              </button>

              {/* Compact Glowing SignUp Button with Clean Hover Info */}
              <motion.button
                type="button"
                onClick={openLoginModal}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative inline-block group cursor-pointer select-none shrink-0"
                title="To download our demo application"
                aria-label="SignUp - To download our demo application"
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
        )}

        {/* 2. Main Slideshow Display (Constrained height with top-left logo & top-right green/blue health dot) */}
        <div
          ref={slideshowRef}
          className={`relative w-full ${isFullScreen
            ? "fixed inset-0 z-[9999] h-screen w-screen bg-black flex items-center justify-center p-0 m-0"
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

          {/* 3D Bharat Logo in Top-Left Corner */}

          {/* 3D Bharat Logo: Rendered when in fullscreen view (placed cleanly at top-left corner) */}
          {isFullScreen && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 select-none transition-all duration-300">
              <img
                src="/images/logo2.png"
                alt="3D Bharat"
                className="w-16 h-16 sm:w-20 sm:h-20 aspect-square object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)] transition-all duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.src = "/images/logo.png";
                }}
              />
            </div>
          )}

          {/* Health / Diagnostic Dot Indicator (Green / Blue Dot in Top-Right Corner) */}

          <button
            type="button"
            onClick={() => {
              if (isFullScreen && !showControlsInFullScreen) {
                // If in fullscreen and menu is hidden/down, bring the menu up and reveal the debug button
                if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                setShowControlsInFullScreen(true);
                setIsPinnedOpenInFullScreen(true);
                setShowDebugButton(true);
              } else {
                setShowDebugButton((prev) => {
                  const nextState = !prev;
                  if (nextState && isFullScreen) {
                    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                    setShowControlsInFullScreen(true);
                    setIsPinnedOpenInFullScreen(true);
                  }
                  return nextState;
                });
              }
            }}
            className="absolute top-3.5 right-[3.8rem] sm:top-4.5 sm:right-[4.5rem] z-20 p-2 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-95 select-none focus:outline-none bg-transparent border-0"
            title={`Status: ${currentSlide.status === "ok" ? "All Data OK (Green Dot)" : "Warning / Missing Data (Blue Dot)"}. Click to ${showDebugButton ? "hide" : "reveal"} Debug button.`}
            aria-label="Toggle Debug button"
          >
            <span
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${currentSlide.status === "ok"
                ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                : "bg-sky-500 shadow-[0_0_8px_#0ea5e9]"
                }`}
            />
          </button>

          {/* Animated Clean Media Display (Supports Image or Video - Pure original image render without pixel filter distortion) */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden p-2">
            <AnimatePresence mode="wait">
              {currentSlide.type === 2 ? (
                // Video Slide with Integrated Interactive Video Play Bar (Normal & Fullscreen view)
                // Previous transition duration 0.35 easeInOut preserved per zero-deletions rule:
                // transition={{ duration: 0.35, ease: "easeInOut" }}
                <motion.div
                  key={`video-${currentIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onMouseMove={handleVideoMouseMove}
                  onMouseEnter={() => setIsVideoControlsVisible(true)}
                  onMouseLeave={handleVideoMouseLeave}
                  className="w-full h-full flex items-center justify-center relative group"
                >
                  <video
                    ref={(el) => {
                      videoRef.current = el;
                      if (el) attachVideoSource(el, currentSlide);
                    }}
                    key={`video-${currentIndex}-${currentSlide.hls_location || currentSlide.location}`}
                    poster={currentSlide.poster_location || currentSlide.thumbnail || currentSlide.image_location}
                    src={currentSlide.fallback_location || currentSlide.video_location}
                    autoPlay
                    playsInline
                    muted={isMuted}
                    onLoadedMetadata={(e) => {
                      const dur = e.currentTarget.duration;
                      if (dur && !isNaN(dur) && isFinite(dur)) {
                        setTimeLeft(Math.ceil(dur));
                      }
                    }}
                    onTimeUpdate={(e) => {
                      const cur = e.currentTarget.currentTime;
                      const dur = e.currentTarget.duration || currentSlide?.video_duration || 30;
                      const remaining = Math.max(0, Math.ceil(dur - cur));
                      if (!isNaN(remaining) && !showCompletionModal && !isPaused) {
                        setTimeLeft(remaining);
                      }
                    }}
                    onEnded={() => {
                      setTimeLeft(0);
                      if (currentIndex < activeSlides.length - 1) {
                        setIsPaused(false); // Reset pause state so next slide auto-plays immediately
                        goToSlide(currentIndex + 1);
                      } else {
                        setIsPaused(true);
                        // Check presentationHeader.connect_with_us_popus (1 = yes [open ConnectModal at end of last slide], 2 = no [show completion modal])
                        if (Number(presentationHeader?.connect_with_us_popus) === 1) {
                          setIsConnectModalOpen(true);
                        } else {
                          setShowCompletionModal(true);
                        }
                      }
                    }}
                    onClick={handleTogglePlayPause}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl cursor-pointer"
                  />

                  {/* Subtle Center Play indicator overlay when paused */}
                  {isPaused && (
                    <div
                      onClick={handleTogglePlayPause}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                    >
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                </motion.div>
              ) : (
                <motion.div
                  key={`img-wrap-${currentIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full h-full flex items-center justify-center relative"
                >
                  <img
                    key={`img-${currentIndex}`}
                    src={currentSlide.location}
                    className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                    alt={`Methodology ${currentIndex + 1} - ${currentSlide.title}`}
                    loading="eager"
                  />
                  {currentSlide.audio_location && (
                    <>

                      {/* Synchronized slide audio with time tracking & scrubber events */}
                      <audio
                        ref={audioRef}
                        key={`audio-${currentSlide.audio_location}`}
                        src={currentSlide.audio_location}
                        autoPlay={!isPaused}
                        muted={isMuted}
                        playsInline
                        onLoadedMetadata={(e) => {
                          const dur = e.currentTarget.duration;
                          if (dur && !isNaN(dur) && isFinite(dur)) {
                            setAudioDuration(dur);
                            setTimeLeft(Math.ceil(dur));
                          }
                          setAudioCurrentTime(0);
                          e.currentTarget.currentTime = 0;
                          e.currentTarget.muted = isMuted;
                          if (!isPaused) {
                            e.currentTarget.play().then(() => setIsAudioPlaying(true)).catch(() => { });
                          }
                        }}
                        onTimeUpdate={(e) => {
                          if (!isAudioScrubbing) {
                            setAudioCurrentTime(e.currentTarget.currentTime);
                          }
                        }}
                        onPlay={() => setIsAudioPlaying(true)}
                        onPause={() => setIsAudioPlaying(false)}
                        onEnded={() => {
                          setIsAudioPlaying(false);
                            }}
                      />

                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom-Left Fullscreen / Exit Button (with subtle attention-catching flicking/pulsing glow when in normal view) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullScreen();
            }}
            className={`absolute z-50 flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold border shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer bg-black/75 hover:bg-black/90 text-white select-none pointer-events-auto ${isFullScreen
              ? showControlsInFullScreen
                ? "bottom-20 sm:bottom-24 left-3 sm:left-4 border-white/20"
                : "bottom-3 left-3 sm:bottom-4 sm:left-4 border-white/20"
              : "bottom-3 left-3 sm:bottom-4 sm:left-4 border-emerald-400/60 animate-slight-flicker"
              }`}
            title={isFullScreen ? "Exit Fullscreen (Esc or F)" : "View in Fullscreen (F)"}
            aria-label={isFullScreen ? "Exit Fullscreen" : "View in Fullscreen"}
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-gray-200 group-hover:scale-95 transition-transform" />
                <span>Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Full Screen</span>
              </>
            )}
          </button>

          {!isFullScreen && (
            <button
              type="button"
              onClick={handleBackNavigation}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 hover:border-amber-400/80 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group cursor-pointer"
              title={
                searchParams.get("category")
                  ? `Back to ${searchParams.get("category") === "technical" ? "Technical" : "Marketing"} Modules`
                  : "Back"
              }
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-200 group-hover:text-amber-400 group-hover:-translate-x-0.5 transition-all" />
            </button>
          )}

          {/* Top-Right Fullscreen Toggle Button */}
          <button
            onClick={toggleFullScreen}
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group ${!isFullScreen ? "border-emerald-400/60 animate-slight-flicker" : "border-white/20"}`}
            title={isFullScreen ? "Exit Fullscreen (Esc or F)" : "Fullscreen (F)"}
            aria-label="Toggle Fullscreen"
          >
            {isFullScreen ? (
              <Minimize2 className="w-5 h-5 group-hover:scale-95 transition-transform text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform text-white" />
            )}
          </button>

          {/* Left Arrow Button (Hidden on Slide 1 - Only shown when currentIndex > 0) */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group cursor-pointer"
              title="Previous (Left Arrow)"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Right Action Button: Home icon on Last Slide (Open 1st Slide) or Next (Right Arrow) */}
          {currentIndex === activeSlides.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                setIsPaused(false);
                goToSlide(0);
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group cursor-pointer"
              title="Return to First Slide (Home)"
              aria-label="Return to First Slide"
            >
              <Home className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group cursor-pointer"
              title="Next (Right Arrow)"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* In Fullscreen: Floating Upward Arrow Tab when bottom bar is closed */}
          {isFullScreen && !showControlsInFullScreen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => {
                  if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                  setShowControlsInFullScreen(true);
                  setIsPinnedOpenInFullScreen(true);
                }}
                className="group flex items-center justify-center gap-1.5 px-5 py-1.5 sm:px-6 sm:py-2 bg-black/85 hover:bg-black/95 text-white/90 hover:text-white rounded-t-xl border-t border-x border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                title="Open bottom bar menu"
                aria-label="Open bottom bar menu"
              >
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:text-amber-400 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 group-hover:text-amber-400 transition-colors">Menu</span>
              </button>
            </motion.div>
          )}

          {/* In Fullscreen: Animated Bottom Dock with Downward Arrow Close Tab */}
          {isFullScreen && (
            <AnimatePresence>
              {showControlsInFullScreen && (
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 35 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute bottom-4 inset-x-3 sm:inset-x-8 z-40 pointer-events-none flex flex-col items-center"
                  onMouseEnter={() => {
                    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                  }}
                  onMouseLeave={() => {
                    if (!isPinnedOpenInFullScreen && !showCompletionModal) {
                      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                      hideTimerRef.current = setTimeout(() => {
                        setShowControlsInFullScreen(false);
                      }, 2000);
                    }
                  }}
                >
                  {/* Downward Arrow Tab (Centered at the top of the open bottom bar) */}
                  <div className="flex justify-center -mb-px relative z-10 pointer-events-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                        setShowControlsInFullScreen(false);
                        setIsPinnedOpenInFullScreen(false);
                      }}
                      className="group flex items-center justify-center gap-1.5 px-5 py-1 sm:px-6 sm:py-1.5 bg-black/85 hover:bg-black/95 text-white/90 hover:text-white rounded-t-xl border-t border-x border-white/20 shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      title="Close bottom bar menu"
                      aria-label="Close bottom bar menu"
                    >
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:text-amber-400 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 group-hover:text-amber-400 transition-colors">Menu</span>
                    </button>
                  </div>

                  <div className="w-full pointer-events-auto">
                    {renderBottomControls(true)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Inside Fullscreen: Slide Diagnostic & Health Inspector Modal (Must be inside slideshowRef for browser fullscreen display) */}
          {isFullScreen && renderDebugModal(true)}

        </div>

        {/* 3. Bottom Controls Area (When NOT in Fullscreen - Always visible) */}
        {!isFullScreen && (
          <div className="w-full mt-2 shrink-0">
            {renderBottomControls(false)}
          </div>
        )}
      </div>

      {/* 4. Outside Fullscreen: Slide Diagnostic & Health Inspector Modal (Renders in normal document view) */}
      {!isFullScreen && renderDebugModal(false)}

      {/* 6. Connect with us Popup Modal Form */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
};

export default Methodology;
