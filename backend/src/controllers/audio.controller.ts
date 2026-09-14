import { Request, Response } from 'express';
import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';

// Use Groq's API compatibility with OpenAI SDK
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export const transcribeAudio = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);

    // Call Groq Whisper API
    const response = await openai.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-large-v3', // Groq's high-speed whisper model
    });

    res.status(200).json({
      text: response.text,
      audioUrl: `/uploads/audio/${req.file.filename}`
    });

  } catch (error: any) {
    console.error('Transcription Error:', error);
    res.status(500).json({ 
      message: error.message || 'Error processing audio file', 
      details: error.response?.data || error
    });
  }
};
