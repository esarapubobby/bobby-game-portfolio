import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { Gamepad2, Code2, Wrench, Cpu } from 'lucide-react';
import { VARIANTS, TRANSITIONS } from '../../lib/animations';

export const SkillsSection: React.FC = () => {
  const { skills } = usePortfolio();

  const getCategoryIcon = (categoryName: string, idx: number) => {
    const lower = categoryName.toLowerCase();
    if (lower.includes('game')) {
      return <Gamepad2 className="w-4 h-4 text-accent" />;
    }
    if (lower.includes('program') || lower.includes('language')) {
      return <Code2 className="w-4 h-4 text-accent" />;
    }
    if (lower.includes('tool') || lower.includes('workflow') || lower.includes('engine')) {
      return <Wrench className="w-4 h-4 text-accent" />;
    }
    if (lower.includes('concept')) {
      return <Cpu className="w-4 h-4 text-accent" />;
    }
    // Fallback by index
    switch (idx) {
      case 0:
        return <Gamepad2 className="w-4 h-4 text-accent" />;
      case 1:
        return <Code2 className="w-4 h-4 text-accent" />;
      case 2:
        return <Wrench className="w-4 h-4 text-accent" />;
      default:
        return <Cpu className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <section id="skills" className="py-20 relative bg-[#0c1015]/60 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <SectionHeading title="Skills & Tech" />
        </div>

        <motion.div
          variants={VARIANTS.staggerContainer(0.08, 0.04)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
        >
          {skills.map((category, idx) => (
            <motion.div
              key={category.id}
              variants={VARIANTS.fadeUp}
              whileHover={{ y: -3 }}
              transition={TRANSITIONS.smooth}
              className="p-5 sm:p-6 rounded-2xl bg-[#111720] border border-white/10 hover:border-accent/40 transition-colors shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/40 flex items-center justify-center flex-shrink-0">
                    {getCategoryIcon(category.name, idx)}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-display tracking-tight">
                    {category.name}
                  </h3>
                </div>

                {/* Compact Modern Skill Tags */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {category.skills.map((skill) => (
                    <motion.span
                      key={skill.id}
                      whileHover={{ y: -1.5, scale: 1.02 }}
                      transition={TRANSITIONS.snappy}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-default ${
                        skill.highlight
                          ? 'bg-accent/10 text-white border border-accent/40 font-semibold shadow-sm shadow-accent/5 hover:border-accent hover:bg-accent/20'
                          : 'bg-white/5 text-gray-300 border border-white/10 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          skill.highlight ? 'bg-accent shadow-[0_0_6px_var(--accent-color)]' : 'bg-gray-500/80'
                        }`}
                      />
                      <span>{skill.name}</span>
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
