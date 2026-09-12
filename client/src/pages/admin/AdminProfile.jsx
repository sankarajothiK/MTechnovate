import React, { useState, useEffect } from 'react';
import { Building2, Save, Upload, CheckCircle2, AlertCircle, Loader2, User, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '',
    tagline: '',
    ceo_name: '',
    ceo_designation: '',
    ceo_message: '',
    address: '',
    email: '',
    phone: '',
    whatsapp_number: '',
    social_linkedin: '',
    social_instagram: '',
    social_twitter: '',
    social_github: '',
    about_text: '',
    vision: '',
    mission: ''
  });

  const [newLogoFile, setNewLogoFile] = useState(null);
  const [newCeoFile, setNewCeoFile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await api.getCompany();
      if (res.success && res.data) {
        setProfile(res.data);
        setFormData({
          company_name: res.data.company_name || '',
          tagline: res.data.tagline || '',
          ceo_name: res.data.ceo_name || '',
          ceo_designation: res.data.ceo_designation || '',
          ceo_message: res.data.ceo_message || '',
          address: res.data.address || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          whatsapp_number: res.data.whatsapp_number || '',
          social_linkedin: res.data.social_linkedin || '',
          social_instagram: res.data.social_instagram || '',
          social_twitter: res.data.social_twitter || '',
          social_github: res.data.social_github || '',
          about_text: res.data.about_text || '',
          vision: res.data.vision || '',
          mission: res.data.mission || ''
        });
      }
    } catch (err) {
      console.error('Failed to load company profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (newLogoFile) {
        data.append('logo', newLogoFile);
      }
      if (newCeoFile) {
        data.append('ceo_photo', newCeoFile);
      }

      const res = await api.updateCompanyProfile(data);
      if (res.success) {
        setFeedback({
          type: 'success',
          text: 'Company Profile & Executive Details updated successfully! Changes are live.'
        });
        setNewLogoFile(null);
        setNewCeoFile(null);
        fetchProfile();
        setTimeout(() => setFeedback(null), 5000);
      }
    } catch (err) {
      alert(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-xs font-mono flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
        <span>Loading company profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Company Profile & Executive Configuration
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Control official corporate branding, CEO Ramesh K details, contact information, and institutional statements.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Executive & Leadership */}
        <div className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm dark:shadow-xl">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-500" />
            <span>Executive Leadership (CEO / Founder)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            
            {/* CEO Photo Preview & Upload */}
            <div className="sm:col-span-4 flex flex-col items-center space-y-3">
              <div className="w-44 h-52 rounded-2xl overflow-hidden bg-slate-100 dark:bg-dark-900 border-2 border-slate-200 dark:border-slate-700 shadow-md relative group">
                <img
                  src={newCeoFile ? URL.createObjectURL(newCeoFile) : (profile?.ceo_photo || '/uploads/company/ceo_ramesh_k.jpg')}
                  alt="CEO"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500 transition-colors shadow-xs">
                <Upload className="w-3.5 h-3.5 text-cyan-500" />
                <span>Replace CEO Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCeoFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {newCeoFile && (
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">Selected: {newCeoFile.name}</span>
              )}
            </div>

            {/* CEO Details */}
            <div className="sm:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CEO / Founder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ceo_name}
                    onChange={(e) => setFormData({ ...formData, ceo_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ceo_designation}
                    onChange={(e) => setFormData({ ...formData, ceo_designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  CEO Leadership Message *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.ceo_message}
                  onChange={(e) => setFormData({ ...formData, ceo_message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Corporate Brand & Logo */}
        <div className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm dark:shadow-xl">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-500" />
            <span>Corporate Identity & Logo</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            
            {/* Logo Preview & Upload */}
            <div className="sm:col-span-4 flex flex-col items-center space-y-3">
              <div className="w-40 h-40 rounded-2xl bg-white p-2 border-2 border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center">
                <img
                  src={newLogoFile ? URL.createObjectURL(newLogoFile) : (profile?.logo || '/uploads/company/logo.jpg')}
                  alt="Company Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500 transition-colors shadow-xs">
                <Upload className="w-3.5 h-3.5 text-cyan-500" />
                <span>Replace Company Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewLogoFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {newLogoFile && (
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">Selected: {newLogoFile.name}</span>
              )}
            </div>

            {/* Brand Names */}
            <div className="sm:col-span-8 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Overview / Introduction</label>
                <textarea
                  rows="3"
                  value={formData.about_text}
                  onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: Contact & Headquarters */}
        <div className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm dark:shadow-xl">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span>Headquarters & Contact Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Registered Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Telephone / Hotline</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp Number (e.g. 8778340454)</label>
              <input
                type="text"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="8778340454"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.social_linkedin}
                onChange={(e) => setFormData({ ...formData, social_linkedin: e.target.value })}
                placeholder="https://linkedin.com/..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Instagram URL</label>
              <input
                type="url"
                value={formData.social_instagram}
                onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={formData.social_twitter}
                onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub Organization URL</label>
              <input
                type="url"
                value={formData.social_github}
                onChange={(e) => setFormData({ ...formData, social_github: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Vision & Mission */}
        <div className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm dark:shadow-xl">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-500" />
            <span>Vision & Mission Statements</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Vision</label>
              <textarea
                rows="3"
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Mission</label>
              <textarea
                rows="3"
                value={formData.mission}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-500 to-cyan-500 hover:from-brand-600 hover:to-cyan-600 shadow-xl shadow-brand-500/25 disabled:opacity-50 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synchronizing Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Apply Updates Live</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
