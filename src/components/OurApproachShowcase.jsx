import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Cpu,
  Briefcase,
  Layers,
  Sparkles,
  Clock,
  Compass,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ChevronRight,
  Play,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { getCategoryCards } from "../services/presentationService";
import Methodology from "./Methodology";
import ConnectModal from "./ConnectModal";

/**
 * OurApproachShowcase
 * 
 * 2-Tier Showcase for the "Our Approach" module with URL Deep-Linking:
 * - Tier 1: Master Categories Landing (/our-approach) -> Technical vs Non-Technical
 * - Tier 2: Domain Cards Grid (/our-approach?category=technical | non-technical)
 * - Tier 3: Presentation Player (/our-approach?ppt=:id or ?category=...&ppt=:id)
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// =========================================================================
// TIER 1: Master Categories Landing Component
// =========================================================================
{/* Previous MasterCategoriesLanding implementation preserved per zero-deletions rule:
const MasterCategoriesLanding = ({ onSelectCategory }) => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col justify-center py-4 sm:py-6">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-3 shadow-sm"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Explore Methodologies & Workflows</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-3"
        >
          Our Approach at{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
            3D Bharat
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed"
        >
          Choose a domain category below to explore our precision engineering methodologies,
          3D LiDAR & Drone spatial surveys, or enterprise operational governance.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch"
      >
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -8, scale: 1.015, transition: { type: "spring", stiffness: 350, damping: 22 } }}
          whileTap={{ scale: 0.985 }}
          onClick={() => onSelectCategory("technical")}
          className="group relative cursor-pointer rounded-3xl p-6 sm:p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-amber-500/30 hover:border-amber-500 dark:border-amber-500/30 dark:hover:border-amber-400 shadow-xl hover:shadow-2xl hover:shadow-amber-500/15 dark:hover:shadow-amber-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-7 h-7" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Engineering & Infrastructure</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Technical
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Precision methodologies for Highways, Bridges, Metro Rail, Tunnels, 3D LiDAR scanning,
              and Drone photogrammetry surveys with chainage-level elevation audits.
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
              {[
                "Road Construction",
                "Bridge Engineering",
                "Metro Rail Systems",
                "Tunneling",
                "3D LiDAR Surveys",
                "Drone Photogrammetry",
              ].map((pill, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 group-hover:border-amber-400/40 transition-colors"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Interactive Domain Modules
            </span>
            <div className="inline-flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
              <span>Explore Technical Modules</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover={{ y: -8, scale: 1.015, transition: { type: "spring", stiffness: 350, damping: 22 } }}
          whileTap={{ scale: 0.985 }}
          onClick={() => onSelectCategory("non-technical")}
          className="group relative cursor-pointer rounded-3xl p-6 sm:p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-500 dark:border-emerald-500/30 dark:hover:border-emerald-400 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-7 h-7" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Governance & Operations</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Non-Technical
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Operational workflows, project governance guidelines, quality assurance audits,
              site safety protocols, and executive stakeholder alignment frameworks.
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
              {[
                "Project Governance",
                "Quality Assurance",
                "Site Safety Protocols",
                "Executive Briefs",
                "Compliance Audits",
                "Workflow Optimization",
              ].map((pill, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 group-hover:border-emerald-400/40 transition-colors"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Operational Frameworks
            </span>
            <div className="inline-flex items-center gap-2 font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 group-hover:translate-x-1 transition-all">
              <span>Explore Non-Technical Modules</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
*/}

