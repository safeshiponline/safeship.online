import React from 'react';

interface SafeShipLogoProps {
  className?: string;
  size?: number;
}

export const SafeShipLogo: React.FC<SafeShipLogoProps> = ({ className = 'w-9 h-9', size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer Rounded Isometric Cube Container */}
    <rect width="48" height="48" rx="14" fill="url(#blue_grad)" />
    <defs>
      <linearGradient id="blue_grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0066FF" />
        <stop offset="1" stopColor="#0047CC" />
      </linearGradient>
    </defs>
    
    {/* Isometric Cube Faces with White Geometric Edges */}
    <g transform="translate(4, 4) scale(0.83)">
      {/* Top Face */}
      <path
        d="M24 6L39 15L24 24L9 15L24 6Z"
        fill="white"
        fillOpacity="0.95"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Left Face */}
      <path
        d="M9 16.5L23 25V41L9 32.5V16.5Z"
        fill="white"
        fillOpacity="0.75"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right Face */}
      <path
        d="M25 25L39 16.5V32.5L25 41V25Z"
        fill="white"
        fillOpacity="0.85"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Center Cube Core */}
      <path
        d="M24 16L31 20.5V29.5L24 34L17 29.5V20.5L24 16Z"
        fill="#0052FF"
        fillOpacity="0.9"
      />
    </g>
  </svg>
);
