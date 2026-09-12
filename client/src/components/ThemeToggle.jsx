import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-between w-16 h-8 p-1 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        isDark 
          ? 'bg-slate-800 border border-slate-700 shadow-inner' 
          : 'bg-indigo-50 border border-indigo-200 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      {/* Background Icons */}
      <Sun className={`w-3.5 h-3.5 ml-1 transition-opacity duration-200 ${isDark ? 'text-slate-500 opacity-40' : 'text-amber-500 opacity-100'}`} />
      <Moon className={`w-3.5 h-3.5 mr-1 transition-opacity duration-200 ${isDark ? 'text-indigo-400 opacity-100' : 'text-slate-400 opacity-40'}`} />

      {/* Floating Thumb */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
          isDark 
            ? 'left-[34px] bg-indigo-600 text-white shadow-indigo-500/30' 
            : 'left-[4px] bg-white text-amber-500 shadow-amber-500/20'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5" />
        ) : (
          <Sun className="w-3.5 h-3.5" />
        )}
      </motion.div>
    </button>
  );
}
