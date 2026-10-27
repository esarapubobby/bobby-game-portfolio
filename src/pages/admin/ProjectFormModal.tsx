import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ProjectStatus } from '../../types';
import { X, Upload, Plus, Trash2, AlertCircle } from 'lucide-react';
import { uploadFileToStorage, BUCKET_PROJECT_MEDIA, isSupabaseConfigured } from '../../lib/supabase';
import { VARIANTS, BUTTON_INTERACTIONS, TRANSITIONS } from '../../lib/animations';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<Project>) => Promise<{ success: boolean; error?: string }>;
  initialData?: Project | null;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    category: 'Top-Down Zombie Survival Shooter',
    shortDescription: '',
    detailedDescription: '',
    coverImage: '',
    screenshots: [],
    gameplayVideoUrl: '',
    demoUrl: '',
    googlePlayUrl: '',
    itchUrl: '',
    githubUrl: '',
    technologies: [],
    status: 'Completed',
    featured: false,
    published: true,
    sortOrder: 1,
  });

  const [techInput, setTechInput] = useState('');
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setTechInput(initialData.technologies?.join(', ') || '');
    } else {
      setFormData({
        title: '',
        category: 'Top-Down Zombie Survival Shooter',
        shortDescription: '',
        detailedDescription: '',
        coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
        screenshots: [],
        gameplayVideoUrl: '',
        demoUrl: '',
        googlePlayUrl: '',
        itchUrl: '',
        githubUrl: '',
        technologies: ['Unity', 'C#', 'Enemy AI', 'Mobile Controls'],
        status: 'In Development',
        featured: false,
        published: true,
        sortOrder: 1,
      });
      setTechInput('Unity, C#, Enemy AI, Mobile Controls');
    }
    setErrorMessage(null);
  }, [initialData, isOpen]);

  // Handle Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please choose a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size should be below 5MB.');
      return;
    }

    setUploadingCover(true);
    setErrorMessage(null);

    if (isSupabaseConfigured) {
      const path = `cover-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { url, error } = await uploadFileToStorage(BUCKET_PROJECT_MEDIA, path, file);
      setUploadingCover(false);
      if (error || !url) {
        setErrorMessage(error?.message || 'Failed to upload cover image.');
      } else {
        setFormData((prev) => ({ ...prev, coverImage: url }));
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, coverImage: event.target?.result as string }));
        setUploadingCover(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Screenshot Upload
  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please choose a valid image file.');
      return;
    }

    setUploadingScreenshot(true);
    setErrorMessage(null);

    if (isSupabaseConfigured) {
      const path = `shot-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { url, error } = await uploadFileToStorage(BUCKET_PROJECT_MEDIA, path, file);
      setUploadingScreenshot(false);
      if (error || !url) {
        setErrorMessage(error?.message || 'Failed to upload screenshot.');
      } else {
        setFormData((prev) => ({
          ...prev,
          screenshots: [...(prev.screenshots || []), url],
        }));
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          screenshots: [...(prev.screenshots || []), event.target?.result as string],
        }));
        setUploadingScreenshot(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddScreenshotUrl = () => {
    if (!newScreenshotUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      screenshots: [...(prev.screenshots || []), newScreenshotUrl.trim()],
    }));
    setNewScreenshotUrl('');
  };

  const handleRemoveScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: (prev.screenshots || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.title?.trim()) {
      setErrorMessage('Project title is required.');
      return;
    }
    if (!formData.shortDescription?.trim()) {
      setErrorMessage('Short description is required.');
      return;
    }

    setSaving(true);

    const parsedTech = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await onSave({
      ...formData,
      technologies: parsedTech,
    });

    setSaving(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Failed to save project.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="form-backdrop"
          variants={VARIANTS.modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            key="form-dialog"
            variants={VARIANTS.modalDialog}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-3xl bg-[#111720] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c1015]">
              <h2 className="text-lg font-bold text-white font-display">
                {initialData ? `Edit Project: ${initialData.title}` : 'Create New Game Project'}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={TRANSITIONS.snappy}
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. DEADZONE"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Top-Down Zombie Survival Shooter"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Status & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Project Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-accent focus:outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Completed">Completed</option>
                    <option value="In Development">In Development</option>
                    <option value="Prototype">Prototype</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Sort Order (Display Priority)
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder || 1}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-accent focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Short & Detailed Descriptions */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Short Summary Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="A published zombie survival game featuring enemy AI, wave spawning, and mobile controls."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Detailed Architecture & Gameplay Breakdown
                </label>
                <textarea
                  rows={4}
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                  placeholder="Describe enemy AI state machines, object pooling, joystick physics, and Android performance optimizations..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-accent focus:outline-none resize-none font-sans"
                />
              </div>

              {/* Cover Image & File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-300 uppercase">
                  Cover Image URL or Upload
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://... or upload below"
                    className="flex-1 w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-accent focus:outline-none font-mono"
                  />

                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white cursor-pointer transition-colors flex-shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-accent" />
                    <span>{uploadingCover ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                  </motion.label>
                </div>

                {formData.coverImage && (
                  <div className="w-32 h-20 rounded-lg overflow-hidden border border-white/10 relative mt-2 bg-black/40">
                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Screenshots Gallery */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-300 uppercase">
                  Screenshots Gallery
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newScreenshotUrl}
                    onChange={(e) => setNewScreenshotUrl(e.target.value)}
                    placeholder="Paste screenshot URL"
                    className="flex-1 px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddScreenshotUrl}
                    className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <label className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-accent" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      disabled={uploadingScreenshot}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData.screenshots && formData.screenshots.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.screenshots.map((shot, idx) => (
                      <div key={idx} className="relative w-20 h-14 rounded-lg overflow-hidden border border-white/10 group">
                        <img src={shot} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(idx)}
                          className="absolute inset-0 bg-red-950/80 text-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* External Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Gameplay Trailer / Video URL
                  </label>
                  <input
                    type="text"
                    value={formData.gameplayVideoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, gameplayVideoUrl: e.target.value })}
                    placeholder="e.g. https://youtu.be/OihvAqWn06w"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Google Play Store URL
                  </label>
                  <input
                    type="text"
                    value={formData.googlePlayUrl || ''}
                    onChange={(e) => setFormData({ ...formData, googlePlayUrl: e.target.value })}
                    placeholder="e.g. https://play.google.com/store/apps/details?id=..."
                    className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Itch.io Game URL
                  </label>
                  <input
                    type="text"
                    value={formData.itchUrl || ''}
                    onChange={(e) => setFormData({ ...formData, itchUrl: e.target.value })}
                    placeholder="e.g. https://bobby-esarapu.itch.io/survival-island"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Demo Link or Shortlink
                  </label>
                  <input
                    type="text"
                    value={formData.demoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="e.g. https://tinyurl.com/Badri-Driving"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Technologies Tags */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Technologies & Systems (comma separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Unity, C#, Enemy AI, Mobile Controls, Object Pooling"
                  className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                />
              </div>

              {/* Featured & Published Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-gray-200">
                  <input
                    type="checkbox"
                    checked={formData.featured ?? false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-accent bg-black border-white/20 focus:ring-accent"
                  />
                  <span>Mark as Featured Project</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-gray-200">
                  <input
                    type="checkbox"
                    checked={formData.published ?? true}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-accent bg-black border-white/20 focus:ring-accent"
                  />
                  <span>Published (Publicly Visible)</span>
                </label>
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#0c1015] border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300"
              >
                Cancel
              </button>

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                {...BUTTON_INTERACTIONS}
                className="px-6 py-2 rounded-lg bg-accent text-black font-bold text-xs uppercase font-mono tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving Project...' : initialData ? 'Update Project' : 'Create Project'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
