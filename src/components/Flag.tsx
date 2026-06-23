import React, { useState } from 'react';
import { Team } from '../types';

interface FlagProps {
  team?: Team;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Flag({ team, className = "", size = "md" }: FlagProps) {
  const [hasError, setHasError] = useState(false);

  if (!team) {
    // TBD Flag Placeholder
    return (
      <div className={`flex items-center justify-center rounded-sm bg-slate-700 font-mono text-[10px] font-bold text-slate-400 border border-slate-600 shadow-inner select-none ${className} ${
        size === 'sm' ? 'w-5 h-4 text-[8px]' :
        size === 'md' ? 'w-8 h-6' : 
        size === 'lg' ? 'w-12 h-9 text-[11px]' : 'w-16 h-12 text-[14px]'
      }`}>
        🏳️
      </div>
    );
  }

  // Determine correct country flag image from CDN
  let cdnCode = team.flagCode.toLowerCase();
  
  // Custom flags for special historic or UK teams
  if (team.id === 'gb' || team.id === 'en') {
    cdnCode = 'gb-eng';
  } else if (team.id === 'scotland') {
    cdnCode = 'gb-sct';
  } else if (team.id === 'wales') {
    cdnCode = 'gb-wales';
  }

  const sizes = {
    sm: 'w-6 h-4 text-sm',
    md: 'w-8 h-5.5 text-lg',
    lg: 'w-12 h-8 text-2xl',
    xl: 'w-16 h-11 text-4xl'
  };

  const imgSize = size === 'sm' ? 'w-6' : size === 'md' ? 'w-8' : size === 'lg' ? 'w-12' : 'w-16';

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:scale-105 bg-slate-100 dark:bg-slate-900 shrink-0 ${sizes[size]} ${className}`}>
      {hasError ? (
        <span className="select-none leading-none filter drop-shadow">
          {team.emoji || "🏳️"}
        </span>
      ) : (
        <img
          src={`https://flagcdn.com/w80/${cdnCode}.png`}
          alt={team.nameEn}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="absolute inset-0 w-full h-full object-cover select-none"
        />
      )}
    </div>
  );
}
