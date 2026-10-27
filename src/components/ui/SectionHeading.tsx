import React from 'react';

interface SectionHeadingProps {
  index: string; // e.g. "01"
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  title,
  subtitle,
  align = 'left',
}) => {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <div className={`inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-accent mb-2.5 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="opacity-70">//</span>
        <span>{index}</span>
        <span className="w-6 h-[1px] bg-accent/40 inline-block"></span>
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base md:text-lg text-gray-400 max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
