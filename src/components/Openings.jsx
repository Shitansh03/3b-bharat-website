import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Palette,
  Code2,
  Server,
  TrendingUp,
  Smartphone,
  Cpu,
  ArrowRight,
  Briefcase,
  Lock,
  Clock,
} from "lucide-react";
import { useEffect } from "react";

const openingsList = [
  {
    id: "figma-uiux",
    title: "Figma / UI UX Designer",
    category: "Design & Product",
    type: "Full Time",
    icon: Palette,
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    status: "Actively Hiring",
    isClickable: true,
    pptId: 1,
    description:
      "Design intuitive web & tablet interfaces for 3D construction mapping, point-cloud visualization tools, and client dashboards.",
    skills: ["Figma", "UI/UX", "Wireframing", "Design Systems"],
    ctaText: "Apply",
  },
  {
    /* Previous python-dev configuration preserved per zero-deletions rule:
    id: "python-dev",
    title: "Python Developer",
    category: "Engineering",
    type: "Full Time",
    icon: Code2,
    badgeColor: "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-400/20",
    status: "Opening Soon",
    isClickable: false,
    description:
      "Build high-performance spatial data processing scripts, geospatial algorithms, and backend services.",
    skills: ["Python", "FastAPI / Django", "Data Pipelines"],
    ctaText: "Opening Soon",
    */
    id: "python-dev",
    title: "Python Developer",
    category: "Engineering",
    type: "Full Time",
    icon: Code2,
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    status: "Actively Hiring",
    isClickable: true,
    pptId: 2,
    description:
      "Build high-performance spatial data processing scripts, geospatial algorithms, and backend services.",
    skills: ["Python", "FastAPI / Django", "Data Pipelines"],
    ctaText: "Apply",
  },
  {
    id: "nodejs-dev",
    title: "Node.js / Express Developer",
    category: "Engineering",
    type: "Full Time",
    icon: Server,
    badgeColor: "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-400/20",
    status: "Opening Soon",
    isClickable: false,
    description:
      "Develop scalable microservices, authentication systems, payment workflows, and cloud storage pipelines.",
    skills: ["Node.js", "Express.js", "PostgreSQL", "REST APIs"],
    ctaText: "Opening Soon",
  },
  {
    id: "marketing-sales",
    title: "Marketing & Sales",
    category: "Growth & Business",
    type: "Full Time",
    icon: TrendingUp,
    badgeColor: "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-400/20",
    status: "Opening Soon",
    isClickable: false,
    description:
      "Drive institutional awareness and outreach to construction contractors and infrastructure planners across India.",
    skills: ["B2B Outreach", "Client Relationship", "Lead Generation"],
    ctaText: "Opening Soon",
  },
  {
    id: "android-flutter",
    title: "Android / Flutter Developer",
    category: "Mobile Engineering",
    type: "Full Time",
    icon: Smartphone,
    badgeColor: "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-400/20",
    status: "Opening Soon",
    isClickable: false,
    description:
      "Build offline-first tablet applications used by site engineers for chainage-level construction tracking.",
    skills: ["Flutter", "Android SDK", "Offline Sync"],
    ctaText: "Opening Soon",
  },
  {
    id: "ai-ml",
    title: "AI & ML Engineer",
    category: "Research & Intelligence",
    type: "Full Time",
    icon: Cpu,
    badgeColor: "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-400/20",
    status: "Opening Soon",
    isClickable: false,
    description:
      "Train computer vision models for automated defect recognition, point-cloud segmentation, and volume calculation.",
    skills: ["PyTorch / TensorFlow", "Computer Vision", "3D Point Clouds"],
    ctaText: "Opening Soon",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const Openings = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "3D Bharat - Openings & Careers";
    window.scrollTo(0, 0);
  }, []);

  const handleCardClick = (opening) => {
    if (opening.isClickable) {
      {/* Previous navigate to slide 2 for figma-uiux preserved per zero-deletions rule:
      if (opening.id === "figma-uiux") {
        navigate("/our-approach?slide=2");
      } else {
        navigate("/our-approach");
      }
      */}
      {/* Previous static slide 1 redirect preserved per zero-deletions rule:
      navigate("/our-approach?slide=1");
      */}
      // Dynamic navigation with ppt ID and slide 1
      const targetPpt = opening.pptId || 1;
      navigate(`/our-approach?ppt=${targetPpt}&slide=1`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] lg:max-h-[calc(100vh-5rem)] lg:overflow-hidden bg-stone-100 dark:bg-black text-gray-800 dark:text-white transition-colors duration-300 pt-20 pb-3 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Background Decorative Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl opacity-60 dark:opacity-30" />
      </div>

      <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col flex-1 justify-center py-1">
        {/* Compact Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 lg:mb-4 pb-2 border-b border-gray-200/70 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                Careers & Opportunities
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Current Openings at{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
                3D Bharat
              </span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 sm:text-right max-w-md">
            Shape next-generation 3D spatial tech for India&apos;s infrastructure projects.
          </p>
        </div>

        {/* 6 Cards Grid (3 cols x 2 rows, fits screen) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5"
        >
          {openingsList.map((opening) => {
            const Icon = opening.icon;
            const isClickable = opening.isClickable;

            return (
              <motion.div
                key={opening.id}
                variants={cardVariants}
                whileHover={
                  isClickable
                    ? { y: -8, scale: 1.02, transition: { type: "spring", stiffness: 350, damping: 22 } }
                    : { y: -6, scale: 1.01, transition: { type: "spring", stiffness: 350, damping: 22 } }
                }
                whileTap={isClickable ? { scale: 0.985 } : {}}
                onClick={() => handleCardClick(opening)}
                className={`group relative rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 ${isClickable
                    ? "cursor-pointer bg-white dark:bg-zinc-900 border border-amber-300/80 dark:border-amber-500/40 hover:border-amber-500 dark:hover:border-amber-400 shadow-md hover:shadow-2xl hover:shadow-amber-500/10 dark:hover:shadow-amber-500/10 hover:bg-amber-50/25 dark:hover:bg-amber-950/20"
                    : "cursor-default bg-white/85 dark:bg-zinc-900/60 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 shadow-sm hover:shadow-xl hover:shadow-gray-300/40 dark:hover:shadow-black/50"
                  }`}
              >
                <div>
                  {/* Top Bar: Icon + Title + Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 ${isClickable
                            ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white group-hover:scale-110"
                            : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 group-hover:scale-105"
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block truncate leading-none mb-1">
                          {opening.category}
                        </span>
                        <h3
                          className={`text-sm sm:text-base font-bold tracking-tight transition-colors duration-150 leading-tight truncate ${isClickable
                              ? "text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400"
                              : "text-gray-900 dark:text-white"
                            }`}
                        >
                          {opening.title}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${opening.badgeColor}`}
                    >
                      {isClickable ? (
                        <>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                          </span>
                          <span>{opening.status}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-2.5 h-2.5" />
                          <span>{opening.status}</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Description (concise 2 lines) */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2 line-clamp-2">
                    {opening.description}
                  </p>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {opening.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-gray-500 dark:text-gray-400">{opening.type}</span>

                  {isClickable ? (
                    <div className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 font-bold transition-all">
                      <span>{opening.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-200" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500 font-medium">
                      <Lock className="w-3 h-3" />
                      <span>{opening.ctaText}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Openings;
