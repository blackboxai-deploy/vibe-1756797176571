"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadImage } from "@/lib/image-utils";
import { toast } from "sonner";

interface DownloadButtonProps {
  imageUrl: string;
  filename?: string;
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function DownloadButton({
  imageUrl,
  filename,
  children = "Download",
  variant = "default",
  size = "default",
  className,
  onClick
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClick) {
      onClick(e);
    }
    
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      await downloadImage(imageUrl, filename);
      toast.success("Image downloaded successfully!", {
        description: "Check your downloads folder"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Download failed";
      toast.error("Download failed", {
        description: errorMessage
      });
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleDownload}
      disabled={isDownloading}
      type="button"
    >
      {isDownloading ? (
        <>
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
          Downloading...
        </>
      ) : (
        children
      )}
    </Button>
  );
}