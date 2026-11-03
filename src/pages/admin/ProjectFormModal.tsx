import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ProjectStatus } from '../../types';
import { X, Plus, Trash2, AlertCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { VARIANTS, BUTTON_INTERACTIONS, TRANSITIONS } from '../../lib/animations';
import { isValidUrl, isCloudinaryVideoUrl } from '../../lib/urls';

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
    cloudinaryVideoUrl: '',
    driveVideoUrl: '',
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
  const [screenshotUrlError, setScreenshotUrlError] = useState<string | null>(null);
  const [coverImageFailed, setCoverImageFailed] = useState(false);
  const [failedScreenshots, setFailedScreenshots] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        cloudinaryVideoUrl: initialData.cloudinaryVideoUrl || '',
        driveVideoUrl: initialData.driveVideoUrl || '',
      });
      setTechInput(initialData.technologies?.join(', ') || '');
    } else {
      setFormData({
        title: '',
        category: 'Top-Down Zombie Survival Shooter',
        shortDescription: '',
        detailedDescription: '',
        coverImage: '',
        screenshots: [],
        gameplayVideoUrl: '',
        cloudinaryVideoUrl: '',
        driveVideoUrl: '',
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
    setCoverImageFailed(false);
    setFailedScreenshots({});
    setScreenshotUrlError(null);
    setErrorMessage(null);
  }, [initialData, isOpen]);

  const handleAddScreenshotUrl = () => {
    const trimmed = newScreenshotUrl.trim();
    if (!trimmed) {
      setScreenshotUrlError('Please enter an image URL.');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setScreenshotUrlError('Please enter a valid HTTP/HTTPS URL.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      screenshots: [...(prev.screenshots || []), trimmed],
    }));
    setNewScreenshotUrl('');
    setScreenshotUrlError(null);
  };

  const handleUpdateScreenshotUrl = (index: number, updatedUrl: string) => {
    setFormData((prev) => {
      const list = [...(prev.screenshots || [])];
      list[index] = updatedUrl;
      return { ...prev, screenshots: list };
    });
    setFailedScreenshots((prev) => ({ ...prev, [index]: false }));
  };

  const handleRemoveScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: (prev.screenshots || []).filter((_, i) => i !== index),
    }));
    setFailedScreenshots((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
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
    if (formData.coverImage && !isValidUrl(formData.coverImage)) {
      setErrorMessage('Cover image must be a valid URL.');
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

              {/* Cover Image URL Field with Live Preview */}
              <div className="space-y-3 p-4 rounded-xl bg-black/30 border border-white/5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-gray-300 uppercase">
                    Cover Image URL (Cloudinary or Direct URL)
                  </label>
                  <div className="flex items-center gap-3">
                    {formData.coverImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, coverImage: '' }));
                          setCoverImageFailed(false);
                        }}
                        className="text-[11px] font-mono text-red-400 hover:text-red-300 transition-colors"
                      >
                        Clear Image
                      </button>
                    )}
                    {formData.coverImage && isValidUrl(formData.coverImage) && (
                      <a
                        href={formData.coverImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
                      >
                        <span>Open image</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <input
                  type="url"
                  value={formData.coverImage || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, coverImage: e.target.value });
                    setCoverImageFailed(false);
                  }}
                  placeholder="Paste Cloudinary URL (e.g. https://res.cloudinary.com/...) or public image URL"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-accent focus:outline-none font-mono"
                />

                {/* Cover Preview */}
                {formData.coverImage ? (
                  <div className="flex items-start gap-4 pt-1">
                    <div className="w-40 h-24 rounded-lg overflow-hidden border border-white/10 bg-black/50 relative flex items-center justify-center flex-shrink-0">
                      {coverImageFailed ? (
                        <div className="p-2 text-center text-red-400 text-[10px] font-mono flex flex-col items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>Broken URL</span>
                        </div>
                      ) : (
                        <img
                          src={formData.coverImage}
                          alt="Cover preview"
                          onError={() => setCoverImageFailed(true)}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-mono space-y-1">
                      <p className="text-gray-300 font-semibold">Cover Preview</p>
                      <p className="text-[11px] text-gray-400">
                        {coverImageFailed
                          ? 'Could not load this image URL. Verify that it points to a public, direct image link.'
                          : 'Card thumbnail loaded successfully from provided URL.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
                    <span>No image URL configured. The card will display the clean styled placeholder.</span>
                  </div>
                )}
              </div>

              {/* Screenshots Gallery URLs with Preview & In-line Editing */}
              <div className="space-y-3 p-4 rounded-xl bg-black/30 border border-white/5">
                <label className="block text-xs font-mono text-gray-300 uppercase">
                  Screenshots Gallery (Image URLs)
                </label>

                {/* Add new screenshot URL */}
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newScreenshotUrl}
                      onChange={(e) => {
                        setNewScreenshotUrl(e.target.value);
                        setScreenshotUrlError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddScreenshotUrl();
                        }
                      }}
                      placeholder="Paste image URL (e.g. https://...)"
                      className="flex-1 px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddScreenshotUrl}
                      className="px-3.5 py-2 rounded-lg bg-accent text-black hover:bg-accent-hover text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add URL</span>
                    </button>
                  </div>
                  {screenshotUrlError && (
                    <p className="text-[11px] text-red-400 font-mono">{screenshotUrlError}</p>
                  )}
                </div>

                {/* Screenshots List */}
                {formData.screenshots && formData.screenshots.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    {formData.screenshots.map((shot, idx) => {
                      const isFailed = !!failedScreenshots[idx];
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="w-16 h-11 rounded overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center flex-shrink-0">
                            {isFailed ? (
                              <ImageIcon className="w-4 h-4 text-red-400" />
                            ) : (
                              <img
                                src={shot}
                                alt={`Screenshot ${idx + 1}`}
                                onError={() => setFailedScreenshots((prev) => ({ ...prev, [idx]: true }))}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          <input
                            type="url"
                            value={shot}
                            onChange={(e) => handleUpdateScreenshotUrl(idx, e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded bg-black/50 border border-white/10 text-white text-xs font-mono focus:border-accent focus:outline-none truncate"
                            title={shot}
                          />

                          <div className="flex items-center gap-1">
                            <a
                              href={shot}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10"
                              title="Open image in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <button
                              type="button"
                              onClick={() => handleRemoveScreenshot(idx)}
                              className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40"
                              title="Remove screenshot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-500 font-mono pt-1">
                    No screenshots added yet. Paste image URLs above to showcase gameplay.
                  </p>
                )}
              </div>

              {/* External Links */}
              <div className="space-y-4">
                {/* YouTube Video URL */}
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Gameplay Trailer / Video URL (YouTube)
                  </label>
                  <input
                    type="url"
                    value={formData.gameplayVideoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, gameplayVideoUrl: e.target.value })}
                    placeholder="e.g. https://youtu.be/OihvAqWn06w"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                  />
                  <p className="text-[10px] text-gray-500 font-mono mt-1">
                    YouTube trailer embed link (e.g. https://youtu.be/OihvAqWn06w)
                  </p>
                </div>

                {/* Cloudinary Gameplay Video URL (Below YouTube field) */}
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Cloudinary Gameplay Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.cloudinaryVideoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, cloudinaryVideoUrl: e.target.value })}
                    placeholder="e.g. https://res.cloudinary.com/<cloud_name>/video/upload/.../gameplay.mp4"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                  />
                  {formData.cloudinaryVideoUrl ? (
                    <div className="mt-1 text-[10px] font-mono">
                      {isCloudinaryVideoUrl(formData.cloudinaryVideoUrl) ? (
                        <span className="text-accent">
                          ✓ Cloudinary video delivery URL detected
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          Direct video URL configured (MP4/WebM supported)
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-500 font-mono mt-1">
                      Paste a Cloudinary video delivery URL (e.g. https://res.cloudinary.com/.../upload/.../video.mp4)
                    </p>
                  )}
                </div>

                {/* Store & Demo Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                      Google Play Store URL
                    </label>
                    <input
                      type="url"
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
                      type="url"
                      value={formData.itchUrl || ''}
                      onChange={(e) => setFormData({ ...formData, itchUrl: e.target.value })}
                      placeholder="e.g. https://bobby-esarapu.itch.io/survival-island"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                      Demo Link or WebGL Shortlink
                    </label>
                    <input
                      type="url"
                      value={formData.demoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                      placeholder="e.g. https://tinyurl.com/Badri-Driving"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
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
