"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { truncatePrompt } from "@/lib/image-utils";

interface GenerationProgressProps {
  message: string;
  prompt: string;
}

export default function GenerationProgress({ message, prompt }: GenerationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    // Simulate progress based on typical generation time
    const startTime = Date.now();
    const updateInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setTimeElapsed(Math.floor(elapsed));
      
      // Simulate realistic progress curve
      let newProgress = 0;
      if (elapsed < 10) {
        newProgress = elapsed * 2; // Quick initial progress
      } else if (elapsed < 30) {
        newProgress = 20 + ((elapsed - 10) * 1.5); // Steady progress
      } else if (elapsed < 60) {
        newProgress = 50 + ((elapsed - 30) * 1); // Slower progress
      } else if (elapsed < 90) {
        newProgress = 80 + ((elapsed - 60) * 0.5); // Final stretch
      } else {
        newProgress = 95; // Nearly complete
      }
      
      setProgress(Math.min(newProgress, 98)); // Never show 100% until complete
    }, 1000);

    return () => clearInterval(updateInterval);
  }, []);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getProgressColor = (): string => {
    if (progress < 25) return "bg-blue-500";
    if (progress < 50) return "bg-purple-500";
    if (progress < 75) return "bg-indigo-500";
    return "bg-green-500";
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Generating Your Image</h3>
              <p className="text-sm text-gray-600">This may take up to 90 seconds</p>
            </div>
          </div>
          
          <Badge variant="secondary" className="font-mono text-xs">
            {formatTime(timeElapsed)}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">{message}</span>
            <span className="text-gray-500">{Math.round(progress)}%</span>
          </div>
          
          <div className="relative">
            <Progress value={progress} className="h-3 bg-gray-200" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Prompt Display */}
        <div className="bg-white/60 rounded-lg p-3 border border-white/40">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Prompt:</span>{" "}
            <span className="italic">"{truncatePrompt(prompt, 100)}"</span>
          </p>
        </div>

        {/* Progress Stages */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${progress > 0 ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <span>Initialize</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${progress > 25 ? 'bg-purple-500' : 'bg-gray-300'}`} />
            <span>Process</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${progress > 50 ? 'bg-indigo-500' : 'bg-gray-300'}`} />
            <span>Generate</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${progress > 75 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>Finalize</span>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <span className="font-semibold">Pro Tip:</span> More detailed prompts often produce better results. 
            Complex images may take longer to generate.
          </p>
        </div>
      </div>
    </Card>
  );
}