import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { GraduationCap, MapPin, Calendar, BookOpen } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { education } = usePortfolio();

  return (
    <section id="education" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="05"
          title="Education"
          subtitle="Formal academic curriculum and engineering studies."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#111720] border border-white/10 hover:border-accent/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/5 text-xs font-mono text-accent">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
