import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  FolderGit2,
  CheckCircle,
  Clock,
  Plus,
  FileDown,
  Palette,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Gamepad2,
} from 'lucide-react';
import { BUTTON_INTERACTIONS, TRANSITIONS, VARIANTS } from '../../lib/animations';

export const AdminDashboard: React.FC = () => {
  const { projects, messages, toggleProjectPublished } = usePortfolio();

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.published).length;
  const draftProjects = totalProjects - publishedProjects;
  const unreadMessages = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          Dashboard Overview
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
          Monitor your published game titles, draft systems, and studio updates.
        </p>
      </div>

      {/* Metric Cards with Staggered Entrance */}
      <motion.div
        variants={VARIANTS.staggerContainer(0.08, 0.05)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <motion.div
          variants={VARIANTS.fadeUp}
          whileHover={{ y: -3 }}
          transition={TRANSITIONS.snappy}
          className="p-5 rounded-2xl bg-[#111720] border border-white/10"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-mono uppercase">Total Projects</span>
            <FolderGit2 className="w-4 h-4 text-accent" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">
            {totalProjects}
          </div>
          <span className="text-[10px] font-mono text-gray-400 mt-1 block">
            Across Mobile, 3D & Sim
          </span>
        </motion.div>

        <motion.div
          variants={VARIANTS.fadeUp}
          whileHover={{ y: -3 }}
          transition={TRANSITIONS.snappy}
          className="p-5 rounded-2xl bg-[#111720] border border-white/10"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-mono uppercase">Published Live</span>
            <CheckCircle className="w-4 h-4 text-lime-400" />
          </div>
          <div className="text-3xl font-extrabold text-lime-400 font-display">
            {publishedProjects}
          </div>
          <span className="text-[10px] font-mono text-gray-400 mt-1 block">
            Visible on public portfolio
          </span>
        </motion.div>

        <motion.div
          variants={VARIANTS.fadeUp}
          whileHover={{ y: -3 }}
          transition={TRANSITIONS.snappy}
          className="p-5 rounded-2xl bg-[#111720] border border-white/10"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-mono uppercase">Draft Projects</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-display">
            {draftProjects}
          </div>
          <span className="text-[10px] font-mono text-gray-400 mt-1 block">
            Hidden from public visitors
          </span>
        </motion.div>

        <motion.div
          variants={VARIANTS.fadeUp}
          whileHover={{ y: -3 }}
          transition={TRANSITIONS.snappy}
          className="p-5 rounded-2xl bg-[#111720] border border-white/10"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-mono uppercase">Inbox Messages</span>
            <Mail className="w-4 h-4 text-accent" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">
            {messages.length}
          </div>
          <span className="text-[10px] font-mono text-accent mt-1 block">
            {unreadMessages} unread inquiries
          </span>
        </motion.div>
      </motion.div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-gray-400">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div {...BUTTON_INTERACTIONS}>
            <Link
              to="/admin/projects?create=true"
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/10 transition-colors flex items-center gap-3 group h-full block"
            >
              <div className="p-2.5 rounded-lg bg-accent/20 text-accent group-hover:bg-accent group-hover:text-black transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Create New Project</span>
                <span className="text-[11px] font-mono text-gray-400">Add a game title</span>
              </div>
            </Link>
          </motion.div>

          <motion.div {...BUTTON_INTERACTIONS}>
            <Link
              to="/admin/media"
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/10 transition-colors flex items-center gap-3 group h-full block"
            >
              <div className="p-2.5 rounded-lg bg-accent/20 text-accent group-hover:bg-accent group-hover:text-black transition-colors">
                <FileDown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Update Resume</span>
                <span className="text-[11px] font-mono text-gray-400">Upload replacement PDF</span>
              </div>
            </Link>
          </motion.div>

          <motion.div {...BUTTON_INTERACTIONS}>
            <Link
              to="/admin/settings"
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/10 transition-colors flex items-center gap-3 group h-full block"
            >
              <div className="p-2.5 rounded-lg bg-accent/20 text-accent group-hover:bg-accent group-hover:text-black transition-colors">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Accent & Themes</span>
                <span className="text-[11px] font-mono text-gray-400">Customize colorway</span>
              </div>
            </Link>
          </motion.div>

          <motion.div {...BUTTON_INTERACTIONS}>
            <Link
              to="/admin/messages"
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/10 transition-colors flex items-center gap-3 group h-full block"
            >
              <div className="p-2.5 rounded-lg bg-accent/20 text-accent group-hover:bg-accent group-hover:text-black transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">View Inquiries</span>
                <span className="text-[11px] font-mono text-gray-400">Check client messages</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Recent Projects Table / List */}
      <div className="p-6 rounded-2xl bg-[#111720] border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold text-white font-display">
              Portfolio Projects Overview
            </h2>
          </div>
          <Link
            to="/admin/projects"
            className="text-xs font-mono text-accent hover:text-accent-hover flex items-center gap-1 group"
          >
            <span>Manage All ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={proj.coverImage}
                  alt=""
                  className="w-12 h-9 rounded-lg object-cover flex-shrink-0 bg-black/40 border border-white/10"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white truncate">
                      {proj.title}
                    </span>
                    {proj.featured && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">
                        Featured
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 font-mono block truncate">
                    {proj.category} • {proj.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleProjectPublished(proj.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                    proj.published
                      ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20 hover:bg-lime-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                  }`}
                  title={proj.published ? 'Click to unpublish' : 'Click to publish'}
                >
                  {proj.published ? (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Published</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Draft</span>
                    </>
                  )}
                </motion.button>

                <Link
                  to="/admin/projects"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-mono"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
