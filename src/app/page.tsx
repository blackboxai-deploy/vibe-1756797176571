"use client";

import { useState, useCallback } from "react";
import { GeneratedImage, GenerationRequest, GenerationStatus } from "@/types/image";
import { generateImage } from "@/lib/api";
import { saveGeneratedImage, getGenerationHistory } from "@/lib/storage";
import { generateImageId } from "@/lib/image-utils";
import ImageGenerator from "@/components/ImageGenerator";
import ImageGallery from "@/components/ImageGallery";
import GenerationProgress from "@/components/GenerationProgress";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function HomePage() {
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>("idle");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progressMessage, setProgressMessage] = useState("");

  // Load saved images on component mount
  useState(() => {
    const history = getGenerationHistory();
    setGeneratedImages(history.images);
  });

  const handleGenerate = useCallback(async (request: GenerationRequest) => {
    setGenerationStatus("generating");
    setCurrentPrompt(request.prompt);
    setProgressMessage("Initializing AI model...");

    try {
      // Update progress messages
      const progressMessages = [
        "Initializing AI model...",
        "Processing your prompt...",
        "Generating image composition...",
        "Adding details and refinements...",
        "Finalizing your image..."
      ];

      let messageIndex = 0;
      const progressInterval = setInterval(() => {
        if (messageIndex < progressMessages.length - 1) {
          messageIndex++;
          setProgressMessage(progressMessages[messageIndex]);
        }
      }, 8000); // Update every 8 seconds

      const response = await generateImage(request);

      clearInterval(progressInterval);

      if (response.success && response.imageUrl) {
        const newImage: GeneratedImage = {
          id: generateImageId(),
          url: response.imageUrl,
          prompt: request.prompt,
          style: request.style,
          aspectRatio: request.aspectRatio,
          createdAt: new Date(),
          downloadUrl: response.imageUrl
        };

        // Save to storage and update state
        saveGeneratedImage(newImage);
        setGeneratedImages(prev => [newImage, ...prev]);
        setGenerationStatus("success");
        
        toast.success("Image generated successfully!", {
          description: "Your new image has been added to the gallery."
        });
      } else {
        throw new Error(response.error || "Failed to generate image");
      }
    } catch (error) {
      setGenerationStatus("error");
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      toast.error("Generation failed", {
        description: errorMessage
      });
      
      console.error("Image generation failed:", error);
    } finally {
      setProgressMessage("");
    }
  }, []);

  const handleImageDelete = useCallback((imageId: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== imageId));
    toast.success("Image deleted from gallery");
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Image Generator
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Transform your imagination into stunning visuals with cutting-edge AI technology
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            High-Quality Generation
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Multiple Styles
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Custom Aspect Ratios
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Instant Download
          </span>
        </div>
      </section>

      {/* Generation Section */}
      <section id="generator" className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Create Your Image</h2>
          <p className="text-gray-600">Describe what you want to see and let AI bring it to life</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <ImageGenerator 
            onGenerate={handleGenerate}
            isGenerating={generationStatus === "generating"}
          />
          
          {generationStatus === "generating" && (
            <div className="mt-8">
              <GenerationProgress 
                message={progressMessage}
                prompt={currentPrompt}
              />
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      {generatedImages.length > 0 && (
        <section id="gallery" className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Your Creations</h2>
            <p className="text-gray-600">
              {generatedImages.length} image{generatedImages.length !== 1 ? "s" : ""} generated
            </p>
          </div>
          
          <ImageGallery 
            images={generatedImages}
            onImageDelete={handleImageDelete}
          />
        </section>
      )}

      {/* Features Section */}
      <section id="about" className="py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
          <p className="text-gray-600">Everything you need to create amazing AI-generated images</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mx-auto flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Advanced AI Models</h3>
            <p className="text-gray-600">
              Powered by state-of-the-art Flux models for exceptional image quality and detail
            </p>
          </div>
          
          <div className="text-center space-y-4 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl mx-auto flex items-center justify-center">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Fast Generation</h3>
            <p className="text-gray-600">
              Quick processing with real-time progress updates to keep you informed
            </p>
          </div>
          
          <div className="text-center space-y-4 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto flex items-center justify-center">
              <span className="text-white font-bold">⚙️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Customizable Styles</h3>
            <p className="text-gray-600">
              Multiple artistic styles and aspect ratios to match your creative vision
            </p>
          </div>
        </div>
      </section>

      <Toaster position="bottom-right" />
    </div>
  );
}