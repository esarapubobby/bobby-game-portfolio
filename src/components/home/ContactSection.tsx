import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { Mail, Linkedin, Github, Send, CheckCircle2, AlertCircle, Copy, Check, Info } from 'lucide-react';
import { BUTTON_INTERACTIONS, TRANSITIONS } from '../../lib/animations';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBMISSION_COOLDOWN_SECONDS = 30;

export const ContactSection: React.FC = () => {
  const { settings } = usePortfolio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Honeypot field for bot protection (hidden from humans via CSS)
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activationNotice, setActivationNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const lastSubmissionRef = useRef<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setActivationNotice(null);

    // 1. Abuse Protection: Honeypot check
    if (honeypot.trim() !== '') {
      // Silently ignore bots without sending
      return;
    }

    // 2. Abuse Protection: Rate-limit cooldown check
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastSubmissionRef.current) / 1000);
    if (lastSubmissionRef.current > 0 && elapsedSeconds < SUBMISSION_COOLDOWN_SECONDS) {
      const waitTime = SUBMISSION_COOLDOWN_SECONDS - elapsedSeconds;
      setErrorMsg(`Please wait ${waitTime} seconds before sending another message.`);
      return;
    }

    // 3. Validation
    const nameTrimmed = formData.name.trim();
    const emailTrimmed = formData.email.trim();
    const messageTrimmed = formData.message.trim();

    if (!nameTrimmed || nameTrimmed.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!emailTrimmed || !EMAIL_REGEX.test(emailTrimmed)) {
      setErrorMsg('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (!messageTrimmed || messageTrimmed.length < 10) {
      setErrorMsg('Please provide a message of at least 10 characters.');
      return;
    }

    setSubmitting(true);

    const recipientEmail = (settings.contactEmail || 'esarapubobby@gmail.com').trim();
    const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: nameTrimmed,
          email: emailTrimmed,
          _replyto: emailTrimmed,
          message: messageTrimmed,
          _subject: `Game Developer Portfolio Inquiry from ${nameTrimmed}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const resData = await response.json();

      if (
        resData.success === 'true' ||
        resData.success === true ||
        (resData.message && resData.message.toLowerCase().includes('success'))
      ) {
        lastSubmissionRef.current = Date.now();
        setSuccess(true);
        // Clear form only on verified delivery
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSuccess(false), 9000);
      } else if (resData.message && resData.message.toLowerCase().includes('activation')) {
        // FormSubmit first-time activation confirmation notice
        lastSubmissionRef.current = Date.now();
        setActivationNotice(
          `FormSubmit activation link sent to ${recipientEmail}! Please open your Gmail, find the newest FormSubmit email, and click "Activate Form" once to activate direct delivery.`
        );
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(resData.message || `Form service responded with status: ${response.status}`);
      }
    } catch (err: any) {
      console.error('FormSubmit send error:', err);
      // Values in formData are strictly preserved so the visitor does not lose their typed message
      const detailedError =
        err?.message || (typeof err === 'string' ? err : 'Failed to dispatch email. Please check your connection or retry.');
      setErrorMsg(`Delivery Error: ${detailedError}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(settings.contactEmail || 'esarapubobby@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contact" className="py-24 relative bg-[#0c1015]/60 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Get In Touch" />

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
                Let's Discuss Game Projects
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed font-sans">
                Whether you have an inquiry about Unity gameplay systems, indie collaborations, or studio opportunities, send a message below and it will be delivered directly to my inbox.
              </p>

              {/* Direct Email Box with One-Click Copy */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-lg bg-accent/15 text-accent border border-accent/40 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${settings.contactEmail || 'esarapubobby@gmail.com'}`}
                      className="text-xs sm:text-sm font-mono text-white font-semibold hover:text-accent transition-colors truncate block"
                    >
                      {settings.contactEmail || 'esarapubobby@gmail.com'}
                    </a>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors flex-shrink-0"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </div>

              {/* Verified Social Channels */}
              <div className="space-y-3 pt-2">
                <motion.a
                  href={settings.linkedinUrl || 'https://linkedin.com/in/bobby-esarapu-68543230'}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  transition={TRANSITIONS.snappy}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-colors text-sm text-gray-200 cursor-pointer"
                  aria-label="LinkedIn Profile"
                >
                  <span className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-accent" />
                    <span>LinkedIn Profile</span>
                  </span>
                  <span className="text-xs font-mono text-gray-500">Connect &rarr;</span>
                </motion.a>

                <motion.a
                  href={settings.githubUrl || 'https://github.com/esarapubobby'}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  transition={TRANSITIONS.snappy}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-colors text-sm text-gray-200 cursor-pointer"
                  aria-label="GitHub Profile"
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

          {/* Contact Message Form Column (Delivered directly via FormSubmit) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-[#111720] border border-white/10 space-y-5 shadow-xl relative"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white font-display">
                  Send a Direct Message
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/25 text-accent">
                  Direct to Inbox
                </span>
              </div>

              {/* Honeypot field for anti-bot protection */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="website-trap">Leave this field blank</label>
                <input
                  id="website-trap"
                  type="text"
                  name="website-trap"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

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
                      <strong className="block font-semibold">Message Delivered Successfully!</strong>
                      <span>
                        Your message has been sent directly to Bobby's email inbox at <strong>{settings.contactEmail || 'esarapubobby@gmail.com'}</strong>. A response will be sent to your provided email address shortly.
                      </span>
                    </div>
                  </motion.div>
                )}

                {activationNotice && (
                  <motion.div
                    key="activation-banner"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-sm text-amber-200 overflow-hidden"
                  >
                    <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold text-amber-300">One-Time Activation Required</strong>
                      <span className="text-xs leading-relaxed block mt-0.5">{activationNotice}</span>
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
                      <strong className="block font-semibold">Notice</strong>
                      <span className="text-xs leading-relaxed">{errorMsg}</span>
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
                  disabled={submitting}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Miller"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition-colors disabled:opacity-50"
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
                  disabled={submitting}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex@gamestudio.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-gray-300 uppercase mb-2">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  disabled={submitting}
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry, project scope, or collaboration opportunity..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm resize-none transition-colors disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  {...BUTTON_INTERACTIONS}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-50 shadow-md shadow-accent/10 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Sending to Inbox...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Direct Email</span>
                    </>
                  )}
                </motion.button>

                <span className="text-[11px] font-mono text-gray-400">
                  Recipient: <span className="text-white">esarapubobby@gmail.com</span>
                </span>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
