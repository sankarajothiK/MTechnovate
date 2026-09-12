import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, Upload, Trash2, Plus, CheckCircle2, 
  AlertCircle, Loader2, Tag, X, Eye 
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Innovation');
  const [description, setDescription] = useState('');

  const fetchGallery = async () => {
    try {
      const res = await api.getGallery();
      if (res.success) setGallery(res.data);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFilesChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Please select at least one image file.');
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      selectedFiles.forEach((file) => {
        data.append('images', file);
      });
      data.append('title', title.trim());
      data.append('category', category.trim());
      data.append('description', description.trim());

      const res = await api.uploadGalleryImages(data);
      if (res.success) {
        setFeedback({
          type: 'success',
          text: `${selectedFiles.length} showcase photo(s) uploaded to /uploads/gallery/ and published live!`
        });
        setSelectedFiles([]);
        setTitle('');
        setDescription('');
        fetchGallery();
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err) {
      alert(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, itemTitle) => {
    if (window.confirm(`Delete image "${itemTitle}" permanently from gallery & disk?`)) {
      try {
        await api.deleteGalleryItem(id);
        setFeedback({ type: 'success', text: 'Image removed from gallery.' });
        fetchGallery();
        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        alert('Delete failed.');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Showcase & Gallery Management
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Upload and manage high-resolution images stored in <code className="text-cyan-600 dark:text-cyan-400 font-mono">/uploads/gallery/</code>. New uploads reflect on the public website instantaneously.
        </p>
      </div>

      {/* Upload Box */}
      <div className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm dark:shadow-xl">
        <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-cyan-500" />
          <span>Upload New Gallery Images</span>
        </h3>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Image Title / Caption
              </label>
              <input
                type="text"
                placeholder="e.g. Cloud Operations Center"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="Innovation">Innovation</option>
                <option value="Architecture">Architecture</option>
                <option value="Branding">Branding</option>
                <option value="Leadership">Leadership</option>
                <option value="Engineering">Engineering</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Brief Context / Description
              </label>
              <input
                type="text"
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Drag and drop / select area */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500/60 rounded-xl p-6 text-center bg-slate-50/80 dark:bg-dark-950/60 relative cursor-pointer transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {selectedFiles.length > 0 ? (
              <div className="text-cyan-600 dark:text-cyan-400 font-semibold text-xs">
                {selectedFiles.length} file(s) ready for upload: {selectedFiles.map(f => f.name).join(', ')}
              </div>
            ) : (
              <div className="space-y-1">
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Click or drag files here to upload (multi-file supported)
                </p>
                <p className="text-[11px] text-slate-500">JPG, PNG, WEBP up to 20MB</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 font-mono">
              Target directory: /uploads/gallery/
            </span>
            <button
              type="submit"
              disabled={uploading || selectedFiles.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 shadow-md disabled:opacity-50 transition-all"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Storing & Publishing Assets...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload & Publish Live</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Grid of Existing Assets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Current Published Gallery ({gallery.length} Images)
          </h3>
        </div>

        {gallery.length === 0 ? (
          <div className="text-center py-16 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-mono">
            No gallery images found. Upload new photos above to populate the gallery.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="group relative h-64 rounded-2xl overflow-hidden glass-card border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm dark:shadow-xl"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />

                <div className="relative z-10 p-4 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {item.category}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg bg-red-950/80 text-red-400 hover:bg-red-900 border border-red-800 transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative z-10 p-4 space-y-1">
                  <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                  {item.description && (
                    <p className="text-[11px] text-slate-300 line-clamp-1">{item.description}</p>
                  )}
                  <div className="text-[10px] text-slate-400 font-mono truncate">{item.image_url}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
