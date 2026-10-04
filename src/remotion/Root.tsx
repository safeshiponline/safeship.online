import React from 'react';
import { Composition } from 'remotion';
import { SafeShipPromo35 } from './SafeShipPromo35';
import { SafeShipPromo } from './SafeShipPromo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 
        SafeShip 35-Second Hyper-Polished Master Promo
        1080p @ 30 FPS = 1050 Frames (Exact Outship / OpenAI / Sleeko Creative Direction)
      */}
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
