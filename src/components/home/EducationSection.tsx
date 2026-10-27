import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { GraduationCap, MapPin, Calendar, BookOpen } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { education } = usePortfolio();

  return (
    <section id="education" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Education" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="p-6 sm:p-8 rounded-2xl bg-[#111720] border border-white/10 hover:border-accent/40 transition-colors flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-accent/5"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-accent">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/5 text-xs font-mono text-accent">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.duration}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-4">
                  {item.degree} in {item.field}
                </h3>
                <h4 className="text-sm sm:text-base font-semibold text-gray-300 mt-1">
                  {item.institution}
                </h4>

                <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>{item.location}</span>
                </div>

                {item.details && (
                  <p className="mt-4 text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {item.details}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-500">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-accent" />
                  Electronics & Communication
                </span>
                <span>Undergraduate</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
