import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { MapPin, GraduationCap, Users, Gamepad2 } from 'lucide-react';
import { VARIANTS, TRANSITIONS } from '../../lib/animations';

export const AboutSection: React.FC = () => {
  const { settings } = usePortfolio();
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [settings.profileImageUrl]);

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="About Me" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Narrative Column with Staggered Fade Up */}
          <motion.div
            variants={VARIANTS.staggerContainer(0.12, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="lg:col-span-7 space-y-6"
          >
            <motion.div variants={VARIANTS.fadeUp} className="prose prose-invert max-w-none text-gray-300 space-y-5 text-base sm:text-lg leading-relaxed font-sans">
              <p>{settings.aboutBioP1}</p>
              <p>{settings.aboutBioP2}</p>
            </motion.div>

            {/* Quick Context Highlights with Micro-Interactions */}
            <motion.div variants={VARIANTS.fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                transition={TRANSITIONS.snappy}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent/40 transition-colors flex items-start gap-3"
              >
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Location</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{settings.aboutLocation}</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                transition={TRANSITIONS.snappy}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent/40 transition-colors flex items-start gap-3"
              >
                <Users className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Team Collaboration</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Redundant Studios (3-person Indie Team)</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                transition={TRANSITIONS.snappy}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent/40 transition-colors flex items-start gap-3 sm:col-span-2"
              >
                <GraduationCap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Academic Foundation</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    B.Tech in Electronics & Communication Technology (2023–2027) • Sasi Institute of Technology and Engineering
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Location B: Right Column Profile Portrait */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex items-center justify-center"
          >
            <div className="w-full max-w-[360px] sm:max-w-[400px] aspect-[4/5] rounded-2xl bg-[#111720] border-2 border-accent/40 p-2.5 shadow-2xl relative overflow-hidden group hover:border-accent transition-all duration-300">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/60 flex items-center justify-center">
                {settings.profileImageUrl && !imgError ? (
                  <img
                    src={settings.profileImageUrl}
                    alt={settings.heroName || 'Bobby Esarapu'}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-500">
                    <Gamepad2 className="w-12 h-12 text-accent/60 mb-2" />
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                      Developer Portrait
                    </span>
                  </div>
                )}
                {/* Tech corner reticles */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-accent/50 pointer-events-none" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-accent/50 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-accent/50 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-accent/50 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
