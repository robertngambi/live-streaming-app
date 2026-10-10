import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Video,
  Volume2,
  HardDrive,
  RotateCcw,
  RefreshCw,
  X,
  Check,
  Smartphone,
  Wifi,
  Bluetooth,
  Usb,
  Mic,
  FolderTree,
  AlertCircle,
  Cloud,
  CloudUpload,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AppSettings, CameraDevice, AudioDevice } from '../types';
import { DEFAULT_APP_SETTINGS, STORAGE_INFO } from '../data/constants';
import { CloudAuthModal } from './CloudAuthModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  availableCameras: CameraDevice[];
  availableAudio: AudioDevice[];
  onRefreshResources: () => void;
  isRefreshing: boolean;
  subscriptionTier?: 'trial' | 'basic' | 'premium';
  onOpenSubscription?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  availableCameras,
  availableAudio,
  onRefreshResources,
  isRefreshing,
  subscriptionTier = 'trial',
  onOpenSubscription,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [cloudAuthTarget, setCloudAuthTarget] = useState<'google_drive' | 'dropbox' | null>(null);
  const [expandedVideoSetting, setExpandedVideoSetting] = useState<'fps' | 'format' | 'quality' | null>(null);

  const isPremium = subscriptionTier === 'premium';

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleCloudAuthSuccess = (service: 'google_drive' | 'dropbox', email: string) => {
    const updated: AppSettings = {
      ...localSettings,
      storageLocation: service,
      cloudSync: {
        ...localSettings.cloudSync,
        ...(service === 'google_drive'
          ? { googleDriveConnected: true, googleDriveEmail: email }
          : { dropboxConnected: true, dropboxEmail: email }),
      },
    };
    handleSaveAndClose(updated);
  };

  const handleDisconnectCloud = (service: 'google_drive' | 'dropbox') => {
    const updated: AppSettings = {
      ...localSettings,
      storageLocation: localSettings.storageLocation === service ? 'internal' : localSettings.storageLocation,
      cloudSync: {
        ...localSettings.cloudSync,
        ...(service === 'google_drive'
          ? { googleDriveConnected: false, googleDriveEmail: '' }
          : { dropboxConnected: false, dropboxEmail: '' }),
      },
    };
    handleSaveAndClose(updated);
  };

  // Check if any setting differs from default (for Reset button active state)
  const isSettingsModified =
    JSON.stringify(localSettings) !== JSON.stringify(DEFAULT_APP_SETTINGS);

  const handleSaveAndClose = (updated: AppSettings) => {
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleReset = () => {
    if (!isSettingsModified) return;
    const resetted = { ...DEFAULT_APP_SETTINGS };
    setLocalSettings(resetted);
    onUpdateSettings(resetted);
  };

  const fpsList: (15 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90)[] = [
    15, 20, 30, 40, 50, 60, 70, 80, 90,
  ];
  const formatList: ('MKV' | 'Mp4' | '3gp')[] = ['MKV', 'Mp4', '3gp'];
  const qualityList: ('240p' | '360p' | '480p' | '720p' | '1080p')[] = [
    '240p',
    '360p',
    '480p',
    '720p',
    '1080p',
  ];

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="settings-modal-box"
        className="w-full max-w-xl bg-[#1c222a] border border-[#374151] rounded-2xl text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2d3744] bg-[#212732]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Application Settings</h2>
              <p className="text-[11px] text-slate-400">Configure studio preferences & hardware</p>
            </div>
          </div>
          <button
            id="close-settings-modal-top"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2b3340]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1 text-xs">
          {/* 1. Background settings */}
          <section id="settings-background-section">
            <h3 className="font-bold text-slate-100 text-sm mb-1">
              Background settings
            </h3>
            <p className="text-[11px] text-slate-400 mb-2">
              Choose the interface display appearance mode
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Light mode button (defaulted) */}
              <button
                id="setting-theme-light-btn"
                type="button"
                onClick={() => {
                  const updated = { ...localSettings, themeMode: 'light' as const };
                  handleSaveAndClose(updated);
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                  localSettings.themeMode === 'light'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 shadow-sm'
                    : 'bg-[#151921] border-[#2c3543] text-slate-300 hover:border-slate-500'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-xs">Light mode</span>
                {localSettings.themeMode === 'light' && (
                  <Check className="w-3.5 h-3.5 text-amber-400 ml-1" />
                )}
              </button>

              {/* Dark mode button */}
              <button
                id="setting-theme-dark-btn"
                type="button"
                onClick={() => {
                  const updated = { ...localSettings, themeMode: 'dark' as const };
                  handleSaveAndClose(updated);
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                  localSettings.themeMode === 'dark'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 ring-2 ring-sky-400/40 shadow-sm'
                    : 'bg-[#151921] border-[#2c3543] text-slate-300 hover:border-slate-500'
                }`}
              >
                <Moon className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-xs">Dark mode</span>
                {localSettings.themeMode === 'dark' && (
                  <Check className="w-3.5 h-3.5 text-sky-400 ml-1" />
                )}
              </button>
            </div>
          </section>

          <hr className="border-[#2b3543]" />

          {/* 2. Video settings */}
          <section id="settings-video-section" className="space-y-4">
            <h3 className="font-bold text-slate-100 text-sm">Video settings</h3>

            {/* Video frame rate set */}
            <div id="setting-frame-rate-group" className="rounded-xl bg-[#151921] border border-[#2c3543] overflow-hidden">
              <button
                type="button"
                id="toggle-video-frame-rate-btn"
                onClick={() =>
                  setExpandedVideoSetting(
                    expandedVideoSetting === 'fps' ? null : 'fps'
                  )
                }
                className="w-full p-3 flex items-center justify-between text-left hover:bg-[#1a212d] transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-200">
                    Video frame rate set
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Set video frame rate (fps) of your video stream
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded-md">
                    {localSettings.videoFrameRate} fps
                  </span>
                  {expandedVideoSetting === 'fps' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Radio optional list: hidden by default, expandable with radio button on right side */}
              {expandedVideoSetting === 'fps' && (
                <div className="p-2 border-t border-[#26303e] bg-[#12161f] space-y-1 animate-in fade-in duration-100">
                  {fpsList.map((fps) => {
                    const isSelected = localSettings.videoFrameRate === fps;
                    return (
                      <button
                        key={fps}
                        id={`setting-fps-${fps}`}
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...localSettings,
                            videoFrameRate: fps,
                          };
                          handleSaveAndClose(updated);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                          isSelected
                            ? 'bg-sky-500/15 text-sky-300 font-semibold'
                            : 'text-slate-300 hover:bg-[#1c2330]'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-mono">
                          <span>{fps} fps</span>
                          {fps === 30 && (
                            <span className="text-[10px] text-slate-500 font-sans">
                              (Standard)
                            </span>
                          )}
                          {fps === 60 && (
                            <span className="text-[10px] text-emerald-400 font-sans">
                              (High Smoothness)
                            </span>
                          )}
                        </div>

                        {/* Radio button appearing on the right side */}
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-sky-400 bg-sky-500/20 ring-2 ring-sky-400/30'
                              : 'border-[#4b5563] bg-[#1a202c]'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-sky-400 shadow-sm" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Video format */}
            <div id="setting-video-format-group" className="rounded-xl bg-[#151921] border border-[#2c3543] overflow-hidden">
              <button
                type="button"
                id="toggle-video-format-btn"
                onClick={() =>
                  setExpandedVideoSetting(
                    expandedVideoSetting === 'format' ? null : 'format'
                  )
                }
                className="w-full p-3 flex items-center justify-between text-left hover:bg-[#1a212d] transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-200">
                    Video format
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Set the output format for your live stream video
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded-md">
                    {localSettings.videoOutputFormat}
                  </span>
                  {expandedVideoSetting === 'format' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Radio optional list: expandable with radio button on right side */}
              {expandedVideoSetting === 'format' && (
                <div className="p-2 border-t border-[#26303e] bg-[#12161f] space-y-1 animate-in fade-in duration-100">
                  {formatList.map((fmt) => {
                    const isSelected = localSettings.videoOutputFormat === fmt;
                    return (
                      <button
                        key={fmt}
                        id={`setting-format-${fmt.toLowerCase()}`}
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...localSettings,
                            videoOutputFormat: fmt,
                          };
                          handleSaveAndClose(updated);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                          isSelected
                            ? 'bg-sky-500/15 text-sky-300 font-semibold'
                            : 'text-slate-300 hover:bg-[#1c2330]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{fmt}</span>
                          {fmt === 'Mp4' && (
                            <span className="text-[10px] text-sky-400/80 font-sans">
                              (Default / Broad Compatibility)
                            </span>
                          )}
                          {fmt === 'MKV' && (
                            <span className="text-[10px] text-slate-400 font-sans">
                              (High Fault Tolerance)
                            </span>
                          )}
                          {fmt === '3gp' && (
                            <span className="text-[10px] text-slate-400 font-sans">
                              (Ultra Lightweight)
                            </span>
                          )}
                        </div>

                        {/* Radio button appearing on the right side */}
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-sky-400 bg-sky-500/20 ring-2 ring-sky-400/30'
                              : 'border-[#4b5563] bg-[#1a202c]'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-sky-400 shadow-sm" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Video quality */}
            <div id="setting-video-quality-group" className="rounded-xl bg-[#151921] border border-[#2c3543] overflow-hidden">
              <button
                type="button"
                id="toggle-video-quality-btn"
                onClick={() =>
                  setExpandedVideoSetting(
                    expandedVideoSetting === 'quality' ? null : 'quality'
                  )
                }
                className="w-full p-3 flex items-center justify-between text-left hover:bg-[#1a212d] transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-200">
                    Video quality
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Set the quality of your output video quality
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded-md">
                    {localSettings.videoQuality}
                  </span>
                  {expandedVideoSetting === 'quality' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Radio optional list: expandable with radio button on right side */}
              {expandedVideoSetting === 'quality' && (
                <div className="p-2 border-t border-[#26303e] bg-[#12161f] space-y-1 animate-in fade-in duration-100">
                  {qualityList.map((q) => {
                    const isSelected = localSettings.videoQuality === q;
                    return (
                      <button
                        key={q}
                        id={`setting-quality-${q}`}
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...localSettings,
                            videoQuality: q,
                          };
                          handleSaveAndClose(updated);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                          isSelected
                            ? 'bg-sky-500/15 text-sky-300 font-semibold'
                            : 'text-slate-300 hover:bg-[#1c2330]'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-mono">
                          <span>{q}</span>
                          {q === '1080p' && (
                            <span className="text-[10px] text-emerald-400 font-sans">
                              (Full HD 1920x1080)
                            </span>
                          )}
                          {q === '720p' && (
                            <span className="text-[10px] text-sky-400 font-sans">
                              (HD 1280x720)
                            </span>
                          )}
                          {q === '480p' && (
                            <span className="text-[10px] text-slate-400 font-sans">
                              (SD / Default)
                            </span>
                          )}
                        </div>

                        {/* Radio button appearing on the right side */}
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-sky-400 bg-sky-500/20 ring-2 ring-sky-400/30'
                              : 'border-[#4b5563] bg-[#1a202c]'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-sky-400 shadow-sm" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <hr className="border-[#2b3543]" />

          {/* 3. Audio settings */}
          <section id="settings-audio-section">
            <h3 className="font-bold text-slate-100 text-sm mb-1">
              Audio settings
            </h3>
            <p className="text-[11px] text-slate-400 mb-2.5">
              Choose audio file (source) for your live stream
            </p>

            <div className="space-y-2">
              {/* Option 1: 'From phone self-microphone' */}
              <button
                id="audio-source-phone-mic-btn"
                type="button"
                onClick={() => {
                  const updated = { ...localSettings, audioSource: 'phone_mic' as const };
                  handleSaveAndClose(updated);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  localSettings.audioSource === 'phone_mic'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                    : 'bg-[#151921] border-[#2c3543] text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-xs">From phone self-microphone</span>
                </div>
                {localSettings.audioSource === 'phone_mic' && (
                  <Check className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              {/* Option 2: 'From the current (edited) previewer source video' (as default) */}
              <button
                id="audio-source-previewer-btn"
                type="button"
                onClick={() => {
                  const updated = { ...localSettings, audioSource: 'previewer_video' as const };
                  handleSaveAndClose(updated);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  localSettings.audioSource === 'previewer_video'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                    : 'bg-[#151921] border-[#2c3543] text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4 text-sky-400" />
                  <div>
                    <span className="font-medium text-xs">
                      From the current (edited) previewer source video
                    </span>
                    <span className="text-[10px] text-sky-400/80 ml-2 font-mono">(Default)</span>
                  </div>
                </div>
                {localSettings.audioSource === 'previewer_video' && (
                  <Check className="w-4 h-4 text-sky-400" />
                )}
              </button>

              {/* Option 3: 'From external audio sources' */}
              <button
                id="audio-source-external-btn"
                type="button"
                onClick={() => {
                  const updated = { ...localSettings, audioSource: 'external_sources' as const };
                  handleSaveAndClose(updated);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  localSettings.audioSource === 'external_sources'
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                    : 'bg-[#151921] border-[#2c3543] text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-indigo-400" />
                  <span className="font-medium text-xs">From external audio sources</span>
                </div>
                {localSettings.audioSource === 'external_sources' && (
                  <Check className="w-4 h-4 text-indigo-400" />
                )}
              </button>

              {/* Expanded List of External Audio Sources if selected */}
              {localSettings.audioSource === 'external_sources' && (
                <div className="mt-2 pl-4 space-y-1.5 animate-in fade-in">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    Select External Microphone:
                  </div>
                  {availableAudio.map((mic) => {
                    const isSelected = localSettings.selectedExternalAudioId === mic.id;
                    return (
                      <button
                        key={mic.id}
                        id={`external-mic-select-${mic.id}`}
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...localSettings,
                            selectedExternalAudioId: mic.id,
                          };
                          handleSaveAndClose(updated);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs border ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 font-semibold'
                            : 'bg-[#181d26] border-[#2c3543] text-slate-300 hover:bg-[#202733]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Mic className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{mic.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <hr className="border-[#2b3543]" />

          {/* 4. Recording settings */}
          <section id="settings-recording-section">
            <h3 className="font-bold text-slate-100 text-sm mb-1">
              Recording settings
            </h3>
            <p className="text-[11px] text-slate-400 mb-2.5">
              Choose what to record (multi-select enabled)
            </p>

            <div className="space-y-2">
              {/* Option 1: 'Record video edit previewer output' (turned on in default) */}
              <label
                className="flex items-center justify-between p-3 rounded-xl bg-[#151921] border border-[#2c3543] cursor-pointer hover:border-slate-500"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    id="record-opt-previewer"
                    type="checkbox"
                    checked={localSettings.recordPreviewerOutput}
                    onChange={(e) => {
                      const updated = {
                        ...localSettings,
                        recordPreviewerOutput: e.target.checked,
                      };
                      handleSaveAndClose(updated);
                    }}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-[#1e232a] border-slate-600"
                  />
                  <div>
                    <span className="font-medium text-xs text-slate-200">
                      Record video edit previewer output
                    </span>
                    <span className="text-[10px] text-emerald-400 ml-2 font-mono">
                      (Default Saved to 'Edited Output')
                    </span>
                  </div>
                </div>
              </label>

              {/* Option 2: 'Record all cameras outputs' */}
              <label
                className="flex items-center justify-between p-3 rounded-xl bg-[#151921] border border-[#2c3543] cursor-pointer hover:border-slate-500"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    id="record-opt-all-cameras"
                    type="checkbox"
                    checked={localSettings.recordAllCameras}
                    onChange={(e) => {
                      const updated = {
                        ...localSettings,
                        recordAllCameras: e.target.checked,
                      };
                      handleSaveAndClose(updated);
                    }}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-[#1e232a] border-slate-600"
                  />
                  <div>
                    <span className="font-medium text-xs text-slate-200">
                      Record all cameras outputs
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      (Saves individual raw feeds to 'Streamer Output')
                    </span>
                  </div>
                </div>
              </label>

              {/* Option 3: 'Record audio file separately' */}
              <label
                className="flex items-center justify-between p-3 rounded-xl bg-[#151921] border border-[#2c3543] cursor-pointer hover:border-slate-500"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    id="record-opt-audio-separately"
                    type="checkbox"
                    checked={localSettings.recordAudioSeparately}
                    onChange={(e) => {
                      const updated = {
                        ...localSettings,
                        recordAudioSeparately: e.target.checked,
                      };
                      handleSaveAndClose(updated);
                    }}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-[#1e232a] border-slate-600"
                  />
                  <div>
                    <span className="font-medium text-xs text-slate-200">
                      Record audio file separately
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      (Saves master audio track to 'Audio Output')
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </section>

          <hr className="border-[#2b3543]" />

          {/* 5. Resources access */}
          <section id="settings-resources-section">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-100 text-sm">
                Resources access
              </h3>
              {/* 'Refresh' button on the right side */}
              <button
                id="refresh-resources-button"
                type="button"
                onClick={onRefreshResources}
                disabled={isRefreshing}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Scanning...' : 'Refresh'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Available input sources, make sure your USB is inserted properly, or your Bluetooth or Wi-Fi is turned on
            </p>

            {/* Subhead: Available Video sources */}
            <div className="mb-3">
              <div className="text-[11px] font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-sky-400" />
                <span>Available Video sources</span>
              </div>
              <div className="space-y-1.5">
                {availableCameras.map((cam) => (
                  <div
                    key={cam.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#151921] border border-[#2c3543] text-xs text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-medium">{cam.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {cam.resolution}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subhead: Available Audio resources */}
            <div>
              <div className="text-[11px] font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Available Audio resources</span>
              </div>
              <div className="space-y-1.5">
                {availableAudio.map((audio) => (
                  <div
                    key={audio.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#151921] border border-[#2c3543] text-xs text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-medium">{audio.name}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Ready (Gain {audio.gain}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <hr className="border-[#2b3543]" />

          {/* 6. Storage location & Cloud Services */}
          <section id="settings-storage-section" className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-100 text-sm">
                  Storage Location & Cloud Backup
                </h3>
                <span className="text-[10px] text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded font-mono">
                  Cloud Sync Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Select where recorded videos and captured photos are saved (Local or Cloud Services)
              </p>
            </div>

            {/* Storage Destinations Grid (4 destinations: Internal, External SD, Google Drive, Dropbox) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Internal storage */}
              <button
                id="select-storage-internal"
                type="button"
                onClick={() => {
                  const updated = { ...localSettings, storageLocation: 'internal' as const };
                  handleSaveAndClose(updated);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  localSettings.storageLocation === 'internal'
                    ? 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-500/40'
                    : 'bg-[#151921] border-[#2c3543] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-xs text-slate-100">
                      Internal Storage
                    </span>
                  </div>
                  {localSettings.storageLocation === 'internal' && (
                    <span className="text-[10px] font-bold text-sky-400 bg-sky-500/20 px-1.5 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 text-[11px] text-slate-300">
                  <div>
                    Free Space: <span className="font-mono font-bold text-emerald-400">{STORAGE_INFO.internal.freeSpace}</span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#27303d] mt-2 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${STORAGE_INFO.internal.usedPercentage}%` }}
                  />
                </div>
              </button>

              {/* Option 2: External storage */}
              <button
                id="select-storage-external"
                type="button"
                onClick={() => {
                  const updated = { ...localSettings, storageLocation: 'external' as const };
                  handleSaveAndClose(updated);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  localSettings.storageLocation === 'external'
                    ? 'bg-indigo-500/20 border-indigo-400 ring-2 ring-indigo-500/40'
                    : 'bg-[#151921] border-[#2c3543] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-xs text-slate-100">
                      External SD/USB
                    </span>
                  </div>
                  {localSettings.storageLocation === 'external' && (
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 text-[11px] text-slate-300">
                  <div>
                    Free Space: <span className="font-mono font-bold text-emerald-400">{STORAGE_INFO.external.freeSpace}</span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#27303d] mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${STORAGE_INFO.external.usedPercentage}%` }}
                  />
                </div>
              </button>

              {/* Option 3: Google Drive Cloud */}
              <button
                id="select-storage-google-drive"
                type="button"
                onClick={() => {
                  if (!isPremium) {
                    if (onOpenSubscription) {
                      onClose();
                      onOpenSubscription();
                    }
                    return;
                  }
                  if (!localSettings.cloudSync.googleDriveConnected) {
                    setCloudAuthTarget('google_drive');
                  } else {
                    const updated = { ...localSettings, storageLocation: 'google_drive' as const };
                    handleSaveAndClose(updated);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  localSettings.storageLocation === 'google_drive'
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-500/40'
                    : 'bg-[#151921] border-[#2c3543] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs text-slate-100">
                      Google Drive
                    </span>
                  </div>
                  {!isPremium ? (
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                      ★ Premium Only
                    </span>
                  ) : localSettings.storageLocation === 'google_drive' ? (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                      Selected
                    </span>
                  ) : localSettings.cloudSync.googleDriveConnected ? (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-1 rounded flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Linked
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-[#252d38] px-1 rounded">
                      Tap to Connect
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 text-[11px] text-slate-300">
                  {!isPremium ? (
                    <div className="text-amber-400/90 font-medium">Upgrade to Premium to enable cloud backup</div>
                  ) : localSettings.cloudSync.googleDriveConnected ? (
                    <div className="truncate text-slate-300">
                      Acc: <span className="font-mono text-amber-300">{localSettings.cloudSync.googleDriveEmail}</span>
                    </div>
                  ) : (
                    <div className="text-slate-400">Sign in to sync /Live streamer output/</div>
                  )}
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#27303d] mt-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${STORAGE_INFO.google_drive.usedPercentage}%` }}
                  />
                </div>
              </button>

              {/* Option 4: Dropbox Cloud */}
              <button
                id="select-storage-dropbox"
                type="button"
                onClick={() => {
                  if (!isPremium) {
                    if (onOpenSubscription) {
                      onClose();
                      onOpenSubscription();
                    }
                    return;
                  }
                  if (!localSettings.cloudSync.dropboxConnected) {
                    setCloudAuthTarget('dropbox');
                  } else {
                    const updated = { ...localSettings, storageLocation: 'dropbox' as const };
                    handleSaveAndClose(updated);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  localSettings.storageLocation === 'dropbox'
                    ? 'bg-blue-500/20 border-blue-400 ring-2 ring-blue-500/40'
                    : 'bg-[#151921] border-[#2c3543] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-xs text-slate-100">
                      Dropbox
                    </span>
                  </div>
                  {!isPremium ? (
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                      ★ Premium Only
                    </span>
                  ) : localSettings.storageLocation === 'dropbox' ? (
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded">
                      Selected
                    </span>
                  ) : localSettings.cloudSync.dropboxConnected ? (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-1 rounded flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Linked
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-[#252d38] px-1 rounded">
                      Tap to Connect
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 text-[11px] text-slate-300">
                  {!isPremium ? (
                    <div className="text-amber-400/90 font-medium">Upgrade to Premium to enable cloud backup</div>
                  ) : localSettings.cloudSync.dropboxConnected ? (
                    <div className="truncate text-slate-300">
                      Acc: <span className="font-mono text-blue-300">{localSettings.cloudSync.dropboxEmail}</span>
                    </div>
                  ) : (
                    <div className="text-slate-400">Sign in to sync /Live streamer output/</div>
                  )}
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#27303d] mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${STORAGE_INFO.dropbox.usedPercentage}%` }}
                  />
                </div>
              </button>
            </div>

            {/* Cloud Services Authentication & Account Management Card */}
            <div className="p-3.5 rounded-xl bg-[#14181f] border border-[#2b3340] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
                  <CloudUpload className="w-4 h-4 text-sky-400" />
                  <span>Cloud Storage Account Authentication</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  OAuth 2.0
                </span>
              </div>

              {/* Google Drive Account Card */}
              <div className="p-3 rounded-lg bg-[#191f28] border border-[#2a3442] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-200">Google Drive</div>
                    {localSettings.cloudSync.googleDriveConnected ? (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1 truncate font-mono">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{localSettings.cloudSync.googleDriveEmail}</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400">Not connected</div>
                    )}
                  </div>
                </div>

                <div>
                  {localSettings.cloudSync.googleDriveConnected ? (
                    <button
                      id="disconnect-google-drive-btn"
                      type="button"
                      onClick={() => handleDisconnectCloud('google_drive')}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition-colors flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Disconnect</span>
                    </button>
                  ) : (
                    <button
                      id="connect-google-drive-btn"
                      type="button"
                      onClick={() => setCloudAuthTarget('google_drive')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow"
                    >
                      Connect Account
                    </button>
                  )}
                </div>
              </div>

              {/* Dropbox Account Card */}
              <div className="p-3 rounded-lg bg-[#191f28] border border-[#2a3442] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-200">Dropbox</div>
                    {localSettings.cloudSync.dropboxConnected ? (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1 truncate font-mono">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{localSettings.cloudSync.dropboxEmail}</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400">Not connected</div>
                    )}
                  </div>
                </div>

                <div>
                  {localSettings.cloudSync.dropboxConnected ? (
                    <button
                      id="disconnect-dropbox-btn"
                      type="button"
                      onClick={() => handleDisconnectCloud('dropbox')}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition-colors flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Disconnect</span>
                    </button>
                  ) : (
                    <button
                      id="connect-dropbox-btn"
                      type="button"
                      onClick={() => setCloudAuthTarget('dropbox')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500 text-white hover:bg-blue-400 transition-colors shadow"
                    >
                      Connect Account
                    </button>
                  )}
                </div>
              </div>

              {/* Cloud Sync Toggles */}
              <div className="pt-2 border-t border-[#262f3c] space-y-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Auto-upload recordings to Cloud immediately</span>
                  <input
                    id="cloud-auto-upload-toggle"
                    type="checkbox"
                    checked={localSettings.cloudSync.autoUploadToCloud}
                    onChange={(e) => {
                      const updated: AppSettings = {
                        ...localSettings,
                        cloudSync: {
                          ...localSettings.cloudSync,
                          autoUploadToCloud: e.target.checked,
                        },
                      };
                      handleSaveAndClose(updated);
                    }}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-[#1e232a] border-slate-600"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Upload on Wi-Fi only (Save mobile data)</span>
                  <input
                    id="cloud-wifi-only-toggle"
                    type="checkbox"
                    checked={localSettings.cloudSync.uploadOnWifiOnly}
                    onChange={(e) => {
                      const updated: AppSettings = {
                        ...localSettings,
                        cloudSync: {
                          ...localSettings.cloudSync,
                          uploadOnWifiOnly: e.target.checked,
                        },
                      };
                      handleSaveAndClose(updated);
                    }}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-[#1e232a] border-slate-600"
                  />
                </label>
              </div>
            </div>

            {/* Folder structure auto creation indicator */}
            <div className="p-2.5 rounded-xl bg-[#14181f] border border-[#2b3340] flex items-center gap-2 text-[11px] text-slate-400">
              <FolderTree className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                System automatically initializes <strong>Live streamer output</strong> subfolders (Edited Output, Streamer Output, Photos, Audio Output) in chosen storage destination.
              </span>
            </div>
          </section>

          <hr className="border-[#2b3543]" />

          {/* 7. Reset settings */}
          <section id="settings-reset-section">
            <h3 className="font-bold text-slate-100 text-sm mb-1">
              Reset settings
            </h3>
            <p className="text-[11px] text-slate-400 mb-2.5">
              Reset all settings of the app
            </p>

            {/* Actual 'Reset' button (inactive if untouched, active when any change is applied) */}
            <button
              id="reset-all-settings-button"
              type="button"
              onClick={handleReset}
              disabled={!isSettingsModified}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isSettingsModified
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 cursor-pointer shadow-md'
                  : 'bg-[#151921] text-slate-500 border border-[#262e3a] cursor-not-allowed opacity-60'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {isSettingsModified
                  ? 'Reset Settings to Default (Active)'
                  : 'Reset Settings (No changes applied)'}
              </span>
            </button>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#171b22] border-t border-[#2d3744] flex items-center justify-end">
          <button
            id="close-settings-modal-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Cloud Authentication Modal Dialog */}
      {cloudAuthTarget && (
        <CloudAuthModal
          isOpen={!!cloudAuthTarget}
          onClose={() => setCloudAuthTarget(null)}
          serviceType={cloudAuthTarget}
          currentEmail={
            cloudAuthTarget === 'google_drive'
              ? localSettings.cloudSync.googleDriveEmail
              : localSettings.cloudSync.dropboxEmail
          }
          onAuthenticate={handleCloudAuthSuccess}
        />
      )}
    </div>
  );
};
