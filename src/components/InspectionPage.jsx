import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const COLOR = "#F97316";

// All Data preserved exactly
const contractorProblems = [
  "Work gets completed, but inspection is missed or delayed",
  "Department may reject the work during later checks",
  "Contractors are asked to redo completed work",
  "No proof of inspection → payment gets delayed or blocked",
  "Teams depend on verbal updates → miscommunication happens",
];

const contractorRisks = [
  "Department may impose penalties if inspection is not done on time",
  "Work may be rejected even after completion",
  "Payments can be held due to missing inspection records",
  "Rework increases cost and reduces profit margins",
  "Loss of trust with client / authority",
];

const dailyPainPoints = [
  "Was this layer inspected or not?",
  "Who checked this work?",
  "Where is the proof?",
  "Why was this not reported earlier?",
];

const deptWithout = [
  "No clarity if inspections actually happened",
  "Manual reports → delayed or incomplete",
  "Difficult to track employee performance",
  "No transparency in issue handling",
];

const deptWith = [
  "Track who inspected what and when",
  "Ensure inspections are not skipped",
  "Identify employees who are not performing their duties",
  "Generate reliable internal reports",
  "Maintain full project accountability",
];

const contractorSolutions = [
  "Every inspection is recorded with time and location",
  "You always have proof of quality checks",
  "Avoid penalties by ensuring timely inspections",
  "Detect issues early → reduce costly rework",
  "Maintain clear communication between site & office",
  "Strong documentation helps in faster approvals & billing",
];

const stages = [
  {
    title: "Stage 1: Inspection Setup (Headers)",
    details: ["Define inspection categories", "Create standard checklists", "Set quality parameters"],
  },
  {
    title: "Stage 2: Inspection Notes",
    details: ["Record measurements", "Add observations", "Log defects"],
  },
  {
    title: "Stage 3: Inspection Scheduling",
    details: ["Plan inspections", "Assign responsibility", "Trigger stage-based checks"],
  },
  {
    title: "Stage 4: Responses & Action",
    details: ["Respond to issues", "Track actions taken", "Update status (Open / In Progress / Resolved)"],
  },
  {
    title: "Stage 5: Evidence & Proof",
    details: ["Upload photos", "Maintain time-stamped records", "Build audit-ready documentation"],
  },
  {
    title: "Stage 6: Status & Visibility",
    details: ["Track inspection status", "View issue flags", "Monitor pending vs completed"],
  },
];

const contractorImpact = [
  "Avoid penalties and payment delays",
  "Reduce rework costs",
  "Maintain strong documentation",
  "Improve site discipline",
  "Increase trust with client",
];

const departmentImpact = [
  "Better internal reporting",
  "Strong accountability system",
  "Visibility into employee performance",
  "Improved quality control",
];

