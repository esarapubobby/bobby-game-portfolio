import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Palette, CheckCircle2, AlertCircle, Save, Sliders, FileText } from 'lucide-react';
import { uploadFileToStorage, BUCKET_DOCUMENTS, isSupabaseConfigured } from '../../lib/supabase';

const ACCENT_OPTIONS = [
  { id: 'lime', name: 'Neon Lime (Default)', color: '#a3e635' },
  { id: 'emerald', name: 'Emerald Green', color: '#10b981' },
  { id: 'cyan', name: 'Cyber Cyan', color: '#06b6d4' },
  { id: 'amber', name: 'Warm Amber', color: '#f59e0b' },
  { id: 'violet', name: 'Arcade Violet', color: '#8b5cf6' },
] as const;

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = usePortfolio();

  const [formData, setFormData] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Resume PDF upload handler
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMsg('Resume file must be in PDF format.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Resume file size must be under 10MB.');
      return;
    }

    setUploadingResume(true);
    setErrorMsg(null);

    if (isSupabaseConfigured) {
      const path = `Bobby_Esarapu_Resume_${Date.now()}.pdf`;
      const { url, error } = await uploadFileToStorage(BUCKET_DOCUMENTS, path, file);
      setUploadingResume(false);

      if (error || !url) {
        setErrorMsg(error?.message || 'Failed to upload resume to Supabase Storage.');
      } else {
        setFormData((prev) => ({ ...prev, resumeUrl: url }));
      }
    } else {
      // Local fallback: update path reference
      setFormData((prev) => ({ ...prev, resumeUrl: `/Bobby_Esarapu_Resume.pdf` }));
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccess(false);

    const res = await updateSettings(formData);
    setSaving(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setErrorMsg(res.error || 'Failed to update site settings.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          Website Settings & Customization
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
          Customize theme colors, hero copy, social links, and public resume document.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-lime-950/40 border border-lime-500/40 flex items-center gap-3 text-xs sm:text-sm text-lime-200">
          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
          <span>Settings successfully synchronized and persisted.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-xs sm:text-sm text-red-200">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Accent Color Palette Selector */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-white text-base font-display">
              Site Theme Accent Color
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-mono">
            Select a restrained neon or editorial accent for buttons, borders, and glows.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {ACCENT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, accentColor: opt.id });
                  document.documentElement.setAttribute('data-theme', opt.id);
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.accentColor === opt.id
                    ? 'border-white bg-white/10 shadow-lg'
                    : 'border-white/5 bg-black/40 hover:border-white/20'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: opt.color }}
                />
                <span className="text-[11px] font-mono text-gray-300 text-center">
                  {opt.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Copy & Availability */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-white text-base font-display">
              Hero Section Copy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={formData.heroName}
                onChange={(e) => setFormData({ ...formData, heroName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                Professional Title
              </label>
              <input
                type="text"
                required
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
              Hero Quote / Philosophy
            </label>
            <input
              type="text"
              required
              value={formData.heroQuote}
              onChange={(e) => setFormData({ ...formData, heroQuote: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                Availability Badge Label
              </label>
              <input
                type="text"
                value={formData.heroAvailabilityText}
                onChange={(e) => setFormData({ ...formData, heroAvailabilityText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-gray-200">
                <input
                  type="checkbox"
                  checked={formData.showAvailability}
                  onChange={(e) => setFormData({ ...formData, showAvailability: e.target.checked })}
                  className="w-4 h-4 rounded text-accent bg-black border-white/20"
                />
                <span>Display Availability Badge on Hero</span>
              </label>
            </div>
          </div>
        </div>

        {/* About Bio Section */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4">
          <h2 className="font-bold text-white text-base font-display">
            About Section Biography
          </h2>

          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
              Paragraph 1 (Academic Background & Foundation)
            </label>
            <textarea
              rows={3}
              value={formData.aboutBioP1}
              onChange={(e) => setFormData({ ...formData, aboutBioP1: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
              Paragraph 2 (Studio Focus & Gameplay Specialization)
            </label>
            <textarea
              rows={3}
              value={formData.aboutBioP2}
              onChange={(e) => setFormData({ ...formData, aboutBioP2: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.aboutLocation}
              onChange={(e) => setFormData({ ...formData, aboutLocation: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
            />
          </div>
        </div>

        {/* Social & Contact Channels */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4">
          <h2 className="font-bold text-white text-base font-display">
            Contact Channels & Social Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                Contact Email
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                GitHub Profile URL
              </label>
              <input
                type="url"
                required
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                required
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                Itch.io Profile URL
              </label>
              <input
                type="url"
                value={formData.itchUrl || ''}
                onChange={(e) => setFormData({ ...formData, itchUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Resume PDF Configuration */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-white text-base font-display">
              Resume Document
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-mono">
            Provide the direct URL to your published resume or upload a replacement PDF.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="text"
              value={formData.resumeUrl}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              className="flex-1 w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-mono"
            />

            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white cursor-pointer transition-colors flex-shrink-0">
              <span>{uploadingResume ? 'Uploading PDF...' : 'Upload Replacement PDF'}</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer Text */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4">
          <h2 className="font-bold text-white text-base font-display">
            Website Footer Notice
          </h2>
          <input
            type="text"
            value={formData.footerText}
            onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-accent text-black font-bold text-xs uppercase font-mono tracking-wider hover:bg-accent-hover transition-all disabled:opacity-50 shadow-lg shadow-accent/10 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Persisting Changes...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
