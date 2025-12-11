import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ProcessingStatus } from './components/ProcessingStatus';
import { DownloadButton } from './components/DownloadButton';
import { History } from './components/History';
import { InfoCard } from './components/InfoCard';
import { DataQualityStats } from './components/DataQualityStats';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';
import {
  readXlsxFile,
  processData,
  downloadXlsx,
  validateData,
  getStats,
  getDetailedStats
} from './utils/xlsxProcessor';
import { exportStatsToPDF } from './utils/pdfExport';

function App() {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [stats, setStats] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [originalColumns, setOriginalColumns] = useState([]);
  const [detailedStats, setDetailedStats] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [history, setHistory] = useLocalStorage('xlsx-processor-history', []);

  const handleFileSelect = useCallback(async (file) => {
    setIsProcessing(true);
    setIsComplete(false);
    setError(null);
    setFileName(file.name);
    setProcessedData(null);
    setOriginalColumns([]);
    setStats(null);
    setDetailedStats(null);
    setShowStats(false);

    try {
      // Načtení souboru (vrací { data, originalColumns })
      const { data, originalColumns: columns } = await readXlsxFile(file);

      // Validace dat (včetně kontroly sloupců navíc)
      const validation = validateData(data, columns);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Zpracování dat (s původním pořadím sloupců)
      const processed = processData(data, columns);

      // Získání statistik
      const statistics = getStats(processed);

      // Získání detailních statistik o kvalitě dat
      const detailed = getDetailedStats(processed);

      setProcessedData(processed);
      setOriginalColumns(columns);
      setStats(statistics);
      setDetailedStats(detailed);
      setIsComplete(true);

      // Přidání do historie
      const historyItem = {
        fileName: file.name,
        date: new Date().toISOString(),
        productCount: statistics.totalProducts
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 4)]);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [setHistory]);

  const handleDownload = useCallback(() => {
    if (processedData) {
      const outputFileName = fileName.replace(/\.xlsx?$/i, '_processed.xlsx');
      downloadXlsx(processedData, outputFileName, originalColumns);
    }
  }, [processedData, fileName, originalColumns]);

  const handleExportPDF = useCallback(() => {
    if (detailedStats) {
      exportStatsToPDF(detailedStats, fileName);
    }
  }, [detailedStats, fileName]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const handleReset = useCallback(() => {
    setIsProcessing(false);
    setIsComplete(false);
    setError(null);
    setFileName('');
    setStats(null);
    setProcessedData(null);
    setOriginalColumns([]);
    setDetailedStats(null);
    setShowStats(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Info Card */}
          <InfoCard />

          {/* Upload Area */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              isProcessing={isProcessing}
            />

            {/* Processing Status */}
            {(isProcessing || isComplete || error) && (
              <div className="mt-6">
                <ProcessingStatus
                  fileName={fileName}
                  stats={stats}
                  isProcessing={isProcessing}
                  isComplete={isComplete}
                  error={error}
                />
              </div>
            )}

            {/* Data Quality Stats Toggle & Content */}
            {isComplete && !error && detailedStats && (
              <div className="mt-6 space-y-4">
                {!showStats ? (
                  <button
                    onClick={() => setShowStats(true)}
                    className="w-full py-3 px-6 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Zobrazit kvalitu dat a statistiky
                  </button>
                ) : (
                  <>
                    <DataQualityStats detailedStats={detailedStats} />
                    <button
                      onClick={() => setShowStats(false)}
                      className="w-full py-2 px-4 rounded-xl font-medium text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                      Skrýt statistiky
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Download Buttons */}
            {isComplete && !error && (
              <div className="mt-6 space-y-3">
                {/* PDF Export Button */}
                {detailedStats && (
                  <button
                    onClick={handleExportPDF}
                    className="w-full py-3 px-6 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>📄</span>
                    Stáhnout statistiky (PDF)
                  </button>
                )}

                <DownloadButton
                  onClick={handleDownload}
                  disabled={!processedData}
                />
                <button
                  onClick={handleReset}
                  className="w-full py-3 px-6 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Zpracovat další soubor
                </button>
              </div>
            )}

            {/* Error Reset Button */}
            {error && (
              <div className="mt-6">
                <button
                  onClick={handleReset}
                  className="w-full py-3 px-6 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Zkusit znovu
                </button>
              </div>
            )}
          </div>

          {/* History */}
          <History items={history} onClear={handleClearHistory} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        <p>Shoptet XLSX Processor</p>
      </footer>
    </div>
  );
}

export default App;
