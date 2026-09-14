import React from 'react';

interface SafeShipLogoProps {
  className?: string;
  size?: number;
}

export const SafeShipLogo: React.FC<SafeShipLogoProps> = ({ className = 'w-9 h-9', size }) => (
  <svg
    width={size || 40}
    height={size || 40}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer Rounded Squircle Container */}
    <rect width="48" height="48" rx="13" fill="#0066FF" />
    
    {/* Outer Hexagon */}
    <path
      d="M24 9L37.5 16.8V32.4L24 40.2L10.5 32.4V16.8L24 9Z"
      fill="white"
    />

    {/* Subtle 3D Bevel Facets */}
    <path
      d="M24 9L37.5 16.8L30 21.2L24 17.7L18 21.2L10.5 16.8L24 9Z"
      fill="#FFFFFF"
    />
    <path
      d="M10.5 16.8L18 21.2V27.9L10.5 32.4V16.8Z"
      fill="#E0E7FF"
    />
    <path
      d="M37.5 16.8L30 21.2V27.9L37.5 32.4V16.8Z"
      fill="#F1F5F9"
    />
    <path
      d="M24 40.2L10.5 32.4L18 27.9L24 31.4L30 27.9L37.5 32.4L24 40.2Z"
      fill="#CBD5E1"
    />

    {/* Center Hexagonal Aperture (matches background blue) */}
    <path
      d="M24 18L30 21.5V28.5L24 32L18 28.5V21.5L24 18Z"
      fill="#0066FF"
    />
  </svg>
);

