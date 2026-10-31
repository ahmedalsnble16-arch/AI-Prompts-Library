export type CategoryId =
  | 'all'
  | 'portrait'
  | 'cinematic'
  | 'studio'
  | 'fantasy'
  | '3d-render'
  | 'anime'
  | 'fashion';

export interface Category {
  id: CategoryId;
  nameAr: string;
  nameEn: string;
}

export interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  category: CategoryId;
  targetModel?: string; // e.g., 'ChatGPT (DALL-E 3)', 'Midjourney v6', 'Flux.1', 'Stable Diffusion'
  aspectRatio?: string; // e.g., '1:1', '9:16', '16:9', '4:5'
  createdAt: number;
  userPhotoTip?: string; // specific instruction for swapping your photo
  isCustomUploaded?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'error';
}
