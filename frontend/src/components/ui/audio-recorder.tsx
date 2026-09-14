import React, { useState, useRef } from 'react';
import { Mic, Square, UploadCloud, Loader2, Play, Pause } from 'lucide-react';
import { Button } from './button';
import api from '@/lib/api';
import { toast } from 'sonner';

interface AudioRecorderProps {
  onTranscriptionComplete: (text: string) => void;
}

export function AudioRecorder({ onTranscriptionComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioUpload(audioBlob, 'recording.webm');
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleAudioUpload(file, file.name);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAudioUpload = async (audioData: Blob | File, filename: string) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('audio', audioData, filename);

    try {
      toast.info('Extracting text from audio...');
      const response = await api.post('/audio/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.text) {
        onTranscriptionComplete(response.data.text);
        toast.success('Audio transcribed successfully!');
      }
    } catch (error: any) {
      console.error('Transcription error:', error);
      const serverMsg = error.response?.data?.message;
      toast.error('Transcription Failed: ' + (serverMsg || 'Unknown server error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center gap-3">
      {!isRecording ? (
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={startRecording}
          disabled={isProcessing}
          className="border-primary/50 text-primary hover:bg-primary/5 font-bold tracking-widest text-[10px] uppercase shadow-sm h-10"
        >
          {isProcessing ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
          ) : (
            <><Mic className="w-4 h-4 mr-2" /> Record Audio</>
          )}
        </Button>
      ) : (
        <Button 
          type="button" 
          variant="destructive" 
          size="sm" 
          onClick={stopRecording}
          className="font-bold tracking-widest text-[10px] uppercase shadow-sm h-10 animate-pulse"
        >
          <Square className="w-4 h-4 mr-2" /> 
          Stop ({formatTime(recordingTime)})
        </Button>
      )}

      <div className="relative">
        <input 
          type="file" 
          accept="audio/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload}
          disabled={isRecording || isProcessing}
        />
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          disabled={isRecording || isProcessing}
          onClick={() => fileInputRef.current?.click()}
          className="text-muted-foreground hover:text-foreground font-bold tracking-widest text-[10px] uppercase h-10"
        >
          <UploadCloud className="w-4 h-4 mr-2" /> Upload File
        </Button>
      </div>
    </div>
  );
}
