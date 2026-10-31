/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import {
  Sparkles,
  Camera,
  Layers,
  SearchX,
  Plus,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Smartphone,
  Info,
} from 'lucide-react';
import { PromptItem, CategoryId, ToastMessage } from './types';
import {
  initDatabase,
  getAllPrompts,
  addPrompt,
  updatePrompt,
  deletePrompt,
  resetDatabaseToDefaults,
} from './lib/db';
import { Navbar } from './components/Navbar';
import { CategoryFilter } from './components/CategoryFilter';
import { PromptCard } from './components/PromptCard';
import { PromptDetailsModal } from './components/PromptDetailsModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ImageViewerModal } from './components/ImageViewerModal';
import { ToastContainer } from './components/Toast';

export default function App() {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');

  // Modals state
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  // Admin state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Guide toggle
  const [showQuickGuide, setShowQuickGuide] = useState(false);

  // Initialize offline database and fetch items
  const loadData = async () => {
    try {
      setLoading(true);
      await initDatabase();
      const items = await getAllPrompts();
      setPrompts(items);
    } catch (err) {
      console.error('Failed to load prompts from local database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Check if admin is remembered in session
    if (sessionStorage.getItem('ai_prompts_admin_session') === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'error' = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Copy prompt action with SnackBar/Toast
  const handleCopyPrompt = async (promptText: string, title: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(promptText);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = promptText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      addToast('تم نسخ الـ Prompt بنجاح! 📋', `جاهز للصق في ChatGPT أو Midjourney مع صورتك`, 'success');
    } catch (err) {
      addToast('فشل النسخ التلقائي', 'يمكنك تحديد النص ونسخه يدوياً', 'error');
    }
  };

  // Admin handlers
  const handleAdminAuthSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('ai_prompts_admin_session', 'true');
    setShowAdminAuth(false);
    setShowAdminPanel(true);
    addToast('تم تسجيل دخول المدير بنجاح', 'مرحباً بك في لوحة تحكم مكتبة البرومتات', 'info');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('ai_prompts_admin_session');
    setShowAdminPanel(false);
    addToast('تم تسجيل الخروج من لوحة الإدارة', undefined, 'info');
  };

  const handleAddPrompt = async (newItem: PromptItem) => {
    await addPrompt(newItem);
    await loadData();
  };

  const handleUpdatePrompt = async (updatedItem: PromptItem) => {
    await updatePrompt(updatedItem);
    await loadData();
    if (selectedPrompt?.id === updatedItem.id) {
      setSelectedPrompt(updatedItem);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    await deletePrompt(id);
    await loadData();
    if (selectedPrompt?.id === id) {
      setSelectedPrompt(null);
    }
  };

  const handleResetDefaults = async () => {
    await resetDatabaseToDefaults();
    await loadData();
  };

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    let list = prompts;

    if (activeCategory !== 'all') {
      list = list.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.prompt.toLowerCase().includes(q) ||
          (item.targetModel && item.targetModel.toLowerCase().includes(q))
      );
    }

    return list;
  }, [prompts, activeCategory, searchQuery]);

  // Category counts
  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of prompts) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [prompts]);

  // Navigation inside details modal
  const currentIndex = selectedPrompt
    ? filteredPrompts.findIndex((p) => p.id === selectedPrompt.id)
    : -1;
  const hasNext = currentIndex !== -1 && currentIndex < filteredPrompts.length - 1;
  const hasPrev = currentIndex !== -1 && currentIndex > 0;

  const handleNavigateNext = () => {
    if (hasNext) {
      setSelectedPrompt(filteredPrompts[currentIndex + 1]);
    }
  };

  const handleNavigatePrev = () => {
    if (hasPrev) {
      setSelectedPrompt(filteredPrompts[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setShowAdminPanel(true);
          } else {
            setShowAdminAuth(true);
          }
        }}
        totalCount={prompts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* App Hero & Introduction */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 p-6 sm:p-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>مكتبة برومتات ذكية لتوليد وتعديل الصور الشخصية</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                اختر الستايل المفضل لديك، انسخ الـ Prompt، واستخدمه مع صورتك فوراً!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                مكتبة محلية بالكامل تخزن الصور والبرومتات على جهازك وتعمل بدون اتصال بالإنترنت.
                اختر أي صورة تعجبك، واضغط زر النسخ لاستخدامه في ChatGPT أو Midjourney للحصول على نفس النتيجة لشخصيتك.
              </p>
            </div>

            {/* Quick guide toggle button */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => setShowQuickGuide(!showQuickGuide)}
                className="px-4 py-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-zinc-600 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>{showQuickGuide ? 'إخفاء طريقة الاستخدام' : 'كيفية استخدام البرومتات؟'}</span>
              </button>

              {isAdminLoggedIn && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة نمط جديد (Admin)</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Guide Collapsible Card */}
          {showQuickGuide && (
            <div className="mt-6 pt-6 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <span className="font-bold text-indigo-400 text-sm">1. اختر النمط</span>
                <p className="text-zinc-400 leading-relaxed">
                  تصفح صور الأنماط المختلفة (سينمائي، استوديو رسمي، سايبربانك، بيكسار، أزياء...) واضغط على ما يعجبك.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <span className="font-bold text-indigo-400 text-sm">2. انسخ الـ Prompt</span>
                <p className="text-zinc-400 leading-relaxed">
                  اضغط على زر النسخ السريع لنسخ النص الإنجليزي المصاغ خصيصاً ليناسب أدوات الذكاء الاصطناعي بدقة.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <span className="font-bold text-indigo-400 text-sm">3. ارفع صورتك في التطبيق</span>
                <p className="text-zinc-400 leading-relaxed">
                  افتح ChatGPT أو Midjourney، ارفق صورتك الشخصية بوضوح والصق هذا البرومت لتتولد لك صورة مطابقة للملامح والنمط!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Categories Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>تصنيفات الأنماط:</span>
            </h3>
            <span className="text-xs text-zinc-500">
              {filteredPrompts.length} من أصل {prompts.length} نمط
            </span>
          </div>

          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            countsByCategory={countsByCategory}
          />
        </div>

        {/* Content Section: GridView (2 columns on mobile as requested in SRS, 3-4 on larger screens) */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/5] bg-zinc-800/40 w-full" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                  <div className="h-4 bg-zinc-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-4 max-w-md mx-auto my-12">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-800/60 flex items-center justify-center text-zinc-500">
              <SearchX className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">لم يتم العثور على أنماط مطابقة</h3>
              <p className="text-xs text-zinc-400">
                جرب تغيير كلمة البحث أو اختيار تصنيف مختلف
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors"
            >
              عرض جميع الأنماط
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredPrompts.map((item) => (
              <PromptCard
                key={item.id}
                item={item}
                onOpenDetails={setSelectedPrompt}
                onCopyPrompt={handleCopyPrompt}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950 py-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-zinc-300">
              AI Prompts Library · مكتبة برومتات الذكاء الاصطناعي
            </span>
          </div>

          <p className="text-zinc-400">
            تطبيق محلي 100% يعمل في وضع عدم الاتصال (Offline-First) · جميع الحقوق محفوظة لمالك التطبيق
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setShowAdminPanel(true);
                } else {
                  setShowAdminAuth(true);
                }
              }}
              className="text-zinc-400 hover:text-zinc-200 text-xs underline underline-offset-4"
            >
              {isAdminLoggedIn ? 'لوحة تحكم المدير (مفتوحة)' : 'مدخل المدير السري (Admin)'}
            </button>
          </div>
        </div>
      </footer>

      {/* Prompt Details Modal */}
      <PromptDetailsModal
        item={selectedPrompt}
        isOpen={Boolean(selectedPrompt)}
        onClose={() => setSelectedPrompt(null)}
        onCopyPrompt={handleCopyPrompt}
        onNavigateNext={handleNavigateNext}
        onNavigatePrev={handleNavigatePrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onOpenFullscreenImage={(url, title) => setFullscreenImage({ url, title })}
      />

      {/* Fullscreen Image Lightbox Modal */}
      <ImageViewerModal
        imageUrl={fullscreenImage?.url || null}
        title={fullscreenImage?.title || ''}
        isOpen={Boolean(fullscreenImage)}
        onClose={() => setFullscreenImage(null)}
      />

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={showAdminAuth}
        onClose={() => setShowAdminAuth(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        prompts={prompts}
        onAddPrompt={handleAddPrompt}
        onUpdatePrompt={handleUpdatePrompt}
        onDeletePrompt={handleDeletePrompt}
        onResetDefaults={handleResetDefaults}
        onLogoutAdmin={handleAdminLogout}
        onShowToast={addToast}
      />
    </div>
  );
}
