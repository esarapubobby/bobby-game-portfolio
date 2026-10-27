import React from 'react';
import { ExternalLink, Play, Smartphone, Gamepad2, ChevronRight } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  return (
    <article className="group relative rounded-2xl bg-[#111720] border border-white/10 hover:border-accent/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent/5">
      {/* Cover Image Container */}
      <div
        className="relative aspect-video w-full overflow-hidden bg-black/40 cursor-pointer"
        onClick={() => onSelect(project)}
      >
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111720] via-transparent to-black/30 opacity-90" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded bg-black/75 backdrop-blur-md text-accent border border-accent/30 uppercase tracking-wider">
            {project.category}
          </span>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded backdrop-blur-md ${
              project.status === 'Published'
                ? 'bg-lime-500/20 text-lime-300 border border-lime-500/30'
                : 'bg-black/60 text-gray-300 border border-white/10'
            }`}
          >
            {project.status}
          </span>
        </div>

        {/* Play / Inspect overlay hint on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <div className="px-4 py-2 rounded-lg bg-accent text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Gamepad2 className="w-4 h-4" />
            <span>Inspect Systems</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onSelect(project)}
            className="text-xl sm:text-2xl font-bold text-white group-hover:text-accent transition-colors font-display cursor-pointer"
          >
            {project.title}
          </h3>

          <p className="mt-2 text-sm text-gray-300 leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>

          {/* Technology Pills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 text-[11px] font-mono text-gray-300 bg-white/5 rounded border border-white/5"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-0.5 text-[11px] font-mono text-gray-500 bg-white/5 rounded">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSelect(project)}
            className="text-xs font-mono font-semibold text-accent hover:text-accent-hover flex items-center gap-1 group/btn focus:outline-none focus:underline"
          >
            <span>View Architecture</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </button>

          <div className="flex items-center gap-2">
            {project.googlePlayUrl && (
              <a
                href={project.googlePlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Google Play Store"
                className="p-1.5 rounded-md bg-white/5 hover:bg-accent hover:text-black text-gray-300 transition-colors"
                aria-label={`${project.title} on Google Play`}
              >
                <Smartphone className="w-4 h-4" />
              </a>
            )}

            {project.itchUrl && (
              <a
                href={project.itchUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Play on Itch.io"
                className="p-1.5 rounded-md bg-white/5 hover:bg-red-600 hover:text-white text-gray-300 transition-colors"
                aria-label={`${project.title} on Itch.io`}
              >
                <Gamepad2 className="w-4 h-4" />
              </a>
            )}

            {(project.demoUrl || project.gameplayVideoUrl) && !project.googlePlayUrl && !project.itchUrl && (
              <a
                href={project.demoUrl || project.gameplayVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Demo link"
                className="p-1.5 rounded-md bg-white/5 hover:bg-white/20 text-gray-300 transition-colors"
                aria-label={`${project.title} Demo`}
              >
                {project.gameplayVideoUrl ? <Play className="w-4 h-4 text-red-400" /> : <ExternalLink className="w-4 h-4" />}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
