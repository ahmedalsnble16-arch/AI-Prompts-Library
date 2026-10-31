import React from 'react';
import { Sparkles, ShieldCheck, Search, WifiOff, KeyRound, X } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  isAdminLoggedIn,
  onOpenAdmin,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  مكتبة برومتات الذكاء الاصطناعي
                </h1>
                <span className="hidden md:inline-flex text-[11px] font-medium text-emerald-400/90 items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  محلي 100%
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                انسخ أفضل برومتات توليد وتعديل الصور مع صورتك الشخصية
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md mx-2 hidden sm:block">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث بالاسم، النمط، أو تفاصيل البرومت..."
                className="w-full pl-9 pr-9 py-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  aria-label="مسح البحث"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action: Secret Admin Button */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 pl-2">
              <WifiOff className="w-3.5 h-3.5 text-zinc-500" />
              <span>{totalCount} نمط جاهز</span>
            </div>

            {/* Secret Admin button as specified in SRS */}
            <button
              onClick={onOpenAdmin}
              className={`relative p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
                isAdminLoggedIn
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/80'
              }`}
              title={isAdminLoggedIn ? 'لوحة تحكم المدير (نشطة)' : 'الزر السري للمدير'}
              aria-label="لوحة تحكم المدير"
            >
              {isAdminLoggedIn ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 opacity-70 hover:opacity-100" />
                  <span className="sr-only">مدخل الإدارة السري</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن نمط أو برومت..."
              className="w-full pl-9 pr-9 py-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                aria-label="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
