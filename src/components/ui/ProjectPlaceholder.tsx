import React from 'react';
import { Gamepad2, Terminal } from 'lucide-react';

interface ProjectPlaceholderProps {
  title: string;
  category?: string;
  className?: string;
}

export const ProjectPlaceholder: React.FC<ProjectPlaceholderProps> = ({
  title,
  category,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full h-full min-h-[180px] bg-[#0c1015] border border-white/5 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden ${className}`}
    >
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" />

      {/* Ambient Radial Accent Glow */}
      <div className="absolute w-44 h-44 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

      {/* Decorative Corner Reticles */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-accent/40" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-accent/40" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-accent/40" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-accent/40" />

      <div className="relative z-10 flex flex-col items-center space-y-3">
        {/* Themed Icon Shield */}
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center shadow-lg shadow-accent/10">
          <Gamepad2 className="w-6 h-6 text-accent" />
        </div>

        {/* Project Title */}
        <div>
          <h4 className="text-base sm:text-lg font-black tracking-wider text-white font-display uppercase">
            {title}
          </h4>
          {category && (
            <p className="text-[11px] font-mono text-accent/90 tracking-widest uppercase mt-0.5">
              {category}
            </p>
          )}
        </div>

        {/* Studio Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
          <Terminal className="w-3 h-3 text-accent" />
          <span>Unity System Build</span>
        </div>
      </div>
    </div>
  );
};
