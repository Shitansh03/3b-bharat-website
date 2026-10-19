import { useState, useEffect, Suspense, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Send, CheckCircle, AlertCircle, X, Globe } from "lucide-react";
import ConnectGlobe from "./three/ConnectGlobe";
import { COUNTRIES, getCountryByName } from "../data/countriesData";
import { useTheme } from "../context/ThemeContext";

const ConnectModal = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "India",
    organization: "",
    projectType: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected country details for quick preview banner
  const selectedCountryData = useMemo(
    () => getCountryByName(formData.country),
    [formData.country]
  );

  const projectTypes = [
    "Road Construction",
    "Bridge / Flyover",
    "Building",
    "Railway",
    "Other Infrastructure",
  ];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      setIsSubmitting(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address (e.g., name@example.com).",
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare email HTML template (identical to homepage Enquiry + Country field)
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Project Enquiry</h1>
          <p style="color: #cccccc; margin: 10px 0 0 0;">3D Bharat - Infrastructure Monitoring</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0;">
          <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Contact Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #666; width: 140px;"><strong>Name:</strong></td>
              <td style="padding: 10px 0; color: #333;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 10px 0; color: #333;"><a href="mailto:${
                formData.email
              }" style="color: #007bff;">${formData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;"><strong>Country:</strong></td>
              <td style="padding: 10px 0; color: #333;">${
                formData.country || "Not specified"
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;"><strong>Organization:</strong></td>
              <td style="padding: 10px 0; color: #333;">${
                formData.organization || "Not specified"
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;"><strong>Project Type:</strong></td>
              <td style="padding: 10px 0; color: #333;">${
                formData.projectType || "Not specified"
              }</td>
            </tr>
          </table>
          
          <h3 style="color: #333; margin-top: 25px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Message</h3>
          <div style="background: #ffffff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
            <p style="color: #333; margin: 0; line-height: 1.6; white-space: pre-wrap;">${
              formData.message
            }</p>
          </div>
        </div>
        
        <div style="background: #1a1a1a; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #888; margin: 0; font-size: 12px;">This enquiry was submitted through the 3D Bharat website.</p>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 11px;">© ${new Date().getFullYear()} 3D Bharat. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      const response = await fetch(
        "https://vocoxp.staffhandler.com/vocoxp/tenant/tenant_backend/api/tenant/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: "contact@microintegrated.in",
            subject: `New Project Enquiry from ${formData.name} (${formData.country || "Global"}) - ${
              formData.projectType || "General Enquiry"
            }`,
            html: emailHtml,
            from: '"3D Bharat Enquiry" <enquiry@3dbharat.com>',
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send enquiry");
      }

      // Success
      setStatus({
        type: "success",
        message: "Thank you! We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        country: "India",
        organization: "",
        projectType: "",
        message: "",
      });

      // Automatically close modal after 3 seconds on success
      setTimeout(() => {
        onClose();
        setStatus({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Email sending error:", error);
      setStatus({
        type: "error",
        message:
          "Failed to send enquiry. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
      // Clear error status after 5 seconds if not closed
      setTimeout(() => {
        setStatus((prev) => (prev.type === "error" ? { type: "", message: "" } : prev));
      }, 5000);
    }
  };

  /* PRESERVED: Previous single-column card layout preserved per zero-deletions rule:
  const previousSingleColumnModal = (
    <div className="w-full max-w-lg bg-stone-100 dark:bg-[#121212] border border-gray-200 dark:border-white/15 rounded-3xl shadow-2xl p-5 sm:p-6 relative my-auto select-none">
      <button onClick={onClose}><X /></button>
      <form onSubmit={handleSubmit}>...</form>
    </div>
  );
  */

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl lg:max-w-5xl bg-stone-100 dark:bg-[#0f141c] border border-gray-200 dark:border-white/15 rounded-3xl shadow-2xl relative my-auto overflow-hidden select-none"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Modern 2-Column Square / Balanced Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
              {/* LEFT COLUMN: Interactive Rotating 3D Globe with Reactive Country Highlight */}
              <div className="md:col-span-5 relative bg-gradient-to-br from-emerald-950/30 via-slate-900/70 to-black/90 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10 flex flex-col justify-between p-4 sm:p-5 overflow-hidden">
                {/* Globe Header Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold tracking-wider uppercase">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Global Coverage</span>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono tracking-wider uppercase hidden sm:inline">
                    Interactive 3D
                  </span>
                </div>

                {/* 3D Canvas Center */}
                <div className="relative w-full h-64 sm:h-72 md:h-full min-h-[260px] flex items-center justify-center my-2">
                  <Canvas
                    camera={{ position: [0, 0, 6.2], fov: 36 }}
                    dpr={[1, 1.5]}
                    gl={{ antialias: true, alpha: true }}
                    style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
                  >
                    <Suspense fallback={null}>
                      <ConnectGlobe selectedCountry={formData.country} isDark={isDark} />
                    </Suspense>
                  </Canvas>

                  {/* Ambient Backdrop Glow */}
                  <div className="pointer-events-none absolute w-52 h-52 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 blur-3xl -z-10" />
                </div>

                {/* Bottom Active Country Status Card */}
                <div className="relative z-10 p-3 rounded-2xl bg-white/70 dark:bg-white/[0.06] backdrop-blur-md border border-gray-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg shrink-0">
                      {selectedCountryData?.code || "GL"}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
                        Selected Region
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate flex items-center gap-1.5">
                        <span>{selectedCountryData?.name || "Global Coverage"}</span>
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                      {selectedCountryData
                        ? `${selectedCountryData.lat >= 0 ? selectedCountryData.lat.toFixed(1) + "°N" : Math.abs(selectedCountryData.lat).toFixed(1) + "°S"}, ${selectedCountryData.lng >= 0 ? selectedCountryData.lng.toFixed(1) + "°E" : Math.abs(selectedCountryData.lng).toFixed(1) + "°W"}`
                        : "360° Sync"}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Enquiry Form with Country Selector */}
              <div className="md:col-span-7 p-5 sm:p-6 md:p-7 flex flex-col justify-center">
                {/* Header */}
                <div className="pr-8 mb-4">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400 font-semibold mb-1 block">
                    Get in Touch
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                    Connect with{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
                      us
                    </span>
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    Ready to transform your infrastructure monitoring? Select your country to focus our 3D view and submit your project details.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Name */}
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder=" "
                      className="input-field !py-2.5 !px-3.5 text-xs sm:text-sm peer"
                      required
                    />
                    <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-[#0f141c] peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-[#0f141c] peer-[:not(:placeholder-shown)]:px-1">
                      Name *
                    </label>
                  </div>

                  {/* Email & Country 2-Column Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Email */}
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder=" "
                        className="input-field !py-2.5 !px-3.5 text-xs sm:text-sm peer"
                        required
                      />
                      <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-[#0f141c] peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-[#0f141c] peer-[:not(:placeholder-shown)]:px-1">
                        Email *
                      </label>
                    </div>

                    {/* Country Dropdown (Linked reactively to 3D Globe) */}
                    <div className="relative">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="input-field !py-2.5 !px-3.5 text-xs sm:text-sm appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled className="bg-stone-100 dark:bg-[#0f141c] text-gray-800 dark:text-white">
                          Select Country *
                        </option>
                        {COUNTRIES.map((c) => (
                          <option
                            key={c.code}
                            value={c.name}
                            className="bg-stone-100 dark:bg-[#0f141c] text-gray-800 dark:text-white"
                          >
                            {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
                        <span className="text-[10px] text-emerald-500 font-semibold hidden sm:inline">3D</span>
                        <svg
                          className="w-3.5 h-3.5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Organization & Project Type 2-Column Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Organization */}
                    <div className="relative">
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder=" "
                        className="input-field !py-2.5 !px-3.5 text-xs sm:text-sm peer"
                      />
                      <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-[#0f141c] peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-[#0f141c] peer-[:not(:placeholder-shown)]:px-1">
                        Organization
                      </label>
                    </div>

                    {/* Project Type */}
                    <div className="relative">
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="input-field !py-2.5 !px-3.5 text-xs sm:text-sm appearance-none cursor-pointer"
                      >
                        <option
                          value=""
                          className="bg-stone-100 dark:bg-[#0f141c] text-gray-800 dark:text-white"
                        >
                          Select Project Type
                        </option>
                        {projectTypes.map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="bg-stone-100 dark:bg-[#0f141c] text-gray-800 dark:text-white"
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-3.5 h-3.5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder=" "
                      rows={3}
                      className="input-field !py-2.5 !px-3.5 text-xs sm:text-sm peer resize-none"
                      required
                    />
                    <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-[#0f141c] peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-[#0f141c] peer-[:not(:placeholder-shown)]:px-1">
                      Message *
                    </label>
                  </div>

                  {/* Status Message */}
                  {status.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                        status.type === "success"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                          : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25"
                      }`}
                    >
                      {status.type === "success" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                      <span>{status.message}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 !py-2.5 sm:!py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md mt-1 font-bold text-xs sm:text-sm"
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : modalContent;
};

export default ConnectModal;

