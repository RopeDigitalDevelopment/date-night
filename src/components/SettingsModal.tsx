import { useState } from 'react';
import { getSettings, saveSettings, clearCache } from '../lib/storage';

interface Props {
  onClose: () => void;
}

export function SettingsModal({ onClose }: Props) {
  const [settings, setSettings] = useState(getSettings);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    saveSettings(settings);
    clearCache();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-[#16162a] rounded-t-3xl border-t border-white/8 px-6 pt-5 pb-10 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Handle */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />

        <div className="flex items-center justify-between pt-2">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="text-white/30 text-3xl leading-none active:text-white/60">×</button>
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <label className="text-white/50 text-xs uppercase tracking-wider">Google Places API Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={e => setSettings(s => ({ ...s, apiKey: e.target.value }))}
              placeholder="AIzaSy..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/25"
            />
            <button
              onClick={() => setShowKey(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm active:text-white/60"
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          <p className="text-white/25 text-xs leading-relaxed">
            console.cloud.google.com → APIs & Services → Credentials → Create API Key → restrict to Places API (New)
          </p>
        </div>

        {/* Radius */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-white/50 text-xs uppercase tracking-wider">Search Radius</label>
            <span className="text-white font-bold text-sm">{settings.radiusKm} km</span>
          </div>
          <input
            type="range"
            min={2}
            max={40}
            step={1}
            value={settings.radiusKm}
            onChange={e => setSettings(s => ({ ...s, radiusKm: Number(e.target.value) }))}
            className="w-full accent-violet-500 h-1.5"
          />
          <div className="flex justify-between text-white/25 text-xs">
            <span>2 km (walking)</span>
            <span>40 km (driving)</span>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <label className="text-white/50 text-xs uppercase tracking-wider">Home Location</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-white/30 text-xs">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={settings.lat}
                onChange={e => setSettings(s => ({ ...s, lat: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/25"
              />
            </div>
            <div className="space-y-1">
              <label className="text-white/30 text-xs">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={settings.lng}
                onChange={e => setSettings(s => ({ ...s, lng: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/25"
              />
            </div>
          </div>
          <p className="text-white/25 text-xs">Default: Trion @ KL Tower A (3.1529, 101.7030)</p>
        </div>

        <button
          onClick={handleSave}
          disabled={!settings.apiKey.trim()}
          className={`
            w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-200
            ${saved
              ? 'bg-emerald-600'
              : settings.apiKey.trim()
                ? 'bg-violet-600 active:bg-violet-700'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
        >
          {saved ? '✓  Saved!' : 'Save & Refresh'}
        </button>
      </div>
    </div>
  );
}
