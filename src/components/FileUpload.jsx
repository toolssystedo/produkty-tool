import { useState, useCallback } from 'react';

export function FileUpload({ onFileSelect, isProcessing }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        onFileSelect(file);
      } else {
        alert('Prosím nahrajte soubor ve formátu .xlsx nebo .xls');
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer
        ${isProcessing ? 'pointer-events-none opacity-60' : ''}
      `}
      style={{
        borderColor: isDragging ? '#005c54' : '#d1d5db',
        backgroundColor: isDragging ? '#e6f2f1' : 'transparent',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)'
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = '#33afa3';
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <input
        id="file-input"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileInput}
        className="hidden"
        disabled={isProcessing}
      />

      <div className="flex flex-col items-center gap-4">
        {/* Upload Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isDragging ? '#005c54' : 'linear-gradient(to bottom right, #007a70, #005c54)'
          }}
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700 mb-1">
            {isDragging ? 'Pusťte soubor zde' : 'Přetáhněte XLSX soubor sem'}
          </p>
          <p className="text-gray-500">
            nebo <span className="font-medium hover:underline" style={{ color: '#005c54' }}>klikněte pro výběr</span>
          </p>
        </div>

        {/* Supported formats */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Podporované formáty: .xlsx, .xls</span>
        </div>
      </div>
    </div>
  );
}
