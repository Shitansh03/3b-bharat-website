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
{/* Previous backend service import preserved per zero-deletions rule:
import { getActivePresentation } from "../services/presentationService";
*/}
import { getActivePresentation } from "../services/presentationService";

{/* Previous 10/11 slides images and 9 audios preserved per zero-deletions rule:
export const SLIDES_IMAGES_OLD = [
  "/slides_images/1.png",
  "/slides_images/2.jpeg",
  "/slides_images/3.png",
  "/slides_images/4.png",
  "/slides_images/5.png",
  "/slides_images/6.png",
  "/slides_images/7.png",
  "/slides_images/8.png",
  "/slides_images/9.png",
  "/slides_images/10.png",
  "/slides_images/11.png"
];

export const SLIDES_AUDIOS_OLD = [
  "/slides_audios/1st new intro image audio.mp3",
  "/slides_audios/2nd img(opening - figma and ui ux designer).mp3",
  "/slides_audios/3rd image audio - 3d bharat approach.mpeg",
  "/slides_audios/4th image audio - methodology.mp3",
  "/slides_audios/5th image audio - road methodology.mpeg",
  "/slides_audios/6th image audio - bridge methodology.mpeg",
  "/slides_audios/7th image audio - metro methodology.mp3",
  "/slides_audios/8th image audio - tunnel methodology.mp3",
  "/slides_audios/9th image audio - road deployment.mp3",
];
*/}

// The 12 methodology photos in slides_images folder
export const SLIDES_IMAGES = [
  "/slides_images/1.png",
  "/slides_images/2nd image - task for ui ux designer.jpeg",
  "/slides_images/3.png",
  "/slides_images/4.png",
  "/slides_images/5.png",
  "/slides_images/6.png",
  "/slides_images/7.png",
  "/slides_images/8.png",
  "/slides_images/9.png",
  "/slides_images/10.png",
  "/slides_images/11.png",
  "/slides_images/last image - 12th image - task submission.jpeg",
];

// The 12 sequence-numbered audio files in slides_audios folder matching each image 1 to 12
export const SLIDES_AUDIOS = [
  "/slides_audios/1st new intro image audio.mp3",
  "/slides_audios/2nd image audio - what actual does.mp3",
  "/slides_audios/3rd image - 3d bharat approach.mp3",
  "/slides_audios/4th image audio - 3D bharat methodolgy.mp3",
  "/slides_audios/5th image audio - road methodology.mp3",
  "/slides_audios/6th image audio - bridge methodology.mp3",
  "/slides_audios/7th image audio - metro methodology.mp3",
  "/slides_audios/8th image audio - tunnel methodology.mp3",
  "/slides_audios/9th image audio - road deployment methodolgy.mp3",
  "/slides_audios/10th image audio - bridge deployment methodology.mp3",
  "/slides_audios/11th image audio - measurement methodology.mp3",
  "/slides_audios/12th image audio - last image audio - task submition.mp3",
];

{/* Previous images array preserved per zero-deletions rule:
const images = [
  "/new intro image.png",
  "/1.png",
  "/2.png",
  "/3.png",
  "/4.png",
  "/5.png",
  "/6.png",
  "/7.png",
];
*/}

{/* Previous 4 Public Audio Files preserved per zero-deletions rule:
export const PUBLIC_AUDIOS = [
  "/audio/audio_1.mp3",
  "/audio/audio_2.mp3",
  "/audio/audio_3.mp3",
  "/audio/audio_4.mp3",
];
*/}

{/* Previous backend/mock slides dataset preserved per zero-deletions rule:
export const SLIDES_DATA_LEGACY = [
  {
    id: "slide_1",
    ppt: 1,
    sequence: 1,
    type: 1,
    location: "/new intro image.png",
    audio_location: PUBLIC_AUDIOS[0],
    hasAudio: true,
    ideal_time: 10,
    pause_time: 10,
    title: "Project Introduction",
    status: "ok",
    debugInfo: "All assets loaded successfully. Image resolution verified. Audio stream synchronized with public audio.",
  },
  {
    id: "slide_2",
    ppt: 1,
    sequence: 2,
    type: 1,
    location: "/1.png",
    audio_location: PUBLIC_AUDIOS[1],
    hasAudio: true,
    ideal_time: 27,
    pause_time: 27,
    title: "Road Deployment Plan",
    status: "ok",
    debugInfo: "All assets loaded successfully. Audio stream synchronized with public audio.",
  },
  {
    id: "slide_3",
    ppt: 1,
    sequence: 3,
    type: 2,
    location: "/videos/road-video.mp4",
    audio_location: null,
    hasAudio: true,
    ideal_time: 45,
    video_duration: 45,
    pause_time: 45,
    title: "Road Construction Footage",
    status: "warning",
    debugInfo: "Warning (Blue Dot): Audio track missing or audio sample codec warning for video stream.",
  },
  {
    id: "slide_4",
    ppt: 1,
    sequence: 4,
    type: 1,
    location: "/2.png",
    audio_location: PUBLIC_AUDIOS[2],
    hasAudio: true,
    ideal_time: 52,
    pause_time: 52,
    title: "Structural Chainage Mapping",
    status: "ok",
    debugInfo: "All assets loaded successfully. Chainage markers mapped and audio stream synchronized with public audio.",
  },
  {
    id: "slide_5",
    ppt: 1,
    sequence: 5,
    type: 1,
    location: "/3.png",
    audio_location: "/our-approach/ppt_1/audios/audio_3.mp3",
    hasAudio: false,
    ideal_time: 45,
    pause_time: 45,
    title: "Excavation & Base Layer",
    status: "warning",
    debugInfo: "Warning (Blue Dot): Audio file not found at /our-approach/ppt_1/audios/audio_3.mp3 (HTTP 404).",
  },
  {
    id: "slide_6",
    ppt: 1,
    sequence: 6,
    type: 1,
    location: "/4.png",
    audio_location: PUBLIC_AUDIOS[3],
    hasAudio: true,
    ideal_time: 9,
    pause_time: 9,
    title: "Compaction & Rolling",
    status: "ok",
    debugInfo: "All assets loaded successfully. Rolling specifications and audio stream synchronized with public audio.",
  },
  {
    id: "slide_7",
    ppt: 1,
    sequence: 7,
    type: 1,
    location: "/5.png",
    audio_location: null,
    hasAudio: false,
    ideal_time: 60,
    pause_time: 60,
    title: "Bridge Foundation",
    status: "ok",
    debugInfo: "All assets loaded successfully. Alignment report verified.",
  },
  {
    id: "slide_8",
    ppt: 1,
    sequence: 8,
    type: 2,
    location: "/videos/bridge-video.mp4",
    audio_location: null,
    hasAudio: true,
    ideal_time: 30,
    video_duration: 30,
    pause_time: 30,
    title: "Bridge Inspection Clip",
    status: "ok",
    debugInfo: "All assets loaded successfully. Video streaming active.",
  },
  {
    id: "slide_9",
    ppt: 1,
    sequence: 9,
    type: 1,
    location: "/6.png",
    audio_location: null,
    hasAudio: false,
    ideal_time: 30,
    pause_time: 30,
    title: "Cross Section Analysis",
    status: "ok",
    debugInfo: "All assets loaded successfully. Section data verified.",
  },
  {
    id: "slide_10",
    ppt: 1,
    sequence: 10,
    type: 1,
    location: "/7.png",
    audio_location: null,
    hasAudio: false,
    ideal_time: 30,
    pause_time: 30,
    title: "Final Completion Review",
    status: "warning",
    debugInfo: "Warning (Blue Dot): Metadata incomplete for slide #10 (audio reference missing).",
  },
];
*/}

// 12 Sequential Slides strictly built from /slides_images and /slides_audios folders
export const SLIDES_DATA = [
  {
    id: "slide_1",
    ppt: 1,
    sequence: 1,
    type: 1, // 1 = Image
    location: SLIDES_IMAGES[0], // /slides_images/1.png
    image_location: SLIDES_IMAGES[0],
    audio_location: SLIDES_AUDIOS[0], // /slides_audios/1st new intro image audio.mp3
    hasAudio: true,
    ideal_time: 51,
    pause_time: 51,
    title: "Project Introduction",
    status: "ok",
    debugInfo: "Slide 1: New Intro Image with voice narration.",
  },
  {
    id: "slide_2",
    ppt: 1,
    sequence: 2,
    type: 1,
    location: SLIDES_IMAGES[1], // /slides_images/2nd image - task for ui ux designer.jpeg
    image_location: SLIDES_IMAGES[1],
    audio_location: SLIDES_AUDIOS[1], // /slides_audios/2nd image audio - what actual does.mp3
    hasAudio: true,
    ideal_time: 21,
    pause_time: 21,
    title: "Task for UI UX Designer",
    status: "ok",
    debugInfo: "Slide 2: Opening - Task for UI/UX Designer role description.",
  },
  {
    id: "slide_3",
    ppt: 1,
    sequence: 3,
    type: 1,
    location: SLIDES_IMAGES[2], // /slides_images/3.png
    image_location: SLIDES_IMAGES[2],
    audio_location: SLIDES_AUDIOS[2], // /slides_audios/3rd image - 3d bharat approach.mp3
    hasAudio: true,
    ideal_time: 13,
    pause_time: 13,
    title: "3D Bharat Approach",
    status: "ok",
    debugInfo: "Slide 3: 3D Bharat holistic infrastructure monitoring approach.",
  },
  {
    id: "slide_4",
    ppt: 1,
    sequence: 4,
    type: 1,
    location: SLIDES_IMAGES[3], // /slides_images/4.png
    image_location: SLIDES_IMAGES[3],
    audio_location: SLIDES_AUDIOS[3], // /slides_audios/4th image audio - 3D bharat methodolgy.mp3
    hasAudio: true,
    ideal_time: 14,
    pause_time: 14,
    title: "3D Bharat Methodology",
    status: "ok",
    debugInfo: "Slide 4: Overall methodology workflow overview.",
  },
  {
    id: "slide_5",
    ppt: 1,
    sequence: 5,
    type: 1,
    location: SLIDES_IMAGES[4], // /slides_images/5.png
    image_location: SLIDES_IMAGES[4],
    audio_location: SLIDES_AUDIOS[4], // /slides_audios/5th image audio - road methodology.mp3
    hasAudio: true,
    ideal_time: 67,
    pause_time: 67,
    title: "Road Construction Methodology",
    status: "ok",
    debugInfo: "Slide 5: Road construction monitoring & chainage methodology.",
  },
  {
    id: "slide_6",
    ppt: 1,
    sequence: 6,
    type: 1,
    location: SLIDES_IMAGES[5], // /slides_images/6.png
    image_location: SLIDES_IMAGES[5],
    audio_location: SLIDES_AUDIOS[5], // /slides_audios/6th image audio - bridge methodology.mp3
    hasAudio: true,
    ideal_time: 42,
    pause_time: 42,
    title: "Bridge Infrastructure Methodology",
    status: "ok",
    debugInfo: "Slide 6: Bridge foundations, piers, and girder inspection methodology.",
  },
  {
    id: "slide_7",
    ppt: 1,
    sequence: 7,
    type: 1,
    location: SLIDES_IMAGES[6], // /slides_images/7.png
    image_location: SLIDES_IMAGES[6],
    audio_location: SLIDES_AUDIOS[6], // /slides_audios/7th image audio - metro methodology.mp3
    hasAudio: true,
    ideal_time: 26,
    pause_time: 26,
    title: "Metro Rail Corridor Methodology",
    status: "ok",
    debugInfo: "Slide 7: Metro alignment, stations, and track verification methodology.",
  },
  {
    id: "slide_8",
    ppt: 1,
    sequence: 8,
    type: 1,
    location: SLIDES_IMAGES[7], // /slides_images/8.png
    image_location: SLIDES_IMAGES[7],
    audio_location: SLIDES_AUDIOS[7], // /slides_audios/8th image audio - tunnel methodology.mp3
    hasAudio: true,
    ideal_time: 49,
    pause_time: 49,
    title: "Tunnel Construction Methodology",
    status: "ok",
    debugInfo: "Slide 8: Underground tunnel excavation and 3D profile measurement.",
  },
  {
    id: "slide_9",
    ppt: 1,
    sequence: 9,
    type: 1,
    location: SLIDES_IMAGES[8], // /slides_images/9.png
    image_location: SLIDES_IMAGES[8],
    audio_location: SLIDES_AUDIOS[8], // /slides_audios/9th image audio - road deployment methodolgy.mp3
    hasAudio: true,
    ideal_time: 27,
    pause_time: 27,
    title: "Road Deployment & Execution",
    status: "ok",
    debugInfo: "Slide 9: Field deployment across road construction blocks.",
  },
  {
    id: "slide_10",
    ppt: 1,
    sequence: 10,
    type: 1,
    location: SLIDES_IMAGES[9], // /slides_images/10.png
    image_location: SLIDES_IMAGES[9],
    audio_location: SLIDES_AUDIOS[9], // /slides_audios/10th image audio - bridge deployment methodology.mp3
    hasAudio: true,
    ideal_time: 11,
    pause_time: 11,
    title: "Bridge Deployment Methodology",
    status: "ok",
    debugInfo: "Slide 10: Bridge deployment & execution methodology.",
  },
  {
    id: "slide_11",
    ppt: 1,
    sequence: 11,
    type: 1,
    location: SLIDES_IMAGES[10], // /slides_images/11.png
    image_location: SLIDES_IMAGES[10],
    audio_location: SLIDES_AUDIOS[10], // /slides_audios/11th image audio - measurement methodology.mp3
    hasAudio: true,
    ideal_time: 39,
    pause_time: 39,
    title: "Measurement Methodology",
    status: "ok",
    debugInfo: "Slide 11: Quantitative measurement & precision reporting methodology.",
  },
  {
    id: "slide_12",
    ppt: 1,
    sequence: 12,
    type: 1,
    location: SLIDES_IMAGES[11], // /slides_images/last image - 12th image - task submission.jpeg
    image_location: SLIDES_IMAGES[11],
    audio_location: SLIDES_AUDIOS[11], // /slides_audios/12th image audio - last image audio - task submition.mp3
    hasAudio: true,
    ideal_time: 27,
    pause_time: 27,
    title: "Task Submission",
    status: "ok",
    debugInfo: "Slide 12: Final task submission & project delivery instructions.",
  },
];

