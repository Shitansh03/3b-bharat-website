import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import RegistrationModal from "./RegistrationModal";
import { BASE_URL } from "../services/api";

// ── Category-wise content data (UNCHANGED from previous) ──────────────────────

const getModulesData = (cat) => {
  const c = cat.toLowerCase();

  if (c === "road") {
    return [
      {
        title: "Design Operations",
        items: [
          { prefix: "1.", text: "Cutting" },
          { prefix: "2.", text: "Digging" },
          { prefix: "3.", text: "Filling (crossed once, rewritten)" }
        ],
        borderClass: "border-amber-400",
        titleClass: "text-amber-600 dark:text-amber-400"
      },
      {
        title: "Material",
        items: [
          { prefix: "•", text: "Filling (BOM)" }
        ],
        borderClass: "border-orange-500",
        titleClass: "text-orange-600 dark:text-orange-400"
      }
    ];
  }
  if (c === "bridge") {
    return [
      {
        title: "Design",
        items: [
          { prefix: "•", text: "Footing" },
          { prefix: "•", text: "Pillar" },
          { prefix: "•", text: "Span" },
          { prefix: "•", text: "Deck" }
        ],
        borderClass: "border-blue-400",
        titleClass: "text-blue-600 dark:text-blue-400"
      },
      {
        title: "Material",
        items: [
          { prefix: "•", text: "Quantity of materials like cement & bars" },
          { prefix: "•", text: "Configuration" }
        ],
        borderClass: "border-amber-500",
        titleClass: "text-amber-600 dark:text-amber-400"
      }
    ];
  }
  if (c === "railway" || c === "railways") {
    return [
      {
        title: "Railway and Metro",
        items: [
          { prefix: "•", text: "Cant Angle" },
          { prefix: "•", text: "OHE wire angle & height analysis" },
          { prefix: "•", text: "Track intersection angle" }
        ],
        borderClass: "border-green-500",
        titleClass: "text-green-600 dark:text-green-400"
      }
    ];
  }
  if (c === "measurement" || c === "measurements") {
    return [
      {
        title: "Measurements",
        items: [
          { prefix: "•", text: "Road & bridge component or assets measurement (street light height, pillar volume & outer side)" },
          { prefix: "•", text: "Building" }
        ],
        borderClass: "border-purple-500",
        titleClass: "text-purple-600 dark:text-purple-400"
      }
    ];
  }

  return [
    {
      title: "Inspection Module",
      items: [{ prefix: "•", text: "Understand real site data" }],
      borderClass: "border-amber-400",
      titleClass: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Design & Progress Module",
      items: [{ prefix: "•", text: "Create and track designs" }],
      borderClass: "border-orange-500",
      titleClass: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Monitoring Module",
      items: [{ prefix: "•", text: "Analyze and improve project work" }],
      borderClass: "border-red-500",
      titleClass: "text-red-600 dark:text-red-400"
    }
  ];
};

