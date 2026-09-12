import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * Interactive UI Calendar Picker Component
 * Provides intuitive visual month/year navigation, day grid, and quick presets.
 */
export function UICalendarPicker({
  value,
  onChange,
  label = 'Select Date',
  required = false,
  minDate = null,
  accentColor = 'emerald'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current value or default to current date
  const parsedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  const [viewYear, setViewYear] = useState(validDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(validDate.getMonth());

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keep view year/month in sync if value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const selectDate = (year, month, day) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(formatted);
    setIsOpen(false);
  };

  // Generate calendar day cells
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      month: viewMonth === 0 ? 11 : viewMonth - 1,
      year: viewMonth === 0 ? viewYear - 1 : viewYear,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true
    });
  }

  // Next month leading days (fill to 35 or 42 cells)
  const remainingCells = (calendarDays.length <= 35 ? 35 : 42) - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      month: viewMonth === 11 ? 0 : viewMonth + 1,
      year: viewMonth === 11 ? viewYear + 1 : viewYear,
      isCurrentMonth: false
    });
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const formatDisplay = (val) => {
    if (!val) return 'Choose a date...';
    const d = new Date(val + 'T00:00:00');
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const colorClasses = {
    emerald: {
      border: 'focus:border-emerald-500',
      activeBg: 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30',
      hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    purple: {
      border: 'focus:border-purple-500',
      activeBg: 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30',
      hover: 'hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400',
      badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    },
    cyan: {
      border: 'focus:border-cyan-500',
      activeBg: 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30',
      hover: 'hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400',
      badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
    }
  }[accentColor] || {
    border: 'focus:border-emerald-500',
    activeBg: 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30',
    hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span>{label} {required && <span className="text-rose-500">*</span>}</span>
          {value && (
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              {value}
            </span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-left text-xs transition-all ${
          isOpen ? 'ring-2 ring-emerald-500/20 border-emerald-500 dark:border-emerald-500' : 'hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className={`w-4 h-4 shrink-0 ${value ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'}`} />
          <span className={`font-medium ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            {formatDisplay(value)}
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          Calendar
        </span>
      </button>

      {/* Dropdown Calendar Popup */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 max-w-[calc(100vw-48px)] bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header Month / Year controls */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center font-display font-bold text-sm text-slate-900 dark:text-white">
              {MONTH_NAMES[viewMonth]} <span className="text-slate-400 font-normal">{viewYear}</span>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_SHORT.map((dayName, idx) => (
              <div 
                key={dayName} 
                className={`text-[11px] font-semibold py-1 ${idx === 0 || idx === 6 ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'}`}
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((cDay, i) => {
              const dateKey = `${cDay.year}-${String(cDay.month + 1).padStart(2, '0')}-${String(cDay.day).padStart(2, '0')}`;
              const isSelected = value === dateKey;
              const isToday = todayStr === dateKey;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectDate(cDay.year, cDay.month, cDay.day)}
                  className={`relative py-2 text-xs rounded-xl transition-all flex items-center justify-center font-medium ${
                    isSelected
                      ? colorClasses.activeBg
                      : cDay.isCurrentMonth
                        ? 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'text-slate-300 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span>{cDay.day}</span>
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Presets Footer */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                selectDate(now.getFullYear(), now.getMonth(), now.getDate());
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                selectDate(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                selectDate(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate());
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
            >
              +7 Days
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Interactive UI Clock / Time Picker Component
 * Provides intuitive visual hour dial, minutes (:00, :15, :30, :45), AM/PM toggle, and presets.
 */
export function UIClockPicker({
  value,
  onChange,
  label = 'Select Time',
  required = false,
  accentColor = 'emerald'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse incoming value like "11:00 AM IST" or "14:30"
  const parseTime = (val) => {
    if (!val) return { hour: '11', minute: '00', period: 'AM' };
    const match = val.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      let h = parseInt(match[1], 10);
      let period = match[3] ? match[3].toUpperCase() : 'AM';
      if (!match[3] && h >= 12) {
        period = 'PM';
        if (h > 12) h -= 12;
      }
      return {
        hour: String(h === 0 ? 12 : (h > 12 ? h - 12 : h)).padStart(2, '0'),
        minute: match[2],
        period: period || 'AM'
      };
    }
    return { hour: '11', minute: '00', period: 'AM' };
  };

  const initialTime = parseTime(value);
  const [selectedHour, setSelectedHour] = useState(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialTime.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialTime.period);

  useEffect(() => {
    if (value) {
      const parsed = parseTime(value);
      setSelectedHour(parsed.hour);
      setSelectedMinute(parsed.minute);
      setSelectedPeriod(parsed.period);
    }
  }, [value]);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const applyTime = (h, m, p) => {
    const timeStr = `${h}:${m} ${p} IST`;
    onChange(timeStr);
  };

  const handleHourSelect = (h) => {
    const formatted = String(h).padStart(2, '0');
    setSelectedHour(formatted);
    applyTime(formatted, selectedMinute, selectedPeriod);
  };

  const handleMinuteSelect = (m) => {
    const formatted = String(m).padStart(2, '0');
    setSelectedMinute(formatted);
    applyTime(selectedHour, formatted, selectedPeriod);
  };

  const handlePeriodToggle = (p) => {
    setSelectedPeriod(p);
    applyTime(selectedHour, selectedMinute, p);
  };

  const selectPreset = (presetString) => {
    onChange(presetString);
    const parsed = parseTime(presetString);
    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
    setSelectedPeriod(parsed.period);
    setIsOpen(false);
  };

  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const minutes = ['00', '15', '30', '45'];

  const presets = [
    '10:00 AM IST',
    '11:30 AM IST',
    '02:30 PM IST',
    '04:00 PM IST'
  ];

  const colorClasses = {
    emerald: {
      activeBg: 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30',
      activePeriod: 'bg-emerald-600 text-white',
      badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    purple: {
      activeBg: 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30',
      activePeriod: 'bg-purple-600 text-white',
      badge: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    cyan: {
      activeBg: 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30',
      activePeriod: 'bg-cyan-600 text-white',
      badge: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    }
  }[accentColor] || {
    activeBg: 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30',
    activePeriod: 'bg-emerald-600 text-white',
    badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span>{label} {required && <span className="text-rose-500">*</span>}</span>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            IST (UTC+5:30)
          </span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-left text-xs transition-all ${
          isOpen ? 'ring-2 ring-emerald-500/20 border-emerald-500 dark:border-emerald-500' : 'hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <ClockIcon className={`w-4 h-4 shrink-0 ${value ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'}`} />
          <span className={`font-semibold font-mono ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            {value || '11:00 AM IST'}
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          Time Clock
        </span>
      </button>

      {/* Dropdown Clock UI */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 top-full mt-2 z-50 w-72 sm:w-80 max-w-[calc(100vw-48px)] bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          
          {/* Digital Clock Banner */}
          <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between mb-4 shadow-inner">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tracking-tight text-white">
                {selectedHour}
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400 animate-pulse">
                :
              </span>
              <span className="text-2xl font-bold font-mono tracking-tight text-white">
                {selectedMinute}
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                {selectedPeriod}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              IST
            </span>
          </div>

          {/* AM / PM Segmented Control */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-dark-950 rounded-xl mb-3">
            <button
              type="button"
              onClick={() => handlePeriodToggle('AM')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedPeriod === 'AM'
                  ? colorClasses.activePeriod + ' shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              AM (Morning)
            </button>
            <button
              type="button"
              onClick={() => handlePeriodToggle('PM')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedPeriod === 'PM'
                  ? colorClasses.activePeriod + ' shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              PM (Afternoon/Eve)
            </button>
          </div>

          {/* Hour Selector Grid */}
          <div className="mb-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Hour
            </div>
            <div className="grid grid-cols-6 gap-1">
              {hours.map((h) => {
                const formattedH = String(h).padStart(2, '0');
                const isSelected = selectedHour === formattedH;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleHourSelect(h)}
                    className={`py-1.5 text-xs rounded-lg font-mono transition-all ${
                      isSelected
                        ? colorClasses.activeBg
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {formattedH}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minute Selector */}
          <div className="mb-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Minute
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {minutes.map((m) => {
                const isSelected = selectedMinute === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMinuteSelect(m)}
                    className={`py-1.5 text-xs rounded-lg font-mono transition-all ${
                      isSelected
                        ? colorClasses.activeBg
                        : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    :{m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Quick Schedules
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => selectPreset(p)}
                  className="px-2 py-1 rounded-lg text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 text-left transition-colors truncate"
                >
                  • {p}
                </button>
              ))}
            </div>
          </div>

          {/* Done Button */}
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
            >
              Done
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
