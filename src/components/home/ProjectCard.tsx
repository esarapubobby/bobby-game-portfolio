import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play, Smartphone, Gamepad2, ChevronRight } from 'lucide-react';
import { Project } from '../../types';
import { TiltedCard } from '../ui/TiltedCard';
import { ICON_BUTTON_INTERACTIONS } from '../../lib/animations';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(project);
    }
  };

  return (
    <TiltedCard className="h-full">
      <motion.article
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="group relative rounded-2xl bg-[#111720] border border-white/10 hover:border-accent/50 transition-colors duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent/5 h-full focus-within:ring-2 focus-within:ring-accent"
      >
        {/* Top Cover Image Area */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect(project)}
          onKeyDown={handleKeyDown}
          aria-label={`Inspect ${project.title}`}
          className="relative aspect-video w-full overflow-hidden bg-black/40 cursor-pointer focus:outline-none"
        >
          <motion.img
            src={project.coverImage}
            alt={project.title}
            loading="lazy"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover"
          />

          {/* Cinematic Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111720] via-transparent to-black/40 opacity-90 pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-accent border border-accent/30 uppercase tracking-wider">
              {project.category}
            </span>
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded backdrop-blur-md ${
                project.status === 'Published'
                  ? 'bg-lime-500/20 text-lime-300 border border-lime-500/30'
                  : 'bg-black/70 text-gray-300 border border-white/10'
              }`}
            >
              {project.status}
            </span>
          </div>

          {/* Inspect Hover Overlay Hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
            <motion.div
              initial={{ scale: 0.9, y: 6 }}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-xl bg-accent text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-accent/20"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Inspect Systems</span>
            </motion.div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3
              role="button"
              tabIndex={0}
              onClick={() => onSelect(project)}
              onKeyDown={handleKeyDown}
              className="text-xl sm:text-2xl font-bold text-white group-hover:text-accent transition-colors font-display cursor-pointer focus:outline-none focus:underline"
            >
              {project.title}
            </h3>

            <p className="mt-2 text-sm text-gray-300 leading-relaxed line-clamp-3">
              {project.shortDescription}
            </p>

            {/* Technologies Pills */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 text-[11px] font-mono text-gray-300 bg-white/5 rounded-md border border-white/5 hover:border-accent/30 transition-colors"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-0.5 text-[11px] font-mono text-gray-500 bg-white/5 rounded-md">
                  +{project.technologies.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <motion.button
              type="button"
              onClick={() => onSelect(project)}
              whileHover={{ x: 2 }}
              className="text-xs font-mono font-semibold text-accent hover:text-accent-hover flex items-center gap-1 group/btn focus:outline-none focus:underline"
            >
              <span>View Architecture</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </motion.button>

            <div className="flex items-center gap-2">
              {project.googlePlayUrl && (
                <motion.a
                  href={project.googlePlayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...ICON_BUTTON_INTERACTIONS}
                  title="Google Play Store"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-accent hover:text-black text-gray-300 transition-colors"
                  aria-label={`${project.title} on Google Play`}
                >
                  <Smartphone className="w-4 h-4" />
                </motion.a>
              )}

              {project.itchUrl && (
                <motion.a
                  href={project.itchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...ICON_BUTTON_INTERACTIONS}
                  title="Play on Itch.io"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-600 hover:text-white text-gray-300 transition-colors"
                  aria-label={`${project.title} on Itch.io`}
                >
                  <Gamepad2 className="w-4 h-4" />
                </motion.a>
              )}

              {(project.demoUrl || project.gameplayVideoUrl) && !project.googlePlayUrl && !project.itchUrl && (
                <motion.a
                  href={project.demoUrl || project.gameplayVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...ICON_BUTTON_INTERACTIONS}
                  title="Demo link"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-gray-300 transition-colors"
                  aria-label={`${project.title} Demo`}
                >
                  {project.gameplayVideoUrl ? <Play className="w-4 h-4 text-red-400" /> : <ExternalLink className="w-4 h-4" />}
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </TiltedCard>
  );
};
