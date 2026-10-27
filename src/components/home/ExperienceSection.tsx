import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { Briefcase, Calendar, CheckCircle2, MapPin } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { experience } = usePortfolio();

  return (
    <section id="experience" className="py-24 relative bg-[#0c1015]/60 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="04"
          title="Development Experience"
          subtitle="Collaborative studio game production and technical industry internships."
        />

        <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
          {experience.map((item) => (
            <div key={item.id} className="relative pl-6 md:pl-10 group">
              {/* Timeline marker */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#111720] border-2 border-accent group-hover:bg-accent group-hover:scale-125 transition-all duration-300" />

              <div className="p-6 sm:p-8 rounded-2xl bg-[#111720] border border-white/10 hover:border-accent/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                      {item.role}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-accent font-mono text-sm">
                      <Briefcase className="w-4 h-4" />
                      <span>{item.company}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/5">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      {item.duration}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/5">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mt-4">
                  {item.description}
                </p>

                {/* Achievements list */}
                {item.achievements && item.achievements.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {item.achievements.map((ach, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech stack */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs font-mono text-gray-400 bg-white/5 rounded border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
