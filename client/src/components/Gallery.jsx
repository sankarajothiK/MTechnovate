import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ZoomIn, X, ChevronLeft, ChevronRight, Sparkles, Tag } from 'lucide-react';

export default function Gallery({ gallery = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ['All', ...new Set(gallery.map(item => item.category).filter(Boolean))];

  const filteredItems = activeCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === activeCategory);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextLightbox = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevLightbox = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="relative py-28 bg-white overflow-hidden border-t border-slate-200/80">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-700 text-xs font-bold tracking-wider uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Showcase & Operations Gallery</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight"
          >
            A Glimpse Into Our <br className="hidden sm:inline" />
            <span className="brand-gradient-text">Operations & Workplace Life</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600"
          >
            Explore our facilities, executive leadership, corporate identity, and professional work environment in Kadayam.
          </motion.p>
        </div>

        {/* Category Filtering Tabs */}
        {categories.length > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:text-brand-600 border border-slate-200 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="mt-16 text-center py-20 rounded-3xl bg-slate-50 border border-slate-200 max-w-lg mx-auto">
            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-800">No gallery images available yet</h4>
            <p className="text-xs text-slate-500 mt-1">Upload workplace photos directly through the Admin Panel.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => openLightbox(index)}
                className="group relative h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-md hover:border-brand-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/logo.jpg';
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono font-bold bg-white/95 backdrop-blur-md text-brand-700 border border-slate-200 shadow-sm">
                    <Tag className="w-3 h-3 text-brand-600" />
                    {item.category || 'Operations'}
                  </span>
                </div>

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <ZoomIn className="w-4 h-4 text-brand-600" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-6">
                  <h3 className="text-lg font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1.5 text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white text-slate-700 hover:text-black border border-slate-300 shadow-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {filteredItems.length > 1 && (
              <>
                <button
                  onClick={prevLightbox}
                  className="absolute left-4 sm:left-8 z-20 p-3 rounded-full bg-white text-slate-700 hover:text-black border border-slate-300 shadow-md transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextLightbox}
                  className="absolute right-4 sm:right-8 z-20 p-3 rounded-full bg-white text-slate-700 hover:text-black border border-slate-300 shadow-md transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 max-w-4xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-300 shadow-2xl"
            >
              <div className="relative bg-slate-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
                <img
                  src={filteredItems[lightboxIndex].image_url}
                  alt={filteredItems[lightboxIndex].title}
                  className="w-full h-full object-contain max-h-[60vh]"
                />
              </div>

              <div className="p-6 bg-white text-slate-900">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-50 text-brand-700 border border-blue-200">
                    {filteredItems[lightboxIndex].category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {lightboxIndex + 1} of {filteredItems.length}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-bold font-display text-slate-900">
                  {filteredItems[lightboxIndex].title}
                </h3>
                {filteredItems[lightboxIndex].description && (
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {filteredItems[lightboxIndex].description}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
