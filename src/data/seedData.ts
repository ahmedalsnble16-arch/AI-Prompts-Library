import { PromptItem, Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', nameAr: 'جميع الأنماط', nameEn: 'All Styles' },
  { id: 'portrait', nameAr: 'بورتريه وسيلفي', nameEn: 'Portraits & Selfies' },
  { id: 'cinematic', nameAr: 'سينمائي درامي', nameEn: 'Cinematic & Moody' },
  { id: 'studio', nameAr: 'استوديو رسمي', nameEn: 'Studio Headshots' },
  { id: 'fantasy', nameAr: 'خيالي وسايبربانك', nameEn: 'Fantasy & Cyberpunk' },
  { id: '3d-render', nameAr: 'ثلاثي الأبعاد وكرتون', nameEn: '3D Render & Pixar' },
  { id: 'anime', nameAr: 'أنمي ورسم ياباني', nameEn: 'Anime & Manga' },
  { id: 'fashion', nameAr: 'أزياء ومجلات', nameEn: 'High Fashion' },
];

export const SEED_PROMPTS: PromptItem[] = [
  {
    id: 'seed-1',
    title: 'بورتريه سايبربانك نيون مستقبلي',
    category: 'fantasy',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80',
    prompt: 'Ultra-realistic close-up portrait of the person in the reference photo, bathed in neon cyberpunk lighting, glowing cyan and magenta reflections on wet skin, dark rainy Neo-Tokyo street background with holographic signs and bokeh, 8k resolution, cinematic atmosphere, shot on 85mm f/1.4 lens, hyper-detailed facial texture --ar 4:5 --v 6.0',
    targetModel: 'ChatGPT / Midjourney v6',
    aspectRatio: '4:5',
    createdAt: 1714000000000,
    userPhotoTip: 'في شات جي بي تي: ارفع صورتك الشخصية أولاً، ثم الصق هذا البرومت واكتب قبله: "عدّل ملامح الشخص في صورتي لتناسب هذا الوصف:"'
  },
  {
    id: 'seed-2',
    title: 'صورة شخصية رسمية احترافية للشركات (Executive Headshot)',
    category: 'studio',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    prompt: 'Professional corporate headshot of the subject in the uploaded photo, wearing a sharp tailored charcoal suit, soft studio Rembrandt lighting, subtle blurred office loft background with neutral gray tones, warm confident smile, editorial photography style, 50mm lens portrait, photorealistic, pristine depth of field --ar 1:1 --v 6.0',
    targetModel: 'ChatGPT / Leonardo / Midjourney',
    aspectRatio: '1:1',
    createdAt: 1714010000000,
    userPhotoTip: 'مثالي لصور LinkedIn: ارفع صورتك العادية واطلب تطبيق هذا النمط للحصول على مظهر تنفيذي فخم.'
  },
  {
    id: 'seed-3',
    title: 'مجسم ثلاثي الأبعاد لطيف بنمط استوديو بيكسار (Pixar Character)',
    category: '3d-render',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    prompt: 'Cute stylized 3D animated character portrait inspired by Pixar and Disney animation, keeping the exact facial hairstyle and facial features of the person in the photo, soft porcelain skin, expressive large sparkling eyes, warm volumetric lighting, octane render, vivid pastel colors, highly detailed clothing texture, 4k 3D art --ar 1:1',
    targetModel: 'ChatGPT (DALL-E 3) / Flux',
    aspectRatio: '1:1',
    createdAt: 1714020000000,
    userPhotoTip: 'حوّل صورتك أو صورة أصدقائك إلى شخصية كرتونية ثلاثية الأبعاد بملامح حقيقية قابلة للتعرف.'
  },
  {
    id: 'seed-4',
    title: 'لقطة سينمائية ليلية مع قطرات مطر وضباب',
    category: 'cinematic',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    prompt: 'Moody cinematic film still of the person in the photo standing under a vintage street lamp at night, gentle misty rain, holding a clear umbrella, soft golden backlight rim lighting, analog 35mm film grain, muted tones, Kodak Portra 400 color grading, emotional cinematic atmosphere, 8k resolution --ar 16:9',
    targetModel: 'Midjourney v6 / Flux.1',
    aspectRatio: '16:9',
    createdAt: 1714030000000,
    userPhotoTip: 'الصق هذا البرومت بعد إرفاق صورتك للحصول على لقطة سينمائية تشبه بوسترات أفلام الدراما الكلاسيكية.'
  },
  {
    id: 'seed-5',
    title: 'ستايل غلاف مجلة أزياء فوغ العالمية (Vogue High-Fashion)',
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
    prompt: 'High fashion editorial photography featuring the subject in the photo, elegant avant-garde designer attire, dramatic high-contrast studio strobe lighting, crisp monochrome with gold accents, minimalistic luxury backdrop, confident high-end fashion pose, shot by Annie Leibovitz, Hasselblad 100MP clarity --ar 4:5',
    targetModel: 'ChatGPT / Midjourney',
    aspectRatio: '4:5',
    createdAt: 1714040000000,
    userPhotoTip: 'استخدم صورتك الشخصية مع هذا البرومت لتتحول كأنك عارض أزياء رئيسي على غلاف مجلة عالمية.'
  },
  {
    id: 'seed-6',
    title: 'رسم أنمي ياباني بأسلوب استوديو جيبلي وسماء الغروب',
    category: 'anime',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    prompt: 'Hand-drawn anime aesthetic portrait of the person in the reference picture, Studio Ghibli style, Hayao Miyazaki artwork, breathtaking golden hour sky with fluffy cumulus clouds, gentle breeze blowing hair, soft watercolor tones, nostalgic vintage anime feel, vibrant colors, 1990s retro anime screengrab --ar 16:9',
    targetModel: 'ChatGPT / Niji 6 / Stable Diffusion',
    aspectRatio: '16:9',
    createdAt: 1714050000000,
    userPhotoTip: 'يعطي صورتك طابع أفلام الأنمي الكلاسيكية مثل أفلام ميازاكي وماكوتو شينكاي.'
  },
  {
    id: 'seed-7',
    title: 'بورتريه ملكي كلاسيكي زيتي من عصر النهضة',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
    prompt: 'Oil painting portrait of the person in the photo depicted as royalty, Renaissance master style like Rembrandt and Caravaggio, chiaroscuro deep shadows and dramatic candlelit glow, rich velvet royal robe with intricate gold embroidery, aged canvas texture, museum masterpiece, fine art oil painting --ar 3:4',
    targetModel: 'ChatGPT / Midjourney v6',
    aspectRatio: '3:4',
    createdAt: 1714060000000,
    userPhotoTip: 'حوّل صورتك إلى لوحة فنية أثرية معلقة في المتاحف الأوروبية الكبرى.'
  },
  {
    id: 'seed-8',
    title: 'فارس خيالي أسطوري مع درع لامع وطاقة سحرية',
    category: 'fantasy',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    prompt: 'Epic fantasy warrior portrait featuring the facial features of the uploaded person, clad in ornate obsidian and silver runic plate armor, glowing ethereal blue energy runes, dark mystical enchanted forest background, photorealistic fantasy cinematic keyframe, volumetric smoke, unreal engine 5 quality --ar 9:16',
    targetModel: 'ChatGPT / Midjourney / Flux',
    aspectRatio: '9:16',
    createdAt: 1714070000000,
    userPhotoTip: 'ستايل مذهل لصور البروفايل والألعاب وخلفيات الهاتف الطولية.'
  },
  {
    id: 'seed-9',
    title: 'سيلفي شاطئي صيفي مشمس مع توهج الشمس الذهبية',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    prompt: 'Casual sun-drenched beach selfie of the subject in the photo, natural authentic smile, warm golden hour sun flare, wind-tousled hair, turquoise ocean waves in the background, candid realistic smartphone camera photo, natural skin imperfections, authentic lifestyle photography, 8k --ar 9:16',
    targetModel: 'ChatGPT / Flux.1',
    aspectRatio: '9:16',
    createdAt: 1714080000000,
    userPhotoTip: 'برومت طبيعي جداً بدون مبالغة يبدو كأنك التقطت سيلفي حقيقي بهاتفك أثناء إجازة صيفية فاخرة.'
  },
  {
    id: 'seed-10',
    title: 'تمثال رخامي روماني كلاسيكي بلمسات ذهبية متشققة (Kintsugi)',
    category: '3d-render',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
    prompt: 'Exquisite classical Roman marble bust sculpture with the facial likeness of the reference photo, smooth white Carrara marble with fine veins, delicate Japanese Kintsugi gold lacquer repairing subtle fractures, dramatic museum black backdrop, dramatic side lighting, high-definition photorealism --ar 1:1',
    targetModel: 'Midjourney v6 / ChatGPT',
    aspectRatio: '1:1',
    createdAt: 1714090000000,
    userPhotoTip: 'نمط فني فاخر وأنيق جداً للصور الرمزية ذات الطابع الفلسفي أو الفني الراقي.'
  },
  {
    id: 'seed-11',
    title: 'إضاءة سينمائية مزدوجة بألوان النيون (Bi-Color Portrait)',
    category: 'cinematic',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
    prompt: 'Intense dual-tone cinematic portrait of the person in the photo, split lighting with deep amber gold on one side and electric teal cyan on the other, pitch black background, crisp sharp focus on facial eyes and beard/features, cinematic 85mm lens, high contrast, poster worthy quality --ar 4:5',
    targetModel: 'ChatGPT / Midjourney v6',
    aspectRatio: '4:5',
    createdAt: 1714100000000,
    userPhotoTip: 'إضاءة استوديو متقدمة ومشهورة في بوسترات هوليوود الحديثة.'
  },
  {
    id: 'seed-12',
    title: 'شخصية كلاي ميشن كرتونية مصنوعة من الصلصال (Claymation)',
    category: '3d-render',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=900&q=80',
    prompt: 'Charming handcrafted claymation character portrait based on the uploaded photo, tactile modeling clay texture with visible subtle artist fingerprints, stop-motion animation aesthetic, miniature studio set, warm soft lighting, Aardman Studios inspired, fun and whimsical, macro photography --ar 1:1',
    targetModel: 'ChatGPT / Flux',
    aspectRatio: '1:1',
    createdAt: 1714110000000,
    userPhotoTip: 'تصميم مبتكر ولطيف جداً يحول صورتك إلى مجسم صلصال يدوي فني.'
  }
];
