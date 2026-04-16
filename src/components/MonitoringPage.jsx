import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const COLOR = "#3B82F6";

// ─── DATA SECTIONS ─────────────────────────────────────────────
const contractorProblems = [
  "Design, execution, and measurement are disconnected",
  "Site teams, engineers, and management work in different systems",
  "No accurate way to verify actual work done",
  "Progress tracking is approximate, not reliable",
  "Issues are discovered too late, after major work is done",
];

const contractorRisks = [
  "Mismatch in quantities → payment deductions",
  "Department may reject work based on measurement differences",
  "No proof of actual progress → billing delays",
  "Poor coordination → slow execution & idle machinery",
  "Rework due to late detection of errors",
];

const dailyPainPoints = [
  "How much work is actually completed on ground?",
  "Does site execution match design?",
  "Why is progress different from reports?",
  "Where exactly is the delay happening?",
];

const deptWithout = [
  "No single source of truth",
  "Reports from contractor may not match ground reality",
  "Difficult to verify actual quantities",
  "Lack of transparency across project",
  "Hard to track performance of teams",
];

const deptWith = [
  "Single platform for full project visibility",
  "Compare design vs execution vs actual measurement",
  "Track contractor performance accurately",
  "Ensure transparency across all stages",
  "Reliable data for reporting and decision-making",
];

const contractorSolutions = [
  "Clear alignment between design, execution, and measurement",
  "Accurate tracking of actual work done",
  "Strong proof for billing and approvals",
  "Early detection of issues → less rework",
  "Better coordination across teams",
];

const stages = [
  {
    title: "Stage 1: Desktop Design (Project Foundation)",
    details: ["Create full digital road model", "Define levels, geometry, volumes", "Establish locked project baseline"]
  },
  {
    title: "Stage 2: Web-Based Planning (Steps & Targets)",
    details: ["Convert design into targets", "Define work stages and quantities", "Assign targets and workflows"],
    highlight: "Ensures clear planning before execution"
  },
  {
    title: "Stage 3: On-Site Execution (Tablet System)",
    details: ["Block-level execution tracking", "CUT / DIG / FILL workflows", "Photo-based documentation"],
    highlight: "Captures real ground activity"
  },
  {
    title: "Stage 4: Drone Validation (Ground Truth)",
    details: ["Periodic drone surveys", "Surface mapping and uploads", "Compare actual vs design"],
    highlight: "Verifies actual site conditions"
  },
  {
    title: "Stage 5: Measurement System (Desktop + Web)",
    details: ["Volume verification", "Surface comparison", "Measurement corrections", "Data validation"],
    highlight: "Ensures accurate quantity calculation"
  },
  {
    title: "Stage 6: Monitoring & Reporting",
    details: ["Planned vs executed comparison", "Chainage & block tracking", "Timeline-based progress", "Graph-based visualization"],
    highlight: "Provides complete project visibility"
  },
];

const keyFeatures = [
  "End-to-end project control",
  "Multi-device workflow (desktop + web + tablet)",
  "Drone-based validation",
  "Measurement-backed reporting",
  "Real-time monitoring dashboards",
  "Chainage & block-level precision",
];

const contractorImpact = [
  "Avoid payment disputes",
  "Reduce rework and delays",
  "Improve coordination",
  "Strong documentation",
  "Protect profitability",
];

const departmentImpact = [
  "Full transparency lifecycle",
  "Accurate verification",
  "Better reporting",
  "Improved accountability",
  "Data-driven decision making",
];

