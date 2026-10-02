import React from 'react';

interface SafeShipOfficialLogoProps {
  size?: number;
  glow?: boolean;
}

export const SafeShipOfficialLogo: React.FC<SafeShipOfficialLogoProps> = ({
  size = 64,
  glow = true,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Specular Ambient Glow */}
      {glow && (
        <div
          style={{
            position: 'absolute',
            inset: `-${size * 0.25}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 102, 255, 0.45) 0%, rgba(0, 102, 255, 0) 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Official SafeShip Geometric Vector Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          filter: glow ? 'drop-shadow(0 12px 24px rgba(0, 102, 255, 0.4))' : 'none',
        }}
      >
        {/* Outer Rounded Squircle Container */}
        <rect x="3.5" y="3.5" width="41" height="41" rx="10.5" fill="#0066FF" />

        {/* Centered Safe-Zone Hexagon */}
        <g transform="translate(24, 24) scale(0.92) translate(-24, -24.6)">
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

          {/* Center Hexagonal Aperture */}
          <path
            d="M24 18L30 21.5V28.5L24 32L18 28.5V21.5L24 18Z"
            fill="#0066FF"
          />
        </g>
      </svg>
    </div>
  );
};
