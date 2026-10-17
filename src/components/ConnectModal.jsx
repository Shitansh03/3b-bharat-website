import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, X } from "lucide-react";

const ConnectModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    projectType: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Prepare email HTML template (identical to homepage Enquiry)
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
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: "contact@microintegrated.in",
            subject: `New Project Enquiry from ${formData.name} - ${
              formData.projectType || "General Enquiry"
            }`,
            html: emailHtml,
            from: '"3D Bharat Enquiry" ',
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

  /* PRESERVED: Previous direct return without createPortal and z-50 preserved per zero-deletions rule:
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-hidden"
          onClick={onClose}
        >
          ...
        </div>
      )}
    </AnimatePresence>
  );
  */

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-stone-100 dark:bg-[#121212] border border-gray-200 dark:border-white/15 rounded-3xl shadow-2xl p-5 sm:p-6 relative my-auto select-none"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Header */}
            <div className="pr-8 mb-3.5">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400 font-semibold mb-1 block">
                Get in Touch
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                Connect with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
                  us
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                Ready to transform your infrastructure monitoring? Let us know about your project and we'll get back to you within 24 hours.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=" "
                  className="input-field !py-2.5 !px-3.5 text-xs sm:text-sm peer"
                />
                <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-[#121212] peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-[#121212] peer-[:not(:placeholder-shown)]:px-1">
                  Name *
                </label>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  className="input-field !py-2.5 !px-3.5 text-xs sm:text-sm peer"
                />
                <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-[#121212] peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-[#121212] peer-[:not(:placeholder-shown)]:px-1">
                  Email *
                </label>
              </div>

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
                <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-[#121212] peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-[#121212] peer-[:not(:placeholder-shown)]:px-1">
                  Organization / Company
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
                    className="bg-stone-100 dark:bg-[#121212] text-gray-800 dark:text-white"
                  >
                    Select Project Type
                  </option>
                  {projectTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-stone-100 dark:bg-[#121212] text-gray-800 dark:text-white"
                    >
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
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

              {/* Message */}
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder=" "
                  rows={3}
                  className="input-field !py-2.5 !px-3.5 text-xs sm:text-sm peer resize-none"
                />
                <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-[#121212] peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-[#121212] peer-[:not(:placeholder-shown)]:px-1">
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
                className="w-full btn-primary flex items-center justify-center gap-2 !py-2.5 sm:!py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md mt-1.5 font-bold text-xs sm:text-sm"
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : modalContent;
};

export default ConnectModal;
