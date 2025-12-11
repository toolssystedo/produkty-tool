export function DownloadButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
        flex items-center justify-center gap-3
        ${disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'text-white active:scale-[0.98]'}
      `}
      style={disabled ? {} : {
        background: 'linear-gradient(to right, #007a70, #005c54)',
        boxShadow: '0 10px 15px -3px rgba(0, 92, 84, 0.3)'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = 'linear-gradient(to right, #005c54, #004a43)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = 'linear-gradient(to right, #007a70, #005c54)';
        }
      }}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Stáhnout upravený soubor
    </button>
  );
}
