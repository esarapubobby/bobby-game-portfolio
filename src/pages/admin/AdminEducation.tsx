import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { EducationItem } from '../../types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const AdminEducation: React.FC = () => {
  const { education, saveEducation, deleteEducation } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);

  const [formData, setFormData] = useState<Partial<EducationItem>>({
    institution: '',
    degree: '',
    field: '',
    duration: '',
    location: '',
    details: '',
  });

  const handleOpenEdit = (item: EducationItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      institution: '',
      degree: 'B.Tech',
      field: 'Electronics and Communication Technology',
      duration: '2023 – 2027',
      location: 'Tadepalligudem, Andhra Pradesh, India',
      details: '',
      sortOrder: education.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution || !formData.degree) return;

    const id = editingItem ? editingItem.id : `edu-${Date.now()}`;
    await saveEducation({
      ...formData,
      id,
      institution: formData.institution,
      degree: formData.degree,
      field: formData.field || '',
      duration: formData.duration || '',
      location: formData.location || '',
      details: formData.details || '',
      sortOrder: formData.sortOrder || 1,
    } as EducationItem);

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Education Records
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
            Manage your academic credentials, university degrees, and coursework.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-black font-bold text-xs uppercase font-mono tracking-wider hover:bg-accent-hover transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-4">
        {education.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-[#111720] border border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-bold text-white font-display">
                  {item.degree} in {item.field}
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-accent">
                  {item.duration}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-gray-300">
                {item.institution}
              </h4>
              <p className="text-xs font-mono text-gray-400">{item.location}</p>

              {item.details && (
                <p className="text-sm text-gray-400 leading-relaxed pt-2">
                  {item.details}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-start">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                title="Edit Record"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteEducation(item.id)}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors"
                title="Delete Record"
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
          <div className="w-full max-w-lg bg-[#111720] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-lg font-display">
                {editingItem ? 'Edit Education Record' : 'Add Education Record'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-gray-300 uppercase mb-1">Institution Name *</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 uppercase mb-1">Degree *</label>
                  <input
                    type="text"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 uppercase mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
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
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 uppercase mb-1">Academic Focus & Details</label>
                <textarea
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-sm"
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
