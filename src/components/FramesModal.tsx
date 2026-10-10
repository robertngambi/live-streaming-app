import React from 'react';
import { Sparkles, X, Check, Lock } from 'lucide-react';
import { VIRTUAL_FRAMES } from '../data/constants';
import { StreamerItem, SubscriptionTier } from '../types';

interface FramesModalProps {
  streamer: StreamerItem;
  isOpen: boolean;
  onClose: () => void;
  onSelectFrame: (streamerId: string, frameId: number | null) => void;
  subscriptionTier: SubscriptionTier;
  onOpenSubscription: () => void;
}

export const FramesModal: React.FC<FramesModalProps> = ({
  streamer,
  isOpen,
  onClose,
  onSelectFrame,
  subscriptionTier,
  onOpenSubscription,
}) => {
  if (!isOpen) return null;

  const isPremium = subscriptionTier === 'premium';

  return (
    <div
      id="frames-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="frames-modal-container"
        className="w-full max-w-lg bg-[#1e232a] border border-[#374151] rounded-2xl p-5 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#303844]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">Virtual Video Frames</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  8 Frames
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Applying to: <span className="text-sky-400 font-medium">{streamer.customName}</span>
              </p>
            </div>
          </div>
          <button
            id="close-frames-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2b3340]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isPremium && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-indigo-500/15 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-200">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Virtual video frames are a <strong>Premium Package</strong> feature (8 frames + 7 multi-cams).
              </span>
            </div>
            <button
              id="upgrade-to-premium-from-frames"
              onClick={() => {
                onClose();
                onOpenSubscription();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shrink-0 hover:brightness-110 shadow"
            >
              Unlock Now
            </button>
          </div>
        )}

        {/* Frames Grid (8 virtual video frames) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 overflow-y-auto pr-1">
          {/* None / Default Option */}
          <button
            id="frame-option-none"
            type="button"
            onClick={() => {
              onSelectFrame(streamer.id, null);
              onClose();
            }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all aspect-video ${
              streamer.frameId === null
                ? 'bg-sky-500/20 border-sky-400 text-sky-200 ring-2 ring-sky-500/50'
                : 'bg-[#14181f] border-[#303947] text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold">Standard Frame</div>
            <div className="text-[10px] text-slate-500 mt-0.5">No Overlay</div>
            {streamer.frameId === null && (
              <span className="mt-1 flex items-center gap-1 text-[10px] text-sky-400 font-medium">
                <Check className="w-3 h-3" /> Active
              </span>
            )}
          </button>

          {/* 8 Virtual Video Frames */}
          {VIRTUAL_FRAMES.map((frame) => {
            const isSelected = streamer.frameId === frame.id;
            return (
              <button
                key={frame.id}
                id={`frame-option-${frame.id}`}
                type="button"
                onClick={() => {
                  if (!isPremium) {
                    onClose();
                    onOpenSubscription();
                    return;
                  }
                  onSelectFrame(streamer.id, frame.id);
                  onClose();
                }}
                className={`relative flex flex-col justify-between p-2.5 rounded-xl border text-left transition-all aspect-video overflow-hidden group ${
                  isSelected
                    ? 'border-sky-400 ring-2 ring-sky-500/50 bg-[#1c232f]'
                    : 'bg-[#14181f] border-[#303947] hover:border-slate-400'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 15px ${frame.color}40` : undefined,
                }}
              >
                {/* Visual decorative border simulation */}
                <div
                  className="absolute inset-1 rounded-lg border pointer-events-none transition-transform group-hover:scale-95"
                  style={{
                    borderColor: frame.color,
                    borderWidth: frame.id === 3 ? '3px' : frame.id === 2 ? '2.5px' : '2px',
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className="text-[9px] font-mono font-bold px-1 rounded uppercase tracking-wider"
                    style={{
                      backgroundColor: `${frame.color}25`,
                      color: frame.color,
                    }}
                  >
                    #{frame.id} {frame.tag}
                  </span>
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 text-sky-400" />
                  ) : !isPremium ? (
                    <Lock className="w-3 h-3 text-slate-500" />
                  ) : null}
                </div>

                <div className="relative z-10">
                  <div className="text-[11px] font-bold text-slate-100 truncate">
                    {frame.name}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">
                    {frame.badgeText}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-[#303844]">
          <button
            id="close-frames-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-[#2b3340] text-slate-300 hover:bg-[#364050] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
