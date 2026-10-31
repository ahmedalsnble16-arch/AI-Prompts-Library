import React, { useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface ImageViewerModalProps {
  imageUrl: string | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  imageUrl,
  title,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-white/10 transition-colors"
          aria-label="إغلاق معاينة الصورة"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title}
          className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
        />
        <div className="mt-3 px-4 py-2 bg-zinc-900/90 rounded-xl border border-zinc-800 text-center">
          <p className="text-xs sm:text-sm font-semibold text-zinc-200">{title}</p>
        </div>
      </div>
    </div>
  );
};
