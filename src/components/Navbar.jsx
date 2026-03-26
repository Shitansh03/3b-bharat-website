import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { useRegistrationModal } from "../context/RegistrationModalContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trialsOpen, setTrialsOpen] = useState(false);
  const [mobileTrialsOpen, setMobileTrialsOpen] = useState(false);
  const trialsRef = useRef(null);
  const { isDark } = useTheme();
  const { openModal } = useRegistrationModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (trialsRef.current && !trialsRef.current.contains(e.target)) {
        setTrialsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trialsDropdownItems = [
    { name: "Road", href: "/measurement?category=road" },
    { name: "Bridge", href: "/measurement?category=bridge" },
    { name: "Railways", href: "/measurement?category=railway" },
    { name: "Measurement", href: "/measurement" },
  ];

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Measurements", href: "/measurement" },
    { name: "Videos", href: "/videos" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#enquiry" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-stone-100/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-300 dark:border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">
              <img
                src={
                  scrolled
                    ? isDark
                      ? "/images/logo.png"
                      : "/images/logo2.png"
                    : "/images/logo.png"
                }
                alt="3D Bharat - Precise Work Progress Monitoring"
                className="w-32 h-32"
                width="128"
                height="128"
              />{" "}
            </span>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-300 tracking-wide ${scrolled ? "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" : "text-white/90 hover:text-white"}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -2 }}
              >
                {item.name}
              </motion.a>
            ))}

            {/* Trials Dropdown */}
            <div className="relative" ref={trialsRef}>
              <motion.button
                onClick={() => setTrialsOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 tracking-wide ${scrolled ? "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" : "text-white/90 hover:text-white"}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1, duration: 0.4 }}
                whileHover={{ y: -2 }}
              >
                Trials
                <motion.span
                  animate={{ rotate: trialsOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <ChevronDown size={14} />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {trialsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-44 rounded-xl overflow-hidden shadow-xl border bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200 dark:border-white/10"
                  >
                    {trialsDropdownItems.map((item, i) => (
                      <motion.button
                        key={item.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.2 }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-150"
                        onClick={() => {
                          setTrialsOpen(false);
                          openModal(item.name.toLowerCase());
                        }}
                      >
                        {item.name}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            <motion.a
              href="/#enquiry"
              className={`px-6 py-2.5 border rounded-lg text-sm font-medium transition-all duration-300 ${scrolled ? "border-gray-400 dark:border-white/30 text-gray-700 dark:text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-black" : "border-white/50 text-white hover:bg-white/20"}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 transition-all duration-300 ${scrolled ? "bg-gray-800 dark:bg-white" : "bg-white"} ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 transition-all duration-300 ${scrolled ? "bg-gray-800 dark:bg-white" : "bg-white"} ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 transition-all duration-300 ${scrolled ? "bg-gray-800 dark:bg-white" : "bg-white"} ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: mobileMenuOpen ? "auto" : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}

            {/* Mobile Trials Dropdown */}
            <div>
              <button
                onClick={() => setMobileTrialsOpen((prev) => !prev)}
                className="flex items-center gap-1 w-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2"
              >
                Trials
                <motion.span
                  animate={{ rotate: mobileTrialsOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <ChevronDown size={14} />
                </motion.span>
              </button>
              <AnimatePresence>
                {mobileTrialsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden pl-4"
                  >
                    {trialsDropdownItems.map((item) => (
                      <button
                        key={item.name}
                        className="block w-full text-left text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors py-1.5 text-sm"
                        onClick={() => {
                          setMobileTrialsOpen(false);
                          setMobileMenuOpen(false);
                          openModal(item.name.toLowerCase());
                        }}
                      >
                        {item.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="/#enquiry"
              className="inline-block px-6 py-2.5 border border-gray-400 dark:border-white/30 rounded-lg text-sm font-medium
                         text-gray-700 dark:text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </a>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
