import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-black flex flex-col items-center justify-center relative overflow-hidden pt-32 pb-20 px-4">
      {/* Navbar visibility overlay - provides contrast for white navlinks on light background */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/50 via-black/20 to-transparent z-10 pointer-events-none" />

      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-400/10 dark:bg-amber-500/10 filter blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-orange-400/10 dark:bg-red-500/10 filter blur-[100px] animate-pulse-glow" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 text-center max-w-2xl w-full"
      >
        {/* Icon/Visual element */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-xl group">
             <AlertCircle className="w-16 h-16 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </motion.div>

        {/* 404 Text */}
        <h1 className="text-8xl md:text-9xl font-black mb-4 tracking-tighter text-gradient">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Oops! Page Not Found
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg max-w-md mx-auto leading-relaxed font-medium">
          The page you are looking for might have been moved, deleted, or never existed in the first place.
        </p>

        {/* Action Button */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
        >
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center gap-2 no-underline"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
