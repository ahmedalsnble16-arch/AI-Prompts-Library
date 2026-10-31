import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  HelpCircle,
  Cpu,
  Ratio,
  ExternalLink,
} from 'lucide-react';
import { PromptItem } from '../types';

interface PromptDetailsModalProps {
  item: PromptItem | null;
  isOpen: boolean;
  onClose: () => void;
  onCopyPrompt: (promptText: string, title: string) => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  onOpenFullscreenImage: (imageUrl: string, title: string) => void;
}

export const PromptDetailsModal: React.FC<PromptDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
  onCopyPrompt,
  onNavigateNext,
  onNavigatePrev,
  hasNext,
  hasPrev,
  onOpenFullscreenImage,
}) => {
  const [copied, setCopied] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasPrev && onNavigatePrev) onNavigatePrev();
      if (e.key === 'ArrowLeft' && hasNext && onNavigateNext) onNavigateNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, hasNext, hasPrev, onNavigateNext, onNavigatePrev]);

  if (!isOpen || !item) return null;

  const handleCopy = () => {
    onCopyPrompt(item.prompt, item.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-prompt-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-950/40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-xs text-zinc-400">تفاصيل النمط والبرومت</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next buttons */}
            <div className="flex items-center border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/80">
              <button
                disabled={!hasPrev}
                onClick={onNavigatePrev}
                className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                title="النمط السابق (السهم الأيمن)"
                aria-label="النمط السابق"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-zinc-800" />
              <button
                disabled={!hasNext}
                onClick={onNavigateNext}
                className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                title="النمط التالي (السهم الأيسر)"
                aria-label="النمط التالي"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 rounded-xl transition-colors"
              title="إغلاق النافذة (Esc)"
              aria-label="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left/Image Column (ClipRRect style with border and rounded corners) */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-xl group">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onOpenFullscreenImage(item.imageUrl, item.title)}
                  className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-black/75 hover:bg-black text-white backdrop-blur-md border border-white/15 transition-all shadow-lg flex items-center gap-1.5 text-xs font-medium"
                  title="تكبير الصورة بحجمها الكامل"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>تكبير الصورة</span>
                </button>
              </div>

              {/* Technical specs strip */}
              <div className="w-full mt-3 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex items-center justify-around text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>{item.targetModel || 'ChatGPT / Midjourney'}</span>
                </div>
                <div className="h-3 w-[1px] bg-zinc-800"></div>
                <div className="flex items-center gap-1.5">
                  <Ratio className="w-4 h-4 text-violet-400" />
                  <span>النسبة: {item.aspectRatio || '1:1'}</span>
                </div>
              </div>
            </div>

            {/* Right/Prompt Column */}
            <div className="md:col-span-7 flex flex-col space-y-4">
              <div>
                <h2
                  id="modal-prompt-title"
                  className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug"
                >
                  {item.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1.5">
                  <span>التصنيف: {item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>أضيف في: {new Date(item.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>

              {/* SelectableText Container (كما طُلب في وثيقة المتطلبات) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    نص الـ Prompt الجاهز للنسخ:
                  </span>
                  <span className="text-[11px] text-zinc-500">قابلة للتحديد والنسخ يدوياً</span>
                </div>

                <div className="relative p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-inner group">
                  <p
                    dir="ltr"
                    className="font-mono text-sm leading-relaxed text-zinc-200 select-all selection:bg-indigo-500/40 selection:text-white break-words"
                  >
                    {item.prompt}
                  </p>
                </div>
              </div>

              {/* Prominent Copy Button (الزر البارز لنسخ الـ Prompt) */}
              <button
                onClick={handleCopy}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-xl ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/25 active:scale-[0.99]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-white animate-bounce" />
                    <span>تم النسخ بنجاح للحافظة! جاهز للاستخدام الآن</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>نسخ الـ Prompt بضغطة زر</span>
                  </>
                )}
              </button>

              {/* How to use with your photo guide (طريقة الاستخدام مع صورتك الشخصية) */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2.5">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowHowToUse(!showHowToUse)}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    <span>كيف تطبق هذا البرومت على صورتك الشخصية؟</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">
                    {showHowToUse ? 'إخفاء الدليل' : 'إظهار الدليل'}
                  </span>
                </div>

                {showHowToUse && (
                  <div className="text-xs text-zinc-300 space-y-2 pt-1 border-t border-zinc-800/60 leading-relaxed">
                    <p className="text-zinc-400">
                      {item.userPhotoTip ||
                        '1. افتح تطبيق ChatGPT أو Midjourney. 2. ارفع صورتك الشخصية بوضوح. 3. الصق هذا البرومت.'}
                    </p>
                    <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">💡 نصيحة:</span>
                      <span>
                        يمكنك إضافة عبارة{' '}
                        <code className="text-indigo-300 font-mono">
                          "Keep the exact facial identity and facial structure from my attached photo"
                        </code>{' '}
                        لضمان تطابق الملامح بنسبة 100%.
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-zinc-950/70 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-500">
              تطبيق محلي بدون إنترنت · لا يتم إرسال أي صور لخوادم خارجية
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-zinc-300 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