export default function MonitoringPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen dark:bg-black bg-white dark:text-white text-gray-900 font-sans selection:dark:bg-blue-500/30 selection:bg-blue-200/50">

      {/* ── HEADER ── */}
      <div className="dark:border-neutral-900 border-gray-200 border-b">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate(-1)}
            className="dark:text-neutral-500 dark:hover:text-white text-gray-600 hover:text-gray-900 transition-colors text-xs tracking-[0.3em] uppercase mb-10">
            ← Back to Modules
          </motion.button>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-xs font-bold tracking-[0.4em] uppercase block mb-4" style={{ color: COLOR }}>Module 03</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">3D Precise Work <span style={{ color: COLOR }}>Monitoring System</span></h1>
            <p className="dark:text-neutral-400 text-gray-600 text-lg max-w-2xl leading-relaxed dark:border-l dark:border-neutral-800 border-l border-gray-300 pl-8">
              Complete control over your project — from design to execution to verification.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24">

        {/* ── SECTION: THE REAL PROBLEM ── */}
        <section className="mb-24">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold tracking-tight mb-12 uppercase">
            The Real Problem <span className="text-red-600">On Large Projects</span>
          </motion.h2>
          <div className="space-y-4 mb-16">
            {contractorProblems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="p-5 dark:border-neutral-900 dark:bg-neutral-900/10 border border-gray-300 bg-gray-50/50 text-sm dark:text-neutral-300 text-gray-700 flex gap-4">
                <span className="text-red-700 dark:text-red-600 font-bold">—</span> {item}
              </motion.div>
            ))}
          </div>

          <div className="mb-16">
            <h3 className="text-lg font-bold mb-8 uppercase tracking-wide">Real Risks Contractors <span style={{ color: COLOR }}>Face</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contractorRisks.map((risk, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="p-5 dark:border-neutral-800 dark:bg-neutral-900/20 border border-gray-300 bg-gray-50 relative overflow-hidden group dark:hover:border-neutral-600 hover:border-gray-400 transition-colors">
                  <div className="absolute top-0 left-0 w-full h-[1px] dark:bg-gradient-to-r dark:from-red-600 dark:to-transparent from-red-400 to-transparent opacity-50" />
                  <p className="text-sm dark:text-neutral-300 text-gray-700 flex gap-3"><span className="dark:text-amber-600 text-amber-700 font-bold">!</span> {risk}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-24">
            <h3 className="text-lg font-bold mb-8 uppercase tracking-wide">Daily Project-Level <span style={{ color: COLOR }}>Pain Points</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyPainPoints.map((point, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  className="p-6 dark:border-neutral-900 dark:bg-neutral-900/40 border border-gray-300 bg-gray-50 text-center">
                  <p className="dark:text-neutral-200 text-gray-900 text-sm italic font-medium">"{point}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION: FOR DEPARTMENT / AUTHORITY (Problem & Solution) ── */}
        <section className="mb-32">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold tracking-tight mb-12 uppercase">
            For Department / <span style={{ color: COLOR }}>Authority</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px dark:bg-neutral-900 dark:border dark:border-neutral-900 bg-gray-300 border border-gray-300 overflow-hidden mb-16">
            <div className="dark:bg-black bg-white p-10">
              <h3 className="text-xs font-bold tracking-widest uppercase mb-8 dark:text-red-500 text-red-600">Without System</h3>
              <div className="space-y-6">
                {deptWithout.map((item, i) => (
                  <motion.p key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="text-sm dark:text-neutral-500 text-gray-600 flex gap-4">
                    <span className="dark:text-red-900 text-red-400 font-bold">×</span> {item}
                  </motion.p>
                ))}
              </div>
            </div>
            <div className="dark:bg-black bg-white p-10 dark:border-l dark:border-neutral-900 border-l border-gray-300">
              <h3 className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: COLOR }}>With This Module</h3>
              <div className="space-y-6">
                {deptWith.map((item, i) => (
                  <motion.p key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="text-sm dark:text-neutral-200 text-gray-900 flex gap-4">
                    <span className="font-bold" style={{ color: COLOR }}>/</span> {item}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="p-8 dark:border-neutral-800 dark:bg-neutral-900/30 border border-gray-300 bg-gray-100/50">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6" style={{ color: COLOR }}>Simple Contractor Outcome</h3>
            <div className="space-y-4">
              {contractorSolutions.map((solution, i) => (
                <p key={i} className="dark:text-neutral-400 text-gray-700 text-sm">/ {solution}</p>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── SECTION: WORKFLOW STAGES (ANIMATED LINE) ── */}
        <section className="mb-32">
          <h2 className="text-xs font-bold tracking-[0.5em] uppercase mb-20 dark:text-neutral-600 text-gray-500 text-center">System Workflow</h2>
          <div className="relative max-w-4xl mx-auto">
            {stages.map((stage, i) => (
              <div key={i} className="relative flex gap-12 pb-20 last:pb-0">
                <div className="relative flex flex-col items-center flex-shrink-0 w-12">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 font-bold dark:text-black text-white text-sm" style={{ background: COLOR }}>{i + 1}</div>
                  {i !== stages.length - 1 && (
                    <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: false }} transition={{ duration: 0.8, ease: "linear" }}
                      className="absolute top-12 bottom-0 w-[1px] origin-top dark:bg-neutral-800 bg-gray-300"
                      style={{ background: isDark ? `linear-gradient(180deg, ${COLOR}, transparent)` : `linear-gradient(180deg, ${COLOR}, ${COLOR}20)` }} />
                  )}
                </div>
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex-1 pt-1">
                  <h3 className="text-xl font-bold mb-6 tracking-tight uppercase dark:text-white text-gray-900" style={{ color: i % 2 === 0 ? "inherit" : COLOR }}>{stage.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                    {stage.details.map((detail, j) => (
                      <div key={j} className="text-sm dark:text-neutral-500 text-gray-600 flex gap-3">
                        <span style={{ color: COLOR }}>/</span> {detail}
                      </div>
                    ))}
                  </div>
                  {stage.highlight && (
                    <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: COLOR }}>— {stage.highlight}</p>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION: KEY FEATURES (Image 3) ── */}
        <section className="mb-32">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold tracking-tight mb-12 uppercase text-center">Key <span style={{ color: COLOR }}>Features</span></motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFeatures.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-6 dark:border-neutral-900 dark:bg-neutral-900/20 border border-gray-300 bg-gray-50 flex gap-4 items-center group dark:hover:border-neutral-700 hover:border-gray-400 transition-colors">
                <span className="font-bold text-lg" style={{ color: COLOR }}>/</span>
                <span className="text-xs font-bold uppercase tracking-widest dark:text-neutral-300 text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── SECTION: IMPACT COMPARISON ── */}
        <section className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px dark:bg-neutral-900 dark:border dark:border-neutral-900 bg-gray-300 border border-gray-300 overflow-hidden">
            <div className="dark:bg-black bg-white p-12">
              <h3 className="text-[10px] font-bold tracking-widest uppercase mb-10 dark:text-neutral-500 text-gray-600">For Contractors</h3>
              <div className="space-y-5">
                {contractorImpact.map((item, i) => (
                  <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} key={i}
                    className="text-sm dark:text-neutral-400 text-gray-700 flex gap-4 items-start">
                    <span style={{ color: COLOR }} className="mt-1 font-bold">0{i + 1}</span> {item}
                  </motion.p>
                ))}
              </div>
            </div>
            <div className="dark:bg-black bg-white p-12 dark:border-l dark:border-neutral-900 border-l border-gray-300">
              <h3 className="text-[10px] font-bold tracking-widest uppercase mb-10 dark:text-neutral-500 text-gray-600">For Departments</h3>
              <div className="space-y-5">
                {departmentImpact.map((item, i) => (
                  <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} key={i}
                    className="text-sm dark:text-neutral-400 text-gray-700 flex gap-4 items-start">
                    <span style={{ color: COLOR }} className="mt-1 font-bold">0{i + 1}</span> {item}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="dark:border-neutral-800 border-gray-300 p-20 text-center dark:bg-black/50 bg-gray-50 border">
          <h2 className="text-3xl font-bold mb-6 tracking-tighter uppercase dark:text-white text-gray-900">Integrated Project Control</h2>
          <p className="dark:text-neutral-500 text-gray-600 mb-12 max-w-sm mx-auto text-sm leading-relaxed">
            Control your entire project with one integrated platform. Design. Execute. Verify.
          </p>
          <button onClick={() => navigate(-1)}
            className="px-12 py-5 font-bold text-[10px] uppercase tracking-[0.3em] transition-all dark:text-black text-white hover:opacity-90"
            style={{ backgroundColor: COLOR }}>
            Return to Modules
          </button>
        </motion.div>

      </div>
    </div>
  );
}