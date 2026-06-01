import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = type === 'success' 
    ? 'bg-slate-900/95 border-emerald-500/30 text-white shadow-emerald-500/5' 
    : type === 'error'
      ? 'bg-slate-900/95 border-rose-500/30 text-white shadow-rose-500/5'
      : 'bg-slate-900/95 border-blue-500/30 text-white shadow-blue-500/5';

  const icon = type === 'success' ? (
    <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ) : type === 'error' ? (
    <div className="bg-rose-500/20 p-1.5 rounded-lg text-rose-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  ) : (
    <div className="bg-blue-500/20 p-1.5 rounded-lg text-blue-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 border rounded-2xl shadow-2xl backdrop-blur-md animate-slide-in-right ${bgClass}`}>
      <span className="flex-shrink-0">{icon}</span>
      <p className="text-sm font-bold tracking-wide">{message}</p>
      <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors ml-4 focus:outline-none cursor-pointer">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
