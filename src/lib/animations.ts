import { Variants, Transition } from 'framer-motion';

// ==============================================================================
// BOBBY ESARAPU — MOTION DESIGN SYSTEM
// Snappy, cinematic, performance-focused transitions & reusable variants
// ==============================================================================

export const TRANSITIONS = {
  snappy: { type: 'spring', stiffness: 450, damping: 32 } as Transition,
  smooth: { type: 'spring', stiffness: 280, damping: 26 } as Transition,
  gentle: { type: 'spring', stiffness: 180, damping: 22 } as Transition,
  easeOut: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } as Transition,
  bounce: { type: 'spring', stiffness: 400, damping: 15 } as Transition,
};

export const VARIANTS = {
  // Fade in from transparent
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  } as Variants,

  // Fade Up
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  } as Variants,

  // Fade Down
  fadeDown: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  } as Variants,

  // Stagger Container
  staggerContainer: (staggerChildren = 0.07, delayChildren = 0.05): Variants => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  }),

  // Stagger Item (used inside staggerContainer)
  staggerItem: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  } as Variants,

  // Scale in (for modals and cards)
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 350, damping: 28 },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.18, ease: 'easeIn' },
    },
  } as Variants,

  // Modal Backdrop
  modalBackdrop: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.25 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  } as Variants,

  // Modal Dialog
  modalDialog: {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 380, damping: 30 },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      y: 10,
      transition: { duration: 0.18, ease: 'easeIn' },
    },
  } as Variants,
};

// Reusable micro-interaction button tap/hover props
export const BUTTON_INTERACTIONS = {
  whileHover: { scale: 1.025 },
  whileTap: { scale: 0.975 },
  transition: TRANSITIONS.snappy,
};

export const ICON_BUTTON_INTERACTIONS = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.9 },
  transition: TRANSITIONS.snappy,
};
