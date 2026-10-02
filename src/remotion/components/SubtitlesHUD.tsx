import React from 'react';
import { useCurrentFrame } from 'remotion';

interface SubtitleItem {
  startFrame: number;
  endFrame: number;
  text: string;
  highlightWords?: string[];
}

const SUBTITLES: SubtitleItem[] = [
  {
    startFrame: 10,
    endFrame: 118,
    text: "Buying or selling a phone, laptop, or camera to someone online?",
    highlightWords: ["phone,", "laptop,", "camera", "online?"],
  },
  {
    startFrame: 125,
    endFrame: 198,
    text: "One big question always stops you:",
    highlightWords: ["question", "stops"],
  },
  {
    startFrame: 202,
    endFrame: 260,
    text: "Who trusts who first?",
    highlightWords: ["Who", "trusts", "who", "first?"],
  },
  {
    startFrame: 268,
    endFrame: 305,
    text: "Meet SafeShip.",
    highlightWords: ["SafeShip."],
  },
  {
    startFrame: 310,
    endFrame: 530,
    text: "The only way to buy and sell peer-to-peer across India with zero scams, zero advance risk, and 100% guaranteed delivery.",
    highlightWords: ["zero", "scams,", "zero", "advance", "risk,", "100%", "guaranteed", "delivery."],
  },
  {
    startFrame: 540,
    endFrame: 575,
    text: "Here’s how it works:",
    highlightWords: ["how", "it", "works:"],
  },
  {
    startFrame: 580,
    endFrame: 670,
    text: "You only pay the courier delivery fee to dispatch the shipment.",
    highlightWords: ["courier", "delivery", "fee", "dispatch"],
  },
  {
    startFrame: 678,
    endFrame: 808,
    text: "The merchandise payment is safely held in an RBI-regulated bank escrow vault.",
    highlightWords: ["safely", "held", "RBI-regulated", "bank", "escrow", "vault."],
  },
  {
    startFrame: 812,
    endFrame: 875,
    text: "Neither party can touch it in transit.",
    highlightWords: ["Neither", "party", "touch", "transit."],
  },
  {
    startFrame: 882,
    endFrame: 1005,
    text: "On pickup day, our bonded field officer calls the seller on their scheduled time.",
    highlightWords: ["bonded", "field", "officer", "scheduled", "time."],
  },
  {
    startFrame: 1010,
    endFrame: 1070,
    text: "He audits the serial number on the spot,",
    highlightWords: ["audits", "serial", "number", "spot,"],
  },
  {
    startFrame: 1075,
    endFrame: 1225,
    text: "locks the parcel in a barcoded security seal, and verifies pickup with a 4-digit code.",
    highlightWords: ["barcoded", "security", "seal,", "4-digit", "code."],
  },
  {
    startFrame: 1235,
    endFrame: 1350,
    text: "When it reaches the buyer, they get a 10-minute doorstep open-box window.",
    highlightWords: ["10-minute", "doorstep", "open-box", "window."],
  },
  {
    startFrame: 1358,
    endFrame: 1430,
    text: "Power it on, test the device, and verify.",
    highlightWords: ["Power", "it", "on,", "test", "verify."],
  },
  {
    startFrame: 1435,
    endFrame: 1485,
    text: "Once approved via OTP, the seller receives payout immediately!",
    highlightWords: ["approved", "OTP,", "payout", "immediately!"],
  },
  {
    startFrame: 1490,
    endFrame: 1555,
    text: "Mismatched? Pay zero and get 100% refunded.",
    highlightWords: ["Pay", "zero", "100%", "refunded."],
  },
  {
    startFrame: 1565,
    endFrame: 1665,
    text: "Never risk your money or your gadgets again.",
    highlightWords: ["Never", "risk", "money", "gadgets"],
  },
  {
    startFrame: 1670,
    endFrame: 1845,
    text: "Ship verified with SafeShip. Book your consignment today at SafeShip.online.",
    highlightWords: ["SafeShip.", "SafeShip.online."],
  },
];

export const SubtitlesHUD: React.FC = () => {
  const frame = useCurrentFrame();

  const currentItem = SUBTITLES.find(
    (item) => frame >= item.startFrame && frame <= item.endFrame
  );

  if (!currentItem) return null;

  const duration = currentItem.endFrame - currentItem.startFrame;
  const progress = (frame - currentItem.startFrame) / duration;

  // Words array
  const words = currentItem.text.split(' ');
  const activeWordIdx = Math.min(
    words.length - 1,
    Math.floor(progress * words.length * 1.1)
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '38px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '1080px',
        width: '90%',
      }}
    >
      <div
        style={{
          background: 'rgba(7, 11, 20, 0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '999px',
          padding: '12px 30px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 102, 255, 0.15)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px',
          textAlign: 'center',
        }}
      >
        {words.map((word, idx) => {
          const isSpoken = idx <= activeWordIdx;
          const isKey = currentItem.highlightWords?.some((hw) =>
            word.toLowerCase().includes(hw.toLowerCase().replace(/[^a-z0-9%]/g, ''))
          );

          let color = 'rgba(255, 255, 255, 0.55)';
          let textShadow = 'none';

          if (isSpoken) {
            if (isKey) {
              color = '#38BDF8';
              textShadow = '0 0 12px rgba(56, 189, 248, 0.7)';
            } else {
              color = '#FFFFFF';
            }
          }

          return (
            <span
              key={idx}
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontSize: '20px',
                fontWeight: isKey ? 800 : 500,
                color,
                textShadow,
                letterSpacing: '-0.2px',
                transition: 'color 0.1s ease',
                display: 'inline-block',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
