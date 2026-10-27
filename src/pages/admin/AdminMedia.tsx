import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  uploadFileToStorage,
  deleteFileFromStorage,
  isSupabaseConfigured,
} from '../../lib/supabase';
import { Upload, FileText, Trash2, Copy, Check, AlertCircle, ExternalLink, HardDrive } from 'lucide-react';
import { ICON_BUTTON_INTERACTIONS, TRANSITIONS } from '../../lib/animations';

interface UploadedFileEntry {
  name: string;
  url: string;
  bucket: string;
  type: 'image' | 'document';
  size: number;
  uploadedAt: string;
}

export const AdminMedia: React.FC = () => {
  const [selectedBucket, setSelectedBucket] = useState<'project-media' | 'documents'>('project-media');
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Local state tracking uploaded files in the current admin session
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileEntry[]>(() => {
    const saved = localStorage.getItem('bobby_admin_media_records');
    return saved
      ? JSON.parse(saved)
      : [
          {
            name: 'deadzone-cover.jpg',
            url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
            bucket: 'project-media',
            type: 'image',
            size: 420000,
            uploadedAt: new Date().toISOString(),
          },
          {
            name: 'Bobby_Esarapu_Resume.pdf',
            url: '/Bobby_Esarapu_Resume.pdf',
            bucket: 'documents',
            type: 'document',
            size: 210000,
            uploadedAt: new Date().toISOString(),
          },
        ];
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    // Validation
    if (selectedBucket === 'project-media') {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Only images (PNG, JPG, WEBP, GIF) are allowed in the project-media bucket.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size exceeds 5MB limit.');
        return;
      }
    } else {
      if (file.type !== 'application/pdf') {
        setErrorMessage('Only PDF documents are allowed in the documents bucket.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Document size exceeds 10MB limit.');
        return;
      }
    }

    setUploading(true);

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    if (isSupabaseConfigured) {
      const { url, error } = await uploadFileToStorage(selectedBucket, safeName, file);
      setUploading(false);

      if (error || !url) {
        setErrorMessage(error?.message || 'Failed to upload to Supabase Storage.');
        return;
      }

      const newEntry: UploadedFileEntry = {
        name: file.name,
        url,
        bucket: selectedBucket,
        type: selectedBucket === 'project-media' ? 'image' : 'document',
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };

      const updated = [newEntry, ...uploadedFiles];
      setUploadedFiles(updated);
      localStorage.setItem('bobby_admin_media_records', JSON.stringify(updated));
    } else {
      // Local fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        const fallbackUrl = (event.target?.result as string) || '';
        const newEntry: UploadedFileEntry = {
          name: file.name,
          url: fallbackUrl,
          bucket: selectedBucket,
          type: selectedBucket === 'project-media' ? 'image' : 'document',
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };

        const updated = [newEntry, ...uploadedFiles];
        setUploadedFiles(updated);
        localStorage.setItem('bobby_admin_media_records', JSON.stringify(updated));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (file: UploadedFileEntry) => {
    if (isSupabaseConfigured) {
      await deleteFileFromStorage(file.bucket, file.name);
    }
    const filtered = uploadedFiles.filter((f) => f.url !== file.url);
    setUploadedFiles(filtered);
    localStorage.setItem('bobby_admin_media_records', JSON.stringify(filtered));
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          Media & Storage Manager
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
          Upload game screenshots, cover assets, and resume PDFs with automated validation.
        </p>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-xs sm:text-sm text-red-200 overflow-hidden"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Zone */}
      <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-white text-base font-display">
              Upload New Asset
            </h2>
          </div>

          {/* Bucket Selector Pills */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setSelectedBucket('project-media')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedBucket === 'project-media'
                  ? 'bg-accent text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Bucket: project-media (Images)
            </button>
            <button
              type="button"
              onClick={() => setSelectedBucket('documents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedBucket === 'documents'
                  ? 'bg-accent text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Bucket: documents (PDF)
            </button>
          </div>
        </div>

        {/* Drop / Select File Box with Hover Feedback */}
        <motion.label
          whileHover={{ scale: 1.008 }}
          whileTap={{ scale: 0.995 }}
          className="border-2 border-dashed border-white/15 hover:border-accent/60 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/20 group"
        >
          <Upload className="w-8 h-8 text-gray-400 group-hover:text-accent mb-3 transition-colors" />
          <span className="text-sm font-semibold text-white">
            {uploading ? 'Processing & Uploading...' : 'Click or drop file to upload'}
          </span>
          <span className="text-xs font-mono text-gray-400 mt-1">
            {selectedBucket === 'project-media'
              ? 'PNG, JPG, WEBP, GIF up to 5MB'
              : 'PDF document up to 10MB'}
          </span>
          <input
            type="file"
            accept={selectedBucket === 'project-media' ? 'image/*' : 'application/pdf'}
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </motion.label>
      </div>

      {/* Uploaded Assets Library with Animated Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-gray-400">
          Managed Media Library ({uploadedFiles.length})
        </h2>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {uploadedFiles.map((file, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={TRANSITIONS.smooth}
                className="p-4 rounded-xl bg-[#111720] border border-white/10 flex flex-col justify-between space-y-3 group shadow-lg hover:border-accent/40 transition-colors"
              >
                <div className="space-y-3">
                  {file.type === 'image' ? (
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/50 border border-white/5 relative">
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-lg bg-black/50 border border-white/5 flex flex-col items-center justify-center text-accent">
                      <FileText className="w-10 h-10 mb-2" />
                      <span className="text-xs font-mono text-gray-300">PDF Document</span>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-sm text-white truncate font-mono" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mt-1">
                      <span>{file.bucket}</span>
                      <span>{(file.size / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleCopy(file.url)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-colors"
                  >
                    {copiedUrl === file.url ? (
                      <>
                        <Check className="w-3 h-3 text-accent" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center gap-1">
                    <motion.a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...ICON_BUTTON_INTERACTIONS}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </motion.a>
                    <motion.button
                      type="button"
                      {...ICON_BUTTON_INTERACTIONS}
                      onClick={() => handleDelete(file)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
