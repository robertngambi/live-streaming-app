import React, { useState } from 'react';
import {
  HelpCircle,
  Square,
  Pause,
  Play,
  Camera,
  Check,
  X,
  Sparkles,
  Save,
  Disc,
  Clock,
  Info,
} from 'lucide-react';
import { CaptureMode } from '../types';
import { formatTimeHHMMSS } from '../utils/mediaUtils';

interface FooterBarProps {
  captureMode: CaptureMode;
  isRecording: boolean;
  isPaused: boolean;
  recordingSeconds: number;
  recentCount?: number;
  onStartCapture: () => void;
  onPauseCapture: () => void;
  onResumeCapture: () => void;
  onTriggerStopCapture: () => void;
  onCapturePhoto: () => void;
  onOpenRecents: () => void;
  onOpenAbout?: () => void;
  onOpenHelp: () => void;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  captureMode,
  isRecording,
  isPaused,
  recordingSeconds,
  recentCount,
  onStartCapture,
  onPauseCapture,
  onResumeCapture,
  onTriggerStopCapture,
  onCapturePhoto,
  onOpenRecents,
  onOpenAbout,
  onOpenHelp,
}) => {
  return (
    <footer
      id="app-footer-bar"
      className="w-full bg-[#1e232a] border-t border-[#333a45] text-slate-100 px-4 py-2.5 flex items-center justify-between shadow-2xl relative z-40 select-none"
      style={{
        background: 'linear-gradient(180deg, #282f39 0%, #171b22 100%)',
      }}
    >
      {/* Left side: Time or duration display in format 00.00.00 (hours.minutes.seconds) */}
      <div id="recording-duration-container" className="flex items-center gap-2 min-w-[110px]">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
            {isRecording ? (isPaused ? 'PAUSED' : 'RECORDING') : 'DURATION'}
          </span>
          <div
            id="time-duration-display"
            className={`font-mono text-sm sm:text-base font-bold tracking-widest ${
              isRecording
                ? isPaused
                  ? 'text-amber-400'
                  : 'text-red-400 animate-pulse'
                : 'text-slate-300'
            }`}
          >
            {formatTimeHHMMSS(recordingSeconds)}
          </div>
        </div>
      </div>

      {/* Middle position: Capturing Button & Pause / Stop Buttons */}
      <div className="flex items-center gap-3">
        {captureMode === 'video' ? (
          <>
            {!isRecording ? (
              /* Green (not very big) round dot for starting capturing */
              <button
                id="start-capture-button"
                type="button"
                onClick={onStartCapture}
                className="group relative flex items-center justify-center p-3 rounded-full bg-[#2a3240] hover:bg-[#343e4f] border-2 border-[#455268] hover:border-emerald-400 shadow-lg transition-all active:scale-95"
                title="Start Video Streaming & Capture"
                aria-label="Start Capture"
              >
                {/* Green not very big round dot */}
                <div className="w-6 h-6 rounded-full bg-emerald-500 group-hover:bg-emerald-400 shadow-md shadow-emerald-500/50 flex items-center justify-center transition-transform group-hover:scale-110" />
              </button>
            ) : (
              /* When recording: 2 thick vertical yellow lines button (Pause) + small red square (Stop) on right */
              <div className="flex items-center gap-3 animate-in fade-in zoom-in-95">
                {/* Pause Button: 2 thick vertical yellow lines */}
                <button
                  id="pause-capture-button"
                  type="button"
                  onClick={isPaused ? onResumeCapture : onPauseCapture}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2a3240] hover:bg-[#353f50] border-2 border-amber-400 shadow-lg shadow-amber-400/20 transition-all active:scale-95"
                  title={isPaused ? 'Resume Capture' : 'Pause Capture'}
                  aria-label="Pause or Resume"
                >
                  {isPaused ? (
                    <Play className="w-5 h-5 text-amber-400 fill-amber-400 ml-0.5" />
                  ) : (
                    /* 2 thick vertical yellow lines */
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-5 bg-amber-400 rounded-sm shadow" />
                      <div className="w-1.5 h-5 bg-amber-400 rounded-sm shadow" />
                    </div>
                  )}
                </button>

                {/* Stop button: Small red square on its right side */}
                <button
                  id="stop-capture-button"
                  type="button"
                  onClick={onTriggerStopCapture}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-600/20 hover:bg-red-600/30 border-2 border-red-500 text-red-500 hover:text-red-400 shadow-lg shadow-red-500/20 transition-all active:scale-95"
                  title="Stop Streaming & Video Capturing"
                  aria-label="Stop Capture"
                >
                  {/* Small red square */}
                  <div className="w-4 h-4 bg-red-500 rounded-sm shadow-sm" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Live Photo mode capture button */
          <button
            id="photo-capture-button"
            type="button"
            onClick={onCapturePhoto}
            className="group relative flex items-center justify-center p-3 rounded-full bg-[#2a3240] hover:bg-[#343e4f] border-2 border-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            title="Capture Live Photos from All Cameras"
            aria-label="Take Photo"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <Camera className="w-3.5 h-3.5 text-slate-950" />
            </div>
          </button>
        )}
      </div>

      {/* Far right side: 'Recents' button and 'Help' button */}
      <div className="flex items-center justify-end gap-1.5 sm:gap-2 min-w-[100px]">
        {/* 'Recents' button in the footer */}
        <button
          id="recents-button"
          type="button"
          onClick={onOpenRecents}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#2a3342] hover:bg-[#354154] border border-[#445266] hover:border-sky-400 text-slate-100 hover:text-white transition-all text-xs font-semibold shadow-sm active:scale-95 group"
          title="Recent Recordings (Holds up to 30 recents, organized by format)"
          aria-label="Recent Recordings"
        >
          <Clock className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-12 transition-transform" />
          <span>Recents</span>
          {recentCount !== undefined && recentCount > 0 && (
            <span
              id="footer-recents-count"
              className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-500/25 border border-sky-400/40 text-sky-300 font-mono font-bold"
            >
              {recentCount}
            </span>
          )}
        </button>

        {/* 'Help' button */}
        <button
          id="help-button"
          type="button"
          onClick={onOpenHelp}
          className="p-1.5 rounded-xl bg-[#20252e] hover:bg-[#2b3340] border border-[#363f4e] text-slate-400 hover:text-slate-200 transition-all text-xs shadow-sm"
          title="App Help & First Step Guide"
          aria-label="Help and Guide"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
        </button>
      </div>
    </footer>
  );
};

// Save Video Confirmation Modal:
// "Click on 'OK' button to save your video", then on the bottom is the 'Cancel' button on the left side for cancelling the saving, and on the right is the 'OK' button to confirm saving the video, if clicked then the video is saved to it's destined folder.
interface SaveVideoModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirmSave: () => void;
  durationFormatted: string;
  destinationFolder: string;
}

export const SaveVideoModal: React.FC<SaveVideoModalProps> = ({
  isOpen,
  onCancel,
  onConfirmSave,
  durationFormatted,
  destinationFolder,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="save-video-modal-overlay"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="save-video-note-box"
        className="w-full max-w-sm bg-[#1e232a] border border-[#3f4a5c] rounded-2xl p-5 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 relative"
      >
        {/* Exit 'X' button on the right top side */}
        <button
          id="close-save-video-modal-btn"
          type="button"
          onClick={onCancel}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2b3340] transition-colors"
          title="Close dialog"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-3 pr-8">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Save className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Save Video Recording</h3>
            <p className="text-[11px] text-slate-400">Duration: {durationFormatted}</p>
          </div>
        </div>

        {/* Note box saying: "Click on 'OK' button to save your video" */}
        <div className="my-4 p-3.5 rounded-xl bg-[#14181f] border border-[#2b3340] text-center">
          <p className="text-sm font-semibold text-slate-100">
            Click on 'OK' button to save your video
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Destination folder: <span className="font-mono text-sky-400">{destinationFolder}</span>
          </p>
        </div>

        {/* Bottom buttons: 'Cancel' on left, 'OK' on right */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            id="save-video-cancel-button"
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#2b3340] text-slate-300 hover:bg-[#374253] transition-colors text-center"
          >
            Cancel
          </button>
          <button
            id="save-video-ok-button"
            type="button"
            onClick={onConfirmSave}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors text-center shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