const getWhyChooseData = (cat) => {
  const c = cat.toLowerCase();

  if (c === "road") {
    return [
      { title: "Master professional 3D road site monitoring and design analysis", desc: "Gain hands-on expertise in visualizing and analyzing real-world road construction progress." },
      { title: "Focus on practical road engineering over theory", desc: "Move beyond books and understand how road projects work in real scenarios." },
      { title: "Use real 3D data from highway & road projects", desc: "Work with the same professional data used in road infrastructure." },
      { title: "Build confidence for real road sites and tools", desc: "Be prepared to handle road-specific tasks and professional design software." },
      { title: "Simple road design interface", desc: "Experience a tool that makes complex road monitoring much easier to manage." }
    ];
  }
  if (c === "bridge") {
    return [
      { title: "Master professional 3D bridge site monitoring and structural analysis", desc: "Gain hands-on expertise in visualizing and analyzing real-world bridge construction." },
      { title: "Focus on practical bridge engineering over theory", desc: "Move beyond books and understand how bridge components work in real scenarios." },
      { title: "Use real 3D data from bridge & flyover projects", desc: "Work with the same professional data used in bridge infrastructure." },
      { title: "Build confidence for real bridge sites and tools", desc: "Be prepared to handle bridge-specific tasks and professional analysis software." },
      { title: "Simple bridge monitoring interface", desc: "Experience a tool that makes complex bridge data much easier to manage." }
    ];
  }
  if (c === "railway" || c === "railways") {
    return [
      { title: "Master professional 3D railway monitoring and track analysis", desc: "Gain hands-on expertise in visualizing and analyzing real-world railway progress." },
      { title: "Focus on practical railway engineering over theory", desc: "Move beyond books and understand how railway tracks & OHE work in real scenarios." },
      { title: "Use real 3D data from railway & metro projects", desc: "Work with the same professional data used in railway infrastructure." },
      { title: "Build confidence for real railway sites and tools", desc: "Be prepared to handle track-specific tasks and professional rail software." },
      { title: "Simple railway monitoring interface", desc: "Experience a tool that makes complex rail data much easier to manage." }
    ];
  }

  return [
    { title: "Master professional 3D site monitoring and design analysis", desc: "Gain hands-on expertise in visualizing and analyzing real-world construction progress in 3D." },
    { title: "Focus on practical learning over theory", desc: "Move beyond books and understand how things work in real scenarios." },
    { title: "Use real 3D data from construction & infrastructure projects", desc: "Work with the same data used by professionals." },
    { title: "Build confidence to work on real sites and tools", desc: "Be prepared to handle real-world tasks with ease." },
    { title: "Simple and easy-to-use platform", desc: "Experience a tool that is much easier compared to complicated software." }
  ];
};

// ── Component ─────────────────────────────────────────────────────────────────

