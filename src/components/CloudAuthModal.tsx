import React, { useState } from 'react';
import {
  Cloud,
  Check,
  X,
  Lock,
  ShieldCheck,
  FolderSync,
  HardDrive,
  Mail,
  Key,
  ExternalLink,
  Loader2,
} from 'lucide-react';

interface CloudAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: 'google_drive' | 'dropbox';
  currentEmail: string;
  onAuthenticate: (service: 'google_drive' | 'dropbox', email: string) => void;
}

export const CloudAuthModal: React.FC<CloudAuthModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  currentEmail,
  onAuthenticate,
}) => {
  const [emailInput, setEmailInput] = useState(
    currentEmail || (serviceType === 'google_drive' ? 'creator.streamer@gmail.com' : 'creator.streamer@dropbox.com')
  );
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'prompt' | 'authorizing' | 'success'>('prompt');

  if (!isOpen) return null;

  const isGoogle = serviceType === 'google_drive';
  const serviceName = isGoogle ? 'Google Drive' : 'Dropbox';
  const serviceColor = isGoogle ? 'text-amber-400' : 'text-blue-400';
  const serviceBg = isGoogle ? 'bg-amber-500/20' : 'bg-blue-500/20';
  const serviceBorder = isGoogle ? 'border-amber-500/30' : 'border-blue-500/30';

  const handleStartAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsLoading(true);
    setStep('authorizing');

    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      setTimeout(() => {
        onAuthenticate(serviceType, emailInput.trim());
        onClose();
      }, 700);
    }, 1100);
  };

  return (
    <div
      id="cloud-auth-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="cloud-auth-modal-container"
        className="w-full max-w-md bg-[#1e232a] border border-[#374151] rounded-2xl p-5 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col"
      >
        {/* Header with X on the top right */}
        <div className="flex items-center justify-between pb-3 border-b border-[#303844]">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl ${serviceBg} border ${serviceBorder} flex items-center justify-center ${serviceColor}`}>
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Connect {serviceName}</h3>
              <p className="text-[11px] text-slate-400">Authenticate your cloud storage account</p>
            </div>
          </div>
          <button
            id="close-cloud-auth-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2b3340]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          {step === 'prompt' && (
            <form onSubmit={handleStartAuth} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#14181f] border border-[#2b3340] text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Permissions Requested:</span>
                </div>
                <ul className="text-[11px] text-slate-400 list-disc pl-5 space-y-1">
                  <li>
                    Create & upload to folder: <code>Live streamer output/</code>
                  </li>
                  <li>Auto-sync recorded live stream videos and photos</li>
                  <li>Access storage quota and cloud file links</li>
                </ul>
              </div>

              <div>
                <label
                  htmlFor="cloud-auth-email-input"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  {serviceName} Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="cloud-auth-email-input"
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={isGoogle ? 'yourname@gmail.com' : 'yourname@dropbox.com'}
                    className="w-full bg-[#14181f] border border-[#353f4f] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>OAuth 2.0 Secure Handshake</span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3" /> Encrypted
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#303844]">
                <button
                  id="cancel-cloud-auth-btn"
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-medium bg-[#2b3340] text-slate-300 hover:bg-[#364050] transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  id="submit-cloud-auth-btn"
                  type="submit"
                  disabled={!emailInput.trim()}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md ${
                    isGoogle
                      ? 'bg-amber-400 hover:bg-amber-300'
                      : 'bg-sky-400 hover:bg-sky-300'
                  }`}
                >
                  <span>Authorize Account</span>
                </button>
              </div>
            </form>
          )}

          {step === 'authorizing' && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-sky-400 animate-spin mx-auto" />
              <div className="text-sm font-bold text-slate-100">
                Authenticating with {serviceName}...
              </div>
              <p className="text-xs text-slate-400">
                Establishing OAuth token session for <span className="text-sky-300 font-mono">{emailInput}</span>
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="text-sm font-bold text-emerald-400">
                {serviceName} Connected!
              </div>
              <p className="text-xs text-slate-300">
                Cloud folder initialized at <code>/Live streamer output/</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
