import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { transcribeAudio } from '../controllers/audio.controller';

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads/audio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Transcription endpoint
router.post('/transcribe', upload.single('audio'), transcribeAudio);

export default router;
