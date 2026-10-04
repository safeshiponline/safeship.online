import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { MOTION_PHYSICS, PALETTE } from '../constants/physics';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, Lock, Truck, Eye } from 'lucide-react';

export const Scene2Brand: React.FC = () => {
  const frame = useCurrentFrame();

  // Duration: 175 frames (corresponds to master frames 565 - 740)
  // Continuous camera drift
  const cameraZoom = interpolate(frame, [0, 175], [0.96, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade in / out
  const sceneOpacity = interpolate(frame, [0, 15, 160, 175], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Icon 3D Spring
  const iconSpring = spring({
    frame: frame - 10,
    fps: 60,
    config: MOTION_PHYSICS.SNAPPY_SPRING,
  });

  // Text Entrance Spring
  const textSpring = spring({
    frame: frame - 25,
    fps: 60,
    config: MOTION_PHYSICS.SNAPPY_SPRING,
  });

  // Letter spacing contraction: 0.2em -> -0.02em
  const letterSpacing = interpolate(textSpring, [0, 1], [0.22, -0.02]);

  // Light sweep reflection position across logo
  const lightSweep = interpolate(frame, [45, 110], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3-Pillar preview pills entry (starts at frame 90 when voice says "Here's how it works")
  const pillarsSpring = spring({
    frame: frame - 85,
    fps: 60,
    config: MOTION_PHYSICS.HEAVY_DROP_SPRING,
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#080808',
        opacity: sceneOpacity,
        transform: `scale(${cameraZoom})`,
        transformOrigin: 'center center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Volumetric Emerald and Cobalt glow spheres */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          width: 900,
          height: 600,
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(0, 102, 255, 0.22) 0%, rgba(16, 185, 129, 0.15) 45%, transparent 75%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Cybernetic background grid line overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* 3D Isometric Brand Centerpiece */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `perspective(1200px) rotateX(${interpolate(iconSpring, [0, 1], [25, 0])}deg) scale(${iconSpring})`,
          zIndex: 10,
        }}
      >
        {/* Animated 3D Frosted Hexagon Icon */}
        <div
          style={{
            position: 'relative',
            width: 140,
            height: 140,
            marginBottom: 28,
            filter: 'drop-shadow(0 20px 40px rgba(0, 102, 255, 0.45)) drop-shadow(0 0 50px rgba(16, 185, 129, 0.35))',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="140"
            height="140"
            fill="none"
          >
            {/* Outer Squircle Container */}
            <rect
              x="3.5"
              y="3.5"
              width="41"
              height="41"
              rx="11"
              fill="url(#blueGrad)"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="0.8"
            />
            {/* Safe-Zone Hexagon Geometry */}
            <g transform="translate(24, 24) scale(0.92) translate(-24, -24.6)">
              <path d="M24 9L37.5 16.8V32.4L24 40.2L10.5 32.4V16.8L24 9Z" fill="white" />
              <path d="M24 9L37.5 16.8L30 21.2L24 17.7L18 21.2L10.5 16.8L24 9Z" fill="#FFFFFF" />
              <path d="M10.5 16.8L18 21.2V27.9L10.5 32.4V16.8Z" fill="#E0E7FF" />
              <path d="M37.5 16.8L30 21.2V27.9L37.5 32.4V16.8Z" fill="#F1F5F9" />
              <path d="M24 40.2L10.5 32.4L18 27.9L24 31.4L30 27.9L37.5 32.4L24 40.2Z" fill="#CBD5E1" />
              <path d="M24 18L30 21.5V28.5L24 32L18 28.5V21.5L24 18Z" fill="#0066FF" />
            </g>
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0066FF" />
                <stop offset="1" stopColor="#0044BB" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand Name Typography with Specular Light Sweep */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '0 20px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: 92,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: `${letterSpacing}em`,
              lineHeight: 1,
              fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              background: 'linear-gradient(180deg, #FFFFFF 0%, #D1D5DB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.8))',
            }}
          >
            SafeShip
          </h1>

          {/* Light Sweep Sheen */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${lightSweep}%`,
              width: 140,
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Tagline / Subtitle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 14,
            opacity: interpolate(textSpring, [0.3, 1], [0, 1]),
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.28em',
              color: '#94A3B8',
              textTransform: 'uppercase',
            }}
          >
            BUY • SHIP • VERIFY
          </span>
        </div>

        {/* Trust Badge */}
        <div
          style={{
            marginTop: 22,
            opacity: interpolate(textSpring, [0.5, 1], [0, 1]),
          }}
        >
          <Badge variant="obsidian" size="lg" dot icon={<ShieldCheck size={18} color="#10B981" />}>
            Verified Open-Box Escrow Protocol
          </Badge>
        </div>
      </div>

      {/* 3 Pillars Dock: "Here's how it works" (Frame 85+) */}
      {frame >= 85 && (
        <div
          style={{
            position: 'absolute',
            bottom: 70,
            display: 'flex',
            gap: 20,
            transform: `translateY(${(1 - pillarsSpring) * 40}px) scale(${pillarsSpring})`,
            opacity: pillarsSpring,
            zIndex: 20,
          }}
        >
          {[
            {
              step: '01',
              title: 'Vault Lock',
              desc: "Seller can't touch money",
              icon: <Lock size={16} color="#3B82F6" />,
            },
            {
              step: '02',
              title: 'Express Transit',
              desc: 'Insured & tamper-evident',
              icon: <Truck size={16} color="#8B5CF6" />,
            },
            {
              step: '03',
              title: 'Open-Box Test',
              desc: 'Inspect before payout',
              icon: <Eye size={16} color="#10B981" />,
            },
          ].map((pill, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 22px',
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {pill.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                  }}
                >
                  <span style={{ color: '#60A5FA', marginRight: 6 }}>{pill.step}</span>
                  {pill.title}
                </span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{pill.desc}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
