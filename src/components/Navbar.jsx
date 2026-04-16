import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, LogIn, LogOut, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { useRegistrationModal } from "../context/RegistrationModalContext";
import { useLoginModal } from "../context/LoginModalContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trialsOpen, setTrialsOpen] = useState(false);
  const [mobileTrialsOpen, setMobileTrialsOpen] = useState(false);
  const trialsRef = useRef(null);
  const { isDark } = useTheme();
  const { openModal } = useRegistrationModal();
  const { openModal: openLoginModal } = useLoginModal();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Smooth-scroll to a hash section on the homepage.
   * Uses React Router's navigate() with the hash so the existing
   * ScrollToHash component in App.jsx handles the actual scroll.
   */
  const handleHashNavigation = (e, hash) => {
    e.preventDefault();
    navigate(`/#${hash}`);
  };

  // Determine if the current page has a light background beneath the transparent navbar.
  const isLightBgPage =
    location.pathname.startsWith("/user/dashboard") ||
    location.pathname.startsWith("/trial-info") ||
    location.pathname.startsWith("/modules/");
  const useDarkText = scrolled || isLightBgPage;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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
    { name: "Railways and Metro", href: "/measurement?category=railway" },
    { name: "Measurement", href: "/measurement" },
  ];

  const navItems = [
    { name: "Home", href: "/", hash: null },
    { name: "Measurements", href: "/measurement", hash: null },
    { name: "Videos", href: "/videos", hash: null },
    { name: "About", href: "/#about", hash: "about" },
    { name: "Contact", href: "/#enquiry", hash: "enquiry" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled || mobileMenuOpen
        ? "bg-stone-100/90 dark:bg-black/90 backdrop-blur-xl border-gray-300 dark:border-white/10"
        : "bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center space-x-2 relative w-32 h-32"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white block w-full h-full">
              <img
                src="/images/logo.png"
                alt="3D Bharat - Precise Work Progress Monitoring"
                className={`absolute inset-0 w-32 h-32 transition-opacity duration-300 ${(useDarkText || mobileMenuOpen) && !isDark ? "opacity-0" : "opacity-100"}`}
                width="128"
                height="128"
              />
              <img
                src="/images/logo2.png"
                alt="3D Bharat - Precise Work Progress Monitoring"
                className={`absolute inset-0 w-32 h-32 transition-opacity duration-300 ${(useDarkText || mobileMenuOpen) && !isDark ? "opacity-100" : "opacity-0"}`}
                width="128"
                height="128"
              />
            </span>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={item.hash ? (e) => handleHashNavigation(e, item.hash) : undefined}
                className={`text-sm font-medium transition-colors duration-300 tracking-wide cursor-pointer ${useDarkText ? "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" : "text-white/90 hover:text-white"}`}
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
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 tracking-wide ${useDarkText ? "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" : "text-white/90 hover:text-white"}`}
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
                          navigate(`/trial-info?category=${item.name.toLowerCase()}`);
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

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/user/dashboard" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg hover:ring-2 hover:ring-amber-400/30 transition-all ${useDarkText ? "bg-gray-100 dark:bg-white/10" : "bg-white/10"}`}>
                  <User className={`w-4 h-4 ${useDarkText ? "text-gray-600 dark:text-gray-300" : "text-white/80"}`} />
                  <span className={`text-sm font-medium ${useDarkText ? "text-gray-700 dark:text-gray-200" : "text-white/90"}`}>
                    {user?.first_name || "User"}
                  </span>
                </Link>
                <motion.button
                  onClick={logout}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${useDarkText ? "border border-gray-400 dark:border-white/30 text-gray-700 dark:text-white hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:border-red-500/30 dark:hover:text-red-400" : "border border-white/50 text-white hover:bg-red-500/20 hover:border-red-400/50"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={openLoginModal}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${useDarkText ? "text-gray-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-400" : "text-white/90 hover:text-white"}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </motion.button>
                <motion.a
                  href="/#enquiry"
                  onClick={(e) => handleHashNavigation(e, "enquiry")}
                  className={`px-6 py-2.5 border rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${useDarkText ? "border-gray-400 dark:border-white/30 text-gray-700 dark:text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-black" : "border-white/50 text-white hover:bg-white/20"}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.a>
              </div>
            )}
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
                  className={`w-full h-0.5 transition-all duration-300 ${useDarkText || mobileMenuOpen ? "bg-gray-800 dark:bg-white" : "bg-white"} ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                />
                <span
                  className={`w-full h-0.5 transition-all duration-300 ${useDarkText || mobileMenuOpen ? "bg-gray-800 dark:bg-white" : "bg-white"} ${mobileMenuOpen ? "opacity-0" : ""
                    }`}
                />
                <span
                  className={`w-full h-0.5 transition-all duration-300 ${useDarkText || mobileMenuOpen ? "bg-gray-800 dark:bg-white" : "bg-white"} ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
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
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (item.hash) handleHashNavigation(e, item.hash);
                }}
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
                          navigate(`/trial-info?category=${item.name.toLowerCase()}`);
                        }}
                      >
                        {item.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  to="/user/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-2"
                >
                  <User className="w-4 h-4" />
                  My Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-6 py-2.5 border border-red-300 dark:border-red-500/30 rounded-lg text-sm font-medium
                             text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { openLoginModal(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <a
                  href="/#enquiry"
                  className="inline-block px-6 py-2.5 border border-gray-400 dark:border-white/30 rounded-lg text-sm font-medium
                             text-gray-700 dark:text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleHashNavigation(e, "enquiry");
                  }}
                >
                  Get Started
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
