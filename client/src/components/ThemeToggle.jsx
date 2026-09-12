import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', compact = false }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <>
      {/* Mobile Compact Circular Button (< sm) */}
      <button
        onClick={toggleTheme}
        type="button"
        className={`sm:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 active:scale-95 shrink-0 ${
          isDark
            ? 'bg-slate-800/90 border border-slate-700 text-amber-400 hover:text-amber-300 hover:bg-slate-750 shadow-inner'
            : 'bg-slate-100 border border-slate-200 text-indigo-600 hover:text-indigo-700 hover:bg-slate-200/80 shadow-xs'
        } ${className}`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle Theme"
      >
        <motion.div
          key={isDark ? 'dark-icon' : 'light-icon'}
          initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </motion.div>
      </button>

      {/* Desktop Full Sliding Pill Toggle (sm+) */}
      <button
        onClick={toggleTheme}
        type="button"
        className={`hidden sm:inline-flex relative items-center justify-between w-16 h-8 p-1 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shrink-0 ${
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
    </>
  );
}
