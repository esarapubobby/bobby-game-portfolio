import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { MapPin, GraduationCap, Users, Terminal, CheckCircle2 } from 'lucide-react';
import { VARIANTS, TRANSITIONS } from '../../lib/animations';

export const AboutSection: React.FC = () => {
  const { settings } = usePortfolio();

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

          {/* Interactive Game Engine Inspector Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={TRANSITIONS.smooth}
              className="rounded-2xl bg-[#111720] border border-white/10 p-6 shadow-2xl relative overflow-hidden group hover:border-accent/40 transition-colors"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-accent" />
                  <span className="font-mono text-xs text-white uppercase tracking-wider font-bold">
                    Developer_Profile.cs
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  Active
                </span>
              </div>

              <div className="py-4 space-y-3 font-mono text-xs">
                <div className="text-gray-400">
                  <span className="text-purple-400">public class</span>{' '}
                  <span className="text-yellow-300 font-semibold">BobbyEsarapu</span> :{' '}
                  <span className="text-cyan-400">GameDeveloper</span>
                </div>
                <div className="pl-4 space-y-1.5 text-gray-300">
                  <div>
                    <span className="text-purple-400">public string</span> Focus =&gt;{' '}
                    <span className="text-green-300">"Gameplay & Enemy AI"</span>;
                  </div>
                  <div>
                    <span className="text-purple-400">public string</span> Engine =&gt;{' '}
                    <span className="text-green-300">"Unity 2022+ / 6"</span>;
                  </div>
                  <div>
                    <span className="text-purple-400">public string</span> TargetPlatform =&gt;{' '}
                    <span className="text-green-300">"Android / Mobile"</span>;
                  </div>
                  <div>
                    <span className="text-purple-400">public string[]</span> Published =&gt;{' '}
                    <span className="text-blue-300">[</span>
                    <span className="text-green-300">"Deadzone (Google Play)"</span>
                    <span className="text-blue-300">]</span>;
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2 font-semibold">
                    Core Technical Principles:
                  </p>
                  <ul className="space-y-1.5 text-gray-300 text-[11px]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      Zero GC allocations inside Update() loops
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      State-machine based AI logic for clean debugging
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      Custom object pooling for enemy hordes and projectiles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      Touch-first responsive input systems for Android
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
