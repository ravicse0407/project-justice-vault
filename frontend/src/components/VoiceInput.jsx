import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VoiceInput = ({ onSpeechResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const { language, t } = useApp();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage(t.ask.voiceUnavailable);
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && onSpeechResult) {
          onSpeechResult(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions.');
        } else {
          setErrorMessage(`Voice input error: ${event.error}`);
        }
        setTimeout(() => setErrorMessage(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
      setErrorMessage('Could not initiate voice recognition in this environment.');
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        title={isListening ? "Stop listening" : (isSupported ? "Voice Input (Speech Recognition)" : t.ask.voiceUnavailable)}
        className={`p-2.5 rounded-lg border transition flex items-center justify-center ${
          isListening 
            ? 'bg-rose-500 border-rose-600 text-white animate-pulse shadow-md' 
            : isSupported 
              ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-xs'
              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
      </button>

      {isListening && (
        <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-rose-900 text-white text-[10px] px-2 py-0.5 rounded shadow">
          {t.ask.voiceListening}
        </span>
      )}

      {errorMessage && (
        <div className="absolute top-12 left-0 z-20 w-64 bg-slate-900 text-white text-xs p-2 rounded shadow-lg flex items-start space-x-1.5 border border-slate-700">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
