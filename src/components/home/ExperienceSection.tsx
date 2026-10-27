import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../ui/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { Briefcase, Calendar, CheckCircle2, MapPin } from 'lucide-react';
import { TRANSITIONS } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

export const ExperienceSection: React.FC = () => {
  const { experience } = usePortfolio();
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // GSAP ScrollTrigger timeline progress laser beam
  useEffect(() => {
    if (shouldReduceMotion || !sectionRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'bottom 85%',
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-24 relative bg-[#0c1015]/60 border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Development Experience" />

        <div className="relative ml-4 md:ml-8 space-y-12">
          {/* Base Background Track Line */}
          <div className="absolute left-0 top-2 bottom-4 w-[2px] bg-white/10" />

          {/* Animated GSAP Laser Beam Foreground */}
          <div
            ref={lineRef}
            className="absolute left-0 top-2 bottom-4 w-[2px] bg-gradient-to-b from-accent via-lime-400 to-emerald-400 origin-top shadow-[0_0_12px_var(--accent-color,#a3e635)]"
          />

          {experience.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-6 md:pl-10 group"
            >
              {/* Timeline marker node */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: idx * 0.15 + 0.1 }}
                className="absolute -left-[7px] top-1.5 w-4 h-4 rounded-full bg-[#111720] border-2 border-accent group-hover:bg-accent group-hover:scale-125 transition-all duration-300 shadow-md shadow-accent/30"
              />

              <motion.div
                whileHover={{ y: -4 }}
                transition={TRANSITIONS.smooth}
                className="p-6 sm:p-8 rounded-2xl bg-[#111720] border border-white/10 hover:border-accent/40 transition-colors shadow-lg hover:shadow-2xl hover:shadow-accent/5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                      {item.role}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-accent font-mono text-sm font-semibold">
                      <Briefcase className="w-4 h-4" />
                      <span>{item.company}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/5">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      {item.duration}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/5">
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
                    {item.achievements.map((ach, aIdx) => (
                      <div
                        key={aIdx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300"
                      >
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
                        className="px-2.5 py-1 text-xs font-mono text-gray-400 bg-white/5 rounded-md border border-white/5 hover:border-accent/30 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
