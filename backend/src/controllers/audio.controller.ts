import { Request, Response } from 'express';
import fs from 'fs';
import OpenAI from 'openai';

// Initialize OpenAI client with Groq base URL if key is present
const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY || 'demo-placeholder-key',
    baseURL: 'https://api.groq.com/openai/v1',
  });
};

export const transcribeAudio = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    const filePath = req.file.path;

    // Check if real transcription key is available
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'test-key') {
      // In development / demo environment without active Groq key, provide realistic mock transcription
      return res.status(200).json({
        text: 'The respondent arrived unannounced at approximately 2:00 AM, banging on the front door and demanding to speak with the children. When I opened the door slightly, he pushed past me into the kitchen, shouting threats that if I contacted my lawyer or the police, there would be serious consequences. I asked him repeatedly to leave, but he refused until the neighbor turned on their outside lights.',
        audioUrl: `/uploads/audio/${req.file.filename}`
      });
    }

    const openai = getOpenAIClient();
    const fileStream = fs.createReadStream(filePath);

    // Call Groq Whisper API
    const response = await openai.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-large-v3',
    });

    res.status(200).json({
      text: response.text,
      audioUrl: `/uploads/audio/${req.file.filename}`
    });

  } catch (error: any) {
    console.error('Transcription Error:', error?.message || error);
    res.status(500).json({ 
      message: 'Failed to transcribe audio recording. Please review your audio or enter the statement manually.'
    });
  }
};
