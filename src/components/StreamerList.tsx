import React from 'react';
import { Plus, Radio, Sparkles, Video, AlertCircle } from 'lucide-react';
import { StreamerItem, SubscriptionTier } from '../types';
import { StreamerCard } from './StreamerCard';

interface StreamerListProps {
  streamers: StreamerItem[];
  activeStreamerId: string;
  onSelectStreamer: (streamerId: string) => void;
  onOpenAddCamera: () => void;
  onChangeCamera: (streamer: StreamerItem) => void;
  onOpenAudio: (streamer: StreamerItem) => void;
  onOpenRename: (streamer: StreamerItem) => void;
  onRemoveStreamer: (streamerId: string) => void;
  onOpenFrames: (streamer: StreamerItem) => void;
  subscriptionTier: SubscriptionTier;
  fps: number;
}

export const StreamerList: React.FC<StreamerListProps> = ({
  streamers,
  activeStreamerId,
  onSelectStreamer,
  onOpenAddCamera,
  onChangeCamera,
  onOpenAudio,
  onOpenRename,
  onRemoveStreamer,
  onOpenFrames,
  subscriptionTier,
  fps,
}) => {
  // Max cameras allowed based on tier:
  // Trial: 4 (2 external + 2 phone)
  // Basic: 5 (3 external + 2 phone)
  // Premium: 8 (6 external + 2 phone)
  const maxCameras =
    subscriptionTier === 'premium' ? 8 : subscriptionTier === 'basic' ? 5 : 4;
  const canAddMore = streamers.length < maxCameras;

  return (
    <div id="streamers-section" className="w-full py-2.5 px-3 select-none relative z-20">
      {/* Left aligned note on top and active camera counter on right */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
          <h2
            id="start-streaming-live-note"
            className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200"
          >
            Start streaming live
          </h2>
        </div>

        {/* Right side: '2/4 cameras are active' - borderless, blue color */}
        <div
          id="active-cameras-status-pill"
          className="text-[11px] font-mono font-semibold text-blue-500 dark:text-blue-400 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>
            {streamers.length}/{maxCameras} cameras are active
          </span>
        </div>
      </div>

      {/* Camera Streamers Row & Placeholder with '+' Symbol */}
      <div
        id="streamers-horizontal-scroll"
        className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 px-0.5 scrollbar-thin scrollbar-thumb-slate-400/40"
      >
        {/* Placeholder frame with big '+' symbol (comes in front / next slot until limit reaches) */}
        {canAddMore && (
          <button
            id="add-camera-placeholder-frame"
            type="button"
            onClick={onOpenAddCamera}
            className="relative rounded-none aspect-video flex-shrink-0 w-44 sm:w-52 md:w-56 border-2 border-dashed border-slate-400/70 hover:border-blue-500 bg-slate-200/50 dark:bg-[#181d26]/70 hover:bg-blue-500/10 dark:hover:bg-blue-900/20 transition-all flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 group shadow-sm"
            title="Import Available Camera"
            aria-label="Add camera streamer"
          >
            {/* Big '+' symbol in the middle */}
            <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-[#28303d] group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-semibold mt-2 group-hover:text-blue-500 transition-colors">
              Add Camera Feed
            </span>
            <span className="text-[9px] text-slate-500">
              USB • BT • Wi-Fi • Phone
            </span>
          </button>
        )}

        {/* List of active camera streamers */}
        {streamers.map((streamer) => (
          <StreamerCard
            key={streamer.id}
            streamer={streamer}
            isActive={streamer.id === activeStreamerId}
            onSelect={() => onSelectStreamer(streamer.id)}
            onChangeCamera={onChangeCamera}
            onOpenAudio={onOpenAudio}
            onOpenRename={onOpenRename}
            onRemove={onRemoveStreamer}
            onOpenFrames={onOpenFrames}
            subscriptionTier={subscriptionTier}
            fps={fps}
          />
        ))}

        {streamers.length === 0 && !canAddMore && (
          <div className="p-4 rounded-xl border border-dashed border-amber-400 bg-amber-500/10 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>No cameras imported. Click '+' to connect cameras.</span>
          </div>
        )}
      </div>
    </div>
  );
};
