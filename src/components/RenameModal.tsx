import React, { useState, useEffect } from 'react';
import { Edit3, X } from 'lucide-react';
import { StreamerItem } from '../types';

interface RenameModalProps {
  streamer: StreamerItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRename: (streamerId: string, newName: string) => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  streamer,
  isOpen,
  onClose,
  onConfirmRename,
}) => {
  const [name, setName] = useState(streamer.customName);

  useEffect(() => {
    setName(streamer.customName);
  }, [streamer]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirmRename(streamer.id, name.trim());
      onClose();
    }
  };

  return (
    <div
      id="rename-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="rename-modal-box"
        className="w-full max-w-sm bg-[#1e232a] border border-[#374151] rounded-2xl p-5 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 relative"
      >
        {/* Exit 'X' button on the right top side */}
        <button
          id="close-rename-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2b3340] transition-colors"
          title="Close dialog"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3 pr-8">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Rename Streamer Camera</h3>
            <p className="text-[11px] text-slate-400">Edit camera display name</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-5">
            <label
              htmlFor="streamer-name-input"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Streamer Name
            </label>
            <input
              id="streamer-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Host Cam, Studio Wide, Drone View"
              maxLength={32}
              autoFocus
              className="w-full bg-[#14181f] border border-[#353f4f] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Camera hardware ID: <span className="font-mono">{streamer.cameraId}</span>
            </p>
          </div>

          {/* 2 buttons: 'Cancel' button on the left, 'OK' button on the right */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#303844]">
            <button
              id="rename-cancel-button"
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-medium bg-[#2b3340] text-slate-300 hover:bg-[#374253] transition-colors text-center"
            >
              Cancel
            </button>
            <button
              id="rename-ok-button"
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
