import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  PlusCircle,
  ListFilter,
  Trash2,
  Edit3,
  Save,
  Download,
  UploadCloud,
  RotateCcw,
  Key,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { PromptItem, CategoryId } from '../types';
import { CATEGORIES } from '../data/seedData';
import { setAdminPin } from '../lib/db';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: PromptItem[];
  onAddPrompt: (item: PromptItem) => Promise<void>;
  onUpdatePrompt: (item: PromptItem) => Promise<void>;
  onDeletePrompt: (id: string) => Promise<void>;
  onResetDefaults: () => Promise<void>;
  onLogoutAdmin: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  prompts,
  onAddPrompt,
  onUpdatePrompt,
  onDeletePrompt,
  onResetDefaults,
  onLogoutAdmin,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'manage' | 'settings'>('add');
  const [editingItem, setEditingItem] = useState<PromptItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<CategoryId>('portrait');
  const [targetModel, setTargetModel] = useState('ChatGPT / Midjourney');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [userPhotoTip, setUserPhotoTip] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Settings states
  const [newPin, setNewPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local image file upload (converts to base64 Data URL so it works 100% offline)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('الرجاء اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setFormError('حجم الصورة كبير جداً (الحد الأقصى 8 ميجابايت).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      setFormError(null);
    };
    reader.onerror = () => {
      setFormError('حدث خطأ أثناء قراءة ملف الصورة من جهازك.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
        setFormError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPromptText('');
    setImageUrl('');
    setCategory('portrait');
    setTargetModel('ChatGPT / Midjourney');
    setAspectRatio('1:1');
    setUserPhotoTip('');
    setEditingItem(null);
    setFormError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (item: PromptItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setPromptText(item.prompt);
    setImageUrl(item.imageUrl);
    setCategory(item.category);
    setTargetModel(item.targetModel || 'ChatGPT / Midjourney');
    setAspectRatio(item.aspectRatio || '1:1');
    setUserPhotoTip(item.userPhotoTip || '');
    setActiveTab('add');
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation (كما ورد بالوثيقة: يتحقق من اكتمال الحقول واختيار الصورة)
    if (!imageUrl.trim()) {
      setFormError('الرجاء اختيار صورة للنمط من المعرض أو الجهاز.');
      return;
    }
    if (!title.trim()) {
      setFormError('الرجاء كتابة عنوان النمط أو الستايل.');
      return;
    }
    if (!promptText.trim()) {
      setFormError('الرجاء إدخال نص الـ Prompt الموجه للذكاء الاصطناعي.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      if (editingItem) {
        const updatedItem: PromptItem = {
          ...editingItem,
          title: title.trim(),
          prompt: promptText.trim(),
          imageUrl: imageUrl.trim(),
          category,
          targetModel: targetModel.trim(),
          aspectRatio: aspectRatio.trim(),
          userPhotoTip: userPhotoTip.trim() || undefined,
        };
        await onUpdatePrompt(updatedItem);
        onShowToast('تم تحديث النمط بنجاح', `تم حفظ التعديلات على "${title}"`, 'success');
      } else {
        const newItem: PromptItem = {
          id: `custom-${Date.now()}`,
          title: title.trim(),
          prompt: promptText.trim(),
          imageUrl: imageUrl.trim(),
          category,
          targetModel: targetModel.trim(),
          aspectRatio: aspectRatio.trim(),
          createdAt: Date.now(),
          userPhotoTip: userPhotoTip.trim() || undefined,
          isCustomUploaded: true,
        };
        await onAddPrompt(newItem);
        onShowToast('تمت إضافة النمط بنجاح', `تم حفظ "${title}" في قاعدة البيانات المحلية`, 'success');
      }

      resetForm();
      onClose();
    } catch (err) {
      setFormError('فشل حفظ البيانات في قاعدة البيانات المحلية.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(prompts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ai_prompts_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('تم تصدير النسخة الاحتياطية', 'تم تنزيل ملف JSON يحتوي على كامل الأنماط', 'info');
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const imported = JSON.parse(reader.result as string) as PromptItem[];
        if (Array.isArray(imported) && imported.length > 0) {
          for (const item of imported) {
            await onAddPrompt(item);
          }
          onShowToast('تم استيراد البيانات بنجاح', `تمت إضافة ${imported.length} نمط إلى المكتبة`, 'success');
        }
      } catch (err) {
        onShowToast('خطأ في استيراد الملف', 'تأكد من اختيار ملف JSON صحيح', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Handle PIN change
  const handlePinUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      setAdminPin(newPin.trim());
      setPinChangeMsg('تم تغيير رمز المرور السري بنجاح!');
      setNewPin('');
      setTimeout(() => setPinChangeMsg(''), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                لوحة تحكم مالك التطبيق (Admin Control)
              </h2>
              <p className="text-xs text-zinc-400">
                إضافة وإدارة محتوى المكتبة والتخزين المحلي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLogoutAdmin();
                onClose();
              }}
              className="text-xs text-zinc-400 hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              خروج من الإدارة
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-1 border-b border-zinc-800/60 bg-zinc-950/30 shrink-0">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'add'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{editingItem ? 'تعديل النمط الحالي' : 'إضافة نمط جديد'}</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'manage'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>إدارة المحتوى ({prompts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>النسخ الاحتياطي والأمان</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'add' && (
            <form onSubmit={handleSave} className="space-y-5">
              {editingItem && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs text-amber-300">
                  <span>أنت الآن تقوم بتعديل: <strong>{editingItem.title}</strong></span>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-zinc-400 hover:text-white underline underline-offset-2"
                  >
                    إلغاء التعديل والعودة للإضافة
                  </button>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. حقل اختيار الصورة (Interactive image picker / preview) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300">
                  صورة النمط (معاينة النمط): <span className="text-amber-400">*</span>
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                  id="admin-image-upload"
                />

                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
                    imageUrl
                      ? 'border-indigo-500/50 bg-zinc-950'
                      : 'border-zinc-700 hover:border-amber-400/70 bg-zinc-950/60 hover:bg-zinc-950'
                  }`}
                >
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt="المعاينة"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                        <Upload className="w-6 h-6 text-amber-400" />
                        <span className="text-xs font-semibold">انقر لتغيير الصورة المحددة</span>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center text-amber-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-200">
                          انقر لاختيار صورة من معرض جهازك أو اسحبها هنا
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          يدعم صور JPG, PNG, WebP (تُحفظ محلياً داخل قاعدة البيانات بالكامل)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Image URL Input */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-zinc-500">أو رابط صورة مباشر:</span>
                  <input
                    type="url"
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 py-1.5 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* 2. حقل نصي للعنوان (Title) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  اسم النمط أو الستايل (Title): <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: لقطة سينمائية ليلية بنمط نيون سايبربانك"
                  className="w-full py-2.5 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>

              {/* 3. حقل نصي للبرومت (Prompt Text) - متعدد الأسطر maxLines: 5+ */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  نص الـ Prompt الاحترافي الموجه للذكاء الاصطناعي: <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  dir="ltr"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Ultra-realistic portrait of the person in the photo, 85mm lens, golden hour studio lighting, 8k resolution --ar 4:5..."
                  className="w-full p-4 font-mono text-xs sm:text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-y leading-relaxed"
                />
                <span className="text-[11px] text-zinc-500 block">
                  يمكن كتابة البرومت بالإنجليزية أو العربية، يُفضل تضمين معايير الدقة والعدسة والإضاءة.
                </span>
              </div>

              {/* Meta controls: Category, AI Model, Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-zinc-400">
                    التصنيف:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full py-2 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-zinc-400">
                    أداة الذكاء الاصطناعي:
                  </label>
                  <input
                    type="text"
                    value={targetModel}
                    onChange={(e) => setTargetModel(e.target.value)}
                    placeholder="ChatGPT / Midjourney v6"
                    className="w-full py-2 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-zinc-400">
                    نسبة الأبعاد:
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full py-2 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="1:1">1:1 (مربع)</option>
                    <option value="4:5">4:5 (انستغرام بورتريه)</option>
                    <option value="9:16">9:16 (ستوري / سيلفي طولي)</option>
                    <option value="16:9">16:9 (سينمائي عريض)</option>
                    <option value="3:4">3:4 (كلاسيكي)</option>
                  </select>
                </div>
              </div>

              {/* Extra Tip for User's Photo */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-zinc-400">
                  إرشادات للمستخدم (كيف يدمج صورته الشخصية):
                </label>
                <input
                  type="text"
                  value={userPhotoTip}
                  onChange={(e) => setUserPhotoTip(e.target.value)}
                  placeholder="مثال: ارفع صورتك الشخصية أولاً ثم الصق هذا البرومت لتحصل على صورة رسمية فورية."
                  className="w-full py-2 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* 4. زر الحفظ (Save Button) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 text-zinc-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all"
                >
                  <Save className="w-5 h-5" />
                  <span>
                    {isSaving
                      ? 'جاري الحفظ في قاعدة البيانات...'
                      : editingItem
                      ? 'حفظ التعديلات'
                      : 'حفظ النمط في قاعدة البيانات المحلية'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  إجمالي الأنماط المخزنة: <strong className="text-white">{prompts.length}</strong>
                </span>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('add');
                  }}
                  className="text-xs bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>إضافة نمط جديد</span>
                </button>
              </div>

              <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950">
                {prompts.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-zinc-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-500 truncate max-w-sm mt-0.5">
                          {item.prompt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="تعديل"
                        aria-label="تعديل النمط"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف النمط: "${item.title}"؟`)) {
                            onDeletePrompt(item.id);
                            onShowToast('تم حذف النمط', item.title, 'info');
                          }
                        }}
                        className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="حذف"
                        aria-label="حذف النمط"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Database Backup & Restore */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-400" />
                  النسخ الاحتياطي لقاعدة البيانات المحلية (JSON)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  يمكنك تحميل نسخة احتياطية من جميع الأنماط والبرومتات والصور المخزنة على جهازك في ملف JSON أو استيرادها لاحقاً أو على جهاز آخر.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleExportBackup}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>تصدير نسخة احتياطية (Export JSON)</span>
                  </button>

                  <label className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer">
                    <UploadCloud className="w-4 h-4" />
                    <span>استيراد نسخة (Import JSON)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset to Seed Prompts */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  إعادة ضبط المكتبة الافتراضية
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  إعادة تعيين المحتوى إلى الأنماط الـ 12 المنسقة الأصلية في حال الرغبة في استعادة النموذج الأولي.
                </p>

                <button
                  onClick={() => {
                    if (confirm('هل أنت متأكد من استعادة الأنماط الافتراضية للمكتبة؟')) {
                      onResetDefaults();
                      onShowToast('تمت استعادة المكتبة الأصلية', 'تمت استعادة الأنماط الـ 12 الافتراضية بنجاح', 'success');
                    }
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-rose-950 hover:text-rose-300 text-zinc-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  استعادة الأنماط الأصلية
                </button>
              </div>

              {/* Change Admin PIN */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  تغيير رمز المرور السري للمدير (PIN)
                </h3>
                <p className="text-xs text-zinc-400">
                  الرمز الافتراضي الحالي هو <strong>1234</strong>. يمكنك تعيين أي رمز أرقام جديد من 4 خانات على الأقل.
                </p>

                <form onSubmit={handlePinUpdate} className="flex items-center gap-2 max-w-sm pt-1">
                  <input
                    type="password"
                    inputMode="numeric"
                    minLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="رمز PIN جديد (مثلاً 5678)"
                    className="flex-1 py-2 px-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    تحديث الرمز
                  </button>
                </form>

                {pinChangeMsg && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
                    <CheckCircle className="w-4 h-4" />
                    {pinChangeMsg}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
