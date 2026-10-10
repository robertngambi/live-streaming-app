import React from 'react';
import {
  Camera,
  Smartphone,
  Wifi,
  Bluetooth,
  Usb,
  X,
  Check,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';
import { CameraDevice, CameraSourceType } from '../types';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCameras: CameraDevice[];
  onSelectCamera: (camera: CameraDevice) => void;
  title?: string;
  subtitle?: string;
  activeCameraId?: string;
}

export const AddCameraModal: React.FC<AddCameraModalProps> = ({
  isOpen,
  onClose,
  availableCameras,
  onSelectCamera,
  title = 'Connect & Import Camera',
  subtitle = 'Select a camera to stream live',
  activeCameraId,
}) => {
  if (!isOpen) return null;

  // Phone's self cameras on top
  const phoneCameras = availableCameras.filter(
    (c) => c.type === 'phone_front' || c.type === 'phone_rear'
  );
  // External sources (USB, Bluetooth, Wi-Fi) below
  const externalCameras = availableCameras.filter((c) => c.isExternal);

  const getSourceIcon = (type: CameraSourceType) => {
    switch (type) {
      case 'phone_front':
      case 'phone_rear':
        return <Smartphone className="w-4 h-4 text-sky-400" />;
      case 'usb':
        return <Usb className="w-4 h-4 text-emerald-400" />;
      case 'wifi':
        return <Wifi className="w-4 h-4 text-indigo-400" />;
      case 'bluetooth':
        return <Bluetooth className="w-4 h-4 text-blue-400" />;
    }
  };

  const getSourceBadge = (type: CameraSourceType) => {
    switch (type) {
      case 'phone_front':
        return 'Phone Front (Self)';
      case 'phone_rear':
        return 'Phone Rear (Self)';
      case 'usb':
        return 'USB Port';
      case 'wifi':
        return 'Wi-Fi Direct';
      case 'bluetooth':
        return 'Bluetooth Low Latency';
    }
  };

  return (
    <div
      id="add-camera-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="add-camera-modal-container"
        className="w-full max-w-md bg-[#1e232a] border border-[#374151] rounded-2xl p-5 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#303844]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="text-[11px] text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            id="close-add-camera-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2b3340]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto my-3 space-y-4 pr-1">
          {/* Section 1: Phone Self Cameras (On Top of the List) */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>Phone's Self Cameras (Built-in)</span>
            </div>

            <div className="space-y-2">
              {phoneCameras.map((cam) => {
                const isActive = activeCameraId === cam.id;
                return (
                  <button
                    key={cam.id}
                    id={`select-camera-${cam.id}`}
                    type="button"
                    onClick={() => {
                      onSelectCamera(cam);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                      isActive
                        ? 'bg-sky-500/20 border-sky-400 shadow-md ring-1 ring-sky-400'
                        : 'bg-[#151921] border-[#2c3543] hover:border-slate-400 hover:bg-[#1c222c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#252d3a] flex items-center justify-center">
                        {getSourceIcon(cam.type)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                          {cam.name}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>{getSourceBadge(cam.type)}</span>
                          <span>•</span>
                          <span className="font-mono text-emerald-400">
                            {cam.resolution} @ {cam.fps}fps
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="text-[11px] text-sky-400 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Selected
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 group-hover:text-slate-200 flex items-center gap-1 font-medium">
                          <PlusCircle className="w-3.5 h-3.5 text-sky-400" /> Import
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: External Sources (USB, Bluetooth, Wi-Fi) */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-indigo-400" />
              <span>External Sources (USB, Bluetooth, Wi-Fi)</span>
            </div>

            <div className="space-y-2">
              {externalCameras.map((cam) => {
                const isActive = activeCameraId === cam.id;
                return (
                  <button
                    key={cam.id}
                    id={`select-camera-${cam.id}`}
                    type="button"
                    onClick={() => {
                      onSelectCamera(cam);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                      isActive
                        ? 'bg-sky-500/20 border-sky-400 shadow-md ring-1 ring-sky-400'
                        : 'bg-[#151921] border-[#2c3543] hover:border-slate-400 hover:bg-[#1c222c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#252d3a] flex items-center justify-center">
                        {getSourceIcon(cam.type)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                          {cam.name}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span className="capitalize">{getSourceBadge(cam.type)}</span>
                          <span>•</span>
                          <span className="font-mono text-emerald-400">
                            {cam.resolution}
                          </span>
                          {cam.signalStrength && (
                            <>
                              <span>•</span>
                              <span className="text-sky-400 font-mono">
                                Signal {cam.signalStrength}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="text-[11px] text-sky-400 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Selected
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 group-hover:text-slate-200 flex items-center gap-1 font-medium">
                          <PlusCircle className="w-3.5 h-3.5 text-sky-400" /> Import
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#303844]">
          <div className="text-[10px] text-slate-400">
            Plug via USB-C OTG, pair Bluetooth, or connect Wi-Fi
          </div>
          <button
            id="close-add-camera-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-[#2b3340] text-slate-300 hover:bg-[#364050] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
