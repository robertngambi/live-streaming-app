import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RotateCw,
  MoreVertical,
  Video,
  Image as ImageIcon,
  Settings,
  Info,
  Sparkles,
  FolderTree,
  Check,
  Zap,
} from 'lucide-react';
import { CaptureMode, SubscriptionTier } from '../types';

interface HeaderBarProps {
  appName: string;
  captureMode: CaptureMode;
  onSetCaptureMode: (mode: CaptureMode) => void;
  isRotated: boolean;
  onToggleRotate: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenSubscription: () => void;
  onOpenFileManager: () => void;
  subscriptionTier: SubscriptionTier;
  trialDaysLeft: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  appName,
  captureMode,
  onSetCaptureMode,
  isRotated,
  onToggleRotate,
  onOpenSettings,
  onOpenAbout,
  onOpenSubscription,
  onOpenFileManager,
  subscriptionTier,
  trialDaysLeft,
}) => {
  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const cameraMenuRef = useRef<HTMLDivElement>(null);
  const mainMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cameraMenuRef.current &&
        !cameraMenuRef.current.contains(event.target as Node)
      ) {
        setShowCameraMenu(false);
      }
      if (
        mainMenuRef.current &&
        !mainMenuRef.current.contains(event.target as Node)
      ) {
        setShowMainMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="app-header-bar"
      className="w-full bg-[#1e232a] border-b border-[#333a45] text-slate-100 px-3 py-2 flex items-center justify-between shadow-md relative z-40 select-none"
      style={{
        background: 'linear-gradient(180deg, #282f39 0%, #1a1e26 100%)',
      }}
    >
      {/* Left: Brand name */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-inner border border-white/10">
          <Video className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-slate-100 font-mono">
            {appName}
          </h1>
          <p className="text-[10px] text-slate-400 -mt-0.5">
            Multi-Camera Studio
          </p>
        </div>
      </div>

      {/* Right controls: Camera Settings Button, Rotate Button, Main Dropdown Menu */}
      <div className="flex items-center gap-1.5">
        {/* Tier status indicator pill */}
        <button
          id="tier-badge-button"
          onClick={onOpenSubscription}
          className="hidden sm:flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-[#2b3340] border border-[#404b5c] text-amber-300 hover:bg-[#343e4e] transition-colors"
          title="Manage Subscription"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="capitalize font-medium">
            {subscriptionTier === 'trial' ? `Trial (${trialDaysLeft}d)` : subscriptionTier}
          </span>
        </button>

        {/* Camera Setting Button */}
        <div className="relative" ref={cameraMenuRef}>
          <button
            id="camera-settings-button"
            onClick={() => {
              setShowCameraMenu(!showCameraMenu);
              setShowMainMenu(false);
            }}
            className={`p-2 rounded-lg transition-all flex items-center gap-1 border ${
              showCameraMenu
                ? 'bg-sky-600 text-white border-sky-400'
                : 'bg-[#2b3340] text-slate-200 border-[#404b5c] hover:bg-[#374253]'
            }`}
            title="Camera Mode Settings"
            aria-label="Camera Settings"
          >
            <Camera className="w-4 h-4" />
            <span className="text-xs font-medium hidden md:inline">Mode</span>
          </button>

          {/* Camera Setting Checklist Popup */}
          {showCameraMenu && (
            <div
              id="camera-setting-dropdown"
              className="absolute right-0 top-full mt-2 w-56 bg-[#212732] border border-[#3f4a5c] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase text-slate-400 border-b border-[#323b49] mb-1">
                Camera Capture Mode
              </div>

              {/* 'Live photo' button */}
              <button
                id="live-photo-mode-button"
                onClick={() => {
                  onSetCaptureMode('photo');
                  setShowCameraMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                  captureMode === 'photo'
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-[#2b3340]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold">Live photo</div>
                    <div className="text-[10px] text-slate-400">Capture stills from all cameras</div>
                  </div>
                </div>
                {captureMode === 'photo' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* 'Live streaming' button */}
              <button
                id="live-streaming-mode-button"
                onClick={() => {
                  onSetCaptureMode('video');
                  setShowCameraMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors mt-1 ${
                  captureMode === 'video'
                    ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40'
                    : 'text-slate-300 hover:bg-[#2b3340]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-sky-400" />
                  <div>
                    <div className="font-semibold">Live streaming</div>
                    <div className="text-[10px] text-slate-400">Capture & combine live video streams</div>
                  </div>
                </div>
                {captureMode === 'video' && <Check className="w-4 h-4 text-sky-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Rotate Button (Cycling arrows) */}
        <button
          id="rotate-screen-button"
          onClick={onToggleRotate}
          className={`p-2 rounded-lg transition-all flex items-center gap-1 border ${
            isRotated
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-400/50'
              : 'bg-[#2b3340] text-slate-200 border-[#404b5c] hover:bg-[#374253]'
          }`}
          title={isRotated ? 'Unrotate Screen' : 'Rotate Screen'}
          aria-label="Rotate screen display"
        >
          <RotateCw className={`w-4 h-4 ${isRotated ? 'animate-spin-once' : ''}`} />
          <span className="text-xs font-medium">
            {isRotated ? 'Unrotate' : 'Rotate'}
          </span>
        </button>


        {/* Main Drop-down Menu Button */}
        <div className="relative" ref={mainMenuRef}>
          <button
            id="main-menu-dropdown-button"
            onClick={() => {
              setShowMainMenu(!showMainMenu);
              setShowCameraMenu(false);
            }}
            className={`p-2 rounded-lg transition-all border ${
              showMainMenu
                ? 'bg-indigo-600 text-white border-indigo-400'
                : 'bg-[#2b3340] text-slate-200 border-[#404b5c] hover:bg-[#374253]'
            }`}
            title="App Options"
            aria-label="Main menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Main Drop-down Menu Popup */}
          {showMainMenu && (
            <div
              id="main-menu-dropdown"
              className="absolute right-0 top-full mt-2 w-64 bg-[#212732] border border-[#3f4a5c] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase border-b border-[#323b49] mb-1 flex items-center justify-between">
                <span>Menu Options</span>
                <span className="text-[10px] text-sky-400 font-mono">v2.4.0</span>
              </div>

              {/* 'Rotate' / 'Unrotate' button */}
              <button
                id="main-menu-rotate-button"
                onClick={() => {
                  onToggleRotate();
                  setShowMainMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#2b3340] transition-colors"
              >
                <RotateCw className={`w-4 h-4 ${isRotated ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{isRotated ? 'Unrotate' : 'Rotate'} Screen View</span>
              </button>

              {/* 'Set cameras' button */}
              <button
                id="main-menu-set-cameras-button"
                onClick={() => {
                  setShowMainMenu(false);
                  setShowCameraMenu(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#2b3340] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Camera className="w-4 h-4 text-sky-400" />
                  <span>Set Cameras</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#323c4a] text-slate-300 capitalize">
                  {captureMode}
                </span>
              </button>

              {/* 'Settings' button */}
              <button
                id="main-menu-settings-button"
                onClick={() => {
                  onOpenSettings();
                  setShowMainMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#2b3340] transition-colors"
              >
                <Settings className="w-4 h-4 text-indigo-400" />
                <span>Settings</span>
              </button>

              {/* 'About the app' button */}
              <button
                id="main-menu-about-button"
                onClick={() => {
                  onOpenAbout();
                  setShowMainMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#2b3340] transition-colors"
              >
                <Info className="w-4 h-4 text-emerald-400" />
                <span>About the app</span>
              </button>

              <div className="my-1 border-t border-[#323b49]" />

              {/* 'Live streamer output' folder explorer */}
              <button
                id="main-menu-folder-button"
                onClick={() => {
                  onOpenFileManager();
                  setShowMainMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#2b3340] transition-colors"
              >
                <FolderTree className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div className="font-semibold">Live streamer output</div>
                  <div className="text-[10px] text-slate-400">View saved recordings & photos</div>
                </div>
              </button>

              {/* Subscription Plans */}
              <button
                id="main-menu-plans-button"
                onClick={() => {
                  onOpenSubscription();
                  setShowMainMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 text-amber-200 hover:bg-amber-500/20 transition-colors mt-1"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div className="font-semibold">Subscription Packages</div>
                  <div className="text-[10px] text-amber-300/80">
                    {subscriptionTier === 'premium'
                      ? 'Premium Active (7 Cams)'
                      : subscriptionTier === 'basic'
                      ? 'Basic Active (4 Cams)'
                      : `Free Trial (${trialDaysLeft} Days Remaining)`}
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