export default function InspectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">

      {/* ── HEADER ── */}
      <div className="border-b border-neutral-900">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => navigate(-1)}
            className="text-neutral-500 hover:text-white transition-colors text-xs tracking-[0.3em] uppercase mb-10"
          >
            ← Back to Modules
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-xs font-bold tracking-[0.4em] uppercase block mb-4" style={{ color: COLOR }}>
              Module 01
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Inspection & <span style={{ color: COLOR }}>Quality Control</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed border-l border-neutral-800 pl-8">
              Avoid penalties and reduce rework through verified documentation.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24">

        {/* ── THE REAL PROBLEM (CONTRACTOR POV) ── */}
        <section className="mb-24">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold tracking-tight mb-12 uppercase">
            The Real Problem <span className="text-red-600">On Site</span>
          </motion.h2>

          <div className="space-y-4 mb-16">
            {contractorProblems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="p-5 border border-neutral-900 bg-neutral-900/10 text-sm text-neutral-300 flex gap-4">
                <span className="text-red-700 font-bold">—</span> {item}
              </motion.div>
            ))}
          </div>

          <div className="mb-16">
            <h3 className="text-lg font-bold mb-8 uppercase tracking-wide">Real Risks Contractors <span style={{ color: COLOR }}>Face</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contractorRisks.map((risk, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-5 border border-neutral-800 bg-neutral-900/20 relative overflow-hidden group hover:border-neutral-600 transition-colors">
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
                <motion.div key={i} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="p-6 border border-neutral-900 bg-neutral-900/40 text-center">
                  <p className="text-neutral-200 text-sm italic font-medium">"{point}"</p>
                </motion.div>
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-6 text-xs font-bold uppercase tracking-widest text-red-600 flex gap-2">
              <span>{'>'}</span> These questions create stress, confusion, and financial risk
            </motion.p>
          </div>
        </section>

        {/* ── HOW THIS MODULE HELPS CONTRACTORS (Restored from Image) ── */}
        <section className="mb-32">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold tracking-tight mb-8 uppercase">
            How this Module <span style={{ color: COLOR }}>Helps Contractors</span>
          </motion.h2>

          <div className="mb-8 p-5 border border-neutral-800 bg-neutral-900/20">
            <p className="text-sm font-bold tracking-wide uppercase" style={{ color: COLOR }}>Designed to Protect Your Work & Payments</p>
          </div>

          <div className="space-y-3 mb-12">
            {contractorSolutions.map((item, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="p-5 border border-neutral-900 bg-neutral-900/10 text-sm text-neutral-300 flex gap-4"
              >
                <span className="font-bold" style={{ color: COLOR }}>/</span> {item}
              </motion.div>
            ))}
          </div>

          {/* SIMPLE OUTCOME BOX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className="p-8 border border-neutral-800 bg-neutral-900/30"
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6" style={{ color: COLOR }}>Simple Outcome</h3>
            <div className="space-y-4">
              <p className="text-neutral-400 text-sm">/ You don't just do the work</p>
              <p className="text-white text-lg font-bold uppercase tracking-tight">/ You can prove that the work was done correctly</p>
            </div>
          </motion.div>
        </section>

        {/* ── FOR DEPARTMENT / AUTHORITY ── */}
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
              <h3 className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: COLOR }}>With Inspection Module</h3>
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

        {/* ── WORKFLOW STAGES (Vertical Line Animation) ── */}
        <section className="mb-32">
          <h2 className="text-xs font-bold tracking-[0.5em] uppercase mb-20 text-neutral-600 text-center">System Workflow</h2>
          <div className="relative max-w-4xl mx-auto">
            {stages.map((stage, i) => (
              <div key={i} className="relative flex gap-12 pb-20 last:pb-0">
                <div className="relative flex flex-col items-center flex-shrink-0 w-12">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 font-bold text-black text-sm" style={{ background: COLOR }}>{i + 1}</div>
                  {i !== stages.length - 1 && (
                    <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: false }} transition={{ duration: 0.8, ease: "linear" }} className="absolute top-12 bottom-0 w-[1px] origin-top bg-neutral-800" style={{ background: `linear-gradient(180deg, ${COLOR}, transparent)` }} />
                  )}
                </div>
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex-1 pt-1">
                  <h3 className="text-xl font-bold mb-6 tracking-tight uppercase" style={{ color: i % 2 === 0 ? "white" : COLOR }}>{stage.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stage.details.map((detail, j) => (
                      <div key={j} className="text-xs text-neutral-500 uppercase tracking-widest leading-loose"><span className="mr-2" style={{ color: COLOR }}>/</span> {detail}</div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BUSINESS IMPACT (Contractor & Department) ── */}
        <section className="mb-32">
          <h2 className="text-xs font-bold tracking-[0.5em] uppercase mb-12 text-neutral-600 text-center">Business Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-900 border border-neutral-900 overflow-hidden">
            <div className="bg-black p-12">
              <h3 className="text-[10px] font-bold tracking-widest uppercase mb-10 text-neutral-500">For Contractors</h3>
              <div className="space-y-6">
                {contractorImpact.map((item, i) => (
                  <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} key={i} className="text-sm text-neutral-400 flex gap-4 items-start">
                    <span style={{ color: COLOR }} className="mt-1 font-bold">0{i + 1}</span> {item}
                  </motion.p>
                ))}
              </div>
            </div>
            <div className="bg-black p-12 border-l border-neutral-900">
              <h3 className="text-[10px] font-bold tracking-widest uppercase mb-10 text-neutral-500">For Departments</h3>
              <div className="space-y-6">
                {departmentImpact.map((item, i) => (
                  <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} key={i} className="text-sm text-neutral-400 flex gap-4 items-start">
                    <span style={{ color: COLOR }} className="mt-1 font-bold">0{i + 1}</span> {item}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="border border-neutral-800 p-20 text-center">
          <h2 className="text-3xl font-bold mb-6 tracking-tighter uppercase">Operational Excellence</h2>
          <p className="text-neutral-500 mb-12 max-w-sm mx-auto text-sm leading-relaxed">Standardize your verification workflow to protect project timelines and payments.</p>
          <button onClick={() => navigate(-1)} className="px-12 py-5 font-bold text-[10px] uppercase tracking-[0.3em] transition-all" style={{ backgroundColor: COLOR, color: "black" }}>Return to Modules</button>
        </motion.div>

      </div>
    </div>
  );
}