import React, { useState } from 'react';
import {
  FolderTree,
  Folder,
  Film,
  Image as ImageIcon,
  Music,
  Trash2,
  Download,
  Play,
  X,
  ExternalLink,
  Eye,
  CheckCircle,
  Cloud,
  CloudUpload,
  Check,
} from 'lucide-react';
import { SavedMediaItem, SubscriptionTier } from '../types';
import { formatBytes } from '../utils/mediaUtils';

interface FileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedFiles: SavedMediaItem[];
  onDeleteFile: (fileId: string) => void;
  storageLocationName: string;
  subscriptionTier?: SubscriptionTier;
  onOpenSubscription?: () => void;
}

type SubfolderType = 'All' | 'Edited Output' | 'Streamer Output' | 'Photos' | 'Audio Output';

export const FileManagerModal: React.FC<FileManagerModalProps> = ({
  isOpen,
  onClose,
  savedFiles,
  onDeleteFile,
  storageLocationName,
  subscriptionTier = 'trial',
  onOpenSubscription,
}) => {
  const [selectedSubfolder, setSelectedSubfolder] = useState<SubfolderType>('All');
  const [previewMedia, setPreviewMedia] = useState<SavedMediaItem | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [syncedIds, setSyncedIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const isPremium = subscriptionTier === 'premium';

  const handleManualUploadToCloud = (fileId: string) => {
    if (!isPremium) {
      if (onOpenSubscription) {
        onClose();
        onOpenSubscription();
      }
      return;
    }
    setUploadingId(fileId);
    setTimeout(() => {
      setUploadingId(null);
      setSyncedIds((prev) => new Set([...prev, fileId]));
    }, 900);
  };

  const folders: { name: SubfolderType; label: string; icon: React.ReactNode; count: number }[] = [
    {
      name: 'All',
      label: 'All Files',
      icon: <FolderTree className="w-4 h-4 text-amber-400" />,
      count: savedFiles.length,
    },
    {
      name: 'Edited Output',
      label: 'Edited Output',
      icon: <Film className="w-4 h-4 text-sky-400" />,
      count: savedFiles.filter((f) => f.folder === 'Edited Output').length,
    },
    {
      name: 'Streamer Output',
      label: 'Streamer Output',
      icon: <Film className="w-4 h-4 text-purple-400" />,
      count: savedFiles.filter((f) => f.folder === 'Streamer Output').length,
    },
    {
      name: 'Photos',
      label: 'Photos',
      icon: <ImageIcon className="w-4 h-4 text-emerald-400" />,
      count: savedFiles.filter((f) => f.folder === 'Photos').length,
    },
    {
      name: 'Audio Output',
      label: 'Audio Output',
      icon: <Music className="w-4 h-4 text-pink-400" />,
      count: savedFiles.filter((f) => f.folder === 'Audio Output').length,
    },
  ];

  const filteredFiles =
    selectedSubfolder === 'All'
      ? savedFiles
      : savedFiles.filter((f) => f.folder === selectedSubfolder);

  const getMediaIcon = (type: 'video' | 'photo' | 'audio') => {
    switch (type) {
      case 'video':
        return <Film className="w-4 h-4 text-sky-400" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'audio':
        return <Music className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <div
      id="file-manager-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="file-manager-container"
        className="w-full max-w-2xl bg-[#1c222a] border border-[#374151] rounded-3xl text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 bg-[#212732] border-b border-[#303844] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold">Storage & Recordings Explorer</h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                  {storageLocationName}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                /Live streamer output/{selectedSubfolder !== 'All' ? selectedSubfolder : ''}
              </p>
            </div>
          </div>
          <button
            id="close-file-manager-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2b3340]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subfolder Chips Navigation */}
        <div className="flex items-center gap-1.5 p-2.5 bg-[#151921] border-b border-[#2b3543] overflow-x-auto scrollbar-none">
          {folders.map((folder) => {
            const isSelected = selectedSubfolder === folder.name;
            return (
              <button
                key={folder.name}
                id={`folder-chip-${folder.name.replace(/\s+/g, '-').toLowerCase()}`}
                type="button"
                onClick={() => setSelectedSubfolder(folder.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                    : 'bg-[#1e2531] border-[#2e3745] text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
              >
                {folder.icon}
                <span>{folder.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
                  {folder.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Files List Scroll Area */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Folder className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-xs font-bold">No files in this folder yet</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Start capturing live streaming videos or photos to save files here
              </p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                id={`file-item-${file.id}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#151921] border border-[#2b3340] hover:border-slate-500 transition-all text-xs group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#232b38] flex items-center justify-center shrink-0">
                    {getMediaIcon(file.mediaType)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-100 truncate group-hover:text-sky-300 flex items-center gap-1.5">
                      <span>{file.fileName}</span>
                      {(file.cloudSynced || syncedIds.has(file.id)) && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          <Cloud className="w-2.5 h-2.5" />
                          {file.cloudProvider === 'dropbox' ? 'Dropbox' : 'Drive'}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="px-1 rounded bg-[#252d3a] text-amber-300 font-mono">
                        {file.folder}
                      </span>
                      <span>•</span>
                      <span>{formatBytes(file.fileSizeBytes)}</span>
                      {file.durationFormatted && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-emerald-400">
                            {file.durationFormatted}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>{file.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {!file.cloudSynced && !syncedIds.has(file.id) && (
                    <button
                      id={`upload-cloud-${file.id}`}
                      type="button"
                      onClick={() => handleManualUploadToCloud(file.id)}
                      disabled={uploadingId === file.id}
                      className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400 hover:bg-sky-500/30 transition-colors disabled:opacity-50"
                      title="Upload to Cloud Storage"
                    >
                      {uploadingId === file.id ? (
                        <span className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin block" />
                      ) : (
                        <CloudUpload className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    id={`preview-file-${file.id}`}
                    type="button"
                    onClick={() => setPreviewMedia(file)}
                    className="p-1.5 rounded-lg bg-[#252d3a] text-sky-400 hover:bg-[#323d4e] transition-colors"
                    title="Preview Media"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    id={`delete-file-${file.id}`}
                    type="button"
                    onClick={() => onDeleteFile(file.id)}
                    className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30 transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Media Preview Modal / Player */}
        {previewMedia && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#1a1f27] border border-slate-700 rounded-3xl p-5 text-slate-100 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  {getMediaIcon(previewMedia.mediaType)}
                  <h3 className="font-bold text-sm truncate max-w-[260px]">
                    {previewMedia.fileName}
                  </h3>
                </div>
                <button
                  id="close-preview-player"
                  onClick={() => setPreviewMedia(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simulated Media Player Container */}
              <div className="my-4 aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center relative">
                {previewMedia.mediaType === 'photo' ? (
                  <div className="text-center p-6 text-emerald-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-80" />
                    <div className="text-xs font-bold text-slate-200">
                      Live Snapshot Captured
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {previewMedia.quality} • {previewMedia.format}
                    </div>
                  </div>
                ) : previewMedia.mediaType === 'audio' ? (
                  <div className="text-center p-6 text-pink-400">
                    <Music className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                    <div className="text-xs font-bold text-slate-200">
                      Master Audio Track Playback
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      {previewMedia.durationFormatted} • {previewMedia.quality}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 text-sky-400">
                    <Film className="w-12 h-12 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-200">
                      Stream Video Playback
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      {previewMedia.durationFormatted} • {previewMedia.quality} • {previewMedia.fps}fps
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-slate-400">
                  Size: {formatBytes(previewMedia.fileSizeBytes)}
                </span>
                <button
                  id="close-preview-inner-btn"
                  type="button"
                  onClick={() => setPreviewMedia(null)}
                  className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold hover:bg-sky-400"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 bg-[#151921] border-t border-[#2d3744] flex items-center justify-between text-xs text-slate-400">
          <span>
            {savedFiles.length} files saved in <strong>Live streamer output</strong>
          </span>
          <button
            id="close-file-manager-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#2b3340] text-slate-200 hover:bg-[#384354] font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
