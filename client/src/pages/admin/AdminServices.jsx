import React, { useState, useEffect } from 'react';
import { 
  Layers, Plus, Edit, Trash2, CheckCircle2, AlertCircle, 
  Cloud, Code2, Cpu, ShieldCheck, Smartphone, GitBranch, Terminal, X 
} from 'lucide-react';
import { api } from '../../services/api';

const icons = ['Cpu', 'Cloud', 'Code2', 'ShieldCheck', 'Smartphone', 'GitBranch', 'Layers', 'Terminal'];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    icon: 'Cpu',
    short_desc: '',
    detailed_desc: '',
    tech_tags: '',
    featured: true,
    display_order: 1
  });

  const fetchServices = async () => {
    try {
      const res = await api.getAdminServices();
      if (res.success) setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      icon: 'Cpu',
      short_desc: '',
      detailed_desc: '',
      tech_tags: 'AWS, Python, Kubernetes',
      featured: true,
      display_order: services.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      icon: service.icon || 'Cpu',
      short_desc: service.short_desc,
      detailed_desc: service.detailed_desc || '',
      tech_tags: Array.isArray(service.tech_tags) ? service.tech_tags.join(', ') : (service.tech_tags || ''),
      featured: service.featured === 1,
      display_order: service.display_order || 1
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tags = formData.tech_tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = { ...formData, tech_tags: tags };

      if (editingService) {
        await api.updateService(editingService.id, payload);
        setFeedback({ type: 'success', text: 'Service updated successfully.' });
      } else {
        await api.createService(payload);
        setFeedback({ type: 'success', text: 'New service created successfully.' });
      }

      setModalOpen(false);
      fetchServices();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete service "${title}"?`)) {
      try {
        await api.deleteService(id);
        setFeedback({ type: 'success', text: 'Service removed.' });
        fetchServices();
        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Services Catalogue Management</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Define and update enterprise capabilities, solutions, and tech stacks showcased on the main website.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                  Icon: {service.icon}
                </span>
                <span className="text-[11px] font-mono text-slate-500">Order #{service.display_order}</span>
              </div>

              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mt-4">{service.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">{service.short_desc}</p>

              {service.tech_tags && service.tech_tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {service.tech_tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-dark-950 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(service)}
                className="p-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500 shadow-xs transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(service.id, service.title)}
                className="p-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/50 shadow-xs transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-dark-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 text-slate-900 dark:text-white">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Display Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {icons.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Short Description *</label>
                <textarea
                  rows="2"
                  required
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Architecture Description</label>
                <textarea
                  rows="3"
                  value={formData.detailed_desc}
                  onChange={(e) => setFormData({ ...formData, detailed_desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Technology Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="AWS, Docker, Kubernetes, React"
                  value={formData.tech_tags}
                  onChange={(e) => setFormData({ ...formData, tech_tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 shadow-md transition-all"
                >
                  {editingService ? 'Save Service' : 'Create Service'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
