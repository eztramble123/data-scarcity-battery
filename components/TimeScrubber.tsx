"use client";

import { useEffect, useRef } from "react";

type Props = {
  t: number;
  setT: (t: number) => void;
  intervalsCount: number;
  hour: number;
  playing: boolean;
  setPlaying: (p: boolean) => void;
};

const FPS = 12; // intervals per second when playing

export default function TimeScrubber({
  t,
  setT,
  intervalsCount,
  hour,
  playing,
  setPlaying,
}: Props) {
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = (now: number) => {
      if (!lastRef.current) lastRef.current = now;
      const dt = now - lastRef.current;
      const stepMs = 1000 / FPS;
      if (dt >= stepMs) {
        lastRef.current = now;
        const next = t + 1;
        if (next >= intervalsCount) {
          setPlaying(false);
          return;
        }
        setT(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastRef.current = 0;
    };
  }, [playing, t, intervalsCount, setPlaying, setT]);

  const hh = Math.floor(hour);
  const mm = Math.round((hour - hh) * 60);
  const stamp = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-4 w-full">
      <button
        onClick={() => {
          if (t >= intervalsCount - 1) setT(0);
          setPlaying(!playing);
        }}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-950 hover:bg-white transition-colors"
        aria-label={playing ? "pause" : "play"}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="1" width="3.5" height="12" />
            <rect x="8.5" y="1" width="3.5" height="12" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <polygon points="2,1 12,7 2,13" />
          </svg>
        )}
      </button>

      <div className="flex flex-col flex-1">
        <input
          type="range"
          min={0}
          max={intervalsCount - 1}
          step={1}
          value={t}
          onChange={(e) => {
            setT(Number(e.target.value));
            setPlaying(false);
          }}
          className="w-full accent-neutral-100"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 mt-1 font-mono">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:45</span>
        </div>
      </div>

      <div className="font-mono text-lg w-20 text-right">{stamp}</div>
    </div>
  );
}
