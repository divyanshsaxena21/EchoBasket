// src/components/voice/VoiceInput.tsx

'use client';

import React, { useState } from 'react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Product } from '@/types';

interface VoiceInputProps {
  onProductDetected?: (product: Product, quantity: number) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onProductDetected }) => {
  const toast = useToast();
  const { addToCart } = useCart();
  const [manualInput, setManualInput] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput({
    onResult: (result) => {
      processVoiceInput(result.text);
    },
    onError: (error) => {
      toast.error(error);
      setParseError(error);
    },
  });

  const processVoiceInput = (input: string) => {
    // Parse voice input to extract product and quantity
    // Example: "Add 2 apples" -> { product: { name: "apples" }, quantity: 2 }
    const parsed = parseVoiceCommand(input);

    if (parsed) {
      const { productName, quantity } = parsed;
      // Create a product object from the parsed data
      const product: Product = {
        id: productName.toLowerCase().replace(/\s+/g, '-'),
        name: productName,
        price: 0, // Will be set by backend
      };

      addToCart(product, quantity);
      onProductDetected?.(product, quantity);
      setParseError(null);
      resetTranscript();
    } else {
      setParseError('Could not parse voice input. Try saying "Add [quantity] [product name]"');
    }
  };

  const parseVoiceCommand = (
    input: string,
  ): { productName: string; quantity: number } | null => {
    const lowerInput = input.toLowerCase().trim();

    // Pattern: "add [quantity] [product]" or "[quantity] [product]"
    const patterns = [
      /^(?:add\s+)?(\d+)\s+(.+)$/i,
      /^(?:add\s+)?(.+)$/i,
    ];

    for (const pattern of patterns) {
      const match = lowerInput.match(pattern);
      if (match) {
        if (match[2]) {
          // Found quantity and product
          return {
            quantity: parseInt(match[1], 10) || 1,
            productName: match[2].trim(),
          };
        } else if (match[1]) {
          // Only product name
          return {
            quantity: 1,
            productName: match[1].trim(),
          };
        }
      }
    }

    return null;
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      processVoiceInput(manualInput);
      setManualInput('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Voice Input Button */}
      <div className="flex gap-3">
        <Button
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? 'danger' : 'primary'}
          size="lg"
          className="flex-1"
          disabled={!isSupported}
        >
          {isListening ? '🎤 Stop Recording' : '🎤 Start Voice Input'}
        </Button>
        {isListening && (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
            <span className="inline-block h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
            Listening...
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {(transcript || interimTranscript) && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {transcript}
            {interimTranscript && (
              <span className="text-gray-400 dark:text-gray-500 italic">
                {interimTranscript}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Error Display */}
      {parseError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">{parseError}</p>
        </div>
      )}

      {/* Manual Input Fallback */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder='E.g., "2 apples" or "add milk"'
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            Add
          </Button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {isSupported ? 'Voice input is available' : 'Voice input not supported in your browser'}
        </p>
      </div>
    </div>
  );
};
