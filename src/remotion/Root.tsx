import React from 'react';
import { Composition } from 'remotion';
import { SafeShipMasterPromo } from './SafeShipMasterPromo';
import { SafeShipPromo35 } from './SafeShipPromo35';
import { SafeShipPromo } from './SafeShipPromo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 
        SafeShip 35-Second Hyper-Polished Master Promo (Flagship)
        1080p @ 60 FPS = 2100 Frames (Outship / OpenAI / Sleeko Standard)
      */}
      <Composition
        id="SafeShipMasterPromo"
        component={SafeShipMasterPromo}
        durationInFrames={2100}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* 30 FPS Variant */}
      <Composition
        id="SafeShipPromo35"
        component={SafeShipPromo35}
        durationInFrames={1050}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Legacy 60-Second Composition */}
      <Composition
        id="SafeShipPromo"
        component={SafeShipPromo}
        durationInFrames={1860}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