// Single-screen compact Master Categories Landing (zero vertical scroll on desktop, spacious & loose feel)
const MasterCategoriesLanding = ({ onSelectCategory }) => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col justify-center py-1">
      {/* Header Banner - Balanced & Clear of Navbar */}
      <div className="text-center max-w-2xl mx-auto mb-3.5 sm:mb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-extrabold uppercase tracking-wider mb-1.5 shadow-sm"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Explore Methodologies & Workflows</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-1"
        >
          Our Approach at{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
            3D Bharat
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto"
        >
          Choose a domain category below to explore our precision engineering methodologies,
          3D LiDAR & Drone spatial surveys, or enterprise operational governance.
        </motion.p>
      </div>

      {/* 2 Master Cards: Technical vs Non-Technical - Spacious, Free & Balanced */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch max-w-4xl mx-auto w-full"
      >
        {/* Master Card 1: Technical */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 350, damping: 22 } }}
          whileTap={{ scale: 0.985 }}
          onClick={() => onSelectCategory("technical")}
          className="group relative cursor-pointer rounded-3xl p-5 sm:p-5.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-amber-500/30 hover:border-amber-500 dark:border-amber-500/30 dark:hover:border-amber-400 shadow-xl hover:shadow-2xl hover:shadow-amber-500/15 dark:hover:shadow-amber-500/20 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          <div>
            {/* Top Bar: Icon + Category Badge */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Engineering & Infrastructure</span>
              </span>
            </div>

            {/* Title & Description */}
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Technical
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              Precision methodologies for Highways, Bridges, Metro Rail, Tunnels, 3D LiDAR scanning,
              and Drone photogrammetry surveys.
            </p>

            {/* Feature Highlights / Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                "Road Construction",
                "Bridge Engineering",
                "Metro Rail Systems",
                "3D LiDAR Surveys",
              ].map((pill, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 group-hover:border-amber-400/40 transition-colors"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTA Bar */}
          <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Interactive Domain Modules
            </span>
            <div className="inline-flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
              <span>Explore Technical</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Master Card 2: Marketing (formerly Non-Technical) */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 350, damping: 22 } }}
          whileTap={{ scale: 0.985 }}
          /* Previous onSelectCategory("non-technical") preserved per zero-deletions rule: onClick={() => onSelectCategory("non-technical")} */
          onClick={() => onSelectCategory("marketing")}
          className="group relative cursor-pointer rounded-3xl p-5 sm:p-5.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-500 dark:border-emerald-500/30 dark:hover:border-emerald-400 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/20 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          <div>
            {/* Top Bar: Icon + Category Badge */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Governance & Operations</span>
              </span>
            </div>

            {/* Title & Description */}
            {/* Previous Non-Technical title preserved per zero-deletions rule:
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Non-Technical
            </h2>
            */}
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Marketing
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              Operational workflows, project governance guidelines, quality assurance audits,
              and executive stakeholder frameworks.
            </p>

            {/* Feature Highlights / Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                "Project Governance",
                "Quality Assurance",
                "Site Safety Protocols",
                "Compliance Audits",
              ].map((pill, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 group-hover:border-emerald-400/40 transition-colors"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTA Bar */}
          <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Operational Frameworks
            </span>
            <div className="inline-flex items-center gap-2 font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 group-hover:translate-x-1 transition-all">
              {/* Previous Explore Non-Technical CTA preserved per zero-deletions rule:
              <span>Explore Non-Technical</span>
              */}
              <span>Explore Marketing</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// =========================================================================
// TIER 2: Domain Cards Grid Component
// =========================================================================
{/* Previous DomainCardsGrid implementation preserved per zero-deletions rule:
const DomainCardsGrid = ({ category, onSelectCard, onBack, onSwitchCategory }) => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const isTechnical = category === "technical";
  const categoryType = isTechnical ? 1 : 2;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    getCategoryCards(categoryType)
      .then((res) => {
        if (isMounted) {
          if (res && res.cards) {
            setCards(res.cards);
          } else {
            setCards([]);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("[DomainCardsGrid] Error fetching category cards:", err);
        if (isMounted) {
          setFetchError("Unable to load domain modules. Please try again.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [categoryType]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col py-1 sm:py-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6 pb-2.5 border-b border-gray-200/80 dark:border-white/10">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300/80 dark:border-white/15 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer mb-2 shadow-sm"
            title="Back to Categories"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
            <span>← Back to Categories</span>
          </button>

          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            {isTechnical ? (
              <>
                Technical{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  Infrastructure Modules
                </span>
              </>
            ) : (
              <>
                Non-Technical{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                  Operational Modules
                </span>
              </>
            )}
          </h1>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-right max-w-md">
          {isTechnical
            ? "Interactive presentations with 3D point-cloud LiDAR data, drone imagery, and inspection walkthroughs."
            : "Operational governance, quality audit standards, site compliance, and executive stakeholder briefs."}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-3 bg-white/60 dark:bg-zinc-900/60 border border-gray-200 dark:border-white/10 animate-pulse flex flex-col h-64"
            >
              <div className="w-full h-32 rounded-xl bg-gray-200 dark:bg-white/10 mb-3" />
              <div className="w-3/4 h-4 rounded-md bg-gray-200 dark:bg-white/10 mb-2" />
              <div className="w-full h-3 rounded-md bg-gray-200 dark:bg-white/5 mb-1" />
              <div className="w-2/3 h-3 rounded-md bg-gray-200 dark:bg-white/5" />
            </div>
          ))}
        </div>
      ) : fetchError ? (
        <div className="w-full py-10 text-center">
          <p className="text-xs sm:text-sm font-semibold text-red-500 mb-3">{fetchError}</p>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md transition-all cursor-pointer"
          >
            ← Return to Categories
          </button>
        </div>
      ) : cards.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {cards.map((card) => {
            const cardPptId = card.wph_id || card.pptId;
            const title = card.category_name || card.title || "Methodology Presentation";
            const description =
              card.category_short_description ||
              "Explore interactive 3D construction mapping, chainage analytics, and execution guidelines.";

            return (
              <motion.div
                key={cardPptId}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 350, damping: 22 } }}
                whileTap={{ scale: 0.985 }}
                onClick={() => onSelectCard(cardPptId)}
                className="group relative cursor-pointer rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/90 dark:border-white/10 hover:border-amber-500/80 dark:hover:border-amber-400/80 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 dark:hover:shadow-amber-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative w-full h-32 sm:h-36 overflow-hidden bg-gray-950">
                    {card.category_image ? (
                      <img
                        src={card.category_image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-transparent flex items-center justify-center">
                        <Layers className="w-10 h-10 text-amber-500/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-emerald-300 bg-black/60 border border-emerald-500/40 backdrop-blur-md shadow-sm">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                        </span>
                        <span>Interactive PPT</span>
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-1 mb-1">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="px-3.5 pb-3 pt-2.5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs">
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                    <Layers className="w-3 h-3 text-amber-500" />
                    <span>{isTechnical ? "Methodology" : "Operational"}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 font-bold text-xs text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto my-4 sm:my-6 p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-gray-200/90 dark:border-white/10 shadow-xl text-center"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Modules Under Active Development</span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent text-amber-500 mx-auto flex items-center justify-center mb-3 border border-amber-500/25 shadow-md shadow-amber-500/10">
            {isTechnical ? <Cpu className="w-7 h-7" /> : <Briefcase className="w-7 h-7" />}
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
            {isTechnical ? "Technical" : "Non-Technical"} Modules In Preparation
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 max-w-lg mx-auto">
            Our specialized infrastructure engineering teams and operational governance specialists are
            currently curating and validating comprehensive, field-tested interactive presentations for this category.
            These modules will be published in the upcoming release cycle.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto mb-6 text-left">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Field Validated</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                Undergoing real-world site inspection audits
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10">
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">SOP Standards</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                Aligned with industry governance frameworks
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Upcoming Release</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                Scheduled for publication in next rollout
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300/80 dark:border-white/15 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm"
            >
              ← Back to Categories
            </button>

            {isTechnical ? (
              <button
                type="button"
                onClick={() => onSwitchCategory("non-technical")}
                className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Explore Non-Technical Modules →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSwitchCategory("technical")}
                className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-95 shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Explore Technical Modules →
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
*/}

const DomainCardsGrid = ({ category, onSelectCard, onBack, onSwitchCategory }) => {
  const [searchParams] = useSearchParams();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const isTechnical = category === "technical";
  const categoryType = isTechnical ? 1 : 2;
  const isForceUnauthorized = searchParams.get("unauthorized") === "true";

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    getCategoryCards(categoryType)
      .then((res) => {
        if (isMounted) {
          if (res && res.cards && Array.isArray(res.cards)) {
            setCards(res.cards);
          } else {
            setCards([]);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("[DomainCardsGrid] Error fetching category cards:", err);
        if (isMounted) {
          // Gracefully fallback to empty cards so visitors seamlessly see the polite cover-up screen
          // instead of a raw red technical error box
          setCards([]);
          setFetchError(null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [categoryType]);

  /* Previous justify-center wrapper preserved per zero-deletions rule:
  <div className="w-full max-w-6xl mx-auto flex flex-col justify-center py-0 sm:py-1">
  */
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-start py-0">
      {/* Top Header Bar & Navigation - Back button on left, Title on right */}
      {/* PRESERVED: Previous mb-3 pb-2.5 margin preserved per zero-deletions rule */}
      <div className="flex flex-row items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-gray-200/80 dark:border-white/10">
        <div>
          {/* Previous Back button with ArrowLeft icon & symbol preserved per zero-deletions rule:
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300/80 dark:border-white/15 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-sm"
            title="Back to Categories"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
            <span>← Back to Categories</span>
          </button>
          */}
          {/* Previous Back button without arrow icon preserved per zero-deletions rule:
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300/80 dark:border-white/15 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-sm"
            title="Back to Categories"
          >
            <span>Back to Categories</span>
          </button>
          */}
          {/* Back button to Tier 1 with a single clean ArrowLeft icon */}
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300/80 dark:border-white/15 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-sm"
            title="Back to Categories"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
            <span>Back to Categories</span>
          </button>
        </div>

        {/* Title placed on the right (replacing previous pill badges) */}
        <div>
          <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight text-right">
            {isTechnical ? (
              <>
                Technical{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  Infrastructure Modules
                </span>
              </>
            ) : (
              <>
                {/* Previous Non-Technical title preserved per zero-deletions rule:
                Non-Technical{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                  Operational Modules
                </span>
                */}
                Marketing{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                  Operational Modules
                </span>
              </>
            )}
          </h1>
        </div>

        {/* Previous right-hand pill badges preserved per zero-deletions rule:
        <div className="hidden sm:block">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isTechnical
                ? "text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25"
                : "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/25"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isTechnical ? "bg-amber-500" : "bg-emerald-500"
              } animate-pulse`}
            />
            <span>{isTechnical ? "Engineering & LiDAR" : "Governance & SOP"}</span>
          </span>
        </div>
        */}

        {/* Previous header subtexts removed per user request and preserved in comments:
        <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 sm:text-right max-w-sm line-clamp-2">
          {isTechnical
            ? "Interactive presentations with 3D point-cloud LiDAR data, drone imagery, and inspection walkthroughs."
            : "Operational governance, quality audit standards, site compliance, and executive stakeholder briefs."}
        </p>
        */}
      </div>

      {/* Cards Grid / States */}
      {isLoading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-4 bg-white/60 dark:bg-zinc-900/60 border border-gray-200 dark:border-white/10 animate-pulse flex flex-col h-72"
            >
              <div className="w-full aspect-[679/450] rounded-xl bg-gray-200 dark:bg-white/10 mb-3" />
              <div className="w-3/4 h-5 rounded-md bg-gray-200 dark:bg-white/10 mb-2" />
              <div className="w-full h-3 rounded-md bg-gray-200 dark:bg-white/5 mb-1" />
              <div className="w-2/3 h-3 rounded-md bg-gray-200 dark:bg-white/5" />
            </div>
          ))}
        </div>
      ) : /* PRESERVED: Previous technical error block preserved per zero-deletions rule:
      fetchError ? (
        <div className="w-full py-8 text-center">
          <p className="text-xs sm:text-sm font-semibold text-red-500 mb-3">{fetchError}</p>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md transition-all cursor-pointer"
          >
            Return to Categories
          </button>
        </div>
      ) : */ !isForceUnauthorized && cards.length > 0 ? (
        // Dynamic Cards Grid: Compact, sleek, small & highly interactive and impressive
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl w-full"
        >
          {cards.map((card) => {
            const cardPptId = card.wph_id || card.pptId;
            const title = card.category_name || card.title || "Methodology Presentation";
            const description =
              card.category_short_description ||
              "Explore interactive 3D construction mapping, chainage analytics, and execution guidelines.";

            return (
              <motion.div
                key={cardPptId}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02, transition: { type: "spring", stiffness: 350, damping: 22 } }}
                whileTap={{ scale: 0.985 }}
                onClick={() => onSelectCard(cardPptId)}
                /* PRESERVED PREVIOUS SIZING: className="... w-full max-w-[290px]" */
                className="group relative cursor-pointer rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-gray-200/90 dark:border-white/10 hover:border-amber-500/80 dark:hover:border-amber-400 shadow-sm hover:shadow-lg hover:shadow-amber-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden w-full max-w-[265px]"
              >
                {/* Interactive Sheen Sweep Effect on Hover */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-20" />

                <div>
                  {/* PRESERVED PREVIOUS IMAGE RATIO: aspect-[679/450] (height was ~192px, making card too long) */}
                  {/* Card Cover Thumbnail - Compact, Sleek Widescreen Height (Shortened per user request) */}
                  <div className="relative w-full h-32 overflow-hidden rounded-t-xl bg-zinc-950 flex items-center justify-center">
                    {card.category_image ? (
                      <img
                        src={card.category_image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.parentElement?.querySelector(".img-fallback");
                          if (fallback) fallback.classList.remove("hidden");
                        }}
                      />
                    ) : null}

                    {/* Impressive Stylized Fallback if remote host fails or times out */}
                    <div
                      className={`img-fallback ${
                        card.category_image ? "hidden" : "flex"
                      } absolute inset-0 w-full h-full bg-gradient-to-br from-amber-600/25 via-orange-600/15 to-zinc-950 items-center justify-center flex-col gap-1`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-bold text-amber-300/80">3D Engineering</span>
                    </div>

                    {/* Gradient Overlay for Depth & Badge Readability */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-transparent to-black/35 pointer-events-none" />

                    {/* PRESERVED: Non-DB Top-Left Live Status Badge removed per user request ("card has only img, description, and name")
                    <div className="absolute top-2 left-2 z-20">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider text-emerald-300 bg-black/75 border border-emerald-500/40 backdrop-blur-md shadow-sm">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                        </span>
                        <span>Interactive PPT</span>
                      </span>
                    </div>
                    */}

                    {/* PRESERVED: Top-Right Engineering/Operations Badge removed per user request
                    <div className="absolute top-2 right-2 z-20">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-amber-300 bg-black/75 border border-amber-500/40 backdrop-blur-md shadow-sm">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        <span>{isTechnical ? "Engineering" : "Operations"}</span>
                      </span>
                    </div>
                    */}

                    {/* PRESERVED: Bottom-Right "Interactive 3D" Meta Badge removed per user request
                    <div className="absolute bottom-2 right-2 z-20 pointer-events-none">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold text-white/90 bg-black/70 backdrop-blur-md border border-white/15 shadow-sm">
                        Interactive 3D
                      </span>
                    </div>
                    */}

                    {/* Interactive Animated Play Indicator on Card Hover */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-black/25 backdrop-blur-[1px]">
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-amber-400 opacity-60" />
                        <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body - Exclusively DB Data: Name & 2-3 lines of Description */}
                  <div className="p-3.5 pt-3 pb-2.5">
                    <h3 className="text-xs sm:text-sm font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-1 mb-1.5">
                      {title}
                    </h3>
                    {/* 2 to 3 lines of DB description as requested */}
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {description}
                    </p>

                    {/* PRESERVED: Non-DB Tags removed per user request ("remove the 3d survey and 3d audit from it")
                    <div className="flex items-center gap-1.5 overflow-hidden mt-2">
                      {["3D Survey", "Quality Audit"].map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[8.5px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-150 cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    */}
                  </div>
                </div>

                {/* Card Action Footer: Clean, compact CTA */}
                <div className="px-3 pb-2.5 pt-1.5 border-t border-gray-100 dark:border-white/10">
                  {/* PRESERVED: Previous Presentation tag & right-aligned button
                  <div className="px-3.5 pb-2.5 pt-2 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs">
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                      <Layers className="w-3 h-3 text-amber-500" />
                      <span>Presentation</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 group-hover:from-amber-600 group-hover:to-orange-600 shadow-sm shadow-orange-500/20 group-hover:shadow-md group-hover:translate-x-0.5 transition-all duration-200">
                      <span>Launch</span>
                      <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  */}
                  <div className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 group-hover:from-amber-600 group-hover:to-orange-600 shadow-sm shadow-orange-500/20 group-hover:shadow-md flex items-center justify-center gap-1 transition-all duration-200">
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <>
          {/* PRESERVED: Previous "Modules Under Active Development" empty state preserved per zero-deletions rule:
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto my-auto p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-gray-200/90 dark:border-white/10 shadow-xl text-center"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Modules Under Active Development</span>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-transparent text-emerald-500 mx-auto flex items-center justify-center mb-3 border border-emerald-500/30 shadow-md shadow-emerald-500/15">
              {isTechnical ? <Cpu className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1.5">
              {isTechnical ? "Technical" : "Non-Technical"} Modules In Preparation
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 max-w-lg mx-auto">
              Our specialized infrastructure engineering teams and operational governance specialists are
              curating and validating comprehensive, field-tested interactive presentations for this category.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-5 text-left">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/70 dark:border-white/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Field Validated</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                  Site inspection audits
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/70 dark:border-white/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">SOP Standards</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                  Industry governance
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/70 dark:border-white/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Upcoming Release</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                  In next rollout
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300/80 dark:border-white/15 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm"
              >
                ← Back to Categories
              </button>

              {isTechnical ? (
                <button
                  type="button"
                  onClick={() => onSwitchCategory("non-technical")}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Explore Non-Technical Modules →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSwitchCategory("technical")}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-95 shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Explore Technical Modules →
                </button>
              )}
            </div>
          </motion.div>
          */}

          {/* Previous Amber/Warning Modal Card preserved per zero-deletions rule:
          <motion.div
            className="max-w-lg mx-auto my-auto p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-amber-500/20 dark:border-amber-500/30 shadow-2xl text-center relative overflow-hidden"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25 mb-4 shadow-sm">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Viewing Access</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-transparent text-amber-500 mx-auto flex items-center justify-center mb-4 border border-amber-500/30 shadow-lg shadow-amber-500/15">
              <Lock className="w-7 h-7 text-amber-500" />
            </div>
          </motion.div>
          */}

          {/* Strategic Access Authorization Cover-Up Modal Card with Uplifting, Positive Vibe (Emerald & Teal Theme) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-lg mx-auto my-auto p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-emerald-500/25 dark:border-emerald-500/35 shadow-2xl shadow-emerald-500/10 text-center relative overflow-hidden"
          >
            {/* Soft, Positive Ambient Glows (Emerald & Teal) */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-teal-500/15 dark:bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Positive Viewing Access Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Viewing Access</span>
            </div>

            {/* Radiant Positive Icon Halo */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-7 h-7 text-emerald-500" />
            </div>

            {/* Polite, Courteous Heading */}
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
              We're Sorry!
            </h2>

            {/* Polite Sub-heading stating authorization status clearly as requested by seniors */}
            <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">
              You are not authorized to view this page.
            </p>

            {/* Polite, Courteous Body Message */}
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 max-w-md mx-auto">
              We sincerely apologize for the inconvenience. Kindly connect with us to request viewing access, or return to explore other available categories.
            </p>

            {/* Action Buttons: Back to Categories & Connect with us in Positive Vibrant Colors */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-300/80 dark:border-white/15 hover:border-emerald-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Back to Categories</span>
              </button>

              <button
                type="button"
                onClick={() => setIsConnectModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Connect with us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
      </>
    )}

      {/* Connect with Us Popup Modal */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
};

// =========================================================================
// Main Export: OurApproachShowcase (Handles All 3 Tiers via URL SearchParams)
// =========================================================================
const OurApproachShowcase = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentCategory = searchParams.get("category"); // 'technical' | 'marketing' | 'non-technical' | null
  const currentPptId = searchParams.get("ppt") || searchParams.get("wph_id"); // '11', '1', etc. | null

  useEffect(() => {
    if (!currentPptId) {
      if (currentCategory === "technical") {
        document.title = "Technical Methodologies - 3D Bharat";
      } else if (currentCategory === "marketing" || currentCategory === "non-technical") {
        document.title = "Marketing Modules - 3D Bharat";
      } else {
        document.title = "Our Approach - 3D Bharat";
      }
    }
  }, [currentCategory, currentPptId]);

  // Tier 3: If a PPT ID is present in URL, immediately show the Presentation Player (Methodology)
  if (currentPptId) {
    {/* Previous backButtonLabel & handleBackFromPlayer without explicit fromOpenings check preserved per zero-deletions rule:
    const backButtonLabel =
      currentCategory === "technical"
        ? "← Back to Technical Modules"
        : currentCategory === "non-technical"
        ? "← Back to Non-Technical Modules"
        : "← Back";

    const handleBackFromPlayer = () => {
      if (currentCategory) {
        setSearchParams({ category: currentCategory });
      } else {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          setSearchParams({});
        }
      }
    };
    */}
    const isFromOpenings = searchParams.get("from") === "openings";

    {/* Previous backButtonLabel with arrow symbols preserved per zero-deletions rule:
    const backButtonLabel =
      currentCategory === "technical"
        ? "← Back to Technical Modules"
        : currentCategory === "non-technical"
        ? "← Back to Non-Technical Modules"
        : isFromOpenings
        ? "← Back to Openings"
        : "← Back";
    */}
    {/* Previous backButtonLabel with Non-Technical preserved per zero-deletions rule:
    const backButtonLabel =
      currentCategory === "technical"
        ? "Back to Technical Modules"
        : currentCategory === "non-technical"
        ? "Back to Non-Technical Modules"
        : isFromOpenings
        ? "Back to Openings"
        : "Back";
    */}
    const backButtonLabel =
      currentCategory === "technical"
        ? "Back to Technical Modules"
        : currentCategory === "marketing" || currentCategory === "non-technical"
        ? "Back to Marketing Modules"
        : isFromOpenings
        ? "Back to Openings"
        : "Back";

    const handleBackFromPlayer = () => {
      if (currentCategory) {
        // Return back to the category's cards (Technical or Marketing)
        setSearchParams({ category: currentCategory });
      } else if (isFromOpenings) {
        // Return back to Openings module
        navigate("/openings");
      } else {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          setSearchParams({});
        }
      }
    };

    return (
      <Methodology
        pptId={currentPptId}
        onBack={handleBackFromPlayer}
        backButtonLabel={backButtonLabel}
      />
    );
  }

  // Tier 1 & Tier 2 Page Layout Wrapper
  // Strictly lock height to single screen with zero vertical scrolling and comfortable navbar clearance
  {/* Previous container classes with static justify-center preserved per zero-deletions rule:
  <div
    className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden pt-24 pb-4 bg-stone-100 dark:bg-black text-gray-800 dark:text-white transition-colors duration-300 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative"
  >
  */}
  return (
    <div
      className={`min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden pb-4 bg-stone-100 dark:bg-black text-gray-800 dark:text-white transition-colors duration-300 px-4 sm:px-6 lg:px-8 flex flex-col relative ${
        currentCategory ? "justify-start pt-[92px] sm:pt-24" : "justify-center pt-20"
      }`}
    >
      {/* Background Decorative Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl opacity-60 dark:opacity-30" />
      </div>

      <div className={`relative z-10 w-full flex flex-col ${currentCategory ? "justify-start" : "justify-center"}`}>
        {/* Tier 2: Domain Cards Grid (when category is selected) */}
        {currentCategory ? (
          <DomainCardsGrid
            category={currentCategory}
            onSelectCard={(pptId) => {
              setSearchParams({ category: currentCategory, ppt: String(pptId), slide: "1" });
            }}
            onBack={() => setSearchParams({})}
            onSwitchCategory={(targetCategory) => {
              setSearchParams({ category: targetCategory });
            }}
          />
        ) : (
          /* Tier 1: Master Categories Landing (Technical vs Non-Technical) - Single Screen View */
          <MasterCategoriesLanding
            onSelectCategory={(cat) => {
              setSearchParams({ category: cat });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OurApproachShowcase;
