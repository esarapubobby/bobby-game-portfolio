import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  className = '',
  fill = 'var(--accent-color, #a3e635)',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        shouldReduceMotion
          ? { opacity: 0.15, scale: 1 }
          : {
              opacity: [0.12, 0.22, 0.12],
              scale: [0.95, 1.05, 0.95],
            }
      }
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`pointer-events-none absolute -top-40 left-0 md:left-60 md:-top-20 z-0 h-[160%] w-[140%] max-w-[900px] blur-[130px] opacity-20 ${className}`}
      style={{
        background: `radial-gradient(circle at center, ${fill} 0%, rgba(16, 185, 129, 0.15) 35%, transparent 70%)`,
      }}
      aria-hidden="true"
    />
  );
};
