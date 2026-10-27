import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Settings,
  Mail,
  FileImage,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Cloud,
  CloudOff,
} from 'lucide-react';
import { BUTTON_INTERACTIONS, TRANSITIONS } from '../../lib/animations';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, loading, signOut, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If still checking session, show a clean loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-gray-400">Verifying administrator authorization...</span>
        </div>
      </div>
    );
  }

  // If not logged in or not an authorized admin, redirect to login
  if (!user || !isAdmin) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Skills & Tech', path: '/admin/skills', icon: Cpu },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Education', path: '/admin/education', icon: GraduationCap },
    { name: 'Site Customization', path: '/admin/settings', icon: Settings },
    { name: 'Contact Messages', path: '/admin/messages', icon: Mail },
    { name: 'Media & Storage', path: '/admin/media', icon: FileImage },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#090c0e] text-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#0e1319] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-accent" />
          </div>
          <span className="font-display font-bold text-sm text-white">Admin Console</span>
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300"
          aria-label="Toggle admin sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d1217] border-r border-white/10 flex flex-col justify-between transform transition-transform duration-200 md:translate-x-0 md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand & Authorization badge */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="font-display font-black text-white text-base tracking-tight">
                  Studio Admin
                </h1>
                <p className="text-[10px] font-mono text-gray-400">Bobby Esarapu Portfolio</p>
              </div>
            </div>

            {/* Supabase Connection State indicator */}
            <div className="mt-4 p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-2 text-[11px] font-mono">
              {isSupabaseConfigured ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  <span className="text-gray-300">Supabase Connected</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="text-amber-300">Offline / Local Mode</span>
                </>
              )}
            </div>
          </div>

          {/* Navigation Links with Animated Pill Indicator */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-colors ${
                    isActive
                      ? 'text-black font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="adminActiveNav"
                        className="absolute inset-0 rounded-lg bg-accent shadow-sm -z-0"
                        transition={TRANSITIONS.snappy}
                        aria-hidden="true"
                      />
                    )}
                    <item.icon className="w-4 h-4 flex-shrink-0 relative z-10" />
                    <span className="relative z-10">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer with User info & logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <motion.div {...BUTTON_INTERACTIONS}>
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 text-xs font-mono text-gray-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-accent" />
                <span>View Live Website</span>
              </span>
              <span>&rarr;</span>
            </Link>
          </motion.div>

          <div className="flex items-center justify-between pt-2">
            <div className="overflow-hidden mr-2">
              <span className="block text-xs text-white font-medium truncate">
                {user.email}
              </span>
              <span className="text-[10px] font-mono text-accent">Administrator</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSignOut}
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
