export function ProcessingStatus({ fileName, stats, isProcessing, isComplete, error }) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-red-800">Chyba při zpracování</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="rounded-xl p-6" style={{ backgroundColor: '#e6f2f1', border: '1px solid #ccebe8' }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ccebe8' }}>
            <svg className="w-5 h-5 animate-spin" style={{ color: '#005c54' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#004a43' }}>Zpracovávám soubor...</p>
            <p className="text-sm" style={{ color: '#005c54' }}>{fileName}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete && stats) {
    return (
      <div className="rounded-xl p-6" style={{ backgroundColor: '#e6f2f1', border: '1px solid #ccebe8' }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ccebe8' }}>
            <svg className="w-5 h-5" style={{ color: '#005c54' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-2" style={{ color: '#004a43' }}>Zpracování dokončeno</p>
            <p className="text-sm mb-3" style={{ color: '#005c54' }}>{fileName}</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                <p className="text-xs text-gray-500">Produktů</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-gray-800">{stats.mainCategories}</p>
                <p className="text-xs text-gray-500">Hlavních kategorií</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-gray-800">{stats.uniqueCategoryTexts}</p>
                <p className="text-xs text-gray-500">Unikátních cest</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
