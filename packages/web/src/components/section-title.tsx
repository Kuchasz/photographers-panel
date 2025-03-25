import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle: string;
  className?: string;
}

/**
 * SectionTitle component - Used for consistent section headings across the site
 * Uses a design inspired by Mango Studios with decorative elements
 */
export function SectionTitle({ 
  title, 
  subtitle,
  className = ""
}: SectionTitleProps) {
  return (
    <div className={`mx-auto mb-14 max-w-xl text-center ${className}`}>
      <div className="mb-3 flex items-center justify-center">
        <div className="h-px w-12 bg-gold-300"></div>
      </div>
      <h2 className="mb-5 font-serif text-4xl font-light uppercase tracking-widest text-stone-800 md:text-5xl">
        {title}
      </h2>
      <div className="mb-4 flex items-center justify-center">
        <div className="h-px w-16 bg-gold-200"></div>
      </div>
      <p className="mx-auto max-w-lg font-light italic tracking-wide text-stone-600 md:text-lg">
        {subtitle}
      </p>
    </div>
  );
} 