"use client";

import { STYLE_OPTIONS } from "@/lib/image-utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  disabled?: boolean;
}

export default function StyleSelector({ 
  selectedStyle, 
  onStyleChange, 
  disabled 
}: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {STYLE_OPTIONS.map((style) => {
        const isSelected = selectedStyle === style.id;
        
        return (
          <Card
            key={style.id}
            className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-md ${
              isSelected 
                ? "border-purple-500 bg-purple-50 shadow-md" 
                : "border-gray-200 hover:border-gray-300"
            } ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !disabled && onStyleChange(style.id)}
          >
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium text-sm ${
                  isSelected ? "text-purple-900" : "text-gray-900"
                }`}>
                  {style.name}
                </h3>
                {isSelected && (
                  <Badge variant="default" className="text-xs bg-purple-600">
                    Selected
                  </Badge>
                )}
              </div>
              
              <p className={`text-xs leading-relaxed ${
                isSelected ? "text-purple-700" : "text-gray-600"
              }`}>
                {style.description}
              </p>

              {/* Style Preview Indicator */}
              <div className="flex items-center gap-1 pt-1">
                {getStyleIndicators(style.id).map((indicator, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${indicator}`}
                  />
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function getStyleIndicators(styleId: string): string[] {
  const indicators: Record<string, string[]> = {
    none: ["bg-gray-400"],
    photorealistic: ["bg-blue-500", "bg-green-500"],
    artistic: ["bg-purple-500", "bg-pink-500", "bg-orange-500"],
    cinematic: ["bg-red-500", "bg-yellow-500"],
    fantasy: ["bg-purple-600", "bg-indigo-500", "bg-pink-600"],
    abstract: ["bg-lime-500", "bg-cyan-500", "bg-purple-500"],
    vintage: ["bg-amber-600", "bg-orange-700"]
  };
  
  return indicators[styleId] || ["bg-gray-400"];
}