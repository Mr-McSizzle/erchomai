import { useEffect, useRef } from "react";
import { scrollStore } from "./scroll";

/**
 * Ambient Web Audio engine.
 * - Low-frequency resonant hum (two detuned sine oscillators + sub)
 * - Filtered white-noise "sweep" whose brightness/gain tracks scroll velocity
 * Starts only after the first user gesture (click / scroll / touch).
 */
export function useAmbientAudio(enabled = true) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    let ctx: AudioContext | null = null;
    let raf = 0;
    let noiseGain: GainNode | null = null;
    let noiseFilter: BiquadFilterNode | null = null;
    let humFilterRef: BiquadFilterNode | null = null;
    let droneGain: GainNode | null = null;
    let master: GainNode | null = null;
    let disposed = false;


    const start = () => {
      if (startedRef.current || disposed) return;
      startedRef.current = true;

      const AC: typeof AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      void ctx.resume();

      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 6);

      // --- Low resonant hum ---
      const humGain = ctx.createGain();
      humGain.gain.value = 0.09;
      const humFilter = ctx.createBiquadFilter();
      humFilter.type = "lowpass";
      humFilter.frequency.value = 220;
      humFilter.Q.value = 6;
      humGain.connect(humFilter).connect(master);

      [41.2, 41.9, 82.4].forEach((f, i) => {
        const osc = ctx!.createOscillator();
        osc.type = i === 2 ? "triangle" : "sine";
        osc.frequency.value = f;
        const g = ctx!.createGain();
        g.gain.value = i === 2 ? 0.25 : 1;
        osc.connect(g).connect(humGain);
        osc.start();
      });

      // Slow breathing LFO on the hum
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.07;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.045;
      lfo.connect(lfoGain).connect(humGain.gain);
      lfo.start();

      // --- Mechanical noise sweep tied to scroll velocity ---
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 320;
      noiseFilter.Q.value = 1.2;

      noiseGain = ctx.createGain();
      noiseGain.gain.value = 0;
      noise.connect(noiseFilter).connect(noiseGain).connect(master);
      noise.start();

      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!ctx || !noiseGain || !noiseFilter) return;
        const v = Math.min(1, Math.abs(scrollStore.velocity) * 14);
        const t = ctx.currentTime;
        noiseGain.gain.setTargetAtTime(v * 0.05, t, 0.25);
        noiseFilter.frequency.setTargetAtTime(280 + v * 2600, t, 0.35);
      };
      tick();
    };

    const opts = { passive: true } as AddEventListenerOptions;
    window.addEventListener("pointerdown", start, opts);
    window.addEventListener("wheel", start, opts);
    window.addEventListener("touchstart", start, opts);
    window.addEventListener("keydown", start, opts);
    window.addEventListener("scroll", start, opts);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("wheel", start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("scroll", start);
      if (ctx) {
        try {
          master?.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
          const c = ctx;
          setTimeout(() => void c.close().catch(() => {}), 500);
        } catch {
          /* noop */
        }
      }
    };
  }, [enabled]);
}
