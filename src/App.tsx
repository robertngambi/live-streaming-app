import React, { useState, useEffect, useRef } from 'react';
import {
  CaptureMode,
  SubscriptionTier,
  AppSettings,
  StreamerItem,
  CameraDevice,
  SavedMediaItem,
} from './types';
import {
  INITIAL_CAMERAS,
  INITIAL_AUDIO_DEVICES,
  DEFAULT_APP_SETTINGS,
  INITIAL_STREAMERS,
  STORAGE_INFO,
} from './data/constants';
import { INITIAL_SAVED_FILES, formatTimeHHMMSS } from './utils/mediaUtils';
import { HeaderBar } from './components/HeaderBar';
import { StreamerList } from './components/StreamerList';
import { PreviewerEditor } from './components/PreviewerEditor';
import { FooterBar, SaveVideoModal } from './components/FooterBar';
import { SettingsModal } from './components/SettingsModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AboutModal } from './components/AboutModal';
import { HelpModal } from './components/HelpModal';
import { FileManagerModal } from './components/FileManagerModal';
import { AddCameraModal } from './components/AddCameraModal';
import { AudioLevelModal } from './components/AudioLevelModal';
import { RenameModal } from './components/RenameModal';
import { FramesModal } from './components/FramesModal';
import { PermissionsBanner } from './components/PermissionsBanner';
import { RecentsModal } from './components/RecentsModal';

