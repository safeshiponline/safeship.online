import React from 'react';
import { Audio, interpolate, staticFile } from 'remotion';
import { BackgroundCinematic } from './components/BackgroundCinematic';
import { TopBrandHeader } from './components/TopBrandHeader';
import { Scene1_TheStandOff } from './components/Scene1_TheStandOff';
import { Scene2_SafeShipArrival } from './components/Scene2_SafeShipArrival';
import { Scene3_VaultMechanism } from './components/Scene3_VaultMechanism';
import { Scene4_BondedPickup } from './components/Scene4_BondedPickup';
import { Scene5_OpenBoxInspection } from './components/Scene5_OpenBoxInspection';
import { Scene6_GrandOutro } from './components/Scene6_GrandOutro';
import { SubtitlesHUD } from './components/SubtitlesHUD';

export const SafeShipPromo: React.FC = () => {
  // Studio-grade dynamic audio ducking curve for Cushy's electronic beat
  const musicVolume = (f: number) => {
    return interpolate(
      f,
      [0, 35, 240, 270, 520, 550, 860, 890, 1210, 1240, 1540, 1580, 1840],
      [0.25, 0.14, 0.14, 0.20, 0.14, 0.18, 0.14, 0.18, 0.14, 0.18, 0.14, 0.28, 0.28],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  };

  return (
    <div
      style={{
        width: '1920px',
        height: '1080px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#030712',
      }}
    >
      {/* 1. Synchronized Primary Voiceover Audio */}
      <Audio src={staticFile('audio/safeship-promo.wav')} volume={1.0} />

      {/* 2. Layered Studio Background Music with Dynamic Speech Ducking */}
      <Audio src={staticFile('audio/bg-music.mp3')} volume={musicVolume} />

      {/* 3. Luxury Obsidian Cinematic Background & Horizon Flares */}
      <BackgroundCinematic />

      {/* 4. Minimalist SafeShip Status Header */}
      <TopBrandHeader />

      {/* 5. Master Motion Graphics Scenes */}
      <Scene1_TheStandOff />
      <Scene2_SafeShipArrival />
      <Scene3_VaultMechanism />
      <Scene4_BondedPickup />
      <Scene5_OpenBoxInspection />
      <Scene6_GrandOutro />

      {/* 6. Apple Keynote Floating Subtitles HUD */}
      <SubtitlesHUD />
    </div>
  );
};
