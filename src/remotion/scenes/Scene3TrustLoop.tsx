import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { MOTION_PHYSICS, PALETTE } from '../constants/physics';
import { GlassCard } from '../components/ui/GlassCard';
import { KineticHeader } from '../components/ui/KineticHeader';
import { DiagnosticPill } from '../components/ui/DiagnosticPill';
import { Badge } from '../components/ui/Badge';
import {
  Lock,
  ShieldCheck,
  Truck,
  Eye,
  CheckCircle2,
  Package,
  QrCode,
  Smartphone,
  Navigation,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const Scene3TrustLoop: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 3 runs for 725 frames total (master frames 740 to 1465)
  // Step 1: 0 - 295 (Locked Vault)
  // Step 2: 295 - 475 (Express Transit)
  // Step 3: 475 - 725 (Open-Box Doorstep Inspection)

  const currentStep = frame < 295 ? 1 : frame < 475 ? 2 : 3;

  // Camera drift
  const cameraZoom = interpolate(frame, [0, 725], [1.0, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene fade in / out
  const sceneOpacity = interpolate(frame, [0, 15, 710, 725], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Step 1 Springs
  const step1Spring = spring({
    frame: frame - 10,
    fps: 60,
    config: MOTION_PHYSICS.SNAPPY_SPRING,
  });

  // Step 2 Springs
  const step2Spring = spring({
    frame: frame - 305,
    fps: 60,
    config: MOTION_PHYSICS.SNAPPY_SPRING,
  });

  // Step 3 Springs
  const step3Spring = spring({
    frame: frame - 485,
    fps: 60,
    config: MOTION_PHYSICS.SNAPPY_SPRING,
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F8F7F4',
        opacity: sceneOpacity,
        transform: `scale(${cameraZoom})`,
        transformOrigin: 'center center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 80px',
        overflow: 'hidden',
        fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Background technical dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient gradient */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          width: 800,
          height: 600,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* TOP HEADER: Dynamic Step Headline */}
      <div style={{ textAlign: 'center', marginBottom: 28, zIndex: 10 }}>
        {currentStep === 1 && (
          <KineticHeader
            words={[
              { text: '1.', isAccent: false },
              { text: 'Your', isAccent: false },
              { text: 'money', isAccent: false },
              { text: 'stays', isAccent: false },
              { text: 'safely', isAccent: false },
              { text: 'locked', isAccent: true, accentColor: '#10B981' },
              { text: 'in', isAccent: false },
              { text: 'escrow.', isAccent: true, accentColor: '#0066FF' },
            ]}
            frame={frame}
            startFrame={5}
            stagger={4}
            fontSize={42}
            accentFontSize={52}
          />
        )}

        {currentStep === 2 && (
          <KineticHeader
            words={[
              { text: '2.', isAccent: false },
              { text: 'Seller', isAccent: false },
              { text: 'ships', isAccent: false },
              { text: 'with', isAccent: false },
              { text: 'express', isAccent: true, accentColor: '#0066FF' },
              { text: 'insured', isAccent: true, accentColor: '#8B5CF6' },
              { text: 'tracking.', isAccent: false },
            ]}
            frame={frame - 295}
            startFrame={5}
            stagger={4}
            fontSize={42}
            accentFontSize={52}
          />
        )}

        {currentStep === 3 && (
          <KineticHeader
            words={[
              { text: '3.', isAccent: false },
              { text: 'Open', isAccent: true, accentColor: '#10B981' },
              { text: 'the', isAccent: false },
              { text: 'box,', isAccent: false },
              { text: 'turn', isAccent: false },
              { text: 'on', isAccent: false },
              { text: 'the', isAccent: false },
              { text: 'screen,', isAccent: true, accentColor: '#0066FF' },
              { text: 'test', isAccent: false },
              { text: 'the', isAccent: false },
              { text: 'phone.', isAccent: true, accentColor: '#10B981' },
            ]}
            frame={frame - 475}
            startFrame={5}
            stagger={4}
            fontSize={40}
            accentFontSize={50}
          />
        )}
      </div>

      {/* CENTER STAGE: Varies by Step */}
      <div
        style={{
          width: '100%',
          maxWidth: 1040,
          minHeight: 460,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* STEP 1: SPLIT ESCROW CHAMBER (Frame 0 - 295) */}
        {currentStep === 1 && (
          <div
            style={{
              display: 'flex',
              gap: 36,
              alignItems: 'center',
              width: '100%',
              transform: `perspective(1200px) rotateX(4deg) translateY(${(1 - step1Spring) * 50}px) scale(${step1Spring})`,
            }}
          >
            {/* Buyer Side (Funds Secured) */}
            <div style={{ flex: 1 }}>
              <GlassCard
                theme="light"
                rounded={24}
                padding="32px 36px"
                borderColor="rgba(16, 185, 129, 0.3)"
                glowColor="rgba(16, 185, 129, 0.15)"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#10B981',
                        boxShadow: '0 0 10px #10B981',
                      }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase' }}>
                      Buyer Vault Deposit
                    </span>
                  </div>
                  <Badge variant="success" size="sm" dot>
                    Secured
                  </Badge>
                </div>

                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    fontFamily: "'Geist', monospace",
                    color: '#0F172A',
                    letterSpacing: '-0.04em',
                    marginBottom: 8,
                  }}
                >
                  ₹65,000
                </div>

                <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
                  Held in 100% RBI-regulated Escrow Account
                </div>

                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 14,
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <ShieldCheck size={18} color="#10B981" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>
                    Zero risk: Cannot be transferred without your approval
                  </span>
                </div>
              </GlassCard>
            </div>

            {/* Holographic Lock Bridge */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 20,
                  background: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Lock size={26} color="#10B981" />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  fontFamily: "'Geist', sans-serif",
                  color: '#64748B',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Safe Lock
              </span>
            </div>

            {/* Seller Payout Side (Frozen / Protected) */}
            <div style={{ flex: 1 }}>
              <GlassCard
                theme="light"
                rounded={24}
                padding="32px 36px"
                style={{ opacity: 0.9 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#94A3B8',
                      }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Seller Payout Balance
                    </span>
                  </div>
                  <Badge variant="default" size="sm">
                    Frozen
                  </Badge>
                </div>

                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    fontFamily: "'Geist', monospace",
                    color: '#94A3B8',
                    letterSpacing: '-0.04em',
                    marginBottom: 8,
                  }}
                >
                  ₹0 Released
                </div>

                <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
                  Seller cannot withdraw until device is verified
                </div>

                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 14,
                    background: 'rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Lock size={18} color="#64748B" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>
                    Payout trigger: Buyer doorstep inspection test
                  </span>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* STEP 2: EXPRESS LOGISTICS & TELEMETRY (Frame 295 - 475) */}
        {currentStep === 2 && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: `perspective(1200px) rotateX(3deg) translateY(${(1 - step2Spring) * 50}px) scale(${step2Spring})`,
            }}
          >
            <GlassCard theme="light" rounded={24} padding="36px 44px" style={{ width: 880 }}>
              {/* Telemetry Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: 'rgba(0, 102, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Truck size={24} color="#0066FF" />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                      SafeShip Express Logistics
                    </div>
                    <div style={{ fontSize: 13, color: '#64748B' }}>
                      Tracking ID: SF-BLR-DEL-9842 • BlueDart Air Express
                    </div>
                  </div>
                </div>

                <Badge variant="info" size="md" dot icon={<Navigation size={14} />}>
                  Live In Transit
                </Badge>
              </div>

              {/* 3 Telemetry Checkpoints */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                {[
                  {
                    title: 'Tamper-Evident Box',
                    detail: 'Holographic Barcode Sealed',
                    active: true,
                    icon: <Package size={18} color="#10B981" />,
                  },
                  {
                    title: 'Fully Insured Transit',
                    detail: 'Covered up to ₹1,00,000',
                    active: true,
                    icon: <ShieldCheck size={18} color="#0066FF" />,
                  },
                  {
                    title: 'Doorstep Handover',
                    detail: 'Delivery OTP Verification',
                    active: frame >= 390,
                    icon: <QrCode size={18} color="#8B5CF6" />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      padding: '16px 20px',
                      borderRadius: 16,
                      background: item.active ? 'rgba(0, 102, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      border: `1.5px solid ${item.active ? 'rgba(0, 102, 255, 0.25)' : 'rgba(0, 0, 0, 0.06)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      {item.icon}
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{item.title}</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#64748B' }}>{item.detail}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar animation */}
              <div style={{ position: 'relative', width: '100%', height: 8, background: '#E2E8F0', borderRadius: 999 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${interpolate(frame - 295, [0, 180], [25, 95], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`,
                    background: 'linear-gradient(90deg, #0066FF 0%, #10B981 100%)',
                    borderRadius: 999,
                    boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)',
                  }}
                />
              </div>
            </GlassCard>
          </div>
        )}

        {/* STEP 3: DOORSTEP OPEN-BOX INSPECTION (Frame 475 - 725) */}
        {currentStep === 3 && (
          <div
            style={{
              display: 'flex',
              gap: 40,
              alignItems: 'center',
              width: '100%',
              transform: `perspective(1200px) rotateX(3deg) translateY(${(1 - step3Spring) * 50}px) scale(${step3Spring})`,
            }}
          >
            {/* Left: Realistic 2.5D iPhone 15 Pro with Screen Glowing */}
            <div
              style={{
                width: 320,
                height: 480,
                borderRadius: 44,
                background: '#0F172A',
                border: '8px solid #2B3441',
                boxShadow:
                  '0 30px 80px rgba(0, 0, 0, 0.35), inset 0 0 0 2px rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px 20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Dynamic Island */}
              <div
                style={{
                  width: 90,
                  height: 24,
                  borderRadius: 20,
                  background: '#000000',
                  marginBottom: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#111827' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0F172A' }} />
              </div>

              {/* iPhone Screen Glow Animation */}
              <div
                style={{
                  flex: 1,
                  width: '100%',
                  borderRadius: 28,
                  background: 'linear-gradient(180deg, #0A192F 0%, #020C1B 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                  textAlign: 'center',
                  boxShadow: '0 0 40px rgba(16, 185, 129, 0.25)',
                }}
              >
                <Smartphone size={40} color="#10B981" style={{ marginBottom: 14 }} />
                <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
                  iPhone 15 Pro
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
                  Display On • Diagnostics Ready
                </div>
                <Badge variant="success" size="sm" dot>
                  100% HEALTHY
                </Badge>
              </div>

              {/* Bottom Home Indicator */}
              <div
                style={{
                  width: 100,
                  height: 4,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.6)',
                  marginTop: 18,
                }}
              />
            </div>

            {/* Right: 3 Diagnostic Rubric Cards Fanning Out */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              <DiagnosticPill
                label="OLED Display & Touchscreen"
                metric="TrueTone active • Zero dead pixels"
                status="VERIFIED"
                icon="display"
                frame={frame - 475}
                delay={10}
                rotation={-1.5}
              />

              <DiagnosticPill
                label="IMEI & iCloud Lock Status"
                metric="Clean status • No blacklist • Fully Unlocked"
                status="CLEAN"
                icon="hardware"
                frame={frame - 475}
                delay={25}
                rotation={0}
              />

              <DiagnosticPill
                label="Physical Battery & Chassis"
                metric="Battery Health 98% • Grade A+ Pristine"
                status="PRISTINE"
                icon="condition"
                frame={frame - 475}
                delay={40}
                rotation={1.5}
              />
            </div>
          </div>
        )}
      </div>

      {/* SLEEKO-STYLE INTERACTIVE STAGE TIMELINE (Docked at Bottom) */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '10px 22px',
          borderRadius: 9999,
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(20px)',
          zIndex: 20,
        }}
      >
        {[
          { num: '01', title: 'Vault Lock', active: currentStep === 1 },
          { num: '02', title: 'Express Transit', active: currentStep === 2 },
          { num: '03', title: 'Open-Box Test', active: currentStep === 3 },
        ].map((step, idx) => (
          <React.Fragment key={idx}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 9999,
                background: step.active ? '#0F172A' : 'transparent',
                color: step.active ? '#FFFFFF' : '#64748B',
                fontWeight: step.active ? 700 : 500,
                fontSize: 13,
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "'Geist', monospace",
                  color: step.active ? '#10B981' : '#94A3B8',
                }}
              >
                {step.num}
              </span>
              <span>{step.title}</span>
            </div>
            {idx < 2 && <span style={{ color: '#CBD5E1', fontSize: 12 }}>—</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
