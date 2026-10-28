import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-100',
    info: 'border-amber-500/30 bg-amber-950/80 text-amber-100',
    error: 'border-rose-500/30 bg-rose-950/80 text-rose-100'
  };

  const type = toast.type || 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${borders[type]}`}>
        {icons[type]}
        <span className="text-sm font-medium pr-2">{toast.title}</span>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