export default function App() {
  // App core state
  const [appName] = useState('Live Streamer');
  const [captureMode, setCaptureMode] = useState<CaptureMode>('video');
  const [isRotated, setIsRotated] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('trial');
  const [trialDaysLeft, setTrialDaysLeft] = useState(15);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  // Hardware devices & streamers
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>(INITIAL_CAMERAS);
  const [availableAudio, setAvailableAudio] = useState(INITIAL_AUDIO_DEVICES);
  const [streamers, setStreamers] = useState<StreamerItem[]>(INITIAL_STREAMERS);
  const [activeStreamerId, setActiveStreamerId] = useState<string>(
    INITIAL_STREAMERS[0]?.id || ''
  );

  // Recording & capturing state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerIntervalRef = useRef<any>(null);

  // File management
  const [savedFiles, setSavedFiles] = useState<SavedMediaItem[]>(INITIAL_SAVED_FILES);
  const [photoFlash, setPhotoFlash] = useState(false);

  // Modals state
  const [showSettings, setShowSettings] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [showRecents, setShowRecents] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isRefreshingResources, setIsRefreshingResources] = useState(false);

  // Sub-modals for camera items
  const [addCameraModalOpen, setAddCameraModalOpen] = useState(false);
  const [changeCameraTarget, setChangeCameraTarget] = useState<StreamerItem | null>(null);
  const [audioTarget, setAudioTarget] = useState<StreamerItem | null>(null);
  const [renameTarget, setRenameTarget] = useState<StreamerItem | null>(null);
  const [framesTarget, setFramesTarget] = useState<StreamerItem | null>(null);

  // Timer counter when recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  // Capture Handlers
  const handleStartCapture = () => {
    setRecordingSeconds(0);
    setIsRecording(true);
    setIsPaused(false);
  };

  const handlePauseCapture = () => {
    setIsPaused(true);
  };

  const handleResumeCapture = () => {
    setIsPaused(false);
  };

  const handleTriggerStopCapture = () => {
    setIsPaused(true);
    setShowSaveConfirm(true);
  };

  const handleCancelSave = () => {
    setShowSaveConfirm(false);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
  };

  const handleConfirmSave = () => {
    const activeStreamer = streamers.find((s) => s.id === activeStreamerId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDuration = formatTimeHHMMSS(recordingSeconds);
    const quality = settings.videoQuality;
    const format = settings.videoOutputFormat;

    const newFiles: SavedMediaItem[] = [];

    // 1. Edited Previewer Output (default on)
    if (settings.recordPreviewerOutput) {
      newFiles.push({
        id: `rec-edit-${Date.now()}`,
        folder: 'Edited Output',
        fileName: `Edited_Stream_${now.getFullYear()}${(now.getMonth() + 1)
          .toString()
          .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours()}${now.getMinutes()}.${format.toLowerCase()}`,
        format: format,
        timestamp: `Today, ${timeStr}`,
        fileSizeBytes: Math.max(12000000, recordingSeconds * 1800000),
        durationFormatted: formattedDuration,
        quality: quality,
        fps: settings.videoFrameRate,
        cameraName: activeStreamer?.customName || 'Edited Stream',
        mediaType: 'video',
      });
    }

    // 2. Record all cameras outputs (if toggled)
    if (settings.recordAllCameras) {
      streamers.forEach((str, idx) => {
        newFiles.push({
          id: `rec-raw-${str.id}-${Date.now()}`,
          folder: 'Streamer Output',
          fileName: `Raw_${str.customName.replace(/\s+/g, '_')}_${now.getHours()}${now.getMinutes()}.${format.toLowerCase()}`,
          format: format,
          timestamp: `Today, ${timeStr}`,
          fileSizeBytes: Math.max(8000000, recordingSeconds * 1200000),
          durationFormatted: formattedDuration,
          quality: str.resolution,
          fps: str.fps,
          cameraName: str.customName,
          mediaType: 'video',
        });
      });
    }

    // 3. Record audio file separately (if toggled)
    if (settings.recordAudioSeparately) {
      newFiles.push({
        id: `rec-audio-${Date.now()}`,
        folder: 'Audio Output',
        fileName: `AudioMaster_Track_${now.getHours()}${now.getMinutes()}.aac`,
        format: 'AAC/M4A',
        timestamp: `Today, ${timeStr}`,
        fileSizeBytes: Math.max(2000000, recordingSeconds * 180000),
        durationFormatted: formattedDuration,
        quality: '320 kbps Studio',
        mediaType: 'audio',
      });
    }

    setSavedFiles((prev) => [...newFiles, ...prev].slice(0, 30));
    setShowSaveConfirm(false);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
  };

  // Live Photo snapshot capture
  const handleCapturePhoto = () => {
    setPhotoFlash(true);
    setTimeout(() => setPhotoFlash(false), 200);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const activeStreamer = streamers.find((s) => s.id === activeStreamerId);

    const newPhoto: SavedMediaItem = {
      id: `photo-${Date.now()}`,
      folder: 'Photos',
      fileName: `Snap_LiveStream_${now.getFullYear()}${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}.jpg`,
      format: 'JPEG',
      timestamp: `Today, ${timeStr}`,
      fileSizeBytes: 3200000,
      quality: 'High Resolution Still',
      cameraName: activeStreamer?.customName || 'Multi-Cam Snap',
      mediaType: 'photo',
    };

    setSavedFiles((prev) => [newPhoto, ...prev].slice(0, 30));
  };

  // Add camera to streamers list
  const handleAddCamera = (cam: CameraDevice) => {
    const maxCameras =
      subscriptionTier === 'premium' ? 8 : subscriptionTier === 'basic' ? 5 : 4;
    if (streamers.length >= maxCameras) return;

    const newStreamer: StreamerItem = {
      id: `streamer-${Date.now()}`,
      cameraId: cam.id,
      cameraName: cam.name,
      customName: cam.name,
      sourceType: cam.type,
      audioLevel: 60, // default 60%
      frameId: null,
      isMuted: false,
      colorTint: '#38bdf8',
      fps: cam.fps || 30,
      resolution: cam.resolution || '1080p',
      syntheticSeed: Math.floor(Math.random() * 1000),
    };

    setStreamers((prev) => [...prev, newStreamer]);
    if (!activeStreamerId) {
      setActiveStreamerId(newStreamer.id);
    }
  };

  // Change existing camera
  const handleChangeCameraConfirm = (cam: CameraDevice) => {
    if (!changeCameraTarget) return;

    setStreamers((prev) =>
      prev.map((s) =>
        s.id === changeCameraTarget.id
          ? {
              ...s,
              cameraId: cam.id,
              cameraName: cam.name,
              customName: cam.name,
              sourceType: cam.type,
              fps: cam.fps || 30,
              resolution: cam.resolution || '1080p',
            }
          : s
      )
    );
    setChangeCameraTarget(null);
  };

  // Remove streamer
  const handleRemoveStreamer = (streamerId: string) => {
    const remaining = streamers.filter((s) => s.id !== streamerId);
    setStreamers(remaining);
    if (activeStreamerId === streamerId) {
      setActiveStreamerId(remaining[0]?.id || '');
    }
  };

  // Rename streamer
  const handleRenameConfirm = (streamerId: string, newName: string) => {
    setStreamers((prev) =>
      prev.map((s) => (s.id === streamerId ? { ...s, customName: newName } : s))
    );
  };

  // Audio level update
  const handleAudioLevelConfirm = (streamerId: string, level: number) => {
    setStreamers((prev) =>
      prev.map((s) => (s.id === streamerId ? { ...s, audioLevel: level } : s))
    );
  };

  // Virtual Frame selection
  const handleSelectFrame = (streamerId: string, frameId: number | null) => {
    setStreamers((prev) =>
      prev.map((s) => (s.id === streamerId ? { ...s, frameId: frameId } : s))
    );
  };

  // Refresh hardware resources
  const handleRefreshResources = () => {
    setIsRefreshingResources(true);
    setTimeout(() => {
      setIsRefreshingResources(false);
    }, 1000);
  };

  // Delete saved file
  const handleDeleteFile = (fileId: string) => {
    setSavedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const activeStreamer = streamers.find((s) => s.id === activeStreamerId);
  const isLightMode = settings.themeMode === 'light';

  return (
    <div
      id="app-root-container"
      className={`w-full min-h-screen flex items-center justify-center p-0 sm:p-4 md:p-6 transition-colors duration-200 ${
        isLightMode ? 'bg-[#c5ccd6] text-slate-800' : 'bg-[#0f1217] text-slate-100'
      }`}
    >
      {/* Mobile Shell Frame */}
      <div
        id="mobile-phone-frame"
        className={`w-full ${
          isRotated ? 'max-w-4xl h-[96vh]' : 'max-w-md md:max-w-lg h-[100dvh] sm:h-[94vh]'
        } flex flex-col rounded-none sm:rounded-[36px] overflow-hidden shadow-2xl border-0 sm:border-4 border-[#2b3340] relative transition-all duration-200 ${
          isLightMode
            ? 'bg-[#d8dee8] text-slate-800'
            : 'bg-[#181d26] text-slate-100'
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Photo Flash Effect Overlay */}
        {photoFlash && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-in fade-in duration-100" />
        )}

        {/* Top bar: (a little dark) silver or light black */}
        <HeaderBar
          appName={appName}
          captureMode={captureMode}
          onSetCaptureMode={setCaptureMode}
          isRotated={isRotated}
          onToggleRotate={() => setIsRotated(!isRotated)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenAbout={() => setShowAbout(true)}
          onOpenSubscription={() => setShowSubscription(true)}
          onOpenFileManager={() => setShowFileManager(true)}
          subscriptionTier={subscriptionTier}
          trialDaysLeft={trialDaysLeft}
        />

        {/* Hardware Permissions Requester Banner */}
        <PermissionsBanner onPermissionGranted={() => {}} />

        {/* Main Screen / Interface: Light silver (very light black) with smooth up/down scrolling */}
        <main
          id="main-screen-interface"
          className="flex-1 flex flex-col overflow-y-auto scroll-smooth overscroll-contain min-h-0 relative pb-2"
          style={{
            background: isLightMode
              ? 'linear-gradient(180deg, #d8dee8 0%, #cbd4e1 100%)'
              : 'linear-gradient(180deg, #171b23 0%, #11141a 100%)',
          }}
        >
          {/* Streamers row with 'Start streaming live' note and '+' placeholder */}
          <StreamerList
            streamers={streamers}
            activeStreamerId={activeStreamerId}
            onSelectStreamer={setActiveStreamerId}
            onOpenAddCamera={() => setAddCameraModalOpen(true)}
            onChangeCamera={(str) => setChangeCameraTarget(str)}
            onOpenAudio={(str) => setAudioTarget(str)}
            onOpenRename={(str) => setRenameTarget(str)}
            onRemoveStreamer={handleRemoveStreamer}
            onOpenFrames={(str) => setFramesTarget(str)}
            subscriptionTier={subscriptionTier}
            fps={settings.videoFrameRate}
          />

          {/* Video Editing (Pre)viewer Screen and Audio Sound Bar */}
          <PreviewerEditor
            activeStreamer={activeStreamer}
            settings={settings}
            isRecording={isRecording}
            captureMode={captureMode}
            recordingSeconds={recordingSeconds}
          />
        </main>

        {/* Footer Bar: (a little dark) silver or light black */}
        <FooterBar
          captureMode={captureMode}
          isRecording={isRecording}
          isPaused={isPaused}
          recordingSeconds={recordingSeconds}
          recentCount={savedFiles.length}
          onStartCapture={handleStartCapture}
          onPauseCapture={handlePauseCapture}
          onResumeCapture={handleResumeCapture}
          onTriggerStopCapture={handleTriggerStopCapture}
          onCapturePhoto={handleCapturePhoto}
          onOpenRecents={() => setShowRecents(true)}
          onOpenHelp={() => setShowHelp(true)}
        />
      </div>

      {/* Modals & Dialogs */}
      {/* 1. Add Camera Modal */}
      <AddCameraModal
        isOpen={addCameraModalOpen}
        onClose={() => setAddCameraModalOpen(false)}
        availableCameras={availableCameras}
        onSelectCamera={handleAddCamera}
        title="Connect & Import Camera"
        subtitle="Select phone or external camera to host"
      />

      {/* 2. Change Camera Modal */}
      {changeCameraTarget && (
        <AddCameraModal
          isOpen={!!changeCameraTarget}
          onClose={() => setChangeCameraTarget(null)}
          availableCameras={availableCameras}
          onSelectCamera={handleChangeCameraConfirm}
          title={`Change Camera: ${changeCameraTarget.customName}`}
          subtitle="Choose another camera feed to replace"
          activeCameraId={changeCameraTarget.cameraId}
        />
      )}

      {/* 3. Audio Level Vertical Slider Modal */}
      {audioTarget && (
        <AudioLevelModal
          streamer={audioTarget}
          isOpen={!!audioTarget}
          onClose={() => setAudioTarget(null)}
          onSaveAudioLevel={handleAudioLevelConfirm}
        />
      )}

      {/* 4. Rename Streamer Modal */}
      {renameTarget && (
        <RenameModal
          streamer={renameTarget}
          isOpen={!!renameTarget}
          onClose={() => setRenameTarget(null)}
          onConfirmRename={handleRenameConfirm}
        />
      )}

      {/* 5. 8 Virtual Video Frames Modal */}
      {framesTarget && (
        <FramesModal
          streamer={framesTarget}
          isOpen={!!framesTarget}
          onClose={() => setFramesTarget(null)}
          onSelectFrame={handleSelectFrame}
          subscriptionTier={subscriptionTier}
          onOpenSubscription={() => {
            setFramesTarget(null);
            setShowSubscription(true);
          }}
        />
      )}

      {/* 6. Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        availableCameras={availableCameras}
        availableAudio={availableAudio}
        onRefreshResources={handleRefreshResources}
        isRefreshing={isRefreshingResources}
        subscriptionTier={subscriptionTier}
        onOpenSubscription={() => {
          setShowSettings(false);
          setShowSubscription(true);
        }}
      />

      {/* 7. Subscription Packages Modal */}
      <SubscriptionModal
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        currentTier={subscriptionTier}
        trialDaysLeft={trialDaysLeft}
        onSelectTier={setSubscriptionTier}
      />

      {/* 8. About the App Modal */}
      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />

      {/* 9. Help & First Step Guide Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* 10. File Manager (Live streamer output folders explorer) */}
      <FileManagerModal
        isOpen={showFileManager}
        onClose={() => setShowFileManager(false)}
        savedFiles={savedFiles}
        onDeleteFile={handleDeleteFile}
        storageLocationName={
          settings.storageLocation === 'internal'
            ? STORAGE_INFO.internal.name
            : settings.storageLocation === 'external'
            ? STORAGE_INFO.external.name
            : settings.storageLocation === 'google_drive'
            ? 'Google Drive'
            : 'Dropbox'
        }
        subscriptionTier={subscriptionTier}
        onOpenSubscription={() => {
          setShowFileManager(false);
          setShowSubscription(true);
        }}
      />

      {/* 11. Save Video Confirmation Modal */}
      <SaveVideoModal
        isOpen={showSaveConfirm}
        onCancel={handleCancelSave}
        onConfirmSave={handleConfirmSave}
        durationFormatted={formatTimeHHMMSS(recordingSeconds)}
        destinationFolder={`/Live streamer output/${
          settings.recordPreviewerOutput ? 'Edited Output' : 'Streamer Output'
        }`}
      />

      {/* 12. Recents Modal (holds up to 30 recents, organized by format: Photos, Edited streamer, All live streamers, Audio outputs) */}
      <RecentsModal
        isOpen={showRecents}
        onClose={() => setShowRecents(false)}
        recents={savedFiles}
        onDeleteRecent={handleDeleteFile}
        onClearRecents={() => setSavedFiles([])}
        onAddTestRecent={() => {
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const testFolders = ['Photos', 'Edited Output', 'Streamer Output', 'Audio Output'] as const;
          const randomFolder = testFolders[Math.floor(Math.random() * testFolders.length)];
          const isPhoto = randomFolder === 'Photos';
          const isAudio = randomFolder === 'Audio Output';
          const testItem: SavedMediaItem = {
            id: `rec-test-${Date.now()}`,
            folder: randomFolder,
            fileName: isPhoto
              ? `Snap_LiveTest_${Date.now().toString().slice(-4)}.jpg`
              : isAudio
              ? `AudioMaster_Track_${Date.now().toString().slice(-4)}.aac`
              : `LiveStream_Recorded_${Date.now().toString().slice(-4)}.mp4`,
            format: isPhoto ? 'JPEG' : isAudio ? 'AAC' : 'Mp4',
            timestamp: `Today, ${timeStr}`,
            fileSizeBytes: 24000000,
            durationFormatted: isPhoto ? undefined : '00.08.15',
            quality: '1080p Studio',
            fps: 60,
            cameraName: 'Test Live Streamer Feed',
            mediaType: isPhoto ? 'photo' : isAudio ? 'audio' : 'video',
          };
          setSavedFiles((prev) => [testItem, ...prev].slice(0, 30));
        }}
      />
    </div>
  );
}