export const DEFAULT_AUTO_PLAY_SECONDS = 51;

export const IMAGE_PAUSE_TIMES = {
  0: 51,
  1: 21,
  2: 13,
  3: 14,
  4: 67,
  5: 42,
  6: 26,
  7: 49,
  8: 27,
  9: 11,
  10: 39,
  11: 27,
  default: 30,
};

// 1 minute (60s) pause timer for all image slides
export const PAUSE_TIMER_SECONDS = 60;

{/* Previous Methodology definition without props preserved per zero-deletions rule:
const Methodology = () => {
  const navigate = useNavigate();
  const { openModal: openLoginModal } = useLoginModal();
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetPptId = searchParams.get("ppt") || searchParams.get("wph_id") || 1;
*/}
const Methodology = ({ pptId: pptIdProp = null, onBack = null, backButtonLabel = null }) => {
  const navigate = useNavigate();
  const { openModal: openLoginModal } = useLoginModal();
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetPptId = pptIdProp || searchParams.get("ppt") || searchParams.get("wph_id") || 1;
  const initialSlideParam = searchParams.get("slide");
  {/* Previous 9 max limit preserved per zero-deletions rule:
  const parsedInitialIndex = initialSlideParam !== null && !isNaN(Number(initialSlideParam))
    ? Math.max(0, Math.min(Number(initialSlideParam) - 1, 9))
    : 0;
  */}
  {/* Previous 11 max limit preserved per zero-deletions rule:
  const parsedInitialIndex = initialSlideParam !== null && !isNaN(Number(initialSlideParam))
    ? Math.max(0, Math.min(Number(initialSlideParam) - 1, 11))
    : 0;
  */}
  const parsedInitialIndex = initialSlideParam !== null && !isNaN(Number(initialSlideParam))
    ? Math.max(0, Number(initialSlideParam) - 1)
    : 0;

  {/* Previous static 0 currentIndex preserved per zero-deletions rule:
  const [currentIndex, setCurrentIndex] = useState(0);
  */}
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
  const [slides, setSlides] = useState(SLIDES_DATA);
  const [presentationHeader, setPresentationHeader] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Active slides list (uses dynamic DB slides when fetched, fallback to SLIDES_DATA)
  const activeSlides = slides && slides.length > 0 ? slides : SLIDES_DATA;

  // Current active slide object (initialized early for callback references)
  {/* Previous static currentSlide preserved per zero-deletions rule:
  const currentSlide = SLIDES_DATA[currentIndex] || SLIDES_DATA[0];
  */}
  const currentSlide = activeSlides[currentIndex] || activeSlides[0] || SLIDES_DATA[0];
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_AUTO_PLAY_SECONDS);
  // 1-minute pause timer state (runs when user pauses an image slide)
  const [pauseTimeLeft, setPauseTimeLeft] = useState(PAUSE_TIMER_SECONDS);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // New audio and debug modal states
  const [isMuted, setIsMuted] = useState(false);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  {/* Previous single-boolean showDebugButton preserved:
  const [showDebugButton, setShowDebugButton] = useState(false);
  */}
  {/* Previous per-slide debugSlidesMap preserved per zero-deletions rule:
  const [debugSlidesMap, setDebugSlidesMap] = useState({});
  const showDebugButton = !!debugSlidesMap[currentIndex];
  */}
  // Persistent global state for Debug button visibility: remains visible across slide changes until manually clicked on the dot again
  const [showDebugButton, setShowDebugButton] = useState(false);

  // Slide completion modal state (Prompts user to start again or go to next slide when ideal time / video ends)
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Connect with us popup modal state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  {/* Previous 60% auto brightness and volume preserved:
  const [brightness, setBrightness] = useState(60);
  const [volume, setVolume] = useState(60);
  */}
  {/* Previous 120% auto brightness and volume preserved:
  const [brightness, setBrightness] = useState(120);
  const [volume, setVolume] = useState(120);
  */}
  {/* Previous 150% auto brightness and volume preserved:
  const [brightness, setBrightness] = useState(150);
  const [volume, setVolume] = useState(150);
  */}
  {/* Previous 180% auto brightness and volume preserved:
  const [brightness, setBrightness] = useState(180);
  const [volume, setVolume] = useState(180);
  */}
  // Standard Brightness (100%) and Volume (100%) - Brightness adjustment postponed as requested
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(100);
  const [showBrightnessPopover, setShowBrightnessPopover] = useState(false);
  const [showVolumePopover, setShowVolumePopover] = useState(false);
  const previousSettingsRef = useRef({
    brightness: 100,
    volume: 100,
  });

  // Fullscreen auto-hide controls state & timer ref
  const [showControlsInFullScreen, setShowControlsInFullScreen] = useState(true);
  const [isPinnedOpenInFullScreen, setIsPinnedOpenInFullScreen] = useState(false);
  const hideTimerRef = useRef(null);

  const slideshowRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioSourceMapRef = useRef(new WeakMap());
  const audioGainMapRef = useRef(new WeakMap());

  // Dedicated Video Slide Play Bar States
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoBuffered, setVideoBuffered] = useState(0);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1);
  const [isVideoControlsVisible, setIsVideoControlsVisible] = useState(true);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const videoControlsTimerRef = useRef(null);
  const scrubBarRef = useRef(null);

  // Time format helper for video player (MM:SS)
  const formatVideoTime = useCallback((seconds) => {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Video scrubber jump handler
  const handleScrub = useCallback((e) => {
    if (!scrubBarRef.current || !videoRef.current) return;
    const rect = scrubBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    const targetDuration = videoDuration || videoRef.current.duration || currentSlide.video_duration || 30;
    const newTime = percentage * targetDuration;

    videoRef.current.currentTime = newTime;
    setVideoCurrentTime(newTime);
    const remaining = Math.max(0, Math.ceil(targetDuration - newTime));
    setTimeLeft(remaining);
  }, [videoDuration, currentSlide]);

  // Video scrubber hover and drag handler
  const handleScrubMouseMove = useCallback((e) => {
    if (!scrubBarRef.current) return;
    const rect = scrubBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    const targetDuration = videoDuration || videoRef.current?.duration || currentSlide.video_duration || 30;
    setHoverPosition(clickX);
    setHoverTime(percentage * targetDuration);
    if (isScrubbing) {
      handleScrub(e);
    }
  }, [videoDuration, currentSlide, isScrubbing, handleScrub]);

  // Global mouseup to release scrubbing cleanly
  useEffect(() => {
    const handleMouseUp = () => {
      if (isScrubbing) {
        setIsScrubbing(false);
      }
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [isScrubbing]);

  // Skip forward or backward by N seconds
  const handleSkip = useCallback((seconds) => {
    if (!videoRef.current) return;
    const targetDuration = videoDuration || videoRef.current.duration || currentSlide.video_duration || 30;
    const newTime = Math.max(0, Math.min(targetDuration, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setVideoCurrentTime(newTime);
    setTimeLeft(Math.max(0, Math.ceil(targetDuration - newTime)));
  }, [videoDuration, currentSlide]);

  // Playback speed rate changer
  const handlePlaybackRateChange = useCallback((rate) => {
    setVideoPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  }, []);

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

  {/* Auto brightness/volume boost on mount preserved in comment per user request ("we will see this brightness and audio part after some time"):
  useEffect(() => {
    const savedVol = localStorage.getItem("preferred_audio_volume");
    const savedBri = localStorage.getItem("preferred_screen_brightness");

    previousSettingsRef.current = {
      brightness: savedBri !== null ? Number(savedBri) : 100,
      volume: savedVol !== null ? Number(savedVol) : 100,
    };

    // Auto set to 180% on open as requested
    setBrightness(180);
    setVolume(180);

    return () => {
      // Restore previous brightness and volume on leave / unmount
      if (previousSettingsRef.current.brightness !== undefined) {
        localStorage.setItem("preferred_screen_brightness", previousSettingsRef.current.brightness.toString());
      }
      if (previousSettingsRef.current.volume !== undefined) {
        localStorage.setItem("preferred_audio_volume", previousSettingsRef.current.volume.toString());
      }
    };
  }, []);
  */}

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

  {/* Previous seek-to-elapsed-time on unmute preserved in comments per zero-deletions rule:
  useEffect(() => {
    if (prevMutedRef.current && !isMuted) {
      if (currentSlide.type === 1 && audioRef.current) {
        const slideDur = isPaused
          ? (currentSlide.pause_time || IMAGE_PAUSE_TIMES[currentIndex] || IMAGE_PAUSE_TIMES.default)
          : (currentSlide.ideal_time || DEFAULT_AUTO_PLAY_SECONDS);
        const elapsed = Math.max(0, slideDur - timeLeft);
        const audioDur = audioRef.current.duration;

        if (!audioDur || isNaN(audioDur) || elapsed < audioDur) {
          audioRef.current.currentTime = elapsed;
          audioRef.current.muted = false;
          if (!isPaused) {
            audioRef.current.play().catch(() => {});
          }
        } else {
          audioRef.current.currentTime = audioDur;
          audioRef.current.pause();
        }
      }
    }
    prevMutedRef.current = isMuted;
  }, [isMuted, currentSlide, isPaused, timeLeft, currentIndex]);
  */}

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
        /* Previous if (!isPaused) check preserved per zero-deletions rule:
        if (!isPaused) {
          audioRef.current.play().catch(() => { });
        }
        */
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

  {/* Web Audio API volume booster preserved in comment ("we will see this brightness and audio part after some time"):
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        const resumeOnUserAction = () => {
          if (ctx.state === "suspended") ctx.resume();
          window.removeEventListener("click", resumeOnUserAction);
          window.removeEventListener("keydown", resumeOnUserAction);
        };
        window.addEventListener("click", resumeOnUserAction);
        window.addEventListener("keydown", resumeOnUserAction);
      }

      // Boost audio element if available
      if (audioRef.current) {
        const el = audioRef.current;
        let gainNode = audioGainMapRef.current.get(el);
        if (!gainNode && !audioSourceMapRef.current.has(el)) {
          try {
            const source = ctx.createMediaElementSource(el);
            gainNode = ctx.createGain();
            source.connect(gainNode);
            gainNode.connect(ctx.destination);
            audioSourceMapRef.current.set(el, source);
            audioGainMapRef.current.set(el, gainNode);
          } catch (e) {}
        }
        if (gainNode) {
          gainNode.gain.value = isMuted ? 0 : (volume / 100);
        }
      }

      // Boost video element if available
      if (videoRef.current) {
        const el = videoRef.current;
        let gainNode = audioGainMapRef.current.get(el);
        if (!gainNode && !audioSourceMapRef.current.has(el)) {
          try {
            const source = ctx.createMediaElementSource(el);
            gainNode = ctx.createGain();
            source.connect(gainNode);
            gainNode.connect(ctx.destination);
            audioSourceMapRef.current.set(el, source);
            audioGainMapRef.current.set(el, gainNode);
          } catch (e) {}
        }
        if (gainNode) {
          gainNode.gain.value = isMuted ? 0 : (volume / 100);
        }
      }
    } catch (err) {
      console.warn("AudioContext boost:", err);
    }
  }, [currentIndex, volume, isMuted]);
  */}

  {/* Previous currentSlide declaration preserved (moved above callbacks to resolve TDZ ReferenceError):
  const currentSlide = SLIDES_DATA[currentIndex] || SLIDES_DATA[0];
  */}

  {/* Previous totalDuration calculation preserved:
  const totalDuration = isPaused
    ? currentSlide.pause_time || IMAGE_PAUSE_TIMES[currentIndex] || IMAGE_PAUSE_TIMES.default
    : currentSlide.ideal_time || DEFAULT_AUTO_PLAY_SECONDS;
  */}
  // Total duration reference for the circular percentage calculation (supports video and image slides)
  const totalDuration = currentSlide.type === 2
    ? (currentSlide.video_duration || 30)
    : (isPaused
      ? PAUSE_TIMER_SECONDS
      : currentSlide.ideal_time || DEFAULT_AUTO_PLAY_SECONDS);

  {/* Previous backend presentation fetch effect preserved per zero-deletions rule:
  useEffect(() => {
    let isMounted = true;
    const fetchPresentation = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        const res = await getActivePresentation();
        if (isMounted && res) {
          if (res.slides && res.slides.length > 0) {
            setSlides(res.slides);
          }
          if (res.header) {
            setPresentationHeader(res.header);
            if (res.header.web_ppt_name) {
              document.title = `${res.header.web_ppt_name} - 3D Bharat`;
            }
          }
          if (res.documents) {
            setDocuments(res.documents);
          }
        }
      } catch (err) {
        console.warn("[Methodology] Error fetching active presentation from backend, using default fallback:", err);
        if (isMounted) {
          setFetchError(err?.message || "Failed to load presentation from backend");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPresentation();
    return () => {
      isMounted = false;
    };
  }, []);
  */}

  {/* Previous static page title effect preserved per zero-deletions rule:
  // Frontend-only presentation configuration: Page title
  useEffect(() => {
    document.title = "3D Bharat - To Achieve Precise Work Progress Monitoring";
  }, []);
  */}

  // Dynamic presentation fetch effect keyed to targetPptId
  useEffect(() => {
    let isMounted = true;
    const fetchPresentation = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
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
          setFetchError(err?.message || "Failed to load presentation from backend");
          document.title = "3D Bharat - To Achieve Precise Work Progress Monitoring";
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
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
    {/* Previous SLIDES_DATA target preserved:
    const targetSlide = SLIDES_DATA[currentIndex];
    */}
    const targetSlide = activeSlides[currentIndex] || activeSlides[0];
    const initialDuration = targetSlide?.type === 2
      ? (targetSlide?.video_duration || 30)
      : (targetSlide?.ideal_time || DEFAULT_AUTO_PLAY_SECONDS);
    setTimeLeft(initialDuration);
  }, [currentIndex, activeSlides]);

  // Flag to ensure auto-fullscreen only triggers once on initial entry
  const hasAutoFullScreenTriggeredRef = useRef(false);

  {/* Previous 2-second auto-fullscreen timer preserved per zero-deletions rule:
  useEffect(() => {
    if (hasAutoFullScreenTriggeredRef.current) return;

    const autoFsTimer = setTimeout(() => {
      if (hasAutoFullScreenTriggeredRef.current) return;
      hasAutoFullScreenTriggeredRef.current = true;

      // Automatically transition slides to full screen after 2 seconds
      setIsFullScreen(true);
      if (slideshowRef.current?.requestFullscreen) {
        slideshowRef.current.requestFullscreen().catch(() => {});
      } else if (slideshowRef.current?.webkitRequestFullscreen) {
        slideshowRef.current.webkitRequestFullscreen();
      }
    }, 2000);

    return () => clearTimeout(autoFsTimer);
  }, []);
  */}

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

  /* Previous Fullscreen auto-hide effect preserved per zero-deletions rule:
  useEffect(() => {
    if (!isFullScreen) {
      setShowControlsInFullScreen(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      return;
    }

    const startHideTimer = () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setShowControlsInFullScreen(false);
      }, 2000);
    };

    // Initial reveal in fullscreen with 2s timer
    setShowControlsInFullScreen(true);
    startHideTimer();

    const handleFullscreenMouseMove = (e) => {
      const isNearBottom = e.clientY >= window.innerHeight - 180;
      setShowControlsInFullScreen(true);
      if (!isNearBottom) {
        startHideTimer();
      } else {
        // Stay visible when mouse is in the bottom area
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      }
    };

    window.addEventListener("mousemove", handleFullscreenMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleFullscreenMouseMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isFullScreen]);
  */

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

  {/* Previous toggleFullScreen preserved per zero-deletions rule:
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
  */}

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
    {/* Previous targetSlide preserved per zero-deletions rule:
    const targetSlide = SLIDES_DATA[newIndex];
    */}
    const targetSlide = activeSlides[newIndex] || activeSlides[0];
    const initialTime = targetSlide?.type === 2
      ? (targetSlide?.video_duration || 30)
      : (targetSlide?.ideal_time || DEFAULT_AUTO_PLAY_SECONDS);
    setTimeLeft(initialTime);

    // Keep slide bar in sync! When clicking restart / slide 1 or any slide, smoothly scroll slide bar to that slide
    syncSlideBarToSlide(newIndex);
  }, [syncSlideBarToSlide, activeSlides]);

  {/* Previous circular handleNext and handlePrev preserved per zero-deletions rule:
  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % SLIDES_DATA.length;
    goToSlide(nextIdx);
  }, [currentIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + SLIDES_DATA.length) % SLIDES_DATA.length;
    goToSlide(prevIdx);
  }, [currentIndex, goToSlide]);
  */}

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

  // Download currently displayed slide image
  const [isDownloading, setIsDownloading] = useState(false);
  {/* Previous handleDownloadImage without proxy preserved per zero-deletions rule:
  const handleDownloadImage = useCallback(async (e) => {
    if (e) e.stopPropagation();
    const imageSrc = currentSlide?.image_location || currentSlide?.location;
    if (!imageSrc) return;

    try {
      setIsDownloading(true);
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const fileName = imageSrc.split("/").pop() || `slide_${currentIndex + 1}.png`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn("Direct blob download failed, falling back to direct link:", err);
      const link = document.createElement("a");
      link.href = imageSrc;
      const fileName = imageSrc.split("/").pop() || `slide_${currentIndex + 1}.png`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  }, [currentSlide, currentIndex]);
  */}
  const handleDownloadImage = useCallback(async (e) => {
    if (e) e.stopPropagation();
    const imageSrc = currentSlide?.image_location || currentSlide?.location;
    if (!imageSrc) return;

    try {
      setIsDownloading(true);
      const fileName = imageSrc.split("/").pop().split("?")[0] || `slide_${currentIndex + 1}.jpg`;

      // Use backend proxy endpoint to avoid CORS restrictions and force real download
      const proxyDownloadUrl = `http://localhost:3000/server/presentation/download-proxy?url=${encodeURIComponent(imageSrc)}`;
      
      let blob;
      try {
        const response = await fetch(proxyDownloadUrl);
        if (response.ok) {
          blob = await response.blob();
        } else {
          // Direct fallback attempt
          const directRes = await fetch(imageSrc);
          if (directRes.ok) blob = await directRes.blob();
        }
      } catch (fetchErr) {
        console.warn("Proxy fetch error, falling back to direct download anchor:", fetchErr);
      }

      if (blob) {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        // Fallback: trigger download via proxy URL directly in a temporary iframe to avoid opening in current tab
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = proxyDownloadUrl;
        document.body.appendChild(iframe);
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 5000);
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  }, [currentSlide, currentIndex]);

  {/* Previous active-slide-changing wheel navigation preserved per zero-deletions rule:
  const lastWheelTimeRef = useRef(0);
  const handleWheel = useCallback((e) => {
    if (isDebugOpen || showCompletionModal) return;
    const now = Date.now();
    if (now - lastWheelTimeRef.current < 260) return;

    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(delta) < 12) return;

    if (delta > 0) {
      if (currentIndex < SLIDES_DATA.length - 1) {
        lastWheelTimeRef.current = now;
        goToSlide(currentIndex + 1);
      }
    } else if (delta < 0) {
      if (currentIndex > 0) {
        lastWheelTimeRef.current = now;
        goToSlide(currentIndex - 1);
      }
    }
  }, [currentIndex, goToSlide, isDebugOpen, showCompletionModal]);
  */}

  {/* Duplicate ref declarations preserved in comments per zero-deletions rule:
  const normalThumbnailContainerRef = useRef(null);
  const fsThumbnailContainerRef = useRef(null);
  const thumbnailRefs = useRef({});
  const fsThumbnailRefs = useRef({});
  */}

  {/* Previous slide bar scroll listener preserved per zero-deletions rule:
  useEffect(() => {
    const attachSlideBarWheel = (container) => {
      if (!container) return () => { };
      let velocity = 0;
      let animId = null;

      const updateScroll = () => {
        if (Math.abs(velocity) > 0.2) {
          container.scrollLeft += velocity;
          velocity *= 0.88;
          animId = requestAnimationFrame(updateScroll);
        } else {
          velocity = 0;
          animId = null;
        }
      };

      const onWheelHandler = (e) => {
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (Math.abs(delta) < 1) return;
        e.preventDefault();
        velocity += delta * 1.6;
        velocity = Math.max(-80, Math.min(80, velocity));
        if (!animId) {
          animId = requestAnimationFrame(updateScroll);
        }
      };

      let isDragging = false;
      let startX = 0;
      let scrollStart = 0;

      const onMouseDown = (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollStart = container.scrollLeft;
        velocity = 0;
        if (animId) cancelAnimationFrame(animId);
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollStart - walk;
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      container.addEventListener("wheel", onWheelHandler, { passive: false });
      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      return () => {
        if (animId) cancelAnimationFrame(animId);
        container.removeEventListener("wheel", onWheelHandler);
        container.removeEventListener("mousedown", onMouseDown);
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
  */}

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

  {/* Previous handleStartAgain preserved per zero-deletions rule:
  const handleStartAgain = useCallback(() => {
    setShowCompletionModal(false);
    setIsPaused(false);
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
      if (!isMuted) {
        audioRef.current.play().catch(() => { });
      }
    }
  }, [currentSlide, isMuted]);
  */}

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

  {/* Previous handleTogglePlayPause pausing audio preserved per zero-deletions rule:
  const handleTogglePlayPause = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      setShowCompletionModal(false);
      if (currentSlide.type === 2 && videoRef.current) {
        videoRef.current.play().catch(() => { });
      }
      if (currentSlide.type === 1 && audioRef.current) {
        const slideDur = currentSlide.ideal_time || DEFAULT_AUTO_PLAY_SECONDS;
        const elapsed = Math.max(0, slideDur - timeLeft);
        const audioDur = audioRef.current.duration;
        if (!audioDur || isNaN(audioDur) || elapsed < audioDur) {
          audioRef.current.currentTime = elapsed;
        }
        audioRef.current.muted = isMuted;
        audioRef.current.play().catch(() => { });
      }
    } else {
      setIsPaused(true);
      if (currentSlide.type === 2 && videoRef.current) {
        videoRef.current.pause();
      }
      if (currentSlide.type === 1 && audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isPaused, currentSlide, isMuted, timeLeft]);
  */}

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

  {/* Previous countdown effect moving automatically preserved:
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const nextIdx = (currentIndex + 1) % SLIDES_DATA.length;
          setCurrentIndex(nextIdx);
          setIsPaused(false);
          return DEFAULT_AUTO_PLAY_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);
  */}

  /* Previous countdown effect skipping audio slides preserved per zero-deletions rule:
  useEffect(() => {
    if (isPaused || showCompletionModal) return;

    // For video slides or image slides with active audio, let the media's timeUpdate/ended events drive the countdown
    if (currentSlide.type === 2 || (currentSlide.type === 1 && currentSlide.audio_location)) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Duration reached 0 -> pause and prompt user with completion modal
          setIsPaused(true);
          setShowCompletionModal(true);
          if (currentSlide.type === 2 && videoRef.current) {
            videoRef.current.pause();
          }
          if (currentSlide.type === 1 && audioRef.current) {
            audioRef.current.pause();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, showCompletionModal, currentSlide]);
  */

  {/* Previous countdown effect halting on isPaused preserved per zero-deletions rule:
  useEffect(() => {
    if (isPaused || showCompletionModal) return;

    if (currentSlide.type === 2) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPaused(true);
          setShowCompletionModal(true);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, showCompletionModal, currentSlide]);
  */}

  {/* Previous countdown effect stopping slide on ideal duration preserved per zero-deletions rule:
  useEffect(() => {
    if (showCompletionModal) return;

    if (currentSlide.type === 2) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPaused(true);
          setShowCompletionModal(true);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, showCompletionModal, currentSlide]);
  */}

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
        {/* Previous last slide completion handling preserved per zero-deletions rule:
        setIsPaused(true);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        */}
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

    {/* Previous exclusion of video slides (type === 2) preserved per zero-deletions rule:
    if (currentSlide.type === 2) {
      return;
    }
    */}

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
      {/* Previous f key handler preserved per zero-deletions rule:
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullScreen();
      }
      */}
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

  {/* Previous circular visibleSlides preserved per zero-deletions rule:
  const visibleSlides = [-2, -1, 0, 1, 2].map((offset) => {
    const index = (currentIndex + offset + SLIDES_DATA.length) % SLIDES_DATA.length;
    return {
      offset,
      index,
      slide: SLIDES_DATA[index],
    };
  });
  */}
  {/* Previous semi-circular visibleSlides preserved per zero-deletions rule:
  const isLastSlide = currentIndex === SLIDES_DATA.length - 1;
  const visibleSlides = isLastSlide
    ? [
        ...[-3, -2, -1, 0].map((offset) => {
          const index = currentIndex + offset;
          return {
            offset,
            index,
            slide: SLIDES_DATA[index],
            isRestartButton: false,
          };
        }),
        {
          isRestartButton: true,
          offset: 1,
          index: 0,
          slide: null,
        },
      ]
    : [-2, -1, 0, 1, 2].map((offset) => {
        const index = (currentIndex + offset + SLIDES_DATA.length) % SLIDES_DATA.length;
        return {
          offset,
          index,
          slide: SLIDES_DATA[index],
          isRestartButton: false,
        };
      });
  */}

  // Strictly non-circular visible slides calculation for bottom slider
  // 1. Right after '<', only Slide 1 shows (no wrapping to Slide 9 or Slide 10)
  // 2. Right before the Restart button, only the last slide shows (no wrapping to Slide 1)
  // 3. When active slide is the last slide, 1st slide is NOT shown; only the Restart button is presented
  {/* Previous totalSlides using SLIDES_DATA preserved:
  const totalSlides = SLIDES_DATA.length;
  */}
  const totalSlides = activeSlides.length;
  const isLastSlide = currentIndex === totalSlides - 1;

  const visibleSlides = isLastSlide
    ? [
      // Preceding slides ending strictly with the last slide (Slide 10)
      ...[totalSlides - 4, totalSlides - 3, totalSlides - 2, totalSlides - 1].map((idx) => ({
        offset: idx - currentIndex,
        index: idx,
        slide: activeSlides[idx] || activeSlides[0],
        isRestartButton: false,
      })),
      // 5th slot is strictly the Restart button, without showing Slide 1
      {
        isRestartButton: true,
        offset: 1,
        index: 0,
        slide: null,
      },
    ]
    : (() => {
      // Sliding window of 5 slides clamped within [0, totalSlides - 5]
      // When currentIndex is 0 (Slide 1), startIdx is strictly 0, so Slide 1 is immediately after '<'
      const startIdx = Math.max(0, Math.min(currentIndex - 2, Math.max(0, totalSlides - 5)));
      return Array.from({ length: Math.min(5, totalSlides) }, (_, i) => {
        const idx = startIdx + i;
        return {
          offset: idx - currentIndex,
          index: idx,
          slide: activeSlides[idx] || activeSlides[0],
          isRestartButton: false,
        };
      });
    })();

  {/* Previous renderBottomControls implementation preserved:
  const renderBottomControls = (isFs = false) => (
    <div className="w-full flex items-center justify-between gap-2 sm:gap-3 select-none">
      <div
        className={`flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 rounded-2xl shadow-lg backdrop-blur-xl transition-colors ${
          isFs
            ? "bg-black/75 border border-white/20 shadow-black/60"
            : "bg-white/90 dark:bg-neutral-900/90 border border-gray-200 dark:border-white/10 shadow-sm"
        }`}
      >
        <button
          type="button"
          onClick={handlePrev}
          className={`w-8 h-9 sm:h-11 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${
            isFs
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-white"
          }`}
          title="Previous Slide (<)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5 sm:gap-2 overflow-hidden">
          {visibleSlides.map(({ offset, index, slide }) => {
            const isActive = offset === 0;
            return (
              <motion.button
                key={`${slide.id}-${offset}`}
                type="button"
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative rounded-xl overflow-hidden transition-all duration-300 flex-1 min-w-0 cursor-pointer ${
                  isActive
                    ? "h-11 sm:h-13 border-2 border-amber-500 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/25 z-10 scale-[1.02]"
                    : "h-9 sm:h-11 border border-gray-300 dark:border-white/15 opacity-70 hover:opacity-100"
                }`}
                title={`Slide ${index + 1}: ${slide.title} (${slide.type === 2 ? "Video" : "Image"})`}
              >
                {slide.type === 2 ? (
                  <div className="w-full h-full bg-neutral-950 flex items-center justify-center relative">
                    <Film className="w-4 h-4 text-amber-400/90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-0.5">
                      <span className="text-[8px] font-mono text-white/90 font-bold">VID</span>
                    </div>
                  </div>
                ) : (
                  <img
                    src={slide.location}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <span
                  className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
                    slide.status === "ok" ? "bg-emerald-400" : "bg-sky-400"
                  }`}
                />
                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 bg-amber-500 text-white text-[8px] font-extrabold text-center py-0.2 tracking-wider uppercase shadow-sm">
                    Active
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleNext}
          className={`w-8 h-9 sm:h-11 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${
            isFs
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-white"
          }`}
          title="Next Slide (>)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div
          className={`flex items-center gap-1.5 p-1.5 rounded-2xl shadow-lg backdrop-blur-xl transition-colors ${
            isFs
              ? "bg-black/75 border border-white/20 shadow-black/60"
              : "bg-white/90 dark:bg-neutral-900/90 border border-gray-200 dark:border-white/10 shadow-sm"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
              isMuted
                ? "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25"
                : "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
            }`}
            title={isMuted ? "Sound Muted (Click to Unmute for all slides)" : "Sound ON (Click to Mute all slides)"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden sm:inline">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Sound ON</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleTogglePlayPause}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
              isFs
                ? "bg-white/10 hover:bg-white/20 text-white border-white/15"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-800 dark:text-white border-gray-300 dark:border-white/10"
            }`}
            title={isPaused ? "Resume auto slideshow" : "Pause slideshow (Hold slide)"}
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
          {isPaused && (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-gray-300 dark:border-white/15">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 -rotate-90 transform" viewBox="0 0 54 54">
                  <circle cx="27" cy="27" r="22" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-300 dark:text-white/15" />
                  <circle cx="27" cy="27" r="22" stroke={strokeColor} strokeWidth="4" fill="none" strokeDasharray={strokeCircumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
                </svg>
                <span className={`absolute font-mono text-[8px] ${pauseTimeLeft <= 10 ? "text-red-500 font-extrabold animate-pulse" : "text-gray-800 dark:text-white font-bold"}`}>
                  {pauseTimeLeft}s
                </span>
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsDebugOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer ${
            isFs
              ? "bg-black/75 hover:bg-black/90 text-white border-white/20 shadow-black/60"
              : "bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 text-gray-800 dark:text-white border-gray-200 dark:border-white/10 shadow-sm"
          }`}
          title="Inspect slide data, assets and verification status"
        >
          <Bug className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Debug</span>
          <span
            className={`w-2 h-2 rounded-full ${
              currentSlide.status === "ok" ? "bg-emerald-400" : "bg-sky-400"
            }`}
          />
        </button>
        <button
          type="button"
          onClick={toggleFullScreen}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
            isFs
              ? "bg-black/75 hover:bg-black/90 text-white border-white/20 shadow-black/60"
              : "bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 text-gray-800 dark:text-white border-gray-200 dark:border-white/10 shadow-sm"
          }`}
          title={isFs ? "Exit Fullscreen (Esc or F)" : "View in Fullscreen (F)"}
        >
          {isFs ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-gray-300" />
              <span className="hidden md:inline">Exit</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline">Full Screen</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
  */}

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
        {/* Previous disabled Left Arrow Button preserved per zero-deletions rule:
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`w-8 h-10 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${currentIndex === 0
            ? "opacity-30 cursor-not-allowed pointer-events-none"
            : "hover:scale-105 active:scale-95 cursor-pointer"
            } ${isFs
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-gray-100 hover:bg-gray-200/90 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 shadow-sm"
            }`}
          title={currentIndex === 0 ? "First Slide (No previous slide)" : "Previous Slide (<)"}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        */}

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
          {/* Previous SLIDES_DATA map preserved per zero-deletions rule:
          {SLIDES_DATA.map((slide, index) => {
          */}
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
                onClick={() => goToSlide(index)}
                whileHover={{ scale: isActive ? 1.06 : 1.02 }}
                whileTap={{ scale: 0.96 }}
                /* Previous uniform thumbnail size preserved per zero-deletions rule:
                className={`relative rounded-xl overflow-hidden transition-all duration-200 shrink-0 w-20 sm:w-24 md:w-28 h-11 sm:h-13 cursor-pointer select-none ${isActive
                  ? "border-2 border-orange-500 ring-2 ring-orange-500/40 shadow-[0_0_14px_rgba(249,115,22,0.45)] z-10 opacity-100 scale-[1.02]"
                  : "border border-gray-300 dark:border-white/15 opacity-70 hover:opacity-100 hover:border-gray-400 dark:hover:border-white/30"
                  }`}
                */
                /* Previous mismatch-sized thumbnail class preserved per zero-deletions rule:
                className={`relative rounded-xl overflow-hidden transition-all duration-300 shrink-0 cursor-pointer select-none ${isActive
                  ? "w-24 sm:w-28 md:w-32 h-12 sm:h-14 border-2 border-orange-500 ring-2 ring-orange-500/50 shadow-[0_0_18px_rgba(249,115,22,0.5)] z-20 opacity-100 scale-105"
                  : "w-18 sm:w-22 md:w-25 h-9.5 sm:h-11 border border-gray-300 dark:border-white/15 opacity-65 hover:opacity-95 hover:border-gray-400 dark:hover:border-white/30 scale-95 hover:scale-100"
                  }`}
                */
                className={`relative rounded-xl overflow-hidden transition-all duration-300 shrink-0 cursor-pointer select-none ${isActive
                  ? "w-24 sm:w-28 md:w-32 h-[44px] sm:h-[48px] border-2 border-orange-500 ring-2 ring-orange-500/50 shadow-[0_0_18px_rgba(249,115,22,0.5)] z-20 opacity-100 scale-105"
                  : "w-20 sm:w-24 md:w-28 h-[38px] sm:h-[42px] border border-gray-300 dark:border-white/15 opacity-70 hover:opacity-100 hover:border-gray-400 dark:hover:border-white/30"
                  }`}
                title={`Slide ${index + 1}: ${slide.title} (${slide.type === 2 ? "Video" : "Image"})`}
              >
                {slide.type === 2 ? (
                  <div className="w-full h-full bg-neutral-900 relative flex items-center justify-center overflow-hidden">
                    <video
                      src={`${slide.location}#t=0.5`}
                      preload="metadata"
                      muted
                      playsInline
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <div className="w-4.5 h-4.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow">
                        <Play className="w-2 h-2 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0.5 right-1 px-1 py-0.5 rounded bg-black/70 text-[7px] font-mono font-bold text-white/90">
                      VID
                    </div>
                  </div>
                ) : (
                  /* Previous thumbnail img tag preserved per zero-deletions rule:
                  <img
                    src={slide.location}
                    alt={slide.title}
                    className="w-full h-full object-cover select-none"
                    loading="eager"
                  />
                  */
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

                {/* Previous orange status dot preserved per zero-deletions rule:
                <span
                  className={`absolute top-1 right-1 w-2 h-2 rounded-full ring-1 ring-black/40 z-10 ${slide.status === "ok" ? "bg-emerald-400" : "bg-orange-400"
                    }`}
                />
                */}
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

        {/* Previous Right Action Button with RotateCcw preserved per zero-deletions rule:
        {isLastSlide ? (
          <button
            type="button"
            onClick={() => goToSlide(0)}
            className={`w-8 h-10 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${isFs
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-gray-100 hover:bg-gray-200/90 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 shadow-sm"
              }`}
            title="Restart Slideshow from Slide 1"
            aria-label="Restart Slideshow"
          >
            <RotateCcw className="w-4 h-4" />
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
        */}

        {/* Right Action Button: Home icon on last slide to go to 1st slide, or Next Slide (>) button */}
        {isLastSlide ? (
          <button
            type="button"
            onClick={() => goToSlide(0)}
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
          {/* Previous Audio & Play/Pause buttons with text labels preserved:
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
              isMuted
                ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10"
                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
            }`}
            title={isMuted ? "Sound Muted (Click to Unmute for all slides)" : "Sound ON (Click to Mute all slides)"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Sound ON</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleTogglePlayPause}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
              isPaused
                ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white border-emerald-400/40 shadow-md shadow-emerald-500/30 hover:opacity-95"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-sm shadow-amber-500/10"
            }`}
            title={isPaused ? "Resume auto slideshow" : "Pause slideshow (Hold slide)"}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-white fill-white" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Pause</span>
              </>
            )}
          </button>
          */}

          {/* Previous standalone sound button preserved:
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${
              isMuted
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
          */}

          {/* Previous Sun brightness and volume slider popovers preserved in comments as requested:
          {/* Brightness Control (Auto 60% with Interactive Slider Popover) * /}
          ...
          */}

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

                    {/* Previous bold gradient Next Slide button preserved per zero-deletions rule:
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextFromModal();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:opacity-95 shadow-md shadow-orange-500/30 border border-orange-400/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      title="Proceed to next slide"
                    >
                      <span>Next Slide</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                    */}

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

        {/* Previous unconditionally rendered Debug button preserved:
        <button
          type="button"
          onClick={() => setIsDebugOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border shadow-lg backdrop-blur-2xl transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer ${
            isFs
              ? "bg-black/80 hover:bg-black/95 text-white border-white/20 shadow-2xl shadow-black/80"
              : "bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 text-gray-800 dark:text-white border-gray-200/90 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          }`}
          title="Inspect slide data, assets and verification status"
        >
          <Bug className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform duration-200" />
          <span className="hidden sm:inline">Debug</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ring-1 ring-black/20 ${
              currentSlide.status === "ok" ? "bg-emerald-400 shadow-[0_0_6px_#10b981]" : "bg-sky-400 shadow-[0_0_6px_#0ea5e9]"
            }`}
          />
        </button>
        */}

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

        {/* Previous Fullscreen button beside play/pause preserved per zero-deletions rule:
        <button
          type="button"
          onClick={toggleFullScreen}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border shadow-lg backdrop-blur-2xl transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer ${isFs
            ? "bg-black/80 hover:bg-black/95 text-white border-white/20 shadow-2xl shadow-black/80"
            : "bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 text-gray-800 dark:text-white border-gray-200/90 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            }`}
          title={isFs ? "Exit Fullscreen (Esc or F)" : "View in Fullscreen (F)"}
        >
          {isFs ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-gray-300 group-hover:scale-95 transition-transform" />
              <span className="hidden md:inline">Exit</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Full Screen</span>
            </>
          )}
        </button>
        */}

        {/* Previous Exit Fullscreen button in bottom controls preserved per zero-deletions rule:
        {isFs && (
          <button
            type="button"
            onClick={toggleFullScreen}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border shadow-lg backdrop-blur-2xl transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer bg-black/80 hover:bg-black/95 text-white border-white/20 shadow-2xl shadow-black/80"
            title="Exit Fullscreen (Esc or F)"
          >
            <Minimize2 className="w-3.5 h-3.5 text-gray-300 group-hover:scale-95 transition-transform" />
            <span className="hidden md:inline">Exit</span>
          </button>
        )}
        */}
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
            className="w-full max-w-md bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/15 rounded-2xl shadow-2xl p-5 space-y-4 pointer-events-auto"
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
              /* Previous orange dot alert box preserved per zero-deletions rule:
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-orange-800 dark:text-orange-300">
                    Orange Dot: Asset / Stream Alert
                  </p>
                  <p className="text-[11px] text-orange-700 dark:text-orange-400 mt-0.5">
                    {currentSlide.debugInfo}
                  </p>
                </div>
              </div>
              */
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
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Slide Title</span>
                <span className="font-bold text-gray-800 dark:text-white">{currentSlide.title}</span>
              </div>
              <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Media Type</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {currentSlide.type === 1 ? "Image (Type 1)" : "Video (Type 2)"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-medium">File Location</span>
                <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 truncate max-w-[200px]" title={currentSlide.location}>
                  {currentSlide.location}
                </span>
              </div>
              <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Audio Path</span>
                <span className="font-mono text-[10px] text-gray-700 dark:text-gray-300">
                  {currentSlide.audio_location || "None (Static)"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Ideal Duration</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {currentSlide.ideal_time || currentSlide.video_duration || 30}s
                </span>
              </div>
              <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Sound Output</span>
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

  /* Previous large screen-covering modal preserved per zero-deletions rule (replaced by compact 2-button popup on Play/Pause button):
  const renderCompletionModal = (inFs = false) => (
    <AnimatePresence>
      {showCompletionModal && (
        <motion.div
          key="completion-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${inFs ? "absolute" : "fixed"
            } inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto select-none`}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white/95 dark:bg-neutral-900/95 border border-gray-200 dark:border-white/15 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-6 sm:p-7 space-y-6 text-center backdrop-blur-2xl"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-emerald-500 p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-white dark:bg-neutral-900 rounded-[14px] flex items-center justify-center">
                  {currentSlide.type === 2 ? (
                    <Film className="w-8 h-8 text-orange-500 animate-pulse" />
                  ) : (
                    <RotateCcw className="w-8 h-8 text-orange-500" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {currentSlide.type === 2 ? "Video Completed" : "Slide Completed"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {currentSlide.type === 2
                  ? "Do you want to see this video again or move to the next slide?"
                  : "Do you want to see this image again or move to the next slide?"}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              <span>
                Slide {currentIndex + 1} of {activeSlides.length}: {currentSlide.title || `Slide ${currentIndex + 1}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartAgain}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-gray-800 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300 dark:border-white/20 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-orange-500" />
                <span>Start Again</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromModal}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:opacity-95 shadow-md shadow-orange-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Next Slide</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  */

  {/* Previous root div filter removed so top and bottom bars remain unaffected:
  <div
    className="w-full h-screen max-h-screen overflow-hidden bg-stone-100 dark:bg-black text-gray-900 dark:text-white transition-[filter,colors] duration-300 flex flex-col pt-20 pb-2 px-3 sm:px-6"
    style={{ filter: isFullScreen ? undefined : `brightness(${brightness}%)` }}
  >
  */}
  return (
    <div className="w-full h-screen max-h-screen overflow-hidden bg-stone-100 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex flex-col pt-20 pb-2 px-3 sm:px-6">
      <div className="w-full max-w-6xl mx-auto flex-1 min-h-0 flex flex-col justify-between">
        {/* 1. Explore 3D Bharat Header Bar (Clean, Compact, Above Slideshow) */}
        <div className="w-full shrink-0 mb-1.5">
          <div className="w-full flex items-center justify-between gap-2 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl border border-gray-200 dark:border-white/10 py-1.5 px-3 sm:px-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              {/* Optional onBack button to return to domain cards / categories */}
              {/* Previous onBack button with ArrowLeft icon preserved per zero-deletions rule:
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300/80 dark:border-white/15 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer mr-0.5 shrink-0"
                  title={backButtonLabel || "Back to Modules"}
                  aria-label={backButtonLabel || "Back to Modules"}
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">{backButtonLabel || "Back"}</span>
                  <span className="sm:hidden">Back</span>
                </button>
              )}
              */}
              {/* Previous onBack button without icon preserved per zero-deletions rule:
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300/80 dark:border-white/15 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer mr-0.5 shrink-0"
                  title={backButtonLabel || "Back"}
                  aria-label={backButtonLabel || "Back"}
                >
                  <span className="hidden sm:inline">{backButtonLabel || "Back"}</span>
                  <span className="sm:hidden">Back</span>
                </button>
              )}
              */}
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

              {/* Previous Download Brochure button commented out per user request:
              <a
                href="/3D-Bharat-Document.pdf"
                download="3D-Bharat-Document.pdf"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-semibold text-xs text-white bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:opacity-95 shadow-sm shadow-orange-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download Brochure</span>
                <span className="sm:hidden">Brochure</span>
              </a>
              */}

              {/* Previous anchor redirecting to /#enquiry preserved per zero-deletions rule:
              <a
                href="/#enquiry"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-semibold text-xs text-white bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:opacity-95 shadow-sm shadow-orange-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
                title=""
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Connect with us</span>
                <span className="sm:hidden">Connect</span>
              </a>
              */}

              {/* Previous bold gradient Connect with us button preserved per zero-deletions rule:
              <button
                type="button"
                onClick={() => setIsConnectModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-semibold text-xs text-white bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:opacity-95 shadow-sm shadow-orange-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
                title="Connect with us"
                aria-label="Connect with us"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Connect with us</span>
                <span className="sm:hidden">Connect</span>
              </button>
              */}

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

                {/* Previous custom black tooltip box preserved in comments per zero-deletions rule:
                <div className="absolute top-full mt-2 right-0 sm:left-1/2 sm:-translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50 whitespace-nowrap shadow-2xl">
                  <div className="relative px-3 py-1.5 rounded-xl bg-neutral-900/95 dark:bg-black/95 text-white border border-white/20 text-[11px] font-semibold backdrop-blur-xl shadow-lg">
                    <span className="text-amber-400 font-bold mr-1">Info:</span>
                    <span>To download our demo application</span>
                    <div className="absolute -top-1.5 right-6 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-neutral-900/95 dark:bg-black/95 border-t border-l border-white/20 rotate-45" />
                  </div>
                </div>
                */}
              </motion.button>
            </div>
          </div>
        </div>

        {/* 2. Main Slideshow Display (Constrained height with top-left logo & top-right green/blue health dot) */}
        {/* Previous slideshowRef style filter removed so fullscreen controls are unaffected:
        <div
          ref={slideshowRef}
          style={{ filter: isFullScreen ? `brightness(${brightness}%)` : undefined }}
          className={`relative w-full ${isFullScreen ? "h-screen w-screen bg-black flex items-center justify-center p-0" : "flex-1 min-h-0 w-full flex items-center justify-center bg-black/95 rounded-2xl border border-white/20 dark:border-white/15 shadow-[0_0_30px_rgba(249,115,22,0.18),0_0_40px_rgba(16,185,129,0.18),0_15px_35px_rgba(0,0,0,0.5)]"} overflow-hidden select-none group transition-[filter] duration-300`}
        >
        */}
        {/* Previous slideshow container class preserved per zero-deletions rule:
        <div
          ref={slideshowRef}
          className={`relative w-full ${isFullScreen
            ? "h-screen w-screen bg-black flex items-center justify-center p-0"
            : "flex-1 min-h-0 w-full flex items-center justify-center bg-black/95 rounded-2xl border border-white/20 dark:border-white/15 shadow-[0_0_30px_rgba(249,115,22,0.18),0_0_40px_rgba(16,185,129,0.18),0_15px_35px_rgba(0,0,0,0.5)]"
            } overflow-hidden select-none group`}
        >
        */}
        <div
          ref={slideshowRef}
          className={`relative w-full ${isFullScreen
            ? "fixed inset-0 z-50 h-screen w-screen bg-black flex items-center justify-center p-0"
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
          {/* Previous logo container with background box preserved in comments per zero-deletions rule:
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/20 shadow-lg select-none">
            <img
              src="/images/logo2.png"
              alt="3D Bharat"
              className="h-16 sm:h-16 w-auto object-contain"
              onError={(e) => {
                e.target.src = "/images/logo.png";
              }}
            />
          </div>
          */}
          {/* Previous static-size logo preserved in comments per zero-deletions rule:
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 select-none">
            <img
              src="/images/logo2.png"
              alt="3D Bharat"
              className="w-20 h-20 sm:w-24 sm:h-24 aspect-square object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)] transition-transform duration-200 hover:scale-105"
              onError={(e) => {
                e.target.src = "/images/logo.png";
              }}
            />
          </div>
          */}
          {/* Previous logo shown in normal and fullscreen view preserved per zero-deletions rule:
          <div
            className={`absolute z-20 select-none transition-all duration-300 ${isFullScreen
              ? "top-3 left-3 sm:top-4 sm:left-4"
              : "top-2 left-2 sm:top-2.5 sm:left-2.5"
              }`}
          >
            <img
              src="/images/logo2.png"
              alt="3D Bharat"
              className={`aspect-square object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)] transition-all duration-300 hover:scale-105 ${isFullScreen
                ? "w-20 h-20 sm:w-24 sm:h-24"
                : "w-10 h-10 sm:w-12 sm:h-12"
                }`}
              onError={(e) => {
                e.target.src = "/images/logo.png";
              }}
            />
          </div>
          */}

          {/* Previous logo position beside back button preserved per zero-deletions rule:
          {isFullScreen && (
            <div className="absolute top-3 left-16 sm:top-4 sm:left-18 z-20 select-none transition-all duration-300">
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
          */}

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
          {/* Previous code with text preserved in comments:
          <div
            onClick={() => setIsDebugOpen(true)}
            className="absolute top-3 right-16 sm:top-4 sm:right-18 z-20 flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/20 shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 select-none"
            title={`Status: ${currentSlide.status === "ok" ? "Green Dot (All Data OK)" : "Blue Dot (Warning / Missing Data)"}. Click to inspect.`}
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`w-3 h-3 rounded-full animate-ping absolute opacity-75 ${
                  currentSlide.status === "ok" ? "bg-emerald-400" : "bg-sky-400"
                }`}
              />
              <span
                className={`w-3 h-3 rounded-full relative ${
                  currentSlide.status === "ok"
                    ? "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                    : "bg-sky-500 shadow-[0_0_10px_#0ea5e9]"
                }`}
              />
            </div>
            <span className="text-[11px] font-bold tracking-wide uppercase text-white/90 hidden sm:inline">
              {currentSlide.status === "ok" ? "Verified" : "Warning"}
            </span>
          </div>
          */}

          {/* Previous health dot directly opening modal preserved:
          <div
            onClick={() => setIsDebugOpen(true)}
            className="absolute top-3.5 right-[3.8rem] sm:top-4.5 sm:right-[4.5rem] z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 select-none"
            title={`Status: ${currentSlide.status === "ok" ? "All Data OK (Green Dot)" : "Warning / Missing Data (Blue Dot)"}. Click to inspect.`}
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`w-2 h-2 rounded-full animate-ping absolute opacity-75 ${
                  currentSlide.status === "ok" ? "bg-emerald-400" : "bg-sky-400"
                }`}
              />
              <span
                className={`w-2 h-2 rounded-full relative ${
                  currentSlide.status === "ok"
                    ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                    : "bg-sky-500 shadow-[0_0_8px_#0ea5e9]"
                }`}
              />
            </div>
          </div>
          */}

          {/* Previous global toggle preserved:
          <div
            onClick={() => setShowDebugButton((prev) => !prev)}
            className={`absolute top-3.5 right-[3.8rem] sm:top-4.5 sm:right-[4.5rem] z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md border shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 select-none ${
              showDebugButton
                ? "bg-black/90 border-amber-400/60 ring-2 ring-amber-400/40 shadow-amber-500/20"
                : "bg-black/60 hover:bg-black/85 border-white/20"
            }`}
            title={`Status: ${currentSlide.status === "ok" ? "All Data OK (Green Dot)" : "Warning / Missing Data (Blue Dot)"}. Click to ${showDebugButton ? "hide" : "reveal"} Debug button.`}
          >
          */}

          {/* Previous black circle container with pulsing dot preserved in comments per zero-deletions rule:
          <div
            onClick={() => {
              setDebugSlidesMap((prev) => ({
                ...prev,
                [currentIndex]: !prev[currentIndex],
              }));
            }}
            className={`absolute top-3.5 right-[3.8rem] sm:top-4.5 sm:right-[4.5rem] z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md border shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 select-none ${
              showDebugButton
                ? "bg-black/90 border-amber-400/60 ring-2 ring-amber-400/40 shadow-amber-500/20"
                : "bg-black/60 hover:bg-black/85 border-white/20"
            }`}
            title={`Status: ${currentSlide.status === "ok" ? "All Data OK (Green Dot)" : "Warning / Missing Data (Orange Dot)"}. Click to ${showDebugButton ? "hide" : "reveal"} Debug button for this slide.`}
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`w-2 h-2 rounded-full animate-ping absolute opacity-75 ${
                  currentSlide.status === "ok" ? "bg-emerald-400" : "bg-orange-400"
                }`}
              />
              <span
                className={`w-2 h-2 rounded-full relative ${
                  currentSlide.status === "ok"
                    ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                    : "bg-orange-500 shadow-[0_0_8px_#f97316]"
                }`}
              />
            </div>
          </div>
          */}

          {/* Previous per-slide dot onClick preserved per zero-deletions rule:
          <button
            type="button"
            onClick={() => {
              setDebugSlidesMap((prev) => ({
                ...prev,
                [currentIndex]: !prev[currentIndex],
              }));
            }}
            className="absolute top-3.5 right-[3.8rem] sm:top-4.5 sm:right-[4.5rem] z-20 p-2 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-95 select-none focus:outline-none bg-transparent border-0"
            title={`Status: ${currentSlide.status === "ok" ? "All Data OK (Green Dot)" : "Warning / Missing Data (Blue Dot)"}. Click to ${showDebugButton ? "hide" : "reveal"} Debug button for this slide.`}
            aria-label="Toggle Debug button"
          >
          */}
          {/* Previous toggle debug button preserved per zero-deletions rule:
          <button
            type="button"
            onClick={() => setShowDebugButton((prev) => !prev)}
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
          */}
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
            /* Previous status dot position right-[3.8rem] preserved per zero-deletions rule:
            className="absolute top-3.5 right-[3.8rem] sm:top-4.5 sm:right-[4.5rem] z-20 p-2 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-95 select-none focus:outline-none bg-transparent border-0"
            */
            className="absolute top-3.5 right-[6.6rem] sm:top-4.5 sm:right-[7.5rem] z-20 p-2 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-95 select-none focus:outline-none bg-transparent border-0"
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

          {/* Previous media display container preserved:
          <div className="w-full h-full flex items-center justify-center overflow-hidden p-2">
          */}
          {/* Animated Clean Media Display (Supports Image or Video - Pure original image render without pixel filter distortion) */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden p-2">
            {/* Screen Display Brightness Layer preserved in comment per user request ("let it be we will see this brightness and audio part after some time"):
            <div
              className="absolute inset-0 pointer-events-none z-10 transition-all duration-300"
              style={{
                background:
                  brightness > 100
                    ? `radial-gradient(ellipse at center, rgba(255, 255, 255, ${Math.min(0.25, (brightness - 100) / 320)}) 0%, rgba(255, 255, 255, ${Math.min(0.12, (brightness - 100) / 600)}) 100%)`
                    : `rgba(0, 0, 0, ${(100 - brightness) / 100})`,
                mixBlendMode: brightness > 100 ? "screen" : "normal",
              }}
            />
            */}
            <AnimatePresence mode="wait">
              {currentSlide.type === 2 ? (
                // Video Slide with Integrated Interactive Video Play Bar (Normal & Fullscreen view)
                <motion.div
                  key={`video-${currentIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  onMouseMove={handleVideoMouseMove}
                  onMouseEnter={() => setIsVideoControlsVisible(true)}
                  onMouseLeave={handleVideoMouseLeave}
                  className="w-full h-full flex items-center justify-center relative group"
                >
                  {/* Previous basic video tag preserved:
                  <video
                    ref={videoRef}
                    key={currentSlide.location}
                    src={currentSlide.location}
                    autoPlay
                    playsInline
                    muted={isMuted}
                    onEnded={() => {
                      setTimeLeft(0);
                      setIsPaused(true);
                      setShowCompletionModal(true);
                    }}
                    onTimeUpdate={(e) => {
                      if (currentSlide.type === 2 && !showCompletionModal && !isPaused) {
                        const remaining = Math.max(0, Math.ceil(e.currentTarget.duration - e.currentTarget.currentTime));
                        if (!isNaN(remaining)) {
                          setTimeLeft(remaining);
                        }
                      }
                    }}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
                  />
                  */}
                  {/* Previous video onEnded implementations preserved per zero-deletions rule:
                  // Version 1 (open completion modal):
                  onEnded={() => {
                    setTimeLeft(0);
                    setIsPaused(true);
                    setShowCompletionModal(true);
                  }}
                  // Version 2 (auto-advance with completion modal fallback on last slide):
                  onEnded={() => {
                    setTimeLeft(0);
                    if (currentIndex < activeSlides.length - 1) {
                      goToSlide(currentIndex + 1);
                    } else {
                      setIsPaused(true);
                      setShowCompletionModal(true);
                    }
                  }}
                  */}
                  <video
                    ref={videoRef}
                    key={currentSlide.location}
                    src={currentSlide.location}
                    autoPlay
                    playsInline
                    muted={isMuted}
                    onLoadedMetadata={(e) => {
                      const dur = e.currentTarget.duration;
                      if (dur && !isNaN(dur) && isFinite(dur)) {
                        setVideoDuration(dur);
                        setTimeLeft(Math.ceil(dur));
                      }
                    }}
                    onTimeUpdate={(e) => {
                      if (!isScrubbing) {
                        const cur = e.currentTarget.currentTime;
                        setVideoCurrentTime(cur);
                        const dur = e.currentTarget.duration || currentSlide.video_duration || 30;
                        setVideoDuration(dur);
                        const remaining = Math.max(0, Math.ceil(dur - cur));
                        if (!isNaN(remaining) && !showCompletionModal && !isPaused) {
                          setTimeLeft(remaining);
                        }
                      }
                      try {
                        const b = e.currentTarget.buffered;
                        if (b && b.length > 0) {
                          setVideoBuffered(b.end(b.length - 1));
                        }
                      } catch (err) { }
                    }}
                    onEnded={() => {
                      setTimeLeft(0);
                      if (currentIndex < activeSlides.length - 1) {
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

                  {/* Previous large 2-tier video play bar preserved in comments per zero-deletion rule:
                  <AnimatePresence>
                    {isVideoControlsVisible && (
                      <motion.div
                        className="absolute inset-x-2 sm:inset-x-6 md:inset-x-8 z-30 pointer-events-auto transition-all duration-300 flex justify-center"
                      >
                        <div className="w-full max-w-4xl bg-black/85 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 sm:p-3 shadow-[0_8px_32px_rgba(0,0,0,0.7)] text-white select-none">
                          <div ref={scrubBarRef} className="relative w-full h-4 sm:h-5 flex items-center cursor-pointer group/scrub mb-1.5">
                            ...
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  */}

                  {/* Previous Floating Video Play Bar (audio/scrubber bar on video) preserved per zero-deletions rule:
                  <AnimatePresence>
                    {isVideoControlsVisible && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className={`absolute inset-x-0 z-30 pointer-events-auto flex justify-center px-3 transition-all duration-300 ${isFullScreen
                          ? showControlsInFullScreen
                            ? "bottom-20 sm:bottom-24" // Above fullscreen bottom dock
                            : "bottom-10 sm:bottom-12" // Above upward arrow tab in fullscreen when dock hides
                          : "bottom-3 sm:bottom-3.5"   // Neatly placed at bottom of video in normal view
                          }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        // Streamlined Floating Pill Container
                        <div className="w-full max-w-[540px] bg-black/75 hover:bg-black/90 backdrop-blur-2xl border border-white/20 rounded-full px-3 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] text-white flex items-center gap-2 select-none">

                          // 1. Play / Pause Button (Gradient Round Button)
                          <button
                            type="button"
                            onClick={handleTogglePlayPause}
                            className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/30 transition-transform cursor-pointer"
                            title={isPaused ? "Play Video" : "Pause Video"}
                            aria-label={isPaused ? "Play Video" : "Pause Video"}
                          >
                            {isPaused ? (
                              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                            ) : (
                              <Pause className="w-3.5 h-3.5 text-white fill-white" />
                            )}
                          </button>

                          // 2. Current Time (Elapsed)
                          <span className="text-[10px] font-mono font-semibold text-white/90 shrink-0">
                            {formatVideoTime(videoCurrentTime)}
                          </span>

                          // 3. Interactive Scrubber Timeline (Flex Grow)
                          <div
                            ref={scrubBarRef}
                            onMouseDown={(e) => {
                              setIsScrubbing(true);
                              handleScrub(e);
                            }}
                            onMouseMove={handleScrubMouseMove}
                            onMouseLeave={() => setHoverTime(null)}
                            className="relative flex-1 h-3 flex items-center cursor-pointer group/scrub min-w-[100px]"
                          >
                            // Hover Time Tooltip
                            {hoverTime !== null && (
                              <div
                                className="absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 rounded bg-neutral-900 border border-white/20 text-[10px] font-mono text-white pointer-events-none shadow-lg z-20"
                                style={{ left: `${hoverPosition}px` }}
                              >
                                {formatVideoTime(hoverTime)}
                              </div>
                            )}

                            // Background Track
                            <div className="w-full h-1 group-hover/scrub:h-1.5 rounded-full bg-white/20 transition-all relative overflow-hidden">
                              // Buffered Bar
                              <div
                                className="absolute top-0 bottom-0 left-0 bg-white/30 rounded-full transition-all duration-300"
                                style={{
                                  width: `${videoDuration ? (videoBuffered / videoDuration) * 100 : 0}%`,
                                }}
                              />
                              // Played Bar
                              <div
                                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 rounded-full transition-all"
                                style={{
                                  width: `${videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%`,
                                }}
                              />
                            </div>

                            // Draggable Scrubber Thumb
                            <div
                              className="absolute w-2.5 h-2.5 rounded-full bg-white border border-orange-500 shadow-md -translate-x-1/2 opacity-0 group-hover/scrub:opacity-100 transition-opacity pointer-events-none"
                              style={{
                                left: `${videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%`,
                              }}
                            />
                          </div>

                          // 4. Total Duration
                          <span className="text-[10px] font-mono font-medium text-white/50 shrink-0">
                            {formatVideoTime(videoDuration || currentSlide.video_duration || 30)}
                          </span>

                          // 5. Volume Mute & Mini Slider
                          <div className="flex items-center gap-1 group/vol shrink-0">
                            <button
                              type="button"
                              onClick={() => setIsMuted((prev) => !prev)}
                              className="w-6 h-6 rounded-md hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                              title={isMuted ? "Unmute Sound" : "Mute Sound"}
                              aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
                            >
                              {isMuted ? (
                                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                            </button>

                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={isMuted ? 0 : volume}
                              onChange={(e) => {
                                const newVol = Number(e.target.value);
                                setVolume(newVol);
                                if (newVol > 0 && isMuted) {
                                  setIsMuted(false);
                                }
                              }}
                              className="w-12 sm:w-16 h-1 accent-orange-500 bg-white/20 rounded-lg cursor-pointer transition-all opacity-70 hover:opacity-100"
                              title={`Volume: ${isMuted ? 0 : volume}%`}
                              aria-label="Video Volume"
                            />
                          </div>

                          // 6. Playback Speed Selector
                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={() => setShowSpeedMenu((prev) => !prev)}
                              className="px-1.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-white/90 border border-white/10 transition-all cursor-pointer"
                              title="Speed"
                            >
                              {videoPlaybackRate}x
                            </button>

                            <AnimatePresence>
                              {showSpeedMenu && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: -6 }}
                                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                  transition={{ duration: 0.12 }}
                                  className="absolute bottom-full right-0 mb-1 py-1 px-1 rounded-xl bg-neutral-900 border border-white/20 shadow-2xl z-40 flex flex-col min-w-[65px]"
                                >
                                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                    <button
                                      key={rate}
                                      type="button"
                                      onClick={() => handlePlaybackRateChange(rate)}
                                      className={`px-2 py-0.5 text-left text-[11px] font-mono rounded-lg transition-colors cursor-pointer ${videoPlaybackRate === rate
                                        ? "bg-orange-500 text-white font-bold"
                                        : "hover:bg-white/10 text-white/80"
                                        }`}
                                    >
                                      {rate}x
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          // 7. Restart Button
                          <button
                            type="button"
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = 0;
                                setVideoCurrentTime(0);
                                if (isPaused) {
                                  setIsPaused(false);
                                  videoRef.current.play().catch(() => { });
                                }
                              }
                            }}
                            className="w-6 h-6 rounded-md hover:bg-white/10 text-white/70 hover:text-amber-400 flex items-center justify-center transition-all cursor-pointer shrink-0"
                            title="Restart Video"
                            aria-label="Restart Video"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  */}
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
                      {/* Previous audio element with duration override preserved per zero-deletions rule:
                      <audio
                        ref={audioRef}
                        key={`audio-${currentSlide.audio_location}`}
                        src={currentSlide.audio_location}
                        autoPlay={!isPaused && !isMuted}
                        muted={isMuted}
                        playsInline
                        onLoadedMetadata={(e) => {
                          const dur = Math.ceil(e.currentTarget.duration);
                          if (dur && !isNaN(dur) && isFinite(dur)) {
                            setTimeLeft(dur);
                          }
                        }}
                        onTimeUpdate={(e) => {
                          if (currentSlide.type === 1 && !showCompletionModal && !isPaused) {
                            const remaining = Math.max(0, Math.ceil(e.currentTarget.duration - e.currentTarget.currentTime));
                            if (!isNaN(remaining) && isFinite(remaining)) {
                              setTimeLeft(remaining);
                            }
                          }
                        }}
                        onEnded={() => {
                          setTimeLeft(0);
                          setIsPaused(true);
                          setShowCompletionModal(true);
                        }}
                      />
                      */}
                      {/* Previous audio with seek-to-elapsed-time onLoadedMetadata preserved per zero-deletions rule:
                      <audio
                        ref={audioRef}
                        key={`audio-${currentSlide.audio_location}`}
                        src={currentSlide.audio_location}
                        autoPlay={!isPaused}
                        muted={isMuted}
                        playsInline
                        onLoadedMetadata={(e) => {
                          const slideDur = isPaused
                            ? (currentSlide.pause_time || IMAGE_PAUSE_TIMES[currentIndex] || IMAGE_PAUSE_TIMES.default)
                            : (currentSlide.ideal_time || DEFAULT_AUTO_PLAY_SECONDS);
                          const elapsed = Math.max(0, slideDur - timeLeft);
                          const audioDur = e.currentTarget.duration;
                          if (elapsed > 0 && (!audioDur || isNaN(audioDur) || elapsed < audioDur)) {
                            e.currentTarget.currentTime = elapsed;
                          }
                          e.currentTarget.muted = isMuted;
                          if (!isPaused) {
                            e.currentTarget.play().catch(() => {});
                          }
                        }}
                      />
                      */}
                      {/* Previous simple audio element preserved per zero-deletions rule:
                      <audio
                        ref={audioRef}
                        key={`audio-${currentSlide.audio_location}`}
                        src={currentSlide.audio_location}
                        autoPlay={!isPaused}
                        muted={isMuted}
                        playsInline
                        onLoadedMetadata={(e) => {
                          e.currentTarget.currentTime = 0;
                          e.currentTarget.muted = isMuted;
                          if (!isPaused) {
                            e.currentTarget.play().catch(() => { });
                          }
                        }}
                        onEnded={() => {
                        }}
                      />
                      */}

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
                          setAudioCurrentTime(audioDuration || e.currentTarget.duration || 0);
                        }}
                      />

                      {/* Floating Audio Play Bar for Image Slides preserved in comments per zero-deletions rule (controls moved to bottom slide bar dock):
                      <AnimatePresence>
                        {currentSlide.type === 1 && currentSlide.audio_location && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.96 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className={`absolute inset-x-0 z-30 pointer-events-auto flex justify-center px-3 transition-all duration-300 ${isFullScreen
                              ? showControlsInFullScreen
                                ? "bottom-20 sm:bottom-24"
                                : "bottom-10 sm:bottom-12"
                              : "bottom-3 sm:bottom-3.5"
                              }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="w-full max-w-[480px] sm:max-w-[530px] bg-black/80 hover:bg-black/92 backdrop-blur-2xl border border-white/20 hover:border-amber-400/50 rounded-full px-3 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.65)] text-white flex items-center gap-1.5 sm:gap-2 select-none">
                              
                              <button
                                type="button"
                                onClick={handleToggleAudioPlay}
                                className="w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/30 transition-transform cursor-pointer"
                                title={isAudioPlaying ? "Pause Audio" : "Play Audio"}
                                aria-label={isAudioPlaying ? "Pause Audio" : "Play Audio"}
                              >
                                {isAudioPlaying ? (
                                  <Pause className="w-3.5 h-3.5 text-white fill-white" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSkipAudio(-5)}
                                className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer group shrink-0"
                                title="Rewind 5 seconds"
                                aria-label="Rewind 5 seconds"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-amber-400 group-hover:-rotate-45 transition-transform" />
                                <span className="text-[9px] font-mono font-bold text-white/90">5s</span>
                              </button>

                              <span className="text-[10px] font-mono font-semibold text-white/90 shrink-0">
                                {formatVideoTime(audioCurrentTime)}
                              </span>

                              <div
                                ref={audioScrubBarRef}
                                onMouseDown={(e) => {
                                  setIsAudioScrubbing(true);
                                  handleAudioScrub(e);
                                }}
                                onMouseMove={handleAudioScrubMouseMove}
                                onMouseLeave={() => setAudioHoverTime(null)}
                                className="relative flex-1 h-3 flex items-center cursor-pointer group/scrub min-w-[70px]"
                              >
                                {audioHoverTime !== null && (
                                  <div
                                    className="absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 rounded bg-neutral-900 border border-white/20 text-[10px] font-mono text-white pointer-events-none shadow-lg z-20"
                                    style={{ left: `${audioHoverPosition}px` }}
                                  >
                                    {formatVideoTime(audioHoverTime)}
                                  </div>
                                )}

                                <div className="w-full h-1 group-hover/scrub:h-1.5 rounded-full bg-white/20 transition-all relative overflow-hidden">
                                  <div
                                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 rounded-full transition-all"
                                    style={{
                                      width: `${audioDuration ? Math.min(100, (audioCurrentTime / audioDuration) * 100) : 0}%`,
                                    }}
                                  />
                                </div>

                                <div
                                  className="absolute w-2.5 h-2.5 rounded-full bg-white border border-amber-500 shadow-md -translate-x-1/2 opacity-0 group-hover/scrub:opacity-100 transition-opacity pointer-events-none"
                                  style={{
                                    left: `${audioDuration ? Math.min(100, (audioCurrentTime / audioDuration) * 100) : 0}%`,
                                  }}
                                />
                              </div>

                              <span className="text-[10px] font-mono font-medium text-white/50 shrink-0">
                                {formatVideoTime(audioDuration || currentSlide.ideal_time || 30)}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleSkipAudio(5)}
                                className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer group shrink-0"
                                title="Forward 5 seconds"
                                aria-label="Forward 5 seconds"
                              >
                                <span className="text-[9px] font-mono font-bold text-white/90">5s</span>
                                <RotateCw className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setIsMuted((prev) => !prev)}
                                className="w-6 h-6 rounded-md hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                                title={isMuted ? "Unmute Sound" : "Mute Sound"}
                                aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
                              >
                                {isMuted ? (
                                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                                ) : (
                                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                              </button>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      */}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Previous static bottom-left button preserved per zero-deletions rule:
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullScreen();
            }}
            className={`absolute z-50 flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold border border-white/20 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer bg-black/75 hover:bg-black/90 text-white select-none pointer-events-auto ${isFullScreen
              ? showControlsInFullScreen
                ? "bottom-20 sm:bottom-24 left-3 sm:left-4"
                : "bottom-3 left-3 sm:bottom-4 sm:left-4"
              : "bottom-3 left-3 sm:bottom-4 sm:left-4"
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
          */}

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

          {/* Previous Bottom-Right Download Button preserved in comments per zero-deletions rule:
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className={`absolute z-50 flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold border shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer bg-black/75 hover:bg-black/90 text-white select-none pointer-events-auto border-white/20 hover:border-amber-400/80 ${isFullScreen
              ? showControlsInFullScreen
                ? "bottom-20 sm:bottom-24 right-3 sm:right-4"
                : "bottom-3 right-3 sm:bottom-4 sm:right-4"
              : "bottom-3 right-3 sm:bottom-4 sm:right-4"
              }`}
            title="Download Current Slide Image"
            aria-label="Download Current Slide Image"
          >
            {isDownloading ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Download</span>
              </>
            )}
          </button>
          */}

          {/* Previous unconditional Top-Left Back Arrow Button preserved per zero-deletions rule:
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/openings");
            }}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 hover:border-amber-400/80 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group cursor-pointer"
            title="Back to Openings"
            aria-label="Back to Openings"
          >
            <ArrowLeft className="w-5 h-5 text-gray-200 group-hover:text-amber-400 group-hover:-translate-x-0.5 transition-all" />
          </button>
          */}

          {/* Previous unconditional navigate("/openings") back button preserved per zero-deletions rule:
          {!isFullScreen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/openings");
              }}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 hover:border-amber-400/80 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group cursor-pointer"
              title="Back to Openings"
              aria-label="Back to Openings"
            >
              <ArrowLeft className="w-5 h-5 text-gray-200 group-hover:text-amber-400 group-hover:-translate-x-0.5 transition-all" />
            </button>
          )}
          */}

          {/* Top-Left Back Arrow Button (Intelligently returns to Our Approach Technical/Non-Technical cards or Openings) */}
          {!isFullScreen && (
            <button
              type="button"
              onClick={handleBackNavigation}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 hover:border-amber-400/80 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group cursor-pointer"
              title={
                searchParams.get("category")
                  ? `Back to ${searchParams.get("category") === "technical" ? "Technical" : "Non-Technical"} Modules`
                  : "Back"
              }
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-200 group-hover:text-amber-400 group-hover:-translate-x-0.5 transition-all" />
            </button>
          )}

          {/* Top-Right Download Slide Image Button (Beside Fullscreen button) */}
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="absolute top-3 right-14 sm:top-4 sm:right-16 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 hover:border-amber-400/80 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group cursor-pointer select-none"
            title={isDownloading ? "Image Downloaded!" : "Download Current Slide Image"}
            aria-label="Download Current Slide Image"
          >
            {isDownloading ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Download className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            )}
          </button>

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

          {/* Previous unconditional Left Arrow Button preserved in comments per zero-deletions rule:
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group"
            title="Previous (Left Arrow)"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          */}

          {/* Previous disabled Left Arrow Button preserved per zero-deletions rule:
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 text-white border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 z-20 group ${currentIndex === 0
              ? "opacity-25 cursor-not-allowed pointer-events-none"
              : "hover:bg-black/90 hover:scale-110 active:scale-95 cursor-pointer"
              }`}
            title={currentIndex === 0 ? "First Slide (No previous slide)" : "Previous (Left Arrow)"}
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          */}

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

          {/* Previous unconditional Right Arrow Button preserved in comments:
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group"
            title="Next (Right Arrow)"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
          */}

          {/* Previous Right Arrow / RotateCcw Restart Button preserved per zero-deletions rule:
          {currentIndex === SLIDES_DATA.length - 1 ? (
            <button
              type="button"
              onClick={() => goToSlide(0)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 group cursor-pointer"
              title="Restart Slideshow (Open 1st Slide)"
              aria-label="Restart Slideshow from 1st Slide"
            >
              <RotateCcw className="w-6 h-6 text-white group-hover:-rotate-90 transition-transform duration-300" />
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
          */}

          {/* Right Action Button: Home icon on Last Slide (Open 1st Slide) or Next (Right Arrow) */}
          {currentIndex === activeSlides.length - 1 ? (
            <button
              type="button"
              onClick={() => goToSlide(0)}
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

          {/* Previous Fullscreen Bottom Hover Zone preserved per zero-deletions rule:
          {isFullScreen && (
            <div
              className="absolute bottom-0 inset-x-0 h-36 z-30 pointer-events-auto"
              onMouseEnter={() => setShowControlsInFullScreen(true)}
              onMouseMove={() => setShowControlsInFullScreen(true)}
            />
          )}
          */}

          {/* In Fullscreen: Floating Upward Arrow Tab when bottom bar is closed */}
          {isFullScreen && !showControlsInFullScreen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
            >
              {/* Previous upward arrow button preserved per zero-deletions rule:
              <button
                type="button"
                onClick={() => {
                  if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                  setShowControlsInFullScreen(true);
                  setIsPinnedOpenInFullScreen(true);
                }}
                className="group flex items-center justify-center px-6 py-1.5 sm:px-8 sm:py-2 bg-black/85 hover:bg-black/95 text-white/90 hover:text-white rounded-t-xl border-t border-x border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                title="Open bottom bar"
                aria-label="Open bottom bar"
              >
                <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 group-hover:text-amber-400 group-hover:scale-110 transition-transform duration-200" />
              </button>
              */}
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

          {/* Previous In Fullscreen: Animated Auto-Hiding Bottom Dock preserved:
          {isFullScreen && (
            <AnimatePresence>
              {showControlsInFullScreen && (
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 35 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute bottom-4 inset-x-3 sm:inset-x-8 z-40 pointer-events-auto"
                  onMouseEnter={() => {
                    setShowControlsInFullScreen(true);
                    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                  }}
                  onMouseMove={() => {
                    setShowControlsInFullScreen(true);
                    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                  }}
                  onMouseLeave={() => {
                    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                    hideTimerRef.current = setTimeout(() => {
                      setShowControlsInFullScreen(false);
                    }, 2000);
                  }}
                >
                  {renderBottomControls(true)}
                </motion.div>
              )}
            </AnimatePresence>
          )}
          */}

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
                    {/* Previous downward arrow button preserved per zero-deletions rule:
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                        setShowControlsInFullScreen(false);
                        setIsPinnedOpenInFullScreen(false);
                      }}
                      className="group flex items-center justify-center px-6 py-1 sm:px-8 sm:py-1.5 bg-black/85 hover:bg-black/95 text-white/90 hover:text-white rounded-t-xl border-t border-x border-white/20 shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      title="Close bottom bar"
                      aria-label="Close bottom bar"
                    >
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 group-hover:text-amber-400 group-hover:scale-110 transition-transform duration-200" />
                    </button>
                    */}
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

          {/* Inside Fullscreen: Slide Completion Modal (Replaced by compact 2-button popup on Play/Pause button; previous modal preserved per zero-deletions rule):
          {isFullScreen && renderCompletionModal(true)}
          */}
        </div>

        {/* 3. Bottom Controls Area (When NOT in Fullscreen - Always visible) */}
        {!isFullScreen && (
          <div className="w-full mt-2 shrink-0">
            {renderBottomControls(false)}
          </div>
        )}
      </div>


      {/* Previous static modal markup preserved in comments:
      <AnimatePresence>
        {isDebugOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsDebugOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/15 rounded-2xl shadow-2xl p-5 space-y-4"
            >
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
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

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

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Slide Title</span>
                  <span className="font-bold text-gray-800 dark:text-white">{currentSlide.title}</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Media Type</span>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {currentSlide.type === 1 ? "Image (Type 1)" : "Video (Type 2)"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">File Location</span>
                  <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 truncate max-w-[200px]" title={currentSlide.location}>
                    {currentSlide.location}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Audio Path</span>
                  <span className="font-mono text-[10px] text-gray-700 dark:text-gray-300">
                    {currentSlide.audio_location || "None (Static)"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Ideal Duration</span>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {currentSlide.ideal_time || currentSlide.video_duration || 30}s
                  </span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Sound Output</span>
                  <span className={`font-bold ${isMuted ? "text-red-500" : "text-emerald-500"}`}>
                    {isMuted ? "Globally Muted" : "Active / Unmuted"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDebugOpen(false)}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all duration-200"
              >
                Close Inspector
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      */}

      {/* 4. Outside Fullscreen: Slide Diagnostic & Health Inspector Modal (Renders in normal document view) */}
      {!isFullScreen && renderDebugModal(false)}

      {/* 5. Outside Fullscreen: Slide Completion Modal (Replaced by compact 2-button popup on Play/Pause button; previous modal preserved per zero-deletions rule):
      {!isFullScreen && renderCompletionModal(false)}
      */}

      {/* 6. Connect with us Popup Modal Form */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
};

export default Methodology;



