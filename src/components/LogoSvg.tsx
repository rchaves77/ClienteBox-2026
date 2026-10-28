import React, { useState } from 'react';

interface LogoSvgProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  variant?: 'dark' | 'light';
  className?: string;
}

export const LogoSvg: React.FC<LogoSvgProps> = ({ 
  size = 'md', 
  showText = true, 
  variant = 'dark',
  className = '' 
}) => {
  const [imgError, setImgError] = useState(false);

  const dimensions = {
    sm: { box: 'h-9 w-9 rounded-xl', text: 'text-lg', subtext: 'text-[9px]' },
    md: { box: 'h-11 w-11 rounded-xl', text: 'text-xl', subtext: 'text-[10px]' },
    lg: { box: 'h-20 w-20 rounded-2xl', text: 'text-2xl', subtext: 'text-xs' },
    hero: { box: 'h-28 sm:h-36 w-28 sm:w-36 rounded-3xl', text: 'text-3xl sm:text-4xl', subtext: 'text-xs sm:text-sm' },
  }[size];

  const textColorClass = variant === 'light' ? 'text-slate-900' : 'text-white';
  const subtextColorClass = variant === 'light' ? 'text-slate-600' : 'text-slate-400';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Real PNG Logo Image Container - Quadro Bem Preenchido */}
      <div className={`relative ${dimensions.box} bg-white p-1 flex items-center justify-center shrink-0 rounded-2xl shadow-md border border-slate-200/80 overflow-hidden`}>
        {!imgError ? (
          <img
            src="/logo.png"
            alt="ClienteBox Logo Oficial"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-contain rounded-xl"
          />
        ) : (
          /* Fallback Vector in case /logo.png is missing */
          <svg viewBox="0 0 140 140" fill="none" className="h-full w-full overflow-visible drop-shadow-md p-1">
            <defs>
              <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b4a" />
                <stop offset="100%" stopColor="#e5421d" />
              </linearGradient>
              <linearGradient id="boxNavyLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a2333" />
                <stop offset="100%" stopColor="#0d1421" />
              </linearGradient>
              <linearGradient id="boxNavyRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#253248" />
                <stop offset="100%" stopColor="#151d2c" />
              </linearGradient>
            </defs>
            {/* Ribbon Bow */}
            <g transform="translate(0, -2)">
              <path d="M 70,22 C 52,0 32,12 50,25 C 58,28 66,25 70,22 Z" fill="url(#orangeGrad)" />
              <path d="M 70,22 C 88,0 108,12 90,25 C 82,28 74,25 70,22 Z" fill="url(#orangeGrad)" />
              <ellipse cx="70" cy="22" rx="5.5" ry="4" fill="#cc3514" />
            </g>
            {/* Radial Burst */}
            <g>
              <polygon points="70,60 30,12 42,10" fill="url(#orangeGrad)" opacity="0.9" />
              <polygon points="70,60 52,8 62,7" fill="#ffffff" opacity="0.95" />
              <polygon points="70,60 70,5 78,6" fill="url(#orangeGrad)" opacity="0.9" />
              <polygon points="70,60 88,8 98,10" fill="#ffffff" opacity="0.95" />
              <polygon points="70,60 110,14 118,20" fill="url(#orangeGrad)" opacity="0.9" />
            </g>
            {/* Figure */}
            <circle cx="70" cy="44" r="6" fill="#0b111e" />
            <path d="M 70,52 C 58,54 44,45 34,38 C 42,56 58,62 62,74 L 70,74 L 78,74 C 82,62 98,56 106,38 C 96,45 82,54 70,52 Z" fill="#0b111e" />
            {/* Box */}
            <polygon points="28,78 70,96 70,128 28,110" fill="url(#boxNavyLeft)" />
            <polygon points="44,85 54,89 54,121 44,117" fill="url(#orangeGrad)" />
            <polygon points="70,96 112,78 112,110 70,128" fill="url(#boxNavyRight)" />
            <polygon points="86,89 96,85 96,117 86,121" fill="url(#orangeGrad)" />
            <line x1="70" y1="96" x2="70" y2="128" stroke="#ff6b4a" strokeWidth="2.5" />
          </svg>
        )}
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight font-display leading-none ${dimensions.text} ${textColorClass}`}>
            Cliente<span className="text-[#ff5a35]">Box</span>
          </div>
          <span className={`uppercase tracking-widest font-extrabold mt-0.5 ${dimensions.subtext} ${subtextColorClass}`}>
            Gestão &amp; Inteligência Local
          </span>
        </div>
      )}
    </div>
  );
};
