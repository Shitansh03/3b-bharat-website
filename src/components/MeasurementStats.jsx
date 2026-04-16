import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MeasurementStats = () => {
  const [stats, setStats] = useState([]);
  const [totals, setTotals] = useState({ files: 0, app: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloadCounts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/3dtrial/download-counts`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch download counts");
        }
        
        const data = await response.json();
        
        // Map API response to component structure
        const mappedStats = data.data.map((item) => ({
          id: item.category_name.toLowerCase().replace(/\s+/g, "-"),
          label: item.category_name,
          files: item.file_download_count,
          app: item.app_download_count,
        }));

        setStats(mappedStats);
        setTotals({
          files: data.total_file_download_count,
          app: data.total_app_download_count,
        });
      } catch (err) {
        console.error("Error fetching download counts:", err);
        setStats([]);
        setTotals({ files: 0, app: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchDownloadCounts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="relative w-full px-4 py-6"
    >
      <motion.div
        key={`stats-container-${loading}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((measurement) => (
            <motion.div
              key={measurement.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 15 } }}
              className="group h-full"
            >
              <div
                className="rounded-lg p-6 backdrop-blur-md bg-white/5 hover:bg-white/8 
                  border border-white/10 hover:border-white/20 transition-all duration-300
                  shadow-lg hover:shadow-xl h-full"
              >
                {/* Category Name */}
                <h3 className="text-white/80 text-sm md:text-base font-semibold mb-4">
                  {measurement.label}
                </h3>

                {/* Downloads Label */}
                <p className="text-white/50 text-xs md:text-sm font-medium mb-4">Downloads</p>

                {/* Download Stats */}
                <div className="space-y-3">
                  {/* App Download */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs md:text-sm">App</span>
                    <motion.div
                      key={`${measurement.id}-app-${measurement.app}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm md:text-base font-bold text-white/90"
                    >
                      {loading ? (
                        <span className="text-white/40 text-xs">...</span>
                      ) : (
                        measurement.app.toLocaleString()
                      )}
                    </motion.div>
                  </div>

                  {/* Files Download */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs md:text-sm">Files</span>
                    <motion.div
                      key={`${measurement.id}-files-${measurement.files}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm md:text-base font-bold text-white/90"
                    >
                      {loading ? (
                        <span className="text-white/40 text-xs">...</span>
                      ) : (
                        measurement.files.toLocaleString()
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MeasurementStats;
