import { AspectRatio, StyleOption } from "@/types/image";

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "none",
    name: "Default",
    description: "No specific style applied",
    prompt: ""
  },
  {
    id: "photorealistic",
    name: "Photorealistic",
    description: "Realistic, detailed photography style",
    prompt: "photorealistic, highly detailed, professional photography"
  },
  {
    id: "artistic",
    name: "Artistic",
    description: "Creative and expressive artistic style",
    prompt: "artistic, creative, expressive, unique style"
  },
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Movie-like dramatic lighting and composition",
    prompt: "cinematic lighting, dramatic, movie-like composition"
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Magical and mystical atmosphere",
    prompt: "fantasy art, magical, ethereal, mystical atmosphere"
  },
  {
    id: "abstract",
    name: "Abstract",
    description: "Geometric shapes and creative interpretation",
    prompt: "abstract art, geometric shapes, creative interpretation"
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Retro aesthetic with nostalgic atmosphere",
    prompt: "vintage style, retro aesthetic, nostalgic atmosphere"
  }
];

export const ASPECT_RATIOS: { value: AspectRatio; label: string; description: string }[] = [
  { value: "1:1", label: "Square (1:1)", description: "Perfect for social media posts" },
  { value: "16:9", label: "Landscape (16:9)", description: "Widescreen, great for wallpapers" },
  { value: "9:16", label: "Portrait (9:16)", description: "Vertical, perfect for mobile" },
  { value: "3:2", label: "Photo (3:2)", description: "Classic photography format" },
  { value: "2:3", label: "Portrait Photo (2:3)", description: "Vertical photography format" },
  { value: "4:3", label: "Standard (4:3)", description: "Traditional computer screen" },
  { value: "3:4", label: "Vertical (3:4)", description: "Tall vertical format" }
];

export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getImageDimensions(aspectRatio: AspectRatio): { width: number; height: number } {
  const baseDimensions: Record<AspectRatio, { width: number; height: number }> = {
    "1:1": { width: 1024, height: 1024 },
    "16:9": { width: 1920, height: 1080 },
    "9:16": { width: 1080, height: 1920 },
    "3:2": { width: 1536, height: 1024 },
    "2:3": { width: 1024, height: 1536 },
    "4:3": { width: 1280, height: 960 },
    "3:4": { width: 960, height: 1280 }
  };
  
  return baseDimensions[aspectRatio];
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export async function downloadImage(url: string, filename?: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || `generated-image-${Date.now()}.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Failed to download image:", error);
    throw new Error("Failed to download image. Please try again.");
  }
}

export function validateImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

export function getImageFileExtension(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const extension = pathname.split(".").pop()?.toLowerCase();
    
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension || "")) {
      return extension || "png";
    }
    
    return "png"; // Default fallback
  } catch {
    return "png";
  }
}

export const PROMPT_SUGGESTIONS = [
  "A serene mountain landscape at sunset with golden light",
  "A futuristic cityscape with flying cars and neon lights",
  "A cozy coffee shop interior with warm lighting",
  "A magical forest with glowing mushrooms and fairy lights",
  "A minimalist modern kitchen with clean lines",
  "An underwater scene with colorful coral reefs",
  "A vintage library filled with ancient books",
  "A cyberpunk street scene at night with rain",
  "A peaceful zen garden with cherry blossoms",
  "A steampunk airship floating in cloudy skies"
];

export function getRandomPromptSuggestion(): string {
  return PROMPT_SUGGESTIONS[Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)];
}

export function truncatePrompt(prompt: string, maxLength: number = 50): string {
  if (prompt.length <= maxLength) return prompt;
  return prompt.slice(0, maxLength).trim() + "...";
}