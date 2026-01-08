import { useState, useEffect } from 'react';

export function ProductSettings({ settings, onChange, disabled }) {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleCheckboxChange = (type) => {
    const newSettings = {
      ...localSettings,
      [type]: {
        ...localSettings[type],
        enabled: !localSettings[type].enabled
      }
    };
    setLocalSettings(newSettings);
    onChange(newSettings);
  };

  const handleCountChange = (type, value) => {
    const numValue = Math.min(10, Math.max(1, parseInt(value) || 1));
    const newSettings = {
      ...localSettings,
      [type]: {
        ...localSettings[type],
        count: numValue
      }
    };
    setLocalSettings(newSettings);
    onChange(newSettings);
  };

  const noneSelected = !localSettings.related.enabled && !localSettings.alternative.enabled;

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Nastavení výstupu</h3>

      {/* Warning when none selected */}
      {noneSelected && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700 text-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Vyberte alespoň jeden typ produktů</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Related Products */}
        <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
          localSettings.related.enabled
            ? 'bg-white border-gray-200'
            : 'bg-gray-100 border-gray-100'
        }`}>
          <label className="flex items-center gap-3 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={localSettings.related.enabled}
              onChange={() => handleCheckboxChange('related')}
              disabled={disabled}
              className="w-5 h-5 rounded border-gray-300 text-[#00DC82] focus:ring-[#00DC82] cursor-pointer"
            />
            <div>
              <span className={`font-medium ${localSettings.related.enabled ? 'text-gray-700' : 'text-gray-400'}`}>
                Související produkty
              </span>
              <p className={`text-xs ${localSettings.related.enabled ? 'text-gray-500' : 'text-gray-400'}`}>
                Stejná hlavní kategorie
              </p>
            </div>
          </label>

          {localSettings.related.enabled && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Počet:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={localSettings.related.count}
                onChange={(e) => handleCountChange('related', e.target.value)}
                disabled={disabled}
                className="w-16 px-2 py-1 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00DC82] focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Alternative Products */}
        <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
          localSettings.alternative.enabled
            ? 'bg-white border-gray-200'
            : 'bg-gray-100 border-gray-100'
        }`}>
          <label className="flex items-center gap-3 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={localSettings.alternative.enabled}
              onChange={() => handleCheckboxChange('alternative')}
              disabled={disabled}
              className="w-5 h-5 rounded border-gray-300 text-[#00DC82] focus:ring-[#00DC82] cursor-pointer"
            />
            <div>
              <span className={`font-medium ${localSettings.alternative.enabled ? 'text-gray-700' : 'text-gray-400'}`}>
                Podobné produkty
              </span>
              <p className={`text-xs ${localSettings.alternative.enabled ? 'text-gray-500' : 'text-gray-400'}`}>
                Stejný strom kategorií
              </p>
            </div>
          </label>

          {localSettings.alternative.enabled && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Počet:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={localSettings.alternative.count}
                onChange={(e) => handleCountChange('alternative', e.target.value)}
                disabled={disabled}
                className="w-16 px-2 py-1 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00DC82] focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
