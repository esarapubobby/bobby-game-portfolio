import React, { useState, useEffect, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number; // ms per iteration
  maxIterations?: number;
  characters?: string;
  className?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'mount';
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  characters = DEFAULT_CHARS,
  className = '',
  parentClassName = '',
  animateOn = 'mount',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setDisplayText(text);
        return;
      }
    }

    let intervalId: any;
    let iteration = 0;

    const startDecryption = () => {
      iteration = 0;
      clearInterval(intervalId);

      intervalId = setInterval(() => {
        setDisplayText(() => {
          return text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              // Lock into real character sequentially as iteration progresses
              if (index < iteration / 2) {
                return text[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join('');
        });

        iteration++;

        if (iteration >= text.length * 2 + maxIterations) {
          clearInterval(intervalId);
          setDisplayText(text);
        }
      }, speed);
    };

    if (animateOn === 'mount') {
      startDecryption();
    } else {
      // IntersectionObserver for 'view'
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            startDecryption();
          }
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        observer.disconnect();
        clearInterval(intervalId);
      };
    }

    return () => clearInterval(intervalId);
  }, [text, speed, maxIterations, characters, animateOn, isHovered]);

  return (
    <span
      ref={containerRef}
      className={`inline-block ${parentClassName}`}
      aria-label={text}
      onMouseEnter={() => setIsHovered(!isHovered)}
    >
      <span className={className}>{displayText}</span>
    </span>
  );
};
