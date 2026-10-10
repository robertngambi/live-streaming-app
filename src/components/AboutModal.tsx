import React from 'react';
import {
  Info,
  Video,
  CheckCircle2,
  Zap,
  Sparkles,
  X,
  CreditCard,
  Cloud,
  Layers,
  Volume2,
  Camera,
  FolderTree,
  ShieldCheck,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="about-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="about-modal-container"
        className="w-full max-w-xl bg-[#1c222a] border border-[#374151] rounded-2xl sm:rounded-3xl text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 max-h-[88vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#212732] border-b border-[#303844] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">About Live Streamer</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Version 2.5.0 • Studio Multi-Cam Broadcast Suite
              </p>
            </div>
          </div>
          <button
            id="close-about-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#2b3340] transition-colors"
            title="Exit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* App Overview */}
          <div className="p-4 rounded-2xl bg-[#151921] border border-[#2b3340]">
            <h3 className="font-bold text-slate-100 text-sm mb-1.5 flex items-center gap-2">
              <Video className="w-4 h-4 text-sky-400" />
              <span>What is Live Streamer?</span>
            </h3>
            <p className="leading-relaxed text-slate-300">
              <strong>Live Streamer</strong> is a professional mobile multi-camera live streaming and video editing studio. It empowers creators, vloggers, event broadcasters, and educators to connect, switch, frame, and record multiple live video and audio feeds in real-time through a single responsive mobile interface.
            </p>
          </div>

          {/* Key Implemented Features Grid */}
          <div className="p-4 rounded-2xl bg-[#151921] border border-[#2b3340] space-y-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Core Implemented Capabilities</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Feature 1: Multi-Cam Engine */}
              <div className="p-3 rounded-xl bg-[#11151c] border border-[#252e3b] space-y-1">
                <div className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Scalable Multi-Cam Engine</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Connect up to <strong>8 simultaneous cameras</strong> (6 external + 2 phone on Premium; 3 external on Basic; 2 on Trial).
                </p>
              </div>

              {/* Feature 2: Audio VU Equalizer */}
              <div className="p-3 rounded-xl bg-[#11151c] border border-[#252e3b] space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Real-Time Audio VU Equalizer</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Segmented LED VU spectrum analyzer tracking frequencies from 20Hz to 20kHz with live gain and audio boosting.
                </p>
              </div>

              {/* Feature 3: Credit Card Admin Payments */}
              <div className="p-3 rounded-xl bg-[#11151c] border border-[#252e3b] space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Direct Admin Card Billing</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Secure 256-bit encrypted credit card payment modal directly crediting the App Admin Account for Basic and Premium packages.
                </p>
              </div>

              {/* Feature 4: Cloud Storage Sync */}
              <div className="p-3 rounded-xl bg-[#11151c] border border-[#252e3b] space-y-1">
                <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Premium Cloud Storage Sync</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Google Drive and Dropbox cloud synchronization exclusive to VIP Premium, plus internal and SD card storage options.
                </p>
              </div>

              {/* Feature 5: 8 Virtual Frames */}
              <div className="p-3 rounded-xl bg-[#11151c] border border-[#252e3b] space-y-1">
                <div className="font-bold text-rose-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>8 Virtual Video Frames</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Overlay broadcast lower-thirds, cyberpunk neon, golden luxury, sports scoreboards, CRT retro, and news tickers.
                </p>
              </div>

              {/* Feature 6: Dedicated Output Folders */}
              <div className="p-3 rounded-xl bg-[#11151c] border border-[#252e3b] space-y-1">
                <div className="font-bold text-teal-400 flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5" />
                  <span>Structured Output System</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Auto-organized into <code>Live streamer output</code> subfolders: Edited Output, Streamer Output, Photos, and Audio Output.
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Plans Summary */}
          <div className="p-4 rounded-2xl bg-[#151921] border border-[#2b3340]">
            <h3 className="font-bold text-slate-100 text-sm mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Available Packages & Quotas</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#10141b] border border-[#232c38] flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-400">Free Trial</div>
                  <div className="text-[11px] text-slate-400">15-day full access • 4 total cameras (2 external + 2 phone)</div>
                </div>
                <span className="font-bold text-white">$0.00</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#10141b] border border-[#232c38] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sky-400">Basic Package</div>
                  <div className="text-[11px] text-slate-400">5 total cameras (3 external + 2 phone) • 1080p 60fps • Equalizer</div>
                </div>
                <span className="font-bold text-sky-300">$3.99/mo ($45.99/yr)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#10141b] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-400">Premium VIP Package</div>
                  <div className="text-[11px] text-slate-400">8 total cameras (6 external + 2 phone) • Google Drive & Dropbox Cloud Sync • 8 Frames • 4K</div>
                </div>
                <span className="font-bold text-amber-300">$5.99/mo ($67.99/yr)</span>
              </div>
            </div>
          </div>

          {/* Hardware & Platform Support */}
          <div className="p-4 rounded-2xl bg-[#151921] border border-[#2b3340]">
            <h3 className="font-bold text-slate-100 text-sm mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Hardware Compatibility</span>
            </h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Built-in Cameras:</strong> Instant dual front and rear smartphone lens switching.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>External Feeds:</strong> USB-C / OTG webcams, Wi-Fi ActionCams, HDMI broadcast capture cards.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Audio Hardware:</strong> Built-in mics, wired 3.5mm headsets, Bluetooth wireless lapel microphones, and USB audio interfaces.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#151921] border-t border-[#2d3744] flex items-center justify-between text-[11px] text-slate-400">
          <span>Live Streamer • Mobile Production Suite</span>
          <button
            id="close-about-btn-footer"
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-colors shadow-md"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

