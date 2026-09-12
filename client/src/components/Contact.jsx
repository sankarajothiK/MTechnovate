import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Building2 } from 'lucide-react';
import { api } from '../services/api';

export default function Contact({ company }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const address = company?.address || 'M.G.Complex, Busstand, Kadayam-627 415.';
  const email = company?.email || 'mtechnovatesolutions@gmail.com';
  const phone = company?.phone || '+91 94884 12345';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 6000);
      } else {
        setError(res.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Network error sending inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 bg-white border-t border-slate-100">
      
      {/* Background soft ambient accents */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>CONNECT WITH US</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight">
            Let's Discuss Your <br className="hidden sm:inline" />
            <span className="mesh-gradient-text">Global Data Requirements</span>
          </h2>
          <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-full mx-auto mt-4" />
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Reach out to our operations team for project scoping, international documentation partnerships, or career inquiries.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Headquarters & Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Headquarters Bento Card */}
            <div className="p-8 rounded-3xl bento-card space-y-6">
              <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Corporate Headquarters</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Registered Office</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 shrink-0 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Official Email</span>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-semibold text-indigo-600 hover:underline mt-0.5 block font-mono"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Direct Phone</span>
                    <a
                      href={`tel:${phone}`}
                      className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors mt-0.5 block font-mono"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 shrink-0 shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Operational Hours</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      Monday – Saturday: 9:00 AM – 7:00 PM IST
                    </p>
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                      24/7 Rotational Support for UK & USA Project Desks
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="h-60 rounded-3xl overflow-hidden bento-card p-1 relative">
              <iframe
                title="M Technovate Kadayam Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15764.093400588147!2d77.37894!3d8.99583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0429712a45d06d%3A0x6b63d6f78f8cb080!2sKadayam%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full rounded-2xl border-0"
                loading="lazy"
              />
            </div>

          </motion.div>

          {/* Right Column: Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="p-8 sm:p-10 rounded-3xl bento-card relative">
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">
                Send an Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Fill out the form below and our operations desk will respond within 24 hours.
              </p>

              {success && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Your message has been sent successfully. We will get in touch shortly!</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-600 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Name <span className="text-indigo-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-indigo-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone / Mobile
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. US Vital Records Outsourcing"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Message / Project Scope <span className="text-indigo-600">*</span>
                  </label>
                  <textarea
                    rows="5"
                    required
                    placeholder="Tell us about your data processing volume, project timeline, or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gradient-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm shadow-md transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
