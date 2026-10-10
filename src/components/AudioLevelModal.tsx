import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, X, Check } from 'lucide-react';
import { StreamerItem } from '../types';

interface AudioLevelModalProps {
  streamer: StreamerItem;
  isOpen: boolean;
  onClose: () => void;
  onSaveAudioLevel: (streamerId: string, level: number) => void;
}

export const AudioLevelModal: React.FC<AudioLevelModalProps> = ({
  streamer,
  isOpen,
  onClose,
  onSaveAudioLevel,
}) => {
  const [level, setLevel] = useState<number>(streamer.audioLevel);

  if (!isOpen) return null;

  const isAmplified = level > 60;
  const isMuted = level === 0;

  return (
    <div
      id="audio-level-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="audio-level-modal-container"
        className="w-full max-w-sm bg-[#1e232a] border border-[#374151] rounded-2xl p-5 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#303844]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Audio Input Settings</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                {streamer.customName}
              </p>
            </div>
          </div>
          <button
            id="close-audio-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2b3340]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audio vertical change bar */}
        <div className="py-6 flex flex-col items-center">
          <div className="text-center mb-4">
            <div className="text-3xl font-black font-mono tracking-tight text-sky-400">
              {level}%
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-0.5">
              {level === 60 ? (
                <span className="text-emerald-400 font-medium">Default Normal Level (60%)</span>
              ) : isAmplified ? (
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Audio Amplified (+{Math.round((level - 60) * 0.4)}dB Boost)
                </span>
              ) : (
                <span>Attenuated Level</span>
              )}
            </div>
          </div>

          {/* Vertical Slider Bar (0 to 100%) */}
          <div className="relative flex items-center justify-center h-52 w-28 bg-[#14181f] rounded-2xl p-4 border border-[#2b3340] shadow-inner">
            {/* Tick marks on left side */}
            <div className="absolute left-3 top-4 bottom-4 flex flex-col justify-between text-[9px] font-mono text-slate-500 select-none">
              <span>100% (Boost)</span>
              <span>80%</span>
              <span className="text-emerald-400 font-bold">60% (Norm)</span>
              <span>40%</span>
              <span>20%</span>
              <span>0%</span>
            </div>

            {/* Custom Vertical Slider */}
            <input
              id="audio-level-vertical-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value, 10))}
              className="h-44 w-12 appearance-none bg-transparent cursor-pointer [writing-mode:vertical-lr] [direction:rtl] accent-sky-500"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              id="preset-mute-button"
              type="button"
              onClick={() => setLevel(0)}
              className={`px-2.5 py-1 rounded text-xs border ${
                level === 0
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-[#28303d] text-slate-300 border-[#394454] hover:bg-[#323d4e]'
              }`}
            >
              Mute (0%)
            </button>
            <button
              id="preset-normal-button"
              type="button"
              onClick={() => setLevel(60)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                level === 60
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#28303d] text-slate-300 border-[#394454] hover:bg-[#323d4e]'
              }`}
            >
              Default (60%)
            </button>
            <button
              id="preset-boost-button"
              type="button"
              onClick={() => setLevel(100)}
              className={`px-2.5 py-1 rounded text-xs border ${
                level === 100
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#28303d] text-slate-300 border-[#394454] hover:bg-[#323d4e]'
              }`}
            >
              Max Amplified (100%)
            </button>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#303844]">
          <button
            id="cancel-audio-level-button"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-[#2b3340] text-slate-300 hover:bg-[#364050] transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-audio-level-button"
            type="button"
            onClick={() => {
              onSaveAudioLevel(streamer.id, level);
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Check className="w-3.5 h-3.5" />
            Apply Audio Level
          </button>
        </div>
      </div>
    </div>
  );
};
