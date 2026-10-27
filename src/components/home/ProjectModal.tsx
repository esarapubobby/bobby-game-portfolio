import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play, CheckCircle2, ChevronRight, Layers, Smartphone } from 'lucide-react';
import { Project } from '../../types';
import { formatYouTubeEmbedUrl } from '../../lib/utils';
import { VARIANTS, BUTTON_INTERACTIONS, TRANSITIONS } from '../../lib/animations';
import { getLenis } from '../../lib/lenis';
import { ProjectPlaceholder } from '../ui/ProjectPlaceholder';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'screenshots'>('video');
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      const lenis = getLenis();
      lenis?.stop();
      window.addEventListener('keydown', handleKeyDown);
      setImageError(false);
      setSelectedScreenshotIndex(0);
      setActiveMediaTab(project.gameplayVideoUrl ? 'video' : 'screenshots');
    }

    return () => {
      document.body.style.overflow = '';
      const lenis = getLenis();
      lenis?.start();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  const youtubeEmbedUrl = formatYouTubeEmbedUrl(project?.gameplayVideoUrl);
  const hasVideo = Boolean(youtubeEmbedUrl || project?.gameplayVideoUrl);

  const rawScreenshots = project?.screenshots && project.screenshots.length > 0
    ? project.screenshots
    : project?.coverImage
    ? [project.coverImage]
    : [];

  // Filter out any empty strings or old unsplash placeholders
  const validScreenshots = rawScreenshots.filter(
    (url) => url && typeof url === 'string' && url.trim().length > 0 && !url.includes('images.unsplash.com')
  );

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="modal-backdrop"
          variants={VARIANTS.modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          onClick={onClose}
        >
          <motion.div
            key="modal-card"
            variants={VARIANTS.modalDialog}
            initial="hidden"
            animate="visible"
            exit="exit"
            data-lenis-prevent="true"
            className="relative w-full max-w-4xl bg-[#10151c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3.5rem)] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c1015] flex-shrink-0 z-10">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-accent border border-accent/20 uppercase">
                  {project.category}
                </span>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded ${
                    project.status === 'Published'
                      ? 'bg-accent/20 text-accent border border-accent/40'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={TRANSITIONS.snappy}
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Scrollable Content Body with Guaranteed Viewport Clamping */}
            <div
              data-lenis-prevent="true"
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 space-y-6"
            >
              {/* Title & Short Summary */}
              <div>
                <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  {project.title}
                </h2>
                <p className="mt-2 text-gray-300 text-sm sm:text-base leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              {/* Media Player / Gallery / Designed Placeholder Section */}
              <div className="space-y-3">
                {/* Media Selector Tabs (when both video and screenshots exist) */}
                {hasVideo && validScreenshots.length > 0 && (
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('video')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                        activeMediaTab === 'video'
                          ? 'bg-accent text-black font-semibold'
                          : 'text-gray-400 hover:text-white bg-white/5'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      Gameplay Trailer / Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('screenshots')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                        activeMediaTab === 'screenshots'
                          ? 'bg-accent text-black font-semibold'
                          : 'text-gray-400 hover:text-white bg-white/5'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Screenshots ({validScreenshots.length})
                    </button>
                  </div>
                )}

                {/* Display Media Container */}
                <div className="rounded-xl overflow-hidden bg-black/60 border border-white/10 aspect-video relative flex items-center justify-center max-h-[46vh]">
                  {activeMediaTab === 'video' && hasVideo ? (
                    youtubeEmbedUrl ? (
                      <iframe
                        src={youtubeEmbedUrl}
                        title={`${project.title} Video Preview`}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <Play className="w-10 h-10 text-accent mx-auto" />
                        <p className="text-sm text-gray-300 font-mono">External Demo Video Available</p>
                        <motion.a
                          href={project.gameplayVideoUrl || project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...BUTTON_INTERACTIONS}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black text-xs font-bold uppercase tracking-wider hover:bg-accent-hover"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Watch Gameplay Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </motion.a>
                      </div>
                    )
                  ) : validScreenshots.length > 0 && !imageError ? (
                    <motion.img
                      key={selectedScreenshotIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      src={validScreenshots[selectedScreenshotIndex]}
                      alt={`${project.title} screenshot ${selectedScreenshotIndex + 1}`}
                      onError={() => setImageError(true)}
                      className="w-full h-full object-contain bg-black/40"
                    />
                  ) : (
                    <ProjectPlaceholder
                      title={project.title}
                      category={project.category}
                      className="w-full h-full"
                    />
                  )}
                </div>

                {/* Screenshot Thumbnails (when multiple screenshots available) */}
                {activeMediaTab === 'screenshots' && validScreenshots.length > 1 && !imageError && (
                  <div className="flex items-center gap-2 overflow-x-auto py-2">
                    {validScreenshots.map((shot, idx) => (
                      <motion.button
                        key={idx}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedScreenshotIndex(idx)}
                        className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedScreenshotIndex === idx
                            ? 'border-accent'
                            : 'border-white/20 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={shot} alt="" className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Detailed Systems & Gameplay Breakdown */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-mono uppercase tracking-wider text-accent flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Technical Systems & Architecture
                </h3>
                <div className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line bg-white/5 p-4 rounded-xl border border-white/5 font-sans">
                  {project.detailedDescription}
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  Engine, Languages & Systems
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono text-gray-200 bg-white/5 border border-white/10 rounded-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Footer Bar with Actions */}
            <div className="px-6 py-4 bg-[#0c1015] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-10">
              <div className="flex flex-wrap items-center gap-3">
                {project.googlePlayUrl && (
                  <motion.a
                    href={project.googlePlayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...BUTTON_INTERACTIONS}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors shadow-md shadow-accent/20"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Google Play Store</span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                )}

                {project.itchUrl && (
                  <motion.a
                    href={project.itchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...BUTTON_INTERACTIONS}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <span>Play on Itch.io</span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                )}

                {project.demoUrl && !project.googlePlayUrl && (
                  <motion.a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...BUTTON_INTERACTIONS}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                  >
                    <span>Live Demo / Gameplay Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                )}

                {project.gameplayVideoUrl && (
                  <motion.a
                    href={project.gameplayVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...BUTTON_INTERACTIONS}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-medium text-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-red-400" />
                    <span>YouTube Trailer</span>
                  </motion.a>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-mono transition-colors border border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                Close Window [ESC]
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
