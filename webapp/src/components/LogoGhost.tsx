import React from 'react'

export default function LogoGhost({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stopColor="#00FF9C" stopOpacity="0.9"/>
          <stop offset="1" stopColor="#00D1FF" stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      <rect x="6" y="12" width="52" height="36" rx="8" stroke="url(#g1)" strokeWidth="2" fill="#07121A" />
      <path d="M12 38 L22 22 L30 30 L40 18 L52 34" stroke="url(#g1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
