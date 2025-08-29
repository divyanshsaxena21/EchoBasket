import { useState, useRef, useEffect } from 'react';
import API from '../services/api'; // Axios instance configured with your backend baseURL

interface AxiosErrorWithMessage {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function VoiceInput() {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const handleVoice = async () => {
    try {
      setResult('');
      setTranscript('');
      setIsRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      setTranscript('Recording...');

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setTranscript('Audio recorded');
        setIsRecording(false);

        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'voice.wav');

          // Send audio to backend STT (returns transcript, command, reply, audio)
          const res = await API.post('/stt', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          const { transcript, command, reply, audio } = res.data;
          setTranscript(transcript);
          setResult(reply);

          // Play TTS audio from base64
          if (audio) {
            const ttsBlob = b64toBlob(audio, 'audio/mpeg');
            const audioUrl = URL.createObjectURL(ttsBlob);
            new Audio(audioUrl).play();
          }

          // Handle cart update based on parsed command
          if (command && command.intent && command.item) {
            const token = localStorage.getItem('token');
            let cartChanged = false;
            if (command.intent === 'add') {
              const item = {
                id: Date.now().toString(),
                name: command.item,
                quantity: command.quantity || 1,
                category: command.category,
                brand: command.brand,
                price: command.price
              };
              await API.post('/cart', { item }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
              });
              cartChanged = true;
            } else if (command.intent === 'remove') {
              // Find item in cart by name and delete
              const cartRes = await API.get('/cart', {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
              });
              const cart = cartRes.data;
              const itemEntry = Object.entries(cart).find(([, v]) => (v as any).name?.toLowerCase() === command.item?.toLowerCase());
              if (itemEntry) {
                const itemId = itemEntry[0];
                await API.delete(`/cart/${itemId}`, {
                  headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                cartChanged = true;
              }
            } else if (command.intent === 'search' || command.intent === 'show') {
              // Read out all items in cart
              const cartRes = await API.get('/cart', {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
              });
              const cart = cartRes.data;
              const itemsArr = Object.values(cart) as any[];
              if (itemsArr.length === 0) {
                speakText('Your cart is empty.');
              } else {
                const summary = itemsArr.map(i => `${i.quantity} ${i.name}`).join(', ');
                speakText(`You have ${summary} in your cart.`);
              }
            }
            if (cartChanged) {
              window.dispatchEvent(new Event('cart-updated'));
            }
// Helper to speak text using browser TTS
function speakText(text: string) {
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  }
}
          }
        } catch (error: unknown) {
          const err = error as AxiosErrorWithMessage;
          const errorMsg = err?.response?.data?.error || 'Unknown error';
          setResult('Error processing command: ' + errorMsg);
          console.error('STT error:', err);
        }

        // Stop microphone tracks
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
// Helper to convert base64 to Blob
function b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}
      };

      mediaRecorder.start();

      // Stop recording after 4 seconds
      setTimeout(() => {
        mediaRecorder.stop();
      }, 4000);
    } catch {
      setResult('Microphone access denied');
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div>
      <button onClick={handleVoice} disabled={isRecording}>
        {isRecording ? 'Recording...' : '🎤 Speak'}
      </button>
      <p><strong>Status:</strong> {transcript}</p>
      <p><strong>Result:</strong> {result}</p>
    </div>
  );
}
