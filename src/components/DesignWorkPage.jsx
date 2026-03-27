import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const COLOR = "#22C55E";

// ─── DATA SECTIONS ─────────────────────────────────────────────
const contractorProblems = [
  "Design exists only on paper or CAD — not usable on site",
  "Supervisors rely on assumptions → wrong execution happens",
  "Incorrect depth or levels → overcut or undercut work",
  "No clear daily targets → low productivity",
  "No structured tracking → data gets lost or manipulated",
];

const contractorRisks = [
  "Over-excavation or extra filling → direct financial loss",
  "Work not matching design → rework & delays",
  "No proper records → payment disputes",
  "Department may reject quantities or reduce billing",
  "Poor coordination between office & site",
];

const dailyPainPoints = [
  "What exactly needs to be done at this chainage?",
  "How much work should be completed today?",
  "Is this as per design or not?",
  "How much work is actually done vs planned?",
];

const contractorSolutions = [
  "Converts design into clear, actionable targets",
  "Provides exact work instructions to site teams",
  "Prevents overcut / overfill → saves cost",
  "Tracks daily progress with accurate data",
  "Maintains proper records for billing & approvals",
  "Improves coordination between office and site",
];

const deptWithout = [
  "No visibility into actual site progress",
  "Difficult to verify contractor claims",
  "Manual reporting → delayed and unreliable",
  "Hard to track if work follows design",
];

const deptWith = [
  "Compare planned vs executed work in real-time",
  "Ensure work is done as per approved design",
  "Track project progress accurately",
  "Identify delays and inefficiencies early",
  "Improve control over contractor performance",
];

const keyFeatures = [
  "Design-to-execution integration",
  "Chainage-based tracking",
  "Block-level monitoring",
  "Structured workflows for CUT / DIG / FILL",
  "Tablet-based field execution",
  "Real-time web reporting",
];

const stages = [
  {
    title: "Stage 1: Desktop Design (Engineering Setup)",
    subtitle: "Engineers create digital road design",
    details: ["Chainage", "Existing levels", "Formation levels", "Road levels", "Width"],
    output: ["Automatic CUT / DIG / FILL classification", "Accurate volume calculations", "Fixed design baseline"],
    outputLabel: "Output:",
    highlight: "Removes ambiguity before execution begins",
  },
  {
    title: "Stage 2: Web-Based Planning (Steps & Targets)",
    subtitle: "Design is converted into execution targets",
    details: ["Chainage-wise work planning", "Target volumes and depth", "Layer definitions (for FILL)", "Daily / segment-wise targets"],
    output: null,
    highlight: "Answers clearly: What to do → Where to do → How much to do",
  },
  {
    title: "Stage 3: On-Site Execution (Tablet System)",
    subtitle: "Block Definition + Work Progress Entry",
    details: ["Road divided into: Chainage, Lane, Blocks", "CUT / DIG: Depth achieved, Machine usage", "FILL: Material placement, Thickness, Next layer unlock"],
    output: ["No skipping steps", "No editing approved work", "Proper workflow enforcement"],
    outputLabel: "Control:",
    highlight: "Ensures disciplined and accurate execution",
  },
  {
    title: "Stage 4: Web-Based Work Progress Reporting",
    subtitle: "Site data converted into real-time reports",
    details: ["Daily work reports", "Planned vs executed comparison", "Remaining work calculation", "Status tracking"],
    output: ["Date-wise tracking", "Cumulative progress view"],
    outputLabel: "Timeline:",
    highlight: "Gives full control to management",
  },
];

