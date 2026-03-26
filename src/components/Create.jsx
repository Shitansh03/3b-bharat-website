import { motion } from "framer-motion";
import { Tablet, Upload, BarChart2, Eye, Camera, Monitor } from "lucide-react";

const Create = () => {
  const tabletFeatures = [
    {
      icon: Tablet,
      title: "Periodic Field Entry",
      description:
        "Engineers record work execution using tablets with flexible entry schedules.",
    },
    {
      icon: BarChart2,
      title: "Auto Reports",
      description:
        "Periodic progress reports generated automatically with same-day visibility.",
    },
    {
      icon: Camera,
      title: "Drone Data Upload",
      description:
        "Panoramic images and 3D point cloud data uploaded via web interface.",
    },
    {
      icon: Monitor,
      title: "Web Dashboards",
      description:
        " targets vs progress with multi-project monitoring capabilities.",
    },
  ];

  const stats = [
    { value: "100%", label: "Digital Accountability" },
    { value: "24hr", label: "Progress Visibility" },
    { value: "3D", label: "Point Cloud Precision" },
    { value: "Multi", label: "User Access Roles" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="create"
      className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden"
    >
      {/* Fixed background with parallax effect */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/point-cloud-img.png')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-stone-200/40 dark:bg-black/70 transition-colors duration-300" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50 dark:from-[#000000] via-transparent to-stone-50  transition-colors duration-300" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.span
            variants={itemVariants}
            className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 block"
          >
            Data Collection & Monitoring
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="text-gray-800 dark:text-white transition-colors duration-300">
              Capture.
            </span>{" "}
            <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Upload.
            </span>{" "}
            <span className="text-gray-500 dark:text-gray-600 transition-colors duration-300">
              Monitor.
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-300"
          >
            From tablet-based field entries to web-based drone uploads, our
            platform provides same-day visibility of actual work across all your
            construction projects.
          </motion.p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {tabletFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="backdrop-blur-lg bg-white/10 dark:bg-black/30 border border-gray-400/30 dark:border-white/10
               p-8 rounded-2xl card-hover group text-center"
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gray-200/50 dark:bg-white/5 flex items-center justify-center group-hover:bg-gray-300/50 dark:group-hover:bg-white/10 transition-colors">
                <feature.icon className="w-8 h-8 text-gray-800 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 tracking-wide transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 w-12 h-0.5 bg-gradient-to-r from-transparent via-gray-400/30 dark:via-white/20 to-transparent mx-auto" />
            </motion.div>
          ))}
        </motion.div>

        {/* Authority Monitoring Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass-theme rounded-2xl p-8 md:p-12 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Eye className="w-6 h-6 text-gray-500" />
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
              For Authorities
            </span>
          </motion.div>
          <motion.h3
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300"
          >
            Periodic Web-Based Monitoring
          </motion.h3>
          <motion.p
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 transition-colors duration-300"
          >
            View targets versus periodic progress, access reports and dashboards
            on web or tablet, and monitor multiple projects without frequent
            site visits.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="#enquiry"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request Demo
            </motion.a>
            <motion.a
              href="#about"
              className="btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Documentation
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0 grid grid-cols-6 gap-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-r border-white/10" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Create;
