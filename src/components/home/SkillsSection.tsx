import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { Gamepad2, Code2, Wrench, Cpu, CheckCircle } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { skills } = usePortfolio();

  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Gamepad2 className="w-5 h-5 text-accent" />;
      case 1:
        return <Code2 className="w-5 h-5 text-accent" />;
      case 2:
        return <Wrench className="w-5 h-5 text-accent" />;
      default:
        return <Cpu className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative bg-[#0c1015]/60 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="02"
          title="Technical Competencies"
          subtitle="Engine specialization, programming languages, production tools, and core software engineering fundamentals."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((category, idx) => (
            <div
              key={category.id}
              className="p-6 rounded-2xl bg-[#111720] border border-white/10 hover:border-accent/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-accent/10 group-hover:border-accent/40 transition-colors">
                    {getCategoryIcon(idx)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      {category.name}
                    </h3>
                    <span className="text-[11px] font-mono text-gray-400">
                      {category.skills.length} competencies
                    </span>
                  </div>
                </div>

                {category.description && (
                  <p className="text-xs text-gray-400 mb-5 leading-relaxed">
                    {category.description}
                  </p>
                )}

                {/* Skills Badges */}
                <div className="space-y-2">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-mono transition-colors ${
                        skill.highlight
                          ? 'bg-white/10 text-white border border-accent/40 font-semibold'
                          : 'bg-white/5 text-gray-300 border border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {skill.highlight ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                        )}
                        {skill.name}
                      </span>
                      {skill.highlight && (
                        <CheckCircle className="w-3.5 h-3.5 text-accent" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Footer */}
              <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>Verified in production</span>
                <span className="text-accent">#0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
