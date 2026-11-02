import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Palette, CheckCircle2, AlertCircle, Save, Sliders, FileText, ExternalLink, Info, Check, Image as ImageIcon, Trash2, RotateCcw, User, Mail } from 'lucide-react';
import { BUTTON_INTERACTIONS, TRANSITIONS } from '../../lib/animations';
import { extractGoogleDriveId, toGoogleDriveDirectDownload, isValidUrl } from '../../lib/urls';

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
  const [testedResumeUrl, setTestedResumeUrl] = useState(false);
  const [profileImageFailed, setProfileImageFailed] = useState(false);

  useEffect(() => {
    setFormData({ ...settings });
    setProfileImageFailed(false);
  }, [settings]);

  const handleCancel = () => {
    setFormData({ ...settings });
    setProfileImageFailed(false);
    setErrorMsg(null);
    if (settings.accentColor) {
      document.documentElement.setAttribute('data-theme', settings.accentColor);
    }
  };

  const googleDriveId = extractGoogleDriveId(formData.resumeUrl);
  const directDownloadUrl = toGoogleDriveDirectDownload(formData.resumeUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccess(false);

    if (formData.resumeUrl && !isValidUrl(formData.resumeUrl)) {
      setErrorMsg('Please enter a valid HTTP/HTTPS URL or local path for the resume.');
      setSaving(false);
      return;
    }

    if (formData.profileImageUrl && !isValidUrl(formData.profileImageUrl)) {
      setErrorMsg('Please enter a valid HTTPS/HTTP image URL (e.g. from Cloudinary) for your profile photo.');
      setSaving(false);
      return;
    }

    const res = await updateSettings(formData);
    setSaving(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setErrorMsg(res.error || 'Failed to update site settings.');
    }
  };

  const handleTestResume = () => {
    if (!formData.resumeUrl) return;
    window.open(formData.resumeUrl, '_blank', 'noopener,noreferrer');
    setTestedResumeUrl(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          Website Settings & Customization
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
          Customize theme colors, hero copy, social channels, and public resume link via URLs.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {success && (
          <motion.div
            key="settings-success"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-lime-950/40 border border-lime-500/40 flex items-center gap-3 text-xs sm:text-sm text-lime-200 overflow-hidden"
          >
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
            <span>Settings successfully saved and persisted to database. Changes are live on the portfolio.</span>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            key="settings-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-xs sm:text-sm text-red-200 overflow-hidden"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Accent Color Palette Selector */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-white text-base font-display">
              Site Theme Accent Color
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-mono">
            Select an accent color for buttons, laser beams, borders, and glows.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {ACCENT_OPTIONS.map((opt) => (
              <motion.button
                key={opt.id}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={TRANSITIONS.snappy}
                onClick={() => {
                  setFormData({ ...formData, accentColor: opt.id });
                  document.documentElement.setAttribute('data-theme', opt.id);
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-colors ${
                  formData.accentColor === opt.id
                    ? 'border-white bg-white/15 shadow-lg shadow-white/5'
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
              </motion.button>
            ))}
          </div>
        </div>

        {/* Profile Avatar & Portrait URL */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-accent" />
              <h2 className="font-bold text-white text-base font-display">
                Profile Photo & Portrait (Cloudinary URL)
              </h2>
            </div>
            {formData.profileImageUrl && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, profileImageUrl: '' });
                  setProfileImageFailed(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/50 text-xs font-mono transition-colors"
                title="Clear profile image URL"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Image</span>
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400 font-mono">
            Host your portrait photo on Cloudinary or any public HTTPS image host and paste the URL here. No file upload controls are used.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-8 space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={formData.profileImageUrl || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, profileImageUrl: e.target.value.trim() });
                    setProfileImageFailed(false);
                  }}
                  placeholder="https://res.cloudinary.com/your-cloud/image/upload/v1234/bobby-profile.jpg"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-mono focus:border-accent focus:outline-none"
                />
              </div>

              {formData.profileImageUrl && (
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={formData.profileImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
                  >
                    <span>Open image in new tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono text-gray-400 space-y-1">
                <span className="text-gray-300 font-semibold block">Cloudinary Recommendation:</span>
                <p>
                  Use an optimized square or portrait image (e.g. 600x600px). When saved, your photo will be displayed in the public About section and portfolio header.
                </p>
              </div>
            </div>

            {/* Live Image Preview */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2 self-start">
                Live Preview
              </span>
              <div className="w-36 h-36 rounded-2xl bg-black/50 border-2 border-white/15 overflow-hidden flex items-center justify-center relative group shadow-xl">
                {formData.profileImageUrl && !profileImageFailed ? (
                  <img
                    src={formData.profileImageUrl}
                    alt="Bobby Esarapu"
                    onError={() => setProfileImageFailed(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-3 text-gray-500">
                    <User className="w-10 h-10 text-gray-600 mb-1" />
                    <span className="text-[10px] font-mono">
                      {profileImageFailed ? 'Image URL broken' : 'No photo configured'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 border border-accent/20 rounded-2xl pointer-events-none" />
              </div>
              <span className="text-[10px] font-mono text-gray-400 mt-2 text-center">
                {formData.profileImageUrl && !profileImageFailed ? (
                  <span className="text-lime-400 font-semibold">Ready to display</span>
                ) : (
                  <span>Fallback glyph active</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Copy & Availability */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4 shadow-xl">
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

        {/* Resume Google Drive Link Configuration */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <h2 className="font-bold text-white text-base font-display">
                Resume Document (Google Drive Share Link)
              </h2>
            </div>
            {formData.resumeUrl && (
              <div className="flex items-center gap-3">
                {testedResumeUrl && (
                  <span className="text-[11px] font-mono text-lime-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Link opened in new tab</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleTestResume}
                  className="text-xs font-mono text-accent hover:underline flex items-center gap-1.5"
                >
                  <span>Test / Open Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 font-mono">
            Enter your resume's Google Drive sharing link or public document URL. File uploads are disabled in favor of direct external links.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              value={formData.resumeUrl}
              onChange={(e) => {
                setFormData({ ...formData, resumeUrl: e.target.value });
                setTestedResumeUrl(false);
              }}
              placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-mono focus:border-accent focus:outline-none"
            />

            {/* Google Drive Status & Direct Download Conversion */}
            {googleDriveId ? (
              <div className="p-3.5 rounded-xl bg-lime-950/30 border border-lime-500/30 space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-lime-400 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>Valid Google Drive file link detected</span>
                </div>
                <div className="text-gray-300 space-y-1">
                  <p className="text-[11px] text-gray-400">
                    <span className="text-gray-400">Google Drive File ID: </span>
                    <span className="text-accent">{googleDriveId}</span>
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    <span className="text-gray-400">Converted Direct Download URL: </span>
                    <span className="text-accent">{directDownloadUrl}</span>
                  </p>
                </div>
                <p className="text-[11px] text-gray-400 pt-1 border-t border-white/5">
                  The hero "Download Resume" button will automatically route visitors to this direct-download URL.
                </p>
              </div>
            ) : (
              formData.resumeUrl && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs font-mono text-gray-300">
                  <span>Custom URL configured: {formData.resumeUrl}</span>
                </div>
              )
            )}

            {/* Access Permission Requirement Notice */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-200/90 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-300">Google Drive Permission Requirement:</p>
                <p className="text-[11px] leading-relaxed text-amber-200/80">
                  Ensure the file in Google Drive has General Access set to <strong className="text-white">"Anyone with the link"</strong> with Viewer access. If left on "Restricted", public visitors will receive an access-denied error from Google.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Bio Section */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4 shadow-xl">
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
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4 shadow-xl">
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

        {/* FormSubmit Direct Email Delivery Configuration */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent" />
              <h2 className="font-bold text-white text-base font-display">
                FormSubmit Direct Email Delivery
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-semibold">
              Destination: {formData.contactEmail || 'esarapubobby@gmail.com'}
            </span>
          </div>

          <p className="text-xs text-gray-400 font-mono leading-relaxed">
            Direct email delivery is powered by FormSubmit. Inquiries submitted via the public contact form are dispatched straight to your verified email (<code className="text-white">{formData.contactEmail || 'esarapubobby@gmail.com'}</code>) with visitor reply-to routing without requiring EmailJS API keys.
          </p>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-lime-400 font-semibold">
              <Check className="w-4 h-4" />
              <span>FormSubmit Direct Email Delivery Active</span>
            </div>
            <div className="text-gray-300 space-y-1">
              <p className="text-[11px] text-gray-400">
                <span className="text-gray-400">API Endpoint: </span>
                <span className="text-accent">https://formsubmit.co/ajax/{formData.contactEmail || 'esarapubobby@gmail.com'}</span>
              </p>
              <p className="text-[11px] text-gray-400">
                <span className="text-gray-400">Bot Shield: </span>
                <span className="text-lime-300">Honeypot Trap + 30s Cooldown Active</span>
              </p>
              <p className="text-[11px] text-gray-400">
                <span className="text-gray-400">Delivery Format: </span>
                <span className="text-gray-300">Direct Delivery to inbox with visitor Reply-To</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4 shadow-xl">
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

        {/* Actions: Save & Cancel */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 font-bold text-xs uppercase font-mono tracking-wider transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Cancel / Reset</span>
          </button>

          <motion.button
            type="submit"
            disabled={saving}
            {...BUTTON_INTERACTIONS}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-black font-bold text-xs uppercase font-mono tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-50 shadow-lg shadow-accent/15"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Persisting Changes...' : 'Save All Settings'}</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
};
