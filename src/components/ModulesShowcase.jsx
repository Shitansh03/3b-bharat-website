import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    id: "inspection",
    route: "/modules/inspection",
    badge: "MODULE 01",
    title: "Inspection & Quality Control",
    tagline: "Digitize site inspections, track every issue, and ensure quality at every stage.",
    color: "#F97316",
    icon: "🔍",
  },
  {
    id: "design",
    route: "/modules/design",
    badge: "MODULE 02",
    title: "Design & Execution Management",
    tagline: "From desktop planning to on-site execution — control every stage with precision.",
    color: "#22C55E",
    icon: "📐",
  },
  {
    id: "monitoring",
    route: "/modules/monitoring",
    badge: "FULL PROJECT",
    title: "Precise Work Monitoring System",
    tagline: "Plan, execute, measure, and monitor your entire road project.",
    color: "#3B82F6",
    icon: "🌐",
  },
];

function ModulePickerModal({ onSelect, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, #F97316, #22C55E, #3B82F6)" }}
          />

          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-orange-400 mb-1">
                  3D Bharat Platform
                </p>
                <h2 className="text-white font-bold text-2xl">Explore Our Modules</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Select a module to view its full details
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Module Cards */}
          <div className="px-6 pb-6 grid grid-cols-1 gap-3">
            {modules.map((mod, i) => (
              <motion.button
                key={mod.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => onSelect(mod)}
                className="flex items-center gap-4 p-4 rounded-xl text-left transition-all group"
                style={{
                  background: `${mod.color}08`,
                  border: `1px solid ${mod.color}25`,
                }}
                whileHover={{
                  scale: 1.01,
                  borderColor: `${mod.color}60`,
                  background: `${mod.color}12`,
                }}
                whileTap={{ scale: 0.99 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${mod.color}15`, border: `1px solid ${mod.color}30` }}
                >
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                    style={{ color: mod.color, background: `${mod.color}15` }}
                  >
                    {mod.badge}
                  </span>
                  <h3 className="text-white font-semibold text-sm mt-1">{mod.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{mod.tagline}</p>
                </div>
                <div
                  className="group-hover:translate-x-1 transition-transform text-lg flex-shrink-0"
                  style={{ color: mod.color }}
                >
                  →
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ModulesShowcase() {
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (mod) => {
    setShowPicker(false);
    navigate(mod.route); // ← opens full page
  };

  return (
    <>
      {/* Button */}
      <motion.button
        onClick={() => setShowPicker(true)}
        className="relative inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, #F97316, #ea580c)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
        }}
        whileHover={{ scale: 1.04, boxShadow: "0 6px 28px rgba(229, 215, 206, 0.5)" }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span>⚡</span>
        <span>Explore Modules</span>
      </motion.button>

      {/* Picker Modal */}
      {showPicker && (
        <ModulePickerModal
          onSelect={handleSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}