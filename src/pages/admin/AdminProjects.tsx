import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';
import { ProjectFormModal } from './ProjectFormModal';
import {
  Plus,
  Search,
  Star,
  Eye,
  EyeOff,
  Copy,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from 'lucide-react';
import { BUTTON_INTERACTIONS, ICON_BUTTON_INTERACTIONS, TRANSITIONS, VARIANTS } from '../../lib/animations';

export const AdminProjects: React.FC = () => {
  const {
    projects,
    saveProject,
    deleteProject,
    duplicateProject,
    toggleProjectFeatured,
    toggleProjectPublished,
    reorderProjects,
  } = usePortfolio();

  const [searchParams, setSearchParams] = useSearchParams();
  const shouldOpenCreate = searchParams.get('create') === 'true';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'published' | 'draft'>('all');

  const [isModalOpen, setIsModalOpen] = useState(shouldOpenCreate);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Delete Confirmation State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterState === 'published') return matchesSearch && proj.published;
    if (filterState === 'draft') return matchesSearch && !proj.published;
    return matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
    setSearchParams({});
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    await deleteProject(projectToDelete.id);
    setProjectToDelete(null);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    await reorderProjects(reordered.map((p) => p.id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Project Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
            Create, update, duplicate, and control public visibility of all game titles.
          </p>
        </div>

        <motion.button
          onClick={handleOpenCreate}
          {...BUTTON_INTERACTIONS}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-black font-bold text-xs uppercase font-mono tracking-wider hover:bg-accent-hover transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </motion.button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#111720] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search titles or tags..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-black/40 p-1 rounded-lg border border-white/5">
          {(['all', 'published', 'draft'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterState(filter)}
              className={`relative px-3 py-1 rounded-md text-xs font-mono capitalize transition-colors ${
                filterState === filter
                  ? 'bg-accent text-black font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table / Card List with Layout Transitions */}
      <div className="rounded-2xl bg-[#111720] border border-white/10 overflow-hidden shadow-xl">
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-mono text-xs">
            No projects match the criteria.
          </div>
        ) : (
          <motion.div layout className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj, idx) => (
                <motion.div
                  key={proj.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={TRANSITIONS.smooth}
                  className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Project Info */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    {/* Reorder Arrows */}
                    <div className="flex flex-col gap-1 text-gray-500 flex-shrink-0">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === projects.length - 1}
                        className="p-1 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>

                    <img
                      src={proj.coverImage}
                      alt=""
                      className="w-16 h-12 rounded-lg object-cover flex-shrink-0 bg-black/40 border border-white/10"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base truncate">
                          {proj.title}
                        </h3>
                        {proj.featured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-accent" />
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 font-mono truncate mt-0.5">
                        {proj.category} • {proj.status}
                      </p>
                    </div>
                  </div>

                  {/* Project Actions with Tactile Feedback */}
                  <div className="flex items-center flex-wrap gap-2 self-end lg:self-auto pt-2 lg:pt-0 border-t border-white/5 lg:border-t-0">
                    {/* Featured Toggle */}
                    <motion.button
                      {...ICON_BUTTON_INTERACTIONS}
                      onClick={() => toggleProjectFeatured(proj.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        proj.featured
                          ? 'bg-accent/15 border-accent/40 text-accent'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                      title={proj.featured ? 'Unmark featured' : 'Mark featured'}
                    >
                      <Star className={`w-4 h-4 ${proj.featured ? 'fill-accent' : ''}`} />
                    </motion.button>

                    {/* Published Toggle */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleProjectPublished(proj.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                        proj.published
                          ? 'bg-lime-500/10 text-lime-400 border-lime-500/20 hover:bg-lime-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                      }`}
                      title={proj.published ? 'Published (Click to hide)' : 'Draft (Click to publish)'}
                    >
                      {proj.published ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </>
                      )}
                    </motion.button>

                    {/* Duplicate Button */}
                    <motion.button
                      {...ICON_BUTTON_INTERACTIONS}
                      onClick={() => duplicateProject(proj.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                      title="Duplicate Project"
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>

                    {/* Edit Button */}
                    <motion.button
                      {...ICON_BUTTON_INTERACTIONS}
                      onClick={() => handleOpenEdit(proj)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>

                    {/* Delete Button */}
                    <motion.button
                      {...ICON_BUTTON_INTERACTIONS}
                      onClick={() => setProjectToDelete(proj)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 text-gray-400 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Edit / Create Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveProject}
        initialData={editingProject}
      />

      {/* Delete Confirmation Modal with AnimatePresence */}
      <AnimatePresence>
        {projectToDelete && (
          <motion.div
            key="delete-backdrop"
            variants={VARIANTS.modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              key="delete-dialog"
              variants={VARIANTS.modalDialog}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md rounded-2xl bg-[#111720] border border-red-500/30 p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-red-400">
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/30">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Confirm Project Deletion</h3>
                  <span className="text-xs font-mono text-gray-400">Destructive operation</span>
                </div>
              </div>

              <p className="text-sm text-gray-300">
                Are you sure you want to delete <strong className="text-white">"{projectToDelete.title}"</strong>? This will remove all associated systems metadata from the portfolio.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300"
                >
                  Cancel
                </button>
                <motion.button
                  type="button"
                  {...BUTTON_INTERACTIONS}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase font-mono tracking-wider transition-colors"
                >
                  Yes, Delete Project
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
