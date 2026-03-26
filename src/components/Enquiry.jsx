import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

const Enquiry = () => {
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

    // Prepare email HTML template
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
        "https://vocoxp.staffhandler.com/vocoxp/tenant/tenant_backend/api/tenant/email",
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
        },
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
    } catch (error) {
      console.error("Email sending error:", error);
      setStatus({
        type: "error",
        message:
          "Failed to send enquiry. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
      // Clear status after 5 seconds
      setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      id="enquiry"
      className="section bg-stone-100 dark:bg-black relative overflow-hidden transition-colors duration-300"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50 dark:from-[#111111] via-stone-100 dark:via-black to-stone-100 dark:to-black transition-colors duration-300" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-400/10 dark:bg-white/5 rounded-full blur-3xl transition-colors duration-300" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-400/10 dark:bg-white/5 rounded-full blur-3xl transition-colors duration-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.span
              variants={itemVariants}
              className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 block"
            >
              Get in Touch
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            >
              Connect with <span className="text-gradient">us</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed transition-colors duration-300"
            >
              Ready to transform your infrastructure monitoring? Let us know
              about your project and we'll get back to you within 24 hours.
            </motion.p>

            <motion.form
              variants={containerVariants}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name */}
              <motion.div variants={itemVariants} className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=" "
                  className="input-field peer"
                />
                <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-black peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-1">
                  Name *
                </label>
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants} className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  className="input-field peer"
                />
                <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-black peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-1">
                  Email *
                </label>
              </motion.div>

              {/* Organization */}
              <motion.div variants={itemVariants} className="relative">
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder=" "
                  className="input-field peer"
                />
                <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-black peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-1">
                  Organization / Company
                </label>
              </motion.div>

              {/* Project Type */}
              <motion.div variants={itemVariants} className="relative">
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="input-field appearance-none cursor-pointer"
                >
                  <option
                    value=""
                    className="bg-stone-100 dark:bg-black text-gray-800 dark:text-white"
                  >
                    Select Project Type
                  </option>
                  {projectTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-stone-100 dark:bg-black text-gray-800 dark:text-white"
                    >
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
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
              </motion.div>

              {/* Message */}
              <motion.div variants={itemVariants} className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder=" "
                  rows={4}
                  className="input-field peer resize-none"
                />
                <label className="floating-label peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-stone-100 dark:peer-focus:bg-black peer-focus:px-1 peer-focus:text-gray-600 dark:peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-stone-100 dark:peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-1">
                  Message *
                </label>
              </motion.div>

              {/* Status Message */}
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 p-4 rounded-lg ${
                    status.type === "success"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  {status.message}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Right - Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="glass-theme p-10 rounded-3xl relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern
                      id="grid"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 10 0 L 0 0 0 10"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-gray-800 dark:text-white transition-colors duration-300">
                  Accurate Measurement,{" "}
                  <span className="text-gradient">Clear Planning</span>
                  <br />
                  Daily Accountability.
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed transition-colors duration-300">
                  With role-based access for all stakeholders, 3D Bharat ensures
                  transparent construction monitoring across all your
                  infrastructure projects.
                </p>

                {/* Stats or features */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { value: "100+", label: "Projects Monitored" },
                    { value: "50+", label: "Active Authorities" },
                    { value: "Same-Day", label: "Progress Visibility" },
                    { value: "24/7", label: "Web Access" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1 transition-colors duration-300">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Engineering graphics */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400/30 dark:via-white/20 to-transparent" />
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-gray-400/50 dark:bg-white/30 rounded-full"
                      />
                    ))}
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400/30 dark:via-white/20 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Enquiry;
