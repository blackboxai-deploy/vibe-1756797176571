"use client";

import { GeneratedImage, GenerationHistory } from "@/types/image";

const STORAGE_KEY = "ai-image-generator-history";
const MAX_HISTORY_SIZE = 50; // Limit storage size

export function saveGeneratedImage(image: GeneratedImage): void {
  try {
    const history = getGenerationHistory();
    
    // Add new image to the beginning of the array
    history.images.unshift(image);
    
    // Limit the number of stored images
    if (history.images.length > MAX_HISTORY_SIZE) {
      history.images = history.images.slice(0, MAX_HISTORY_SIZE);
    }
    
    history.lastGenerated = new Date();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save image to history:", error);
  }
}

export function getGenerationHistory(): GenerationHistory {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { images: [] };
    }
    
    const parsed = JSON.parse(stored);
    
    // Convert date strings back to Date objects
    return {
      images: parsed.images.map((img: any) => ({
        ...img,
        createdAt: new Date(img.createdAt)
      })),
      lastGenerated: parsed.lastGenerated ? new Date(parsed.lastGenerated) : undefined
    };
  } catch (error) {
    console.error("Failed to load generation history:", error);
    return { images: [] };
  }
}

export function deleteImageFromHistory(imageId: string): void {
  try {
    const history = getGenerationHistory();
    history.images = history.images.filter(img => img.id !== imageId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to delete image from history:", error);
  }
}

export function clearGenerationHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear generation history:", error);
  }
}

export function getStorageUsage(): { used: number; max: number; percentage: number } {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const usedBytes = data ? new Blob([data]).size : 0;
    const maxBytes = 5 * 1024 * 1024; // 5MB typical localStorage limit
    
    return {
      used: usedBytes,
      max: maxBytes,
      percentage: Math.round((usedBytes / maxBytes) * 100)
    };
  } catch (error) {
    console.error("Failed to calculate storage usage:", error);
    return { used: 0, max: 5 * 1024 * 1024, percentage: 0 };
  }
}

export function exportHistory(): string {
  const history = getGenerationHistory();
  return JSON.stringify(history, null, 2);
}

export function importHistory(jsonData: string): boolean {
  try {
    const parsed = JSON.parse(jsonData);
    
    if (!parsed.images || !Array.isArray(parsed.images)) {
      throw new Error("Invalid history format");
    }
    
    // Validate the structure
    for (const img of parsed.images) {
      if (!img.id || !img.url || !img.prompt || !img.createdAt) {
        throw new Error("Invalid image data in history");
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return true;
  } catch (error) {
    console.error("Failed to import history:", error);
    return false;
  }
}