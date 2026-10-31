import { PromptItem } from '../types';
import { SEED_PROMPTS } from '../data/seedData';

const DB_NAME = 'ai_prompts_library_db';
const DB_VERSION = 1;
const STORE_NAME = 'prompts';
const LOCAL_STORAGE_BACKUP_KEY = 'ai_prompts_fallback_v1';
const ADMIN_PIN_KEY = 'ai_prompts_admin_pin';
const DEFAULT_PIN = '1234';

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback to LocalStorage if IndexedDB fails or is unavailable
function getLocalStorageItems(): PromptItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalStorageItems(items: PromptItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage save failed, might be out of quota:', e);
  }
}

export async function initDatabase(): Promise<void> {
  try {
    const db = await openIndexedDB();
    const count = await new Promise<number>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const countReq = store.count();
      countReq.onsuccess = () => resolve(countReq.result);
      countReq.onerror = () => reject(countReq.error);
    });

    if (count === 0) {
      // Seed initial data
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const item of SEED_PROMPTS) {
        store.add(item);
      }
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      // also mirror to local storage
      saveLocalStorageItems(SEED_PROMPTS);
    }
  } catch (err) {
    console.warn('IndexedDB initialization failed, using LocalStorage:', err);
    const existing = getLocalStorageItems();
    if (existing.length === 0) {
      saveLocalStorageItems(SEED_PROMPTS);
    }
  }
}

export async function getAllPrompts(): Promise<PromptItem[]> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const items: PromptItem[] = req.result || [];
        // Sort newest first
        items.sort((a, b) => b.createdAt - a.createdAt);
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    const items = getLocalStorageItems();
    if (items.length === 0) return [...SEED_PROMPTS].sort((a, b) => b.createdAt - a.createdAt);
    return items.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export async function addPrompt(item: PromptItem): Promise<void> {
  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // fallback
  }

  // Also update LocalStorage mirror
  const current = getLocalStorageItems();
  const updated = [item, ...current.filter((i) => i.id !== item.id)];
  saveLocalStorageItems(updated);
}

export async function updatePrompt(item: PromptItem): Promise<void> {
  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // fallback
  }

  const current = getLocalStorageItems();
  const updated = current.map((i) => (i.id === item.id ? item : i));
  saveLocalStorageItems(updated);
}

export async function deletePrompt(id: string): Promise<void> {
  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // fallback
  }

  const current = getLocalStorageItems();
  const updated = current.filter((i) => i.id !== id);
  saveLocalStorageItems(updated);
}

export async function resetDatabaseToDefaults(): Promise<void> {
  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        for (const item of SEED_PROMPTS) {
          store.add(item);
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // fallback
  }
  saveLocalStorageItems(SEED_PROMPTS);
}

export function getAdminPin(): string {
  try {
    return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
  } catch {
    return DEFAULT_PIN;
  }
}

export function setAdminPin(newPin: string): void {
  try {
    localStorage.setItem(ADMIN_PIN_KEY, newPin.trim());
  } catch (e) {
    console.error('Failed to save admin PIN', e);
  }
}
