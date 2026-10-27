import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { Mail, Linkedin, Github, Send, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { BUTTON_INTERACTIONS, TRANSITIONS } from '../../lib/animations';

export const ContactSection: React.FC = () => {
  const { settings, submitMessage } = usePortfolio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const res = await submitMessage(formData);
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 8000);
    } else {
      setErrorMsg(res.error || 'Failed to submit message. Please try again.');
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(settings.contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contact" className="py-24 relative bg-[#0c1015]/60 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="06"
          title="Get In Touch"
          subtitle="Interested in collaborating on a game, hiring for Unity gameplay roles, or discussing systems architecture?"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Direct Contact Information Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-6 sm:p-8 rounded-2xl bg-[#111720] border border-white/10 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-white font-display">
                Direct Channels
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Feel free to reach out directly via email or connect on professional networks. I actively respond to game development opportunities and technical inquiries.
              </p>

              {/* Email Card with Copy button */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 group hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[11px] font-mono text-gray-400 uppercase">Email Address</span>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-sm sm:text-base font-medium text-white hover:text-accent transition-colors truncate block"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors flex-shrink-0"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </div>

              {/* Social Channels */}
              <div className="space-y-3 pt-2">
                <motion.a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  transition={TRANSITIONS.snappy}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-colors text-sm text-gray-200"
                >
                  <span className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-accent" />
                    <span>LinkedIn Profile</span>
                  </span>
                  <span className="text-xs font-mono text-gray-500">Connect &rarr;</span>
                </motion.a>

                <motion.a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  transition={TRANSITIONS.snappy}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-colors text-sm text-gray-200"
                >
                  <span className="flex items-center gap-3">
                    <Github className="w-4 h-4 text-accent" />
                    <span>GitHub Repositories</span>
                  </span>
                  <span className="text-xs font-mono text-gray-500">Explore &rarr;</span>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Contact Message Form Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-[#111720] border border-white/10 space-y-5 shadow-xl"
            >
              <h3 className="text-xl font-bold text-white font-display">
                Send a Direct Message
              </h3>

              <AnimatePresence mode="wait">
                {success && (
                  <motion.div
                    key="success-banner"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-lime-950/40 border border-lime-500/40 flex items-start gap-3 text-sm text-lime-200 overflow-hidden"
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Message Dispatched!</strong>
                      <span>Your message has been stored in Bobby's dashboard. Thank you for reaching out.</span>
                    </div>
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div
                    key="error-banner"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-sm text-red-200 overflow-hidden"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Submission Error</strong>
                      <span>{errorMsg}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label htmlFor="contact-name" className="block text-xs font-mono text-gray-300 uppercase mb-2">
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Miller"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-mono text-gray-300 uppercase mb-2">
                  Your Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex@gamestudio.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-gray-300 uppercase mb-2">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry, project scope, or opportunity..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm resize-none transition-colors"
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                {...BUTTON_INTERACTIONS}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-50 shadow-md shadow-accent/10 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
