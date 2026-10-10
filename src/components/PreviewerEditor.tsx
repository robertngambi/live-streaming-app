import React, { useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Layers,
  Sparkles,
  Maximize2,
  Radio,
  Sliders,
  ShieldCheck,
  Disc,
} from 'lucide-react';
import { StreamerItem, AppSettings, CaptureMode } from '../types';
import { drawLiveStreamCanvas, renderVirtualFrameOverlay } from '../utils/mediaUtils';
import { VIRTUAL_FRAMES } from '../data/constants';

interface PreviewerEditorProps {
  activeStreamer: StreamerItem | undefined;
  settings: AppSettings;
  isRecording: boolean;
  captureMode: CaptureMode;
  recordingSeconds: number;
}

export const PreviewerEditor: React.FC<PreviewerEditorProps> = ({
  activeStreamer,
  settings,
  isRecording,
  captureMode,
  recordingSeconds,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioWaveCanvasRef = useRef<HTMLCanvasElement>(null);

  // Animate Main High Resolution Stream Preview
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    const fps = settings.videoFrameRate || 30;
    const interval = 1000 / fps;

    const render = (time: number) => {
      if (time - lastTime >= interval) {
        lastTime = time;
        const canvas = canvasRef.current;
        if (canvas && activeStreamer) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawLiveStreamCanvas(ctx, canvas.width, canvas.height, activeStreamer, time, true, fps);
            if (activeStreamer.frameId) {
              renderVirtualFrameOverlay(activeStreamer.frameId, canvas.width, canvas.height, ctx);
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeStreamer, settings.videoFrameRate]);

  // Real-time animated Audio Sound Bar equalizer (dynamic changing sound bars depending on sound gain & harmonics)
  useEffect(() => {
    let animationId: number;
    const canvas = audioWaveCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numBars = 54;
    const peakHold = new Array(numBars).fill(0);
    const peakDecay = new Array(numBars).fill(0);
    let lastTime = performance.now();

    const renderBars = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const width = canvas.width;
      const height = canvas.height;
      const audioGain = activeStreamer ? activeStreamer.audioLevel / 100 : 0.05;

      ctx.clearRect(0, 0, width, height);

      // Dark studio background
      ctx.fillStyle = '#0c0f14';
      ctx.fillRect(0, 0, width, height);

      // Subtle horizontal level grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1;
      [0.2, 0.45, 0.7].forEach((ratio) => {
        const yLine = height * ratio;
        ctx.beginPath();
        ctx.moveTo(0, yLine);
        ctx.lineTo(width, yLine);
        ctx.stroke();
      });

      const barPadding = 2;
      const barWidth = Math.max(3, (width - (numBars + 1) * barPadding) / numBars);
      const totalBandWidth = numBars * (barWidth + barPadding);
      const startX = (width - totalBandWidth) / 2 + barPadding;

      const timeSec = currentTime / 1000;

      for (let i = 0; i < numBars; i++) {
        const x = startX + i * (barWidth + barPadding);

        // Vocal frequency profile and wave simulation
        const centerDist = Math.abs(i - numBars * 0.35) / (numBars * 0.35);
        const harmonic1 = Math.sin(timeSec * 7.5 + i * 0.4);
        const harmonic2 = Math.cos(timeSec * 13.0 + i * 0.75);
        const harmonic3 = Math.sin(timeSec * 3.2 + i * 0.18);
        const beatPulse = Math.pow(Math.max(0, Math.sin(timeSec * 3.8)), 3) * (i < 18 ? 0.55 : 0.15);

        const rawIntensity =
          (Math.abs(harmonic1 * 0.45 + harmonic2 * 0.35 + harmonic3 * 0.2) + beatPulse) *
          Math.max(0.2, 1 - centerDist * 0.35);

        const scaledLevel = Math.min(1, Math.max(0.04, rawIntensity * audioGain * 1.3));
        const barHeight = Math.max(2, scaledLevel * (height - 6));

        // Peak hold decay
        if (barHeight > peakHold[i]) {
          peakHold[i] = barHeight;
          peakDecay[i] = 0;
        } else {
          peakDecay[i] += delta * 45;
          peakHold[i] = Math.max(barHeight, peakHold[i] - peakDecay[i] * delta);
        }

        // Segmented LED blocks
        const numSegments = 14;
        const segmentHeight = (height - 6) / numSegments;
        const activeSegments = Math.round(scaledLevel * numSegments);

        for (let s = 0; s < numSegments; s++) {
          const segY = height - 3 - (s + 1) * segmentHeight;
          const isActive = s < activeSegments;

          if (isActive) {
            if (s >= 11) {
              ctx.fillStyle = '#ef4444'; // Red peak
            } else if (s >= 8) {
              ctx.fillStyle = '#f59e0b'; // Amber / Yellow
            } else if (s >= 4) {
              ctx.fillStyle = '#22c55e'; // Green
            } else {
              ctx.fillStyle = '#10b981'; // Emerald
            }
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          }

          ctx.fillRect(x, segY + 1, barWidth, segmentHeight - 1.5);
        }

        // Peak hold floating cap
        if (peakHold[i] > 3) {
          const peakY = height - 3 - peakHold[i];
          ctx.fillStyle = peakHold[i] > height * 0.75 ? '#f87171' : '#fef08a';
          ctx.fillRect(x, Math.max(1, peakY - 2), barWidth, 2);
        }
      }

      animationId = requestAnimationFrame(renderBars);
    };

    animationId = requestAnimationFrame(renderBars);
    return () => cancelAnimationFrame(animationId);
  }, [activeStreamer]);

  const activeFrameData = activeStreamer?.frameId
    ? VIRTUAL_FRAMES.find((f) => f.id === activeStreamer.frameId)
    : null;

  return (
    <div
      id="previewer-audio-combined-container"
      className="w-full mx-0 px-0 flex flex-col bg-[#1a1f29] border-y border-[#2d3644] rounded-none select-none shrink-0 shadow-xl"
    >
      {/* Editor Header / Status Strip inside the dark container */}
      <div className="flex items-center justify-between py-1.5 px-3 bg-[#141820] border-b border-[#252c38] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            Video Editing Previewer
          </span>
          {activeFrameData && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 uppercase rounded-none"
              style={{
                backgroundColor: `${activeFrameData.color}25`,
                color: activeFrameData.color,
                border: `1px solid ${activeFrameData.color}40`,
              }}
            >
              {activeFrameData.name} Frame
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span className="px-1.5 py-0.5 bg-[#202733] text-slate-300 rounded-none border border-[#2d3644]">
            {settings.videoQuality} • {settings.videoFrameRate}fps • {settings.videoOutputFormat}
          </span>
        </div>
      </div>

      {/* Main Video (Pre)viewer Screen - 16:9 full aspect ratio, sharp corners (rounded-none), zero clipping */}
      <div
        id="main-previewer-frame-container"
        className="relative w-full aspect-video sm:aspect-[16/9] bg-black overflow-hidden rounded-none flex items-center justify-center min-h-[190px] max-h-[58vh]"
      >
        {activeStreamer ? (
          <>
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-full object-contain block rounded-none"
            />

            {/* Overlaid Live Studio Watermark / Status */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-2 pointer-events-none">
              <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-none border border-white/15 flex items-center gap-2 text-white shadow-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[11px] font-bold font-mono tracking-wide">
                  LIVE MIX • {activeStreamer.customName}
                </span>
              </div>
              {isRecording && (
                <div className="bg-red-600/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-none flex items-center gap-1 animate-pulse border border-red-400/40">
                  <Disc className="w-3 h-3 animate-spin" />
                  REC ACTIVE
                </div>
              )}
            </div>

            {/* Audio Source Pill */}
            <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2 py-1 rounded-none border border-white/15 text-white text-[10px] flex items-center gap-1.5 pointer-events-none shadow-lg">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Master:</span>
              <span className="font-semibold text-emerald-400 font-mono">
                {activeStreamer.audioLevel}% (+{Math.round((activeStreamer.audioLevel - 60) * 0.4)}dB)
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-6 text-slate-400">
            <Radio className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-pulse" />
            <p className="text-xs font-semibold">No Streamer Selected</p>
            <p className="text-[10px] text-slate-500 mt-1">
              Click on any imported camera above to preview & mix
            </p>
          </div>
        )}
      </div>

      {/* Audio / Sound Band directly on the bottom in the SAME container */}
      <div
        id="audio-sound-bar-container"
        className="w-full bg-[#11151c] border-t border-[#252c38] px-3 py-2 rounded-none flex flex-col gap-1"
      >
        <div className="flex items-center justify-between text-[11px] text-slate-300 px-1">
          <div className="flex items-center gap-2 font-semibold">
            <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Audio Sound Bars (Live VU Equalizer)</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-slate-400">CH 1/2</span>
            <span className="text-emerald-400 font-bold">
              {activeStreamer ? `${activeStreamer.audioLevel}% GAIN` : 'MUTED'}
            </span>
          </div>
        </div>

        {/* Dynamic Canvas Sound Bar Flow */}
        <canvas
          ref={audioWaveCanvasRef}
          width={640}
          height={36}
          className="w-full h-8 rounded-none block"
        />

        {/* Frequency scale ticks beneath the sound bars */}
        <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono px-1 select-none">
          <span>20Hz</span>
          <span>100Hz</span>
          <span>500Hz</span>
          <span>1kHz</span>
          <span>4kHz</span>
          <span>10kHz</span>
          <span>20kHz</span>
        </div>
      </div>
    </div>
  );
};
