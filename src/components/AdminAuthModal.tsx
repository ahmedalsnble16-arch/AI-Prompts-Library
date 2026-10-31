import React, { useState } from 'react';
import { Lock, KeyRound, X, AlertCircle } from 'lucide-react';
import { getAdminPin } from '../lib/db';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = getAdminPin();
    if (pin.trim() === storedPin) {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          لوحة تحكم المالك (Admin Panel)
        </h3>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          هذه المنطقة مخصصة لمالك التطبيق فقط لإضافة وتعديل الأنماط وإدارة قاعدة البيانات.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                autoFocus
                placeholder="أدخل رمز المرور السري (PIN)"
                className={`w-full text-center tracking-widest text-lg font-mono py-3 px-4 rounded-xl bg-zinc-950 border ${
                  error
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                } text-white placeholder-zinc-600 focus:outline-none transition-colors`}
              />
            </div>
            {error && (
              <p className="text-xs text-rose-400 flex items-center justify-center gap-1 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                رمز المرور غير صحيح. حاول مرة أخرى.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-zinc-950 font-bold text-sm transition-all duration-150 shadow-lg shadow-amber-500/20"
          >
            تأكيد الدخول
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-[11px] text-zinc-500 hover:text-zinc-400 underline underline-offset-4"
            >
              {showHint ? 'إخفاء المساعدة' : 'هل نسيت الرمز؟ اضغط هنا للمساعدة'}
            </button>
            {showHint && (
              <p className="text-[11px] text-amber-400/90 mt-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                الرمز السري الافتراضي للتطبيق هو: <strong className="font-mono text-xs">1234</strong>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
