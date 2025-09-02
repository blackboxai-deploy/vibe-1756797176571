import { GenerationRequest, GenerationResponse } from "@/types/image";

// Custom API endpoint configuration (no API keys required)
const API_ENDPOINT = "https://oi-server.onrender.com/chat/completions";
const API_HEADERS = {
  "customerId": "habelsitopu1@gmail.com",
  "Content-Type": "application/json",
  "Authorization": "Bearer xxx"
};

// Default model for image generation
const DEFAULT_MODEL = "replicate/black-forest-labs/flux-1.1-pro";

// Timeout for image generation (5 minutes)
const GENERATION_TIMEOUT = 5 * 60 * 1000;

export async function generateImage(request: GenerationRequest): Promise<GenerationResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GENERATION_TIMEOUT);

  try {
    const prompt = buildPrompt(request);
    
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: API_HEADERS,
      signal: controller.signal,
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract image URL from response
    const imageUrl = extractImageUrl(data);
    
    if (!imageUrl) {
      throw new Error("No image URL found in response");
    }

    return {
      success: true,
      imageUrl,
      metadata: {
        model: DEFAULT_MODEL,
        processingTime: Date.now(),
        prompt: request.prompt
      }
    };

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: "Generation timed out. Please try again with a simpler prompt."
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

function buildPrompt(request: GenerationRequest): string {
  let prompt = request.prompt;

  // Add style modifiers
  if (request.style && request.style !== "none") {
    const styleModifiers = {
      photorealistic: "photorealistic, highly detailed, professional photography",
      artistic: "artistic, creative, expressive, unique style",
      cinematic: "cinematic lighting, dramatic, movie-like composition",
      fantasy: "fantasy art, magical, ethereal, mystical atmosphere",
      abstract: "abstract art, geometric shapes, creative interpretation",
      vintage: "vintage style, retro aesthetic, nostalgic atmosphere"
    };
    
    const modifier = styleModifiers[request.style as keyof typeof styleModifiers];
    if (modifier) {
      prompt = `${prompt}, ${modifier}`;
    }
  }

  // Add quality modifiers
  if (request.quality === "high" || request.quality === "ultra") {
    prompt = `${prompt}, high quality, detailed, professional`;
  }

  if (request.quality === "ultra") {
    prompt = `${prompt}, ultra high definition, masterpiece, award winning`;
  }

  // Add aspect ratio hint
  if (request.aspectRatio && request.aspectRatio !== "1:1") {
    const ratioHints = {
      "16:9": "wide landscape format",
      "9:16": "tall portrait format", 
      "3:2": "landscape format",
      "2:3": "portrait format",
      "4:3": "standard format",
      "3:4": "vertical format"
    };
    
    const hint = ratioHints[request.aspectRatio as keyof typeof ratioHints];
    if (hint) {
      prompt = `${prompt}, ${hint}`;
    }
  }

  return prompt;
}

function extractImageUrl(response: any): string | null {
  // Handle different response formats from the AI service
  if (typeof response === 'string' && response.startsWith('http')) {
    return response;
  }
  
  if (response?.choices?.[0]?.message?.content) {
    const content = response.choices[0].message.content;
    
    // Try to extract URL from content
    const urlMatch = content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|webp)/i);
    if (urlMatch) {
      return urlMatch[0];
    }
  }
  
  if (response?.data?.[0]?.url) {
    return response.data[0].url;
  }
  
  if (response?.images?.[0]) {
    return response.images[0];
  }
  
  return null;
}

export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, error: "Prompt cannot be empty" };
  }
  
  if (prompt.length > 1000) {
    return { valid: false, error: "Prompt must be less than 1000 characters" };
  }
  
  // Check for inappropriate content patterns
  const inappropriatePatterns = [
    /\b(nude|naked|nsfw|explicit|sexual)\b/i,
    /\b(violence|blood|gore|death|kill)\b/i,
    /\b(hate|racism|discrimination)\b/i
  ];
  
  for (const pattern of inappropriatePatterns) {
    if (pattern.test(prompt)) {
      return { valid: false, error: "Prompt contains inappropriate content" };
    }
  }
  
  return { valid: true };
}