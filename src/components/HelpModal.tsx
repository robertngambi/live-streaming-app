import React, { useState } from 'react';
import {
  HelpCircle,
  Video,
  Camera,
  RotateCw,
  Plus,
  Volume2,
  Layers,
  Pause,
  Square,
  HardDrive,
  CheckCircle,
  BookOpen,
  X,
  Compass,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'buttons' | 'storage'>('quickstart');

  if (!isOpen) return null;

  return (
    <div
      id="help-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="help-modal-container"
        className="w-full max-w-xl bg-[#1c222a] border border-[#374151] rounded-3xl text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 bg-[#212732] border-b border-[#303844] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Live Streamer User Guide & Help</h2>
              <p className="text-[11px] text-slate-400">
                Feature breakdown and step-by-step operating instructions
              </p>
            </div>
          </div>
          <button
            id="close-help-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2b3340]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2b3543] bg-[#171c24] px-4">
          <button
            id="help-tab-quickstart"
            onClick={() => setActiveTab('quickstart')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'quickstart'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>First Step Guide (How to Go About)</span>
          </button>
          <button
            id="help-tab-buttons"
            onClick={() => setActiveTab('buttons')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'buttons'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buttons & Features Map</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs text-slate-300">
          {activeTab === 'quickstart' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-[#151921] border border-[#2c3543]">
                <h3 className="font-bold text-slate-100 text-sm mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>Connect & Import Your Cameras</span>
                </h3>
                <p className="leading-relaxed">
                  Under the <strong>"Start streaming live"</strong> section, tap the rounded-rectangular placeholder frame with the <strong>'+'</strong> symbol. A menu will appear with your phone's built-in <strong>Front and Rear cameras</strong> on top, followed by any detected external devices (USB OTG cameras, Bluetooth cams, or Wi-Fi ActionCams). Tap any camera name to import it directly into the studio.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#151921] border border-[#2c3543]">
                <h3 className="font-bold text-slate-100 text-sm mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>Live Video Mixing in the Previewer</span>
                </h3>
                <p className="leading-relaxed">
                  Tap any imported camera streamer in the top row. A <strong>thick blue border</strong> will illuminate the active camera, and its live video and audio will immediately play in the large <strong>Video Editing (Pre)viewer Screen</strong> below. Use the bottom sound bar to monitor audio sound flow in real-time.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#151921] border border-[#2c3543]">
                <h3 className="font-bold text-slate-100 text-sm mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <span>Start, Pause & Save Capturing</span>
                </h3>
                <p className="leading-relaxed">
                  Tap the <strong>Green Round Dot</strong> in the center of the bottom footer to begin recording. The timer on the left will start counting (<code>00.00.00</code> format). While streaming, tap the <strong>2 yellow vertical lines</strong> to pause, or tap the <strong>small red square</strong> to stop. When stopped, confirm with <strong>'OK'</strong> to automatically save the video to your destined folder!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'buttons' && (
            <div className="space-y-2.5 animate-in fade-in">
              <div className="p-3 rounded-xl bg-[#151921] border border-[#2c3543]">
                <div className="font-bold text-slate-100 flex items-center gap-2 mb-1">
                  <Camera className="w-4 h-4 text-sky-400" />
                  <span>Set Cameras Button (Top Bar Camera Icon)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Toggles between <strong>'Live photo'</strong> (simultaneous snapshots across all cameras) and <strong>'Live streaming'</strong> (live video stream capturing).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#151921] border border-[#2c3543]">
                <div className="font-bold text-slate-100 flex items-center gap-2 mb-1">
                  <RotateCw className="w-4 h-4 text-amber-400" />
                  <span>Rotate / Unrotate Button</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Rotates the mobile UI layout for enhanced landscape orientation preview. The icon turns yellow and displays <strong>'Unrotate'</strong> when active.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#151921] border border-[#2c3543]">
                <div className="font-bold text-slate-100 flex items-center gap-2 mb-1">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Audio Level Button & Vertical Slider</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Found in each camera's dropdown. Provides a vertical slider (0 to 100%, default 60%) with audio amplifying boost capabilities.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#151921] border border-[#2c3543]">
                <div className="font-bold text-slate-100 flex items-center gap-2 mb-1">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>8 Virtual Video Frames (Premium Package)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Apply live graphical overlays including Cyberpunk Neon, Studio Broadcast Lower-Thirds, Gold Luxury, News 24 Ticker, and Hologram Matrix.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#151921] border-t border-[#2d3744] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Need help? All guides are built-in offline.</span>
          <button
            id="close-help-btn-bottom"
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