export default function DesignWorkPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30">

      {/* ── HEADER ── */}
      <div className="border-b border-neutral-900">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate(-1)}
            className="text-neutral-500 hover:text-white transition-colors text-xs tracking-[0.3em] uppercase mb-10">
            ← Back to Modules
          </motion.button>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-xs font-bold tracking-[0.4em] uppercase block mb-4" style={{ color: COLOR }}>Module 02</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Design & <span style={{ color: COLOR }}>Execution Management</span></h1>
            <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed border-l border-neutral-800 pl-8">
              Plan accurately, execute efficiently, and avoid costly mistakes on site.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24">

        {/* ── SECTION: THE REAL PROBLEM ── */}
        <section className="mb-24">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold tracking-tight mb-12 uppercase">
            The Real Problem <span className="text-red-600">On Site</span>
          </motion.h2>
          <div className="space-y-4 mb-16">
            {contractorProblems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="p-5 border border-neutral-900 bg-neutral-900/10 text-sm text-neutral-300 flex gap-4">
                <span className="text-red-700 font-bold">—</span> {item}
              </motion.div>
            ))}
          </div>

          <div className="mb-16">
            <h3 className="text-lg font-bold mb-8 uppercase tracking-wide">Real Risks Contractors <span style={{ color: COLOR }}>Face</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contractorRisks.map((risk, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="p-5 border border-neutral-800 bg-neutral-900/20 relative overflow-hidden group hover:border-neutral-600 transition-colors">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-red-600 to-transparent opacity-50" />
                  <p className="text-sm text-neutral-300 flex gap-3"><span className="text-amber-600 font-bold">!</span> {risk}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-24">
            <h3 className="text-lg font-bold mb-8 uppercase tracking-wide">Daily Site <span style={{ color: COLOR }}>Pain Points</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyPainPoints.map((point, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  className="p-6 border border-neutral-900 bg-neutral-900/40 text-center">
                  <p className="text-neutral-200 text-sm italic font-medium">"{point}"</p>
                </motion.div>
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-6 text-xs font-bold uppercase tracking-widest text-red-600 flex gap-2">
              <span>{'>'}</span> Leads to confusion, inefficiency, and financial leakage
            </motion.p>
          </div>
        </section>

        {/* ── SECTION: HOW THIS MODULE HELPS CONTRACTORS ── */}
        <section className="mb-32">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold tracking-tight mb-8 uppercase">
            How this Module <span style={{ color: COLOR }}>Helps Contractors</span>
          </motion.h2>
          <div className="mb-8 p-5 border border-neutral-800 bg-neutral-900/20">
            <p className="text-sm font-bold tracking-wide uppercase" style={{ color: COLOR }}>Designed to Control Execution & Protect Profit</p>
          </div>
          <div className="space-y-3 mb-12">
            {contractorSolutions.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="p-5 border border-neutral-900 bg-neutral-900/10 text-sm text-neutral-300 flex gap-4">
                <span className="font-bold" style={{ color: COLOR }}>/</span> {item}
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="p-8 border border-neutral-800 bg-neutral-900/30">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6" style={{ color: COLOR }}>Simple Outcome</h3>
            <div className="space-y-4">
              <p className="text-neutral-400 text-sm">/ No guesswork on site</p>
              <p className="text-white text-lg font-bold uppercase tracking-tight">/ Work is done exactly as planned</p>
            </div>
          </motion.div>
        </section>

        {/* ── SECTION: FOR DEPARTMENT / AUTHORITY ── */}
        <section className="mb-32">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold tracking-tight mb-12 uppercase">
            For Department / <span style={{ color: COLOR }}>Authority</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-900 border border-neutral-900 overflow-hidden">
            <div className="bg-black p-10">
              <h3 className="text-xs font-bold tracking-widest uppercase mb-8 text-red-500">Without System</h3>
              <div className="space-y-6">
                {deptWithout.map((item, i) => (
                  <motion.p key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="text-sm text-neutral-500 flex gap-4">
                    <span className="text-red-900 font-bold">×</span> {item}
                  </motion.p>
                ))}
              </div>
            </div>
            <div className="bg-black p-10 border-l border-neutral-900">
              <h3 className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: COLOR }}>With This Module</h3>
              <div className="space-y-6">
                {deptWith.map((item, i) => (
                  <motion.p key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="text-sm text-neutral-200 flex gap-4">
                    <span className="font-bold" style={{ color: COLOR }}>/</span> {item}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION: WORKFLOW STAGES (ANIMATED LINE) ── */}
        <section className="mb-32">
          <h2 className="text-xs font-bold tracking-[0.5em] uppercase mb-20 text-neutral-600 text-center">Execution Workflow</h2>
          <div className="relative max-w-4xl mx-auto">
            {stages.map((stage, i) => (
              <div key={i} className="relative flex gap-12 pb-20 last:pb-0">
                <div className="relative flex flex-col items-center flex-shrink-0 w-12">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 font-bold text-black text-sm" style={{ background: COLOR }}>{i + 1}</div>
                  {i !== stages.length - 1 && (
                    <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} transition={{ duration: 0.8, ease: "linear" }}
                      className="absolute top-12 bottom-0 w-[1px] origin-top bg-neutral-800"
                      style={{ background: `linear-gradient(180deg, ${COLOR}, transparent)` }} />
                  )}
                </div>
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex-1 pt-1">
                  <h3 className="text-xl font-bold mb-2 uppercase">{stage.title}</h3>
                  <p className="text-xs text-neutral-500 mb-6 uppercase tracking-widest">{stage.subtitle}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                    {stage.details.map((detail, j) => (
                      <div key={j} className="text-sm text-neutral-500 flex gap-3">
                        <span style={{ color: COLOR }}>/</span> {detail}
                      </div>
                    ))}
                  </div>
                  {stage.output && (
                    <div className="mt-4 p-5 border border-neutral-900 bg-neutral-950/50">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-neutral-600">{stage.outputLabel}</p>
                      {stage.output.map((out, k) => (
                        <p key={k} className="text-xs text-neutral-400 mb-1.5">— {out}</p>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION: KEY FEATURES ── */}
        <section className="mb-32">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold tracking-tight mb-12 uppercase text-center">
            Key <span style={{ color: COLOR }}>Features</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFeatures.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-6 border border-neutral-900 bg-neutral-900/20 flex gap-4 items-center group hover:border-neutral-700 transition-colors">
                <span className="font-bold text-lg" style={{ color: COLOR }}>/</span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="border border-neutral-800 p-20 text-center">
          <h2 className="text-3xl font-bold mb-6 tracking-tighter uppercase">Execution Redefined</h2>
          <p className="text-neutral-500 mb-12 max-w-sm mx-auto text-sm leading-relaxed">
            Stop relying on guesswork and manual tracking. Plan accurately, execute correctly, and track everything in real-time.
          </p>
          <button onClick={() => navigate(-1)}
            className="px-12 py-5 font-bold text-[10px] uppercase tracking-[0.3em] transition-all"
            style={{ backgroundColor: COLOR, color: "black" }}>
            Return to Modules
          </button>
        </motion.div>

      </div>
    </div>
  );
}