import React from 'react';

interface SectionHeadingProps {
  title: string;
  align?: 'left' | 'center';
  className?: string;
  index?: string;
  subtitle?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  align = 'left',
  className = '',
}) => {
  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display">
        {title}
      </h2>
    </div>
  );
};
