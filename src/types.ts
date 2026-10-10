export type CaptureMode = 'video' | 'photo';

export type SubscriptionTier = 'trial' | 'basic' | 'premium';

export type CameraSourceType = 'phone_front' | 'phone_rear' | 'usb' | 'wifi' | 'bluetooth';

export interface CameraDevice {
  id: string;
  name: string;
  type: CameraSourceType;
  resolution: string;
  fps: number;
  isConnected: boolean;
  isExternal: boolean;
  batteryLevel?: number;
  signalStrength?: number;
}

export interface AudioDevice {
  id: string;
  name: string;
  type: 'phone_mic' | 'usb_mic' | 'bluetooth_mic' | 'wifi_mic';
  isConnected: boolean;
  gain: number;
}

export interface VirtualFrame {
  id: number;
  name: string;
  tag: string;
  description: string;
  color: string;
  badgeText: string;
  aspectRatio: string;
}

export interface StreamerItem {
  id: string;
  cameraId: string;
  cameraName: string;
  customName: string;
  sourceType: CameraSourceType;
  audioLevel: number; // 0 to 100, default 60
  frameId: number | null; // 1 to 8 or null
  isMuted: boolean;
  colorTint: string;
  fps: number;
  resolution: string;
  syntheticSeed: number;
}

export interface CloudSyncSettings {
  googleDriveConnected: boolean;
  googleDriveEmail: string;
  googleDriveStorageUsed: string;
  googleDriveStorageTotal: string;
  dropboxConnected: boolean;
  dropboxEmail: string;
  dropboxStorageUsed: string;
  dropboxStorageTotal: string;
  autoUploadToCloud: boolean;
  uploadOnWifiOnly: boolean;
  cloudFolder: string;
}

export interface AppSettings {
  themeMode: 'light' | 'dark';
  videoFrameRate: 15 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;
  videoOutputFormat: 'MKV' | 'Mp4' | '3gp';
  videoQuality: '240p' | '360p' | '480p' | '720p' | '1080p';
  audioSource: 'phone_mic' | 'previewer_video' | 'external_sources';
  selectedExternalAudioId: string;
  recordPreviewerOutput: boolean;
  recordAllCameras: boolean;
  recordAudioSeparately: boolean;
  storageLocation: 'internal' | 'external' | 'google_drive' | 'dropbox';
  cloudSync: CloudSyncSettings;
  enabledVideoSources: string[];
  enabledAudioSources: string[];
}

export interface StorageInfo {
  type: 'internal' | 'external' | 'google_drive' | 'dropbox';
  name: string;
  totalCapacity: string;
  freeSpace: string;
  usedSpace: string;
  usedPercentage: number;
}

export interface SavedMediaItem {
  id: string;
  folder: 'Edited Output' | 'Streamer Output' | 'Photos' | 'Audio Output';
  fileName: string;
  format: string;
  timestamp: string;
  fileSizeBytes: number;
  durationFormatted?: string;
  quality: string;
  fps?: number;
  cameraName?: string;
  mediaType: 'video' | 'photo' | 'audio';
  previewDataUrl?: string;
  cloudSyncStatus?: 'synced' | 'uploading' | 'local_only' | 'error';
  cloudService?: 'google_drive' | 'dropbox';
  cloudPath?: string;
}
