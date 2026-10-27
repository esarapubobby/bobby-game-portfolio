import React, { useState, useMemo } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';
import { Filter, AlertCircle, RefreshCw } from 'lucide-react';

export const FeaturedProjects: React.FC = () => {
  const { projects, loading, error, refreshData } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Filter only published projects for public viewers
  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.published !== false);
  }, [projects]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [publishedProjects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return publishedProjects;
    return publishedProjects.filter((p) => p.category === selectedCategory);
  }, [publishedProjects, selectedCategory]);

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <SectionHeading
            index="01"
            title="Featured Projects"
            subtitle="Published games, prototypes, and technical gameplay systems built with Unity and C#."
          />

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-mono text-gray-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-accent text-black font-bold shadow-sm'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
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
        {!loading && filteredProjects.length === 0 && (
          <div className="py-20 text-center rounded-2xl bg-white/5 border border-white/5 p-8">
            <p className="text-base text-gray-400 font-mono">No projects found for the selected category.</p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="mt-4 px-4 py-2 rounded-lg bg-accent text-black text-xs font-mono font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Project Cards Grid */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={(proj) => setActiveModalProject(proj)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