const TrialInfoPage = () => {
  const [searchParams] = useSearchParams();
  const rawCategory = searchParams.get("category") || "Trial";

  // Normalize the category internally to handle spaces, plurals, or different URL formats
  const getNormalizedCategory = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes("railway") || c.includes("metro")) return "railway";
    if (c.includes("road")) return "road";
    if (c.includes("bridge")) return "bridge";
    if (c.includes("measurement")) return "measurement";
    return c;
  };

  const category = getNormalizedCategory(rawCategory);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloadStats, setDownloadStats] = useState({ files: 0, apps: 0 });

  const carouselSlides = [
    {
      img: "/images/road-construction-monitoring.png",
      label: "Road Construction",
      text: "Master Real-World Road Design & Monitoring"
    },
    {
      img: "/images/bridge.jpg",
      label: "Bridge Construction",
      text: "Explore Bridge Structures in 3D"
    },
    {
      img: "/images/point-cloud-img.png",
      label: "Railway & Infrastructure",
      text: "Analyze Railway Site Data with Precision"
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchDownloadCounts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/3dtrial/download-counts`);
        const json = await response.json();
        if (json) {
          const countsArray = Array.isArray(json.data) ? json.data : (json.data?.data || []);

          let files = json.total_file_download_count || 0;
          let apps = json.total_app_download_count || 0;

          if (countsArray.length > 0 && category && category.toLowerCase() !== "trial") {
            const catLower = category.toLowerCase();
            const matchedCat = countsArray.find(c => {
              if (!c.category_name) return false;
              const nameLower = c.category_name.toLowerCase();
              return nameLower === catLower || nameLower.includes(catLower);
            });

            if (matchedCat) {
              files = matchedCat.file_download_count || 0;
              apps = matchedCat.app_download_count || 0;
            }
          }

          setDownloadStats({ files, apps });
        }
      } catch (error) {
        console.error("Error fetching download counts:", error);
      }
    };

    fetchDownloadCounts();

    // Listen for custom event from RegistrationModal
    const handleRefresh = () => {
      fetchDownloadCounts();
    };

    window.addEventListener("refreshDownloadCounts", handleRefresh);

    return () => {
      window.removeEventListener("refreshDownloadCounts", handleRefresh);
    };
  }, [category]);

  // Animation variants
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const scaleUpVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const staggerList = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const listItemVariant = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const verticalLineVariant = {
    hidden: { height: 0, opacity: 0 },
    show: { height: "100%", opacity: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.1 } },
  };

  const horizontalLineVariant = {
    hidden: { scaleX: 0, opacity: 0 },
    show: { scaleX: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut", originX: 0, delay: 0.1 } },
  };

  const getCategoryDisplayName = (cat) => {
    const c = cat.toLowerCase();
    if (c === "railway" || c === "railways") return "Railways and Metro";
    if (c === "measurement" || c === "measurements") return "Measurements";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  const formattedCategory = getCategoryDisplayName(category);

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-black text-gray-800 dark:text-gray-200 relative pt-32">

      {/* Fixed Background Image — faded so carousel slides attract attention */}
      <div
        className="fixed inset-0 z-0 opacity-10 dark:opacity-8 pointer-events-none bg-cover bg-center bg-no-repeat transition-opacity duration-700"
        style={{ backgroundImage: "url('/images/road-construction-monitoring.png')" }}
      />

      {/* Background Orbs — overflow clipped to their own container only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 -m-32 w-80 h-80 rounded-full bg-amber-400/10 dark:bg-amber-500/10 filter blur-[80px]" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -m-32 w-80 h-80 rounded-full bg-orange-400/10 dark:bg-red-500/10 filter blur-[80px]" />
      </div>

      <div className="max-w-[1400px] mx-auto z-10 relative px-4 sm:px-6 lg:px-12">

        {/* Download Stats Moved Down to Carousel Image section */}

        {/* ======================================================= */}
        {/* HERO SECTION: Left (Heading + Boxes) | Right (Carousel) */}
        {/* ======================================================= */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 pb-16">

          {/* LEFT: Heading + Start Learning + Why Join */}
          <div className="lg:col-span-7 space-y-6">

            {/* Badge + Heading */}
            <motion.div initial="hidden" animate="show" variants={fadeUpVariant} className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black tracking-widest uppercase shadow-sm">
                {formattedCategory} Module
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                3D Bharat <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">Career Track</span>
              </h1>
              <p className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/60 dark:bg-amber-900/40 border border-amber-500/50 text-base md:text-lg font-black text-amber-800 dark:text-amber-300 tracking-wide shadow-md shadow-amber-500/10 transition-all hover:shadow-lg hover:bg-amber-100/80 dark:hover:bg-amber-900/60">
                Start your journey from student <span className="text-amber-600 dark:text-amber-400 mx-1 flex items-center animate-bounce">→</span> professional
              </p>
            </motion.div>

            {/* Start Your Learning Journey */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={scaleUpVariant}
              className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
            >
              <motion.div variants={verticalLineVariant} className="absolute left-0 top-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500 group-hover:w-1.5 transition-all duration-300 origin-top" />
              <h3 className="text-lg font-bold mb-3 text-emerald-900 dark:text-emerald-400">Start Your Learning Journey</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                <span className="font-bold text-gray-900 dark:text-white">Free Files & Designs. </span>
                We provide free files, free content, and initial free designs which make it incredibly easy to learn and help you smoothly navigate your first time using professional tools.
              </p>
            </motion.div>

            {/* Why You Should Join */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg relative overflow-hidden shrink-0 group"
            >
              <motion.div variants={horizontalLineVariant} initial="hidden" animate="show" className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 origin-left" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why You Should Join?</h2>
              <motion.div variants={staggerList} initial="hidden" animate="show" className="flex flex-col gap-2.5">
                {[
                  "Learn industry-ready skills",
                  "Work with real-world 3D design data",
                  "Gain hands-on practical experience",
                ].map((pill, i) => (
                  <motion.div key={i} variants={listItemVariant} className="flex items-center text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mr-2.5 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <span className="font-bold text-sm leading-snug">{pill}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT: Image Carousel */}
          <div className="lg:col-span-5 relative mt-12 md:mt-0">
            {/* Download Stats Corner Widget - Positioned matching diagram */}
            {(downloadStats.files > 0 || downloadStats.apps > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -top-10 right-4 md:right-10 z-[60] flex items-center gap-3 md:gap-4 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-amber-500/20 shadow-[0_8px_30px_rgb(245,158,11,0.15)] rounded-2xl px-4 py-2.5 group hover:bg-white/95 dark:hover:bg-black/80 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3 -mt-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest leading-none mb-1.5">App Downloads</span>
                    <span className="text-3xl font-black text-gray-800 dark:text-white leading-none tracking-tight">
                      {downloadStats.apps.toLocaleString()}<span className="text-amber-500 ml-0.5 text-2xl">+</span>
                    </span>
                  </div>
                </div>

                <div className="w-px h-12 bg-gray-300 dark:bg-gray-700 mx-3" />

                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest leading-none mb-1.5">Files Downloaded</span>
                    <span className="text-3xl font-black text-gray-800 dark:text-white leading-none tracking-tight">
                      {downloadStats.files.toLocaleString()}<span className="text-amber-500 ml-0.5 text-2xl">+</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border-2 border-amber-500/10 group h-[440px] lg:h-[520px]">
              <AnimatePresence>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={carouselSlides[currentSlide].img}
                    alt={carouselSlides[currentSlide].label}
                    className="w-full h-full object-cover transition-transform duration-[5000ms] ease-linear group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="absolute bottom-10 left-10 text-white z-20"
                  >
                    <span className="inline-block px-3 py-1 rounded-md bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest mb-3">
                      {carouselSlides[currentSlide].label}
                    </span>
                    <p className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-md">
                      {carouselSlides[currentSlide].text}
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Indicators */}
              <div className="absolute top-8 right-10 flex gap-2 z-30">
                {carouselSlides.map((_, i) => (
                  <div key={i} className="w-10 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: i === currentSlide ? "100%" : i < currentSlide ? "100%" : "0%" }}
                      transition={{ duration: i === currentSlide ? 4 : 0.3, ease: "linear" }}
                      className="h-full bg-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* MAIN SECTION: Left Content | Right Sticky Form           */}
        {/* ======================================================= */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-16">

          {/* LEFT: Main Content Sections */}
          <div className="lg:col-span-8 space-y-12">

            {/* ── WHY STUDENTS CHOOSE (first in left col per wireframe) ── */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-md shadow-black/5 hover:border-amber-300 dark:hover:border-amber-500/40 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div variants={verticalLineVariant} className="absolute left-0 top-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 group-hover:w-1.5 transition-all duration-300 origin-top" />
              <h3 className="text-lg font-bold mb-1.5 text-gray-900 dark:text-white">Why Students Choose 3D Bharat?</h3>
              <p className="text-base text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 font-bold mb-1.5">Learn by doing — not just by studying.</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 font-medium">Students choose 3D Bharat to gain real, practical experience that prepares them for the industry.</p>
              <motion.div variants={staggerList} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-3">
                {getWhyChooseData(category).map((item, i) => (
                  <motion.div
                    key={i}
                    variants={listItemVariant}
                    whileHover={{ x: 6 }}
                    className="flex items-start bg-gray-50/50 dark:bg-white/5 p-3.5 rounded-xl border border-gray-100 dark:border-white/5 hover:border-amber-300/50 dark:hover:border-amber-500/30 transition-all duration-300 cursor-default"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 mr-4 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-0.5">{item.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="bg-white/40 dark:bg-black/20 border border-amber-200/50 dark:border-amber-500/20 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden"
            >
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm shadow-lg shadow-amber-500/20">
                  <span className="font-black text-xs">GO</span>
                </span>
                Your Journey to Professional 3D Mastery
              </h3>

              <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-6 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden lg:block absolute top-[28px] left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent dark:via-amber-500/20 -z-0" />
                {[
                  { step: "01", title: "Registration", desc: "Fill details and verify your account via OTP" },
                  { step: "02", title: "App Download", desc: "Download our specialized 3D selection & monitoring app" },
                  { step: "03", title: "Access Free Files", desc: "Get instant access to free 3D data and designs" },
                  { step: "04", title: "Design & Operations", desc: "Practice Cutting, Digging, Filling on real project data" },
                  { step: "05", title: "Start Learning", desc: "Master 3D with authentic industry-standard data" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    whileHover={{ y: -6, scale: 1.05 }}
                    className="relative z-10 flex flex-col items-center text-center group cursor-default"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 border-2 border-amber-500/60 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black mb-4 shadow-xl group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-600 transition-all duration-500 ease-out text-base tracking-tighter">
                      {item.step}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 leading-tight uppercase tracking-tight">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold leading-relaxed px-1 opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── EVERYTHING YOU NEED TO SUCCEED ── */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-12 h-1 bg-gradient-to-r from-amber-500 to-red-500 mx-auto rounded-full mb-4"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">Everything You Need to Succeed</h2>
            </div>

            {/* ── PROBLEMS STUDENTS FACE ── */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-900/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-red-900 dark:text-red-400">What Problems Students Face Today?</h3>
                <p className="text-base text-gray-600 dark:text-gray-400 font-medium">Most students struggle because of:</p>
              </div>
              <motion.div variants={staggerList} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-wrap justify-center gap-3">
                {[
                  "No real project experience",
                  "No site-level understanding",
                  "No hands-on practice with tools",
                  "Why do students struggle to get jobs even after completing their degree?",
                  "Why do students feel underconfident during interviews?",
                  "Why are students not ready to work on real construction/site projects from Day 1?"
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={scaleUpVariant}
                    whileHover={{ y: -3, scale: 1.03 }}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-red-950/40 rounded-full border border-red-200 dark:border-red-500/30 shadow-sm hover:shadow-md hover:border-red-400 dark:hover:border-red-400/60 transition-all duration-200 cursor-default"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white font-black text-[9px] leading-none">✕</span>
                    </div>
                    <span className="text-red-800 dark:text-red-300 font-semibold text-xs md:text-sm leading-snug">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
              <div className="mt-8 pt-5 relative text-center">
                <motion.div variants={horizontalLineVariant} initial="hidden" whileInView="show" viewport={{ once: true }} className="absolute top-0 left-0 right-0 h-[1px] bg-red-200 dark:bg-red-500/20" />
                <p className="text-gray-700 dark:text-gray-300 font-bold italic text-base mt-3">
                  "That's why students feel unprepared for real jobs."
                </p>
              </div>
            </motion.div>

            {/* ── WHAT WE PROVIDE ── */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="bg-gradient-to-br from-stone-50 to-amber-50 dark:from-gray-900 dark:to-gray-800/50 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden group"
            >
              <motion.div variants={verticalLineVariant} className="absolute top-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-orange-600 group-hover:w-1.5 transition-all duration-300 origin-top" />

              <div className="mb-8 lg:w-2/3">
                <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white">What We Provide</h2>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  At 3D Bharat, we solve these problems by giving you access to the same resources used in the industry.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Box Lists */}
                <div className="space-y-4">
                  {[
                    { title: "Real 3D Data", desc: "So students can work on actual design projects instead of only theory" },
                    { title: "Design-Based Learning (Cutting, Digging, Filling)", desc: "So students understand real work they will do in jobs" },
                    { title: "Material Calculation (BOM)", desc: "So students can confidently handle practical tasks in interviews & jobs" },
                    { title: "Measurement Techniques", desc: "So students can perform real site-level analysis" },
                    { title: "Easy Tool Handling Process", desc: "So students don't feel overwhelmed like in AutoCAD/Civil 3D" }
                  ].map((item, i) => (
                    <motion.div key={i} whileHover={{ x: 6 }} className="flex flex-col border-l-[3px] border-amber-200 dark:border-amber-500/40 pl-4 py-1 transition-transform bg-white/40 dark:bg-white/5 rounded-r-lg">
                      <span className="font-bold text-base text-gray-900 dark:text-white mb-0.5">{item.title}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Right Box Cards */}
                <motion.div variants={staggerList} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 gap-5 h-fit">
                  <motion.div variants={scaleUpVariant} className="bg-white/80 dark:bg-black/40 p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-md hover:border-amber-300 dark:hover:border-amber-500/50 transition-all hover:-translate-y-0.5">
                    <h4 className="font-bold text-base text-amber-600 dark:text-amber-400 mb-3 block border-b border-amber-100 dark:border-amber-500/20 pb-3">Advanced Design Module</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      <li className="flex items-start"><span className="text-amber-500 mr-2 mt-0.5">&bull;</span>Design roads, bridges & infrastructure</li>
                      <li className="flex items-start"><span className="text-amber-500 mr-2 mt-0.5">&bull;</span>Perform asset mapping (street lights, signals)</li>
                    </ul>
                  </motion.div>
                  <motion.div variants={scaleUpVariant} className="bg-white/80 dark:bg-black/40 p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-md hover:border-orange-300 dark:hover:border-orange-500/50 transition-all hover:-translate-y-0.5">
                    <h4 className="font-bold text-base text-orange-600 dark:text-orange-400 mb-3 block border-b border-orange-100 dark:border-orange-500/20 pb-3">Interchainage & Merging</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      <li className="flex items-start"><span className="text-orange-500 mr-2 mt-0.5">&bull;</span>Understand interchainage sections</li>
                      <li className="flex items-start"><span className="text-orange-500 mr-2 mt-0.5">&bull;</span>Analyze connection of different segments</li>
                    </ul>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* ── WORKFLOW & MODULES ── */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">

              {/* What You Will Do Here */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
                className="bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 h-fit"
              >
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3">What You Will Do Here</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium mt-3">Students will actively work on real workflows:</p>
                <motion.div variants={staggerList} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-3">
                  {[
                    "Load real project data into the application",
                    "Create and understand design",
                    "Calculate materials required for construction",
                    "Perform measurements using tools",
                    "Give feedback and improve understanding"
                  ].map((step, i) => (
                    <motion.div key={i} variants={listItemVariant} className="flex items-center group cursor-default">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center font-bold text-gray-400 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-600 transition-all duration-300 shrink-0 text-sm">
                        {i + 1}
                      </div>
                      <div className="ml-4 flex-1 p-3 bg-white dark:bg-black/30 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm group-hover:shadow transition-all text-gray-800 dark:text-gray-200 font-medium group-hover:border-amber-200 dark:group-hover:border-amber-800/50 text-sm">
                        {step}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Our Learning Modules — bullets only */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
                className="bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 lg:p-8 shadow-md flex flex-col h-fit"
              >
                <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3">Our Learning Modules</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium mt-3">Structured into specialized tracks:</p>
                <motion.div variants={staggerList} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-col gap-4">
                  {getModulesData(category).map((mod, i) => (
                    <motion.div key={i} variants={scaleUpVariant} className={`p-4 bg-white dark:bg-gray-900 rounded-xl border-l-[3px] ${mod.borderClass} shadow-sm hover:shadow-md transition-all duration-300 cursor-default h-fit`}>
                      <h5 className={`font-bold text-base mb-3 ${mod.titleClass}`}>{mod.title}</h5>
                      <div className="flex flex-col gap-2">
                        {mod.items.map((item, idx) => (
                          <div key={idx} className="flex items-center group">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                              {item.text || item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: Sticky Registration Form ONLY */}
          <div className="lg:col-span-4 sticky top-24 self-start z-20">

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col items-stretch justify-start relative ring-1 ring-black/5 dark:ring-white/10">

                {/* Form Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-white/10 px-6 py-5 flex items-center justify-between shrink-0 relative overflow-hidden">
                  <motion.div
                    variants={horizontalLineVariant}
                    initial="hidden"
                    animate="show"
                    className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 origin-left"
                  />
                  <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                    Get Free Access
                  </span>
                </div>

                {/* Registration Modal — scrollable form area */}
                <div className="py-2 px-1 relative w-full max-h-[80vh] overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900 rounded-b-[2rem]">
                  <RegistrationModal isOpen={true} inline={true} forcedCategory={category.toLowerCase()} onClose={() => { }} />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialInfoPage;
