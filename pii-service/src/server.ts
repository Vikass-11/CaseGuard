import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { anonymizeText } from './services/anonymizer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/caseguard')
  .then(() => console.log('PII Service MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error: ', err));

// Single endpoint for anonymization
app.post('/anonymize', async (req, res) => {
  try {
    const { text, caseId } = req.body;
    
    if (!text || !caseId) {
      return res.status(400).json({ error: 'Missing text or caseId' });
    }

    const result = await anonymizeText(text, caseId);
    return res.json(result);
  } catch (err: any) {
    console.error('Anonymization Error:', err);
    return res.status(500).json({ error: 'Anonymization pipeline failed' });
  }
});

app.listen(PORT, () => console.log(`PII Service running on port ${PORT}`));
