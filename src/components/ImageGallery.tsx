"use client";

import { useState } from "react";
import { GeneratedImage } from "@/types/image";
import ImageViewer from "./ImageViewer";
import DownloadButton from "./DownloadButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { truncatePrompt } from "@/lib/image-utils";
import { deleteImageFromHistory } from "@/lib/storage";

interface ImageGalleryProps {
  images: GeneratedImage[];
  onImageDelete?: (imageId: string) => void;
}

export default function ImageGallery({ images, onImageDelete }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
  };

  const handleDeleteImage = async (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (deletingImages.has(imageId)) return;
    
    setDeletingImages(prev => new Set(prev).add(imageId));
    
    try {
      deleteImageFromHistory(imageId);
      onImageDelete?.(imageId);
    } catch (error) {
      console.error("Failed to delete image:", error);
    } finally {
      setDeletingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎨</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Generated Yet</h3>
        <p className="text-gray-600">Create your first AI-generated image using the form above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => {
          const isDeleting = deletingImages.has(image.id);
          
          return (
            <Card 
              key={image.id}
              className={`group cursor-pointer overflow-hidden border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 ${
                isDeleting ? "opacity-50" : ""
              }`}
              onClick={() => handleImageClick(image)}
            >
              <div className="relative">
                {/* Image */}
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={image.url}
                    alt={truncatePrompt(image.prompt, 100)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/217f1a48-3fbd-4629-9ed5-5e4ba220e3f2.png";
                    }}
                  />
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-gray-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(image);
                      }}
                    >
                      👁️ View
                    </Button>
                    <DownloadButton
                      imageUrl={image.url}
                      filename={`ai-image-${image.id}`}
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-gray-900"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-500/90 hover:bg-red-500 text-white"
                      onClick={(e) => handleDeleteImage(image.id, e)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "⏳" : "🗑️"}
                    </Button>
                  </div>
                </div>

                {/* Style Badge */}
                {image.style && image.style !== "none" && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
                      {image.style}
                    </Badge>
                  </div>
                )}

                {/* Aspect Ratio Badge */}
                {image.aspectRatio && image.aspectRatio !== "1:1" && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="text-xs bg-white/90 text-gray-800 border-white/50">
                      {image.aspectRatio}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
                    {truncatePrompt(image.prompt, 80)}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {new Date(image.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <DownloadButton
                      imageUrl={image.url}
                      filename={`ai-image-${image.id}`}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ⬇️
                    </DownloadButton>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <ImageViewer
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={(imageId) => {
            onImageDelete?.(imageId);
            setSelectedImage(null);
          }}
        />
      )}
    </>
  );
}