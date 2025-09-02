"use client";

import { useState } from "react";
import { GeneratedImage } from "@/types/image";
import DownloadButton from "./DownloadButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { deleteImageFromHistory } from "@/lib/storage";

interface ImageViewerProps {
  image: GeneratedImage;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (imageId: string) => void;
}

export default function ImageViewer({ image, isOpen, onClose, onDelete }: ImageViewerProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      deleteImageFromHistory(image.id);
      onDelete?.(image.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete image:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const copyPromptToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      // Could add a toast notification here
    } catch (error) {
      console.error("Failed to copy prompt:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Generated Image Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Display */}
          <div className="relative">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              {!imageLoaded && (
                <div className="aspect-square flex items-center justify-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Loading image...
                  </div>
                </div>
              )}
              <img
                src={image.url}
                alt={image.prompt}
                className={`w-full max-h-[400px] object-contain transition-opacity duration-200 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/54b86f96-a297-4a5d-b78b-ef5ffb9a209a.png";
                  setImageLoaded(true);
                }}
              />
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <DownloadButton
                imageUrl={image.url}
                filename={`ai-image-${image.id}`}
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white shadow-lg"
              />
            </div>
          </div>

          {/* Image Information */}
          <div className="space-y-4">
            {/* Prompt */}
            <Card className="p-4 bg-gray-50 border border-gray-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Prompt</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyPromptToClipboard}
                    className="text-xs text-gray-600 hover:text-gray-900"
                  >
                    📋 Copy
                  </Button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "{image.prompt}"
                </p>
              </div>
            </Card>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Style
                </h4>
                <Badge variant="secondary" className="text-sm">
                  {image.style || "Default"}
                </Badge>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Aspect Ratio
                </h4>
                <Badge variant="outline" className="text-sm">
                  {image.aspectRatio || "1:1"}
                </Badge>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Created
                </h4>
                <p className="text-sm text-gray-700">
                  {new Date(image.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Image ID
                </h4>
                <p className="text-xs text-gray-600 font-mono">
                  {image.id}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DownloadButton
                imageUrl={image.url}
                filename={`ai-image-${image.id}`}
                size="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                ⬇️ Download Image
              </DownloadButton>
              
              <Button
                variant="outline"
                onClick={copyPromptToClipboard}
                className="text-gray-700 hover:text-gray-900"
              >
                📋 Copy Prompt
              </Button>
            </div>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-white"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  🗑️ Delete Image
                </>
              )}
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tips</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Use this prompt as inspiration for similar images</li>
              <li>• Try modifying the prompt slightly for variations</li>
              <li>• Download in high quality for best results</li>
              <li>• Consider different aspect ratios for different use cases</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}