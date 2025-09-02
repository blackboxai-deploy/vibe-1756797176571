"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PROMPT_SUGGESTIONS, getRandomPromptSuggestion } from "@/lib/image-utils";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function PromptInput({ 
  value, 
  onChange, 
  error, 
  disabled, 
  placeholder 
}: PromptInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const maxLength = 1000;
  const charactersUsed = value.length;
  const charactersRemaining = maxLength - charactersUsed;

  const handleSuggestionClick = useCallback((suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  }, [onChange]);

  const handleRandomSuggestion = useCallback(() => {
    const randomSuggestion = getRandomPromptSuggestion();
    onChange(randomSuggestion);
  }, [onChange]);

  const toggleSuggestions = useCallback(() => {
    setShowSuggestions(prev => !prev);
  }, []);

  return (
    <div className="space-y-4">
      {/* Main Input Area */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`min-h-[120px] resize-none text-base leading-relaxed ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          }`}
        />
        
        {/* Character Counter */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <Badge 
            variant={charactersRemaining < 100 ? "destructive" : "secondary"} 
            className="text-xs"
          >
            {charactersRemaining} left
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRandomSuggestion}
            disabled={disabled}
            className="text-xs"
          >
            <span className="mr-1">🎲</span>
            Random Idea
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleSuggestions}
            disabled={disabled}
            className="text-xs"
          >
            <span className="mr-1">💡</span>
            {showSuggestions ? "Hide" : "Show"} Suggestions
          </Button>
        </div>

        {value.trim() && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            disabled={disabled}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Suggestions Panel */}
      {showSuggestions && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            💡 Prompt Suggestions
          </h4>
          <div className="grid gap-2">
            {PROMPT_SUGGESTIONS.slice(0, 6).map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={disabled}
                className="text-left p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-md border border-transparent hover:border-gray-200 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRandomSuggestion}
              disabled={disabled}
              className="text-xs text-purple-600 hover:text-purple-700"
            >
              Get Another Random Suggestion
            </Button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 Be descriptive! Mention colors, lighting, mood, and style for better results.</p>
        <p>✨ Try phrases like "cinematic lighting", "highly detailed", or "artistic style".</p>
      </div>
    </div>
  );
}