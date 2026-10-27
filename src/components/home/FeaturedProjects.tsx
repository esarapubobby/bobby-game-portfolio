import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const FeaturedProjects: React.FC = () => {
  const { projects, loading, error, refreshData } = usePortfolio();
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Display all published projects directly
  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.published !== false);
  }, [projects]);

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <SectionHeading title="Featured Projects" />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-mono text-gray-400">Loading game projects...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="my-8 p-6 rounded-xl bg-red-950/30 border border-red-800/40 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-sm text-red-200">Unable to load dynamic projects from server: {error}</p>
            <button
              onClick={() => refreshData()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && publishedProjects.length === 0 && (
          <div className="py-20 text-center rounded-2xl bg-white/5 border border-white/5 p-8">
            <p className="text-base text-gray-400 font-mono">No published projects available at this moment.</p>
          </div>
        )}

        {/* Project Cards Grid */}
        {!loading && publishedProjects.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {publishedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={(proj) => setActiveModalProject(proj)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Accessible Detail Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
