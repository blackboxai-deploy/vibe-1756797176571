"use client";

import { useState, useCallback } from "react";
import { GenerationRequest, AspectRatio, ImageQuality } from "@/types/image";
import { validatePrompt } from "@/lib/api";
import PromptInput from "./PromptInput";
import StyleSelector from "./StyleSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ASPECT_RATIOS } from "@/lib/image-utils";

interface ImageGeneratorProps {
  onGenerate: (request: GenerationRequest) => Promise<void>;
  isGenerating: boolean;
}

export default function ImageGenerator({ onGenerate, isGenerating }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("none");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [quality, setQuality] = useState<ImageQuality>("high");
  const [promptError, setPromptError] = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setPromptError("");

    // Validate prompt
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      setPromptError(validation.error || "Invalid prompt");
      return;
    }

    // Create generation request
    const request: GenerationRequest = {
      prompt: prompt.trim(),
      style: selectedStyle,
      aspectRatio,
      quality
    };

    try {
      await onGenerate(request);
    } catch (error) {
      console.error("Generation failed:", error);
    }
  }, [prompt, selectedStyle, aspectRatio, quality, onGenerate]);

  const isFormValid = prompt.trim().length > 0 && !promptError;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Prompt Input Section */}
      <div className="space-y-4">
        <Label htmlFor="prompt" className="text-base font-semibold text-gray-900">
          Describe Your Image
        </Label>
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          error={promptError}
          disabled={isGenerating}
          placeholder="A serene mountain landscape at sunset with golden light..."
        />
        {promptError && (
          <p className="text-sm text-red-600 flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            {promptError}
          </p>
        )}
      </div>

      {/* Style Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-900">
          Choose Style
        </Label>
        <StyleSelector
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          disabled={isGenerating}
        />
      </div>

      {/* Settings Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Aspect Ratio */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              Aspect Ratio
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Select 
              value={aspectRatio} 
              onValueChange={(value: AspectRatio) => setAspectRatio(value)}
              disabled={isGenerating}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{ratio.label}</span>
                      <span className="text-xs text-gray-500">{ratio.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Quality Settings */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              Quality Level
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Select 
              value={quality} 
              onValueChange={(value: ImageQuality) => setQuality(value)}
              disabled={isGenerating}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Standard</span>
                      <Badge variant="outline" className="text-xs">Fast</Badge>
                    </div>
                    <span className="text-xs text-gray-500">Good quality, quick generation</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">High</span>
                      <Badge variant="secondary" className="text-xs">Balanced</Badge>
                    </div>
                    <span className="text-xs text-gray-500">High quality with detail</span>
                  </div>
                </SelectItem>
                <SelectItem value="ultra">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Ultra</span>
                      <Badge variant="default" className="text-xs">Premium</Badge>
                    </div>
                    <span className="text-xs text-gray-500">Maximum quality, slower generation</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={!isFormValid || isGenerating}
          className="px-12 py-3 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <span className="mr-2">✨</span>
              Generate Image
            </>
          )}
        </Button>
      </div>

      {/* Generation Info */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>Generation typically takes 30-90 seconds</p>
        <p>Higher quality settings may take longer</p>
      </div>
    </form>
  );
}