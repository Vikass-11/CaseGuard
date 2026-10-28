import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { transcribeAudio } from '../controllers/audio.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Secure audio endpoints with authentication
router.use(protect);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads/audio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for handling file uploads safely
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, 'voice-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.originalname.match(/\.(webm|wav|mp3|ogg|m4a|mp4)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only audio recordings are permitted.'));
    }
  }
});

// Transcription endpoint
router.post('/transcribe', upload.single('audio'), transcribeAudio);

export default router;
