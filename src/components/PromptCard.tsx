import React, { useState } from 'react';
import { Copy, Check, Eye } from 'lucide-react';
import { PromptItem } from '../types';

interface PromptCardProps {
  item: PromptItem;
  onOpenDetails: (item: PromptItem) => void;
  onCopyPrompt: (promptText: string, title: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  item,
  onOpenDetails,
  onCopyPrompt,
}) => {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyPrompt(item.prompt, item.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      onClick={() => onOpenDetails(item)}
      className="group relative flex flex-col bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1"
    >
      {/* Thumbnail Container (ClipRRect style) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-950">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
            <span className="text-xs text-zinc-600">جاري التحميل...</span>
          </div>
        )}
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Quick floating action buttons */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleCopyClick}
            className={`p-2 rounded-xl backdrop-blur-md text-xs font-medium transition-all shadow-lg ${
              copied
                ? 'bg-emerald-500 text-white ring-2 ring-emerald-400/50'
                : 'bg-zinc-900/85 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10'
            }`}
            title="نسخ الـ Prompt سريعاً"
            aria-label="نسخ البرومت"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick view hint icon on bottom right */}
        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-white/10 text-[11px] text-zinc-200">
          <Eye className="w-3 h-3 text-indigo-400" />
          <span>عرض التفاصيل</span>
        </div>
      </div>

      {/* Card Content & Title */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Subtle unboxed metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1.5 truncate">
            <span>{item.targetModel || 'AI Photo'}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>نسبة {item.aspectRatio || '1:1'}</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-zinc-100 leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {item.title}
          </h3>
        </div>

        {/* Action strip */}
        <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
          <span className="truncate max-w-[140px] text-[11px] text-zinc-500">
            انقر لرؤية البرومت
          </span>
          <span className="text-indigo-400 font-semibold group-hover:translate-x-[-2px] transition-transform text-xs">
            عرض وتطبيق ←
          </span>
        </div>
      </div>
    </article>
  );
};
