import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle: string;
  className?: string;
}

/**
 * SectionTitle component - Used for consistent section headings across the site
 * Clean, modern design with subtitle above the main title
 */
export function SectionTitle({ 
  title, 
  subtitle,
  className = ""
}: SectionTitleProps) {
  return (
    <div className={`mx-auto mb-14 max-w-xl text-center ${className}`}>
      {/* Subtitle displayed above the title */}
      <p className="mb-8 text-xs font-bold uppercase tracking-[0.4em] text-stone-800">
        {subtitle}
      </p>
      
      {/* Main title with larger, more dramatic styling */}
      <h2 className="font-serif text-5xl font-normal uppercase tracking-wider text-stone-900 md:text-6xl">
        {title}
      </h2>
    </div>
  );
} 