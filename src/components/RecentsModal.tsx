import React, { useState, useMemo } from 'react';
import {
  X,
  Camera,
  Film,
  Video,
  Music,
  Download,
  Trash2,
  Play,
  Eye,
  Search,
  Check,
  Volume2,
  Pause,
  Share2,
} from 'lucide-react';
import { SavedMediaItem } from '../types';
import { formatBytes, getRecentsCategory, RecentsCategoryType } from '../utils/mediaUtils';

export type RecentsFormatTab =
  | 'All'
  | 'Photos'
  | 'Edited streamers'
  | 'All camera streamers'
  | 'Audio outputs';

interface RecentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recents: SavedMediaItem[];
  onDeleteRecent: (id: string) => void;
  onClearRecents: () => void;
  onAddTestRecent?: () => void;
}

export const RecentsModal: React.FC<RecentsModalProps> = ({
  isOpen,
  onClose,
  recents,
  onDeleteRecent,
  onClearRecents,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<RecentsFormatTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreview, setActivePreview] = useState<SavedMediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Filter recents according to selected format button & search query
  const filteredRecents = useMemo(() => {
    return recents.filter((item) => {
      const category = getRecentsCategory(item);
      const matchesFormat =
        selectedFormat === 'All' ? true : (category as string) === selectedFormat;

      const matchesSearch =
        !searchQuery.trim() ||
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.cameraName &&
          item.cameraName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFormat && matchesSearch;
    });
  }, [recents, selectedFormat, searchQuery]);

  if (!isOpen) return null;

  // Trigger download of media file
  const handleDownload = (item: SavedMediaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      let mimeType = 'video/mp4';
      if (item.mediaType === 'photo') mimeType = 'image/jpeg';
      else if (item.mediaType === 'audio') mimeType = 'audio/aac';
      else if (item.format.toLowerCase() === 'mkv') mimeType = 'video/x-matroska';

      const content = `Live Streamer Studio Output\nFilename: ${item.fileName}\nFormat: ${item.format}\nQuality: ${item.quality}\nTimestamp: ${item.timestamp}\nDuration: ${item.durationFormatted || 'N/A'}\nDevice: ${item.cameraName || 'Default'}\n`;
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback
    }
  };

  const handleCopyFileName = (item: SavedMediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(item.fileName);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Requested format buttons: 'All', 'Photos', 'Edited streamers', All camera streamers', and the 'Audio outputs' without other things (no numbers, no icons)
  const formatButtons: { format: RecentsFormatTab; label: string }[] = [
    { format: 'All', label: 'All' },
    { format: 'Photos', label: 'Photos' },
    { format: 'Edited streamers', label: 'Edited streamers' },
    { format: 'All camera streamers', label: 'All camera streamers' },
    { format: 'Audio outputs', label: 'Audio outputs' },
  ];

  // Helper to get corresponding format icon
  const renderFormatIcon = (category: RecentsCategoryType) => {
    switch (category) {
      case 'Photos':
        return <Camera className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'Edited streamers':
        return <Film className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'All camera streamers':
        return <Video className="w-4 h-4 text-purple-400 shrink-0" />;
      case 'Audio outputs':
        return <Music className="w-4 h-4 text-amber-400 shrink-0" />;
      default:
        return <Film className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div
      id="recents-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="recents-modal-container"
        className="w-full max-w-2xl bg-[#1b2028] border border-[#384353] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100 relative animate-in zoom-in-95 duration-150"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Header Section (Total count box removed as requested) */}
        <div className="p-4 sm:p-5 border-b border-[#2d3644] bg-[#202632] flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Recent Recordings
            </h2>
            <p className="text-xs text-slate-400">
              Recent recordings, most recent on top
            </p>
          </div>

          <div className="flex items-center gap-2">
            {confirmClear ? (
              <div className="flex items-center gap-1.5 animate-in fade-in">
                <span className="text-[11px] text-red-300 font-semibold">Clear all?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClearRecents();
                    setConfirmClear(false);
                  }}
                  className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-0.5 rounded bg-[#2b3340] text-slate-300 text-[11px]"
                >
                  No
                </button>
              </div>
            ) : (
              recents.length > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  title="Clear all recent recordings"
                >
                  Clear all
                </button>
              )
            )}

            <button
              id="close-recents-modal-button"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#2c3544] transition-colors"
              title="Close Recents"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Format Selection Buttons: 'All', 'Photos', 'Edited streamers', All camera streamers', and the 'Audio outputs' without other things */}
        <div className="px-4 sm:px-5 py-3 bg-[#1e242f] border-b border-[#2d3644] flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            {/* Format Buttons Row: NO icons, NO numbers, only text */}
            <div
              id="recents-format-buttons-row"
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none flex-1"
            >
              {formatButtons.map((btn) => {
                const isActive = selectedFormat === btn.format;
                return (
                  <button
                    key={btn.format}
                    id={`format-btn-${btn.format.toLowerCase().replace(/\s+/g, '-')}`}
                    type="button"
                    onClick={() => setSelectedFormat(btn.format)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-[#151922] text-slate-300 hover:bg-[#273242] hover:text-white'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative w-36 sm:w-48 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg bg-[#141820] border border-[#323d4e] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Recent Recordings List (Most Recent on Top) */}
        {/* Border outlines of all output displays removed: output format icon with the name and on the bottom is the space they occupied, the type (e.g in video is 1080p), as they are */}
        <div
          id="recents-items-list"
          className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-1.5"
        >
          {filteredRecents.length === 0 ? (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold text-slate-200">
                No recent recordings found
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                {searchQuery
                  ? `No items match "${searchQuery}". Try clearing search.`
                  : selectedFormat !== 'All'
                  ? `No recents categorized as "${selectedFormat}".`
                  : 'Start live streaming or record sessions to build recents.'}
              </p>
              {selectedFormat !== 'All' && (
                <button
                  type="button"
                  onClick={() => setSelectedFormat('All')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-[#2c3645] hover:bg-[#384558] text-xs font-semibold text-sky-300 transition-colors"
                >
                  All
                </button>
              )}
            </div>
          ) : (
            filteredRecents.map((item) => {
              const category = getRecentsCategory(item);
              const isPhoto = category === 'Photos';

              return (
                <div
                  key={item.id}
                  id={`recent-item-${item.id}`}
                  onClick={() => setActivePreview(item)}
                  className="group px-3 py-2.5 rounded-xl hover:bg-[#252e3d]/70 transition-all flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  {/* Left: format icon with the name, and on the bottom the space occupied & type */}
                  <div className="min-w-0 flex-1">
                    {/* Output format icon with name */}
                    <div className="flex items-center gap-2 min-w-0">
                      {renderFormatIcon(category)}
                      <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate group-hover:text-sky-300 transition-colors">
                        {item.fileName}
                      </span>
                    </div>

                    {/* On the bottom: space they occupied, type (e.g. 1080p), as they are */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 pl-6">
                      <span>{formatBytes(item.fileSizeBytes)}</span>
                      <span>•</span>
                      <span>{item.quality || '1080p'}</span>
                      {item.durationFormatted && (
                        <>
                          <span>•</span>
                          <span>{item.durationFormatted}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>

                  {/* Right: Quick Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    {/* View / Play */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePreview(item);
                      }}
                      className="p-1.5 rounded-lg bg-[#262f3d] hover:bg-[#354357] text-slate-300 hover:text-white transition-colors"
                      title={isPhoto ? 'View' : 'Play'}
                    >
                      {isPhoto ? (
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-sky-400" />
                      )}
                    </button>

                    {/* Copy Name */}
                    <button
                      type="button"
                      onClick={(e) => handleCopyFileName(item, e)}
                      className="p-1.5 rounded-lg bg-[#262f3d] hover:bg-[#354357] text-slate-400 hover:text-white transition-colors"
                      title="Copy file name"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Download */}
                    <button
                      type="button"
                      onClick={(e) => handleDownload(item, e)}
                      className="p-1.5 rounded-lg bg-[#262f3d] hover:bg-emerald-600/30 text-slate-400 hover:text-emerald-300 transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecent(item.id);
                      }}
                      className="p-1.5 rounded-lg bg-[#262f3d] hover:bg-red-600/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-[#181d26] border-t border-[#2d3644] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#2b3544] hover:bg-[#384558] text-slate-200 hover:text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Media Preview Lightbox / Player Sub-Modal */}
      {activePreview && (
        <div
          id="recents-media-player-overlay"
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="w-full max-w-xl bg-[#1c222c] border border-[#3e4a5c] rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-slate-100 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b border-[#2d3644] pb-3">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                  {getRecentsCategory(activePreview)}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {activePreview.fileName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2b3442] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Display screen / player */}
            <div className="aspect-video w-full rounded-2xl bg-[#0e1117] border border-[#2f3948] overflow-hidden flex items-center justify-center relative shadow-inner mb-4">
              {activePreview.mediaType === 'photo' ? (
                /* Photo Snapshot Viewer */
                <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-sky-950 to-emerald-950 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-3 shadow-lg shadow-emerald-500/20">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {activePreview.fileName}
                  </h4>
                  <p className="text-xs text-emerald-300/80 mt-1 font-mono">
                    High Resolution Still • {activePreview.quality}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    Source: {activePreview.cameraName || 'Studio Camera'}
                  </span>
                </div>
              ) : activePreview.mediaType === 'audio' ? (
                /* Audio Waveform Player */
                <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-[#1d1928] to-amber-950/60 flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-amber-300 mb-4 animate-pulse">
                    <Volume2 className="w-8 h-8" />
                  </div>
                  <div className="flex items-end justify-center gap-1.5 h-10 w-48 mb-3">
                    {[16, 28, 40, 22, 35, 18, 32, 26, 38, 20, 30, 15].map((h, i) => (
                      <div
                        key={i}
                        className="w-2 bg-gradient-to-t from-amber-500 to-yellow-300 rounded-t-sm transition-all duration-200"
                        style={{
                          height: isPlaying ? `${h}px` : '6px',
                          opacity: isPlaying ? 1 : 0.4,
                        }}
                      />
                    ))}
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {activePreview.fileName}
                  </h4>
                  <span className="text-xs text-amber-300/80 font-mono mt-1">
                    Audio Recording • {activePreview.durationFormatted || '03:12'}
                  </span>
                </div>
              ) : (
                /* Video Player Preview */
                <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center relative group">
                  <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-xl mb-2">
                    {getRecentsCategory(activePreview) === 'Edited streamers' ? (
                      <Film className="w-8 h-8" />
                    ) : (
                      <Video className="w-8 h-8" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {activePreview.fileName}
                  </h4>
                  <span className="text-xs text-sky-300/90 font-mono mt-0.5">
                    {activePreview.quality} • {activePreview.format} • {activePreview.fps || 60}fps
                  </span>

                  {/* Play / Pause Toggle Overlay */}
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                      {isPlaying ? (
                        <Pause className="w-7 h-7 fill-white" />
                      ) : (
                        <Play className="w-7 h-7 fill-white translate-x-0.5" />
                      )}
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{formatBytes(activePreview.fileSizeBytes)}</span>
                <span>•</span>
                <span>{activePreview.quality}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(activePreview)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview(null)}
                  className="px-3 py-1.5 rounded-xl bg-[#2b3544] hover:bg-[#39465a] text-slate-300 text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
