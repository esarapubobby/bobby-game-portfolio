import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ExperienceItem } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';

export const AdminExperience: React.FC = () => {
  const { experience, saveExperience, deleteExperience } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);

  const [formData, setFormData] = useState<Partial<ExperienceItem>>({
    company: '',
    role: '',
    duration: '',
    location: '',
    description: '',
    achievements: [],
    technologies: [],
  });

  const [achievementsText, setAchievementsText] = useState('');
  const [techText, setTechText] = useState('');

  const handleOpenEdit = (item: ExperienceItem) => {
    setEditingItem(item);
    setFormData(item);
    setAchievementsText(item.achievements?.join('\n') || '');
    setTechText(item.technologies?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      company: '',
      role: '',
      duration: '',
      location: 'Remote',
      description: '',
      sortOrder: experience.length + 1,
    });
    setAchievementsText('');
    setTechText('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.role) return;

    const id = editingItem ? editingItem.id : `exp-${Date.now()}`;
    const achievements = achievementsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const technologies = techText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await saveExperience({
      ...formData,
      id,
      company: formData.company,
      role: formData.role,
      duration: formData.duration || 'Present',
      description: formData.description || '',
      achievements,
      technologies,
      sortOrder: formData.sortOrder || 1,
    } as ExperienceItem);

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Development Experience
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
            Update studio roles, internship records, and technical accomplishments.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-black font-bold text-xs uppercase font-mono tracking-wider hover:bg-accent-hover transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-[#111720] border border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-bold text-white font-display">
                  {item.role}
                </h3>
                <span className="text-accent font-mono text-sm font-semibold">
                  @ {item.company}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
                  {item.duration}
                </span>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {item.description}
              </p>

              {item.achievements && item.achievements.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {item.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              )}

              {item.technologies && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[11px] font-mono text-gray-400 bg-white/5 rounded border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-start">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                title="Edit Position"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteExperience(item.id)}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors"
                title="Delete Position"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#111720] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-lg font-display">
                {editingItem ? 'Edit Experience Entry' : 'Add Experience Entry'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 uppercase mb-1">Company / Studio *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 uppercase mb-1">Role / Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. Active Member or June 2026 – July 2026"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Remote or India"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase mb-1">
                  Key Accomplishments (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={achievementsText}
                  onChange={(e) => setAchievementsText(e.target.value)}
                  placeholder="Published DEADZONE on Google Play Store...&#10;Engineered enemy wave AI logic..."
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={techText}
                  onChange={(e) => setTechText(e.target.value)}
                  placeholder="Unity, C#, Android SDK, Git"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-accent text-black font-bold uppercase tracking-wider hover:bg-accent-hover"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
