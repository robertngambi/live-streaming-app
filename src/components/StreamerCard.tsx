import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  MoreVertical,
  Camera,
  Volume2,
  VolumeX,
  Edit3,
  Trash2,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';
import { StreamerItem, SubscriptionTier } from '../types';
import { drawLiveStreamCanvas, renderVirtualFrameOverlay } from '../utils/mediaUtils';

interface StreamerCardProps {
  streamer: StreamerItem;
  isActive: boolean;
  onSelect: () => void;
  onChangeCamera: (streamer: StreamerItem) => void;
  onOpenAudio: (streamer: StreamerItem) => void;
  onOpenRename: (streamer: StreamerItem) => void;
  onRemove: (streamerId: string) => void;
  onOpenFrames: (streamer: StreamerItem) => void;
  subscriptionTier: SubscriptionTier;
  fps: number;
}

export const StreamerCard: React.FC<StreamerCardProps> = memo(({
  streamer,
  isActive,
  onSelect,
  onChangeCamera,
  onOpenAudio,
  onOpenRename,
  onRemove,
  onOpenFrames,
  subscriptionTier,
  fps,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Render live simulated canvas stream
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    const interval = 1000 / fps;

    const render = (time: number) => {
      if (time - lastTime >= interval) {
        lastTime = time;
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawLiveStreamCanvas(ctx, canvas.width, canvas.height, streamer, time, false, fps);
            if (streamer.frameId) {
              renderVirtualFrameOverlay(streamer.frameId, canvas.width, canvas.height, ctx);
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [streamer, fps]);

  // Handle outside click & auto-close on scroll/resize for portaled streamer dropdown
  useEffect(() => {
    if (!showMenu) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }

    const handleWindowChange = () => {
      setShowMenu(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
    };
  }, [showMenu]);

  // Toggle dropdown and compute exact portal viewport coordinates
  const handleToggleMenu = useCallback(
    (e: React.MouseEvent | React.PointerEvent) => {
      e.stopPropagation();
      if (!showMenu && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const menuWidth = 208;
        let left = rect.right - menuWidth;
        let top = rect.bottom + 6;

        // Boundary checks
        if (left < 10) left = 10;
        if (left + menuWidth > window.innerWidth - 10) {
          left = window.innerWidth - menuWidth - 10;
        }

        // Flip above button if not enough space at bottom of screen
        if (top + 230 > window.innerHeight && rect.top > 230) {
          top = rect.top - 225;
        }

        setMenuPosition({ top, left });
        setShowMenu(true);
      } else {
        setShowMenu(false);
      }
    },
    [showMenu]
  );

  const isPremium = subscriptionTier === 'premium';

  // Fast selection handler
  const handleCardClick = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    onSelect();
  }, [onSelect]);

  return (
    <div
      id={`streamer-card-${streamer.id}`}
      onClick={handleCardClick}
      onPointerDown={handleCardClick}
      role="button"
      tabIndex={0}
      className={`relative rounded-none cursor-pointer transition-all duration-150 aspect-video flex-shrink-0 w-44 sm:w-52 md:w-56 bg-[#12161e] select-none touch-manipulation active:scale-[0.98] ${
        showMenu
          ? 'border-4 border-sky-400 ring-4 ring-sky-500/50 shadow-2xl z-30'
          : isActive
          ? 'border-4 border-blue-500 ring-4 ring-blue-500/40 shadow-xl shadow-blue-500/20 scale-[1.02] z-10'
          : 'border-2 border-[#303846] hover:border-slate-400 opacity-90 hover:opacity-100 z-0'
      }`}
    >
      {/* Live Stream Canvas */}
      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        className="w-full h-full object-cover block rounded-none pointer-events-none"
      />

      {/* Active Streamer Indicator Badge */}
      {isActive && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-none shadow-md animate-pulse pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          ACTIVE STREAM
        </div>
      )}

      {/* Top right: streamer options button */}
      <div
        className="absolute top-1.5 right-1.5 z-20"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          ref={buttonRef}
          id={`streamer-menu-button-${streamer.id}`}
          type="button"
          onClick={handleToggleMenu}
          className={`p-1 rounded-lg backdrop-blur-sm border transition-all ${
            showMenu
              ? 'bg-sky-600 text-white border-sky-400 shadow-md ring-2 ring-sky-400/50'
              : 'bg-black/60 hover:bg-black/80 text-white border-white/10'
          }`}
          title="Camera Streamer Menu"
          aria-label="Streamer options"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Portaled streamer menu: brought completely to FRONT of viewer editor & unclipped */}
      {showMenu &&
        menuPosition &&
        createPortal(
          <>
            {/* Transparent backdrop to catch clicks outside and dismiss menu */}
            <div
              className="fixed inset-0 z-[9998] bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
            />

            {/* Elevated, floating dropdown menu in front of everything */}
            <div
              ref={menuRef}
              id={`streamer-dropdown-${streamer.id}`}
              style={{
                position: 'fixed',
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
                zIndex: 9999,
              }}
              className="w-52 bg-[#1b212b] border border-[#3e4857] rounded-xl shadow-2xl p-1.5 text-slate-100 text-xs font-medium animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/50"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Header label in menu */}
              <div className="px-2.5 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#2d3746] mb-1 truncate">
                {streamer.customName}
              </div>

              {/* 'Change Camera' button */}
              <button
                id={`change-camera-btn-${streamer.id}`}
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onChangeCamera(streamer);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-[#2b3340] text-slate-200 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-sky-400" />
                <span>Change Camera</span>
              </button>

              {/* 'Audio' button */}
              <button
                id={`audio-settings-btn-${streamer.id}`}
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onOpenAudio(streamer);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#2b3340] text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audio</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-1 rounded">
                  {streamer.audioLevel}%
                </span>
              </button>

              {/* 'Rename' button */}
              <button
                id={`rename-streamer-btn-${streamer.id}`}
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onOpenRename(streamer);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-[#2b3340] text-slate-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Rename</span>
              </button>

              {/* 'Frames' button (Premium feature or upgrade preview) */}
              <button
                id={`frames-btn-${streamer.id}`}
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onOpenFrames(streamer);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#2b3340] text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Frames</span>
                </div>
                {isPremium ? (
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1 rounded">
                    8 PRO
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-400 bg-[#2d3542] px-1 rounded">
                    VIP
                  </span>
                )}
              </button>

              <div className="my-1 border-t border-[#2e3745]" />

              {/* 'Remove' button */}
              <button
                id={`remove-streamer-btn-${streamer.id}`}
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onRemove(streamer.id);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-red-500/20 text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Remove</span>
              </button>
            </div>
          </>,
          document.body
        )}

      {/* Bottom info bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-semibold text-white truncate max-w-[120px]">
            {streamer.customName}
          </span>
        </div>
        <div className="text-[9px] text-slate-300 font-mono bg-black/40 px-1 rounded">
          {streamer.audioLevel}% VOL
        </div>
      </div>
    </div>
  );
});
