// src/hooks/useVoiceInput.ts

import { useCallback, useEffect, useRef, useState } from 'react';
import { VOICE_LANGUAGE } from '@/lib/constants';
import { VoiceInputResult } from '@/types';

interface UseVoiceInputOptions {
  language?: string;
  onResult?: (result: VoiceInputResult) => void;
  onError?: (error: string) => void;
}

export const useVoiceInput = (options: UseVoiceInputOptions = {}) => {
  const {
    language = VOICE_LANGUAGE,
    onResult,
    onError,
  } = options;

  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.language = language;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setInterimTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);

      if (final) {
        setTranscript((prev) => prev + final);
        const result: VoiceInputResult = {
          text: final.trim(),
          confidence: event.results[event.results.length - 1][0].confidence,
          isFinal: true,
        };
        onResult?.(result);
      }
    };

    recognition.onerror = (event: any) => {
      const errorMessage = `Speech recognition error: ${event.error}`;
      onError?.(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onResult, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      onError?.('Speech Recognition not supported in this browser');
      return;
    }

    setTranscript('');
    setInterimTranscript('');
    recognitionRef.current.start();
  }, [isSupported, onError]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  };
};
