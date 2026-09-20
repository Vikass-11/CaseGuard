import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { mockRetrieveResearch, mockRetrieveLegal, retrieveResearch, retrieveLegal, retrieveCaseDocuments, mockRetrieveCaseDocuments } from './services/retrieval';

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/caseguard')
  .then(() => console.log('Knowledge Service MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error: ', err));


import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { generateTitanEmbedding } from './services/bedrock';
import CaseChunk from './models/CaseChunk';

app.post('/api/ingest/case-document', async (req, res) => {
  try {
    const { caseId, sourceDocId, text } = req.body;
    if (!caseId || !text) return res.status(400).json({ error: 'caseId and text are required' });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 400,
      chunkOverlap: 50,
    });

    const chunks = await splitter.createDocuments([text]);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateTitanEmbedding(chunk.pageContent);
      
      await CaseChunk.create({
        caseId,
        sourceDocId: sourceDocId || 'unknown',
        chunkText: chunk.pageContent,
        embedding: embedding
      });
    }

    res.status(201).json({ message: 'Document ingested successfully', chunks: chunks.length });
  } catch (error: any) {
    console.error('Ingestion Error:', error);
    res.status(500).json({ error: 'Failed to ingest document' });
  }
});

app.post('/api/retrieve-research', async (req, res) => {
  try {
    const { query, k } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });
    
    // Use mock for local dev without Atlas Vector Search, or switch based on env
    const useAtlas = process.env.USE_ATLAS === 'true';
    const results = useAtlas ? await retrieveResearch(query, k) : await mockRetrieveResearch(query, k);
    
    res.json(results);
  } catch (error: any) {
    console.error('Research Retrieval Error:', error);
    res.status(500).json({ error: 'Failed to retrieve research passages' });
  }
});

app.post('/api/retrieve-legal', async (req, res) => {
  try {
    const { query, k, jurisdiction } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });
    
    const useAtlas = process.env.USE_ATLAS === 'true';
    const results = useAtlas 
      ? await retrieveLegal(query, k, jurisdiction || 'default') 
      : await mockRetrieveLegal(query, k, jurisdiction || 'default');
      
    res.json(results);
  } catch (error: any) {
    console.error('Legal Retrieval Error:', error);
    res.status(500).json({ error: 'Failed to retrieve legal context' });
  }
});

app.post('/api/retrieve-case-documents', async (req, res) => {
  try {
    const { query, caseId, k } = req.body;
    if (!query || !caseId) return res.status(400).json({ error: 'Query and caseId are required' });
    
    const useAtlas = process.env.USE_ATLAS === 'true';
    const results = useAtlas 
      ? await retrieveCaseDocuments(query, caseId, k) 
      : await mockRetrieveCaseDocuments(query, caseId, k);
      
    res.json(results);
  } catch (error: any) {
    console.error('Case Document Retrieval Error:', error);
    res.status(500).json({ error: 'Failed to retrieve case documents' });
  }
});

app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', service: 'knowledge-service' });
});

app.listen(port, () => {
  console.log(`Knowledge service running on port ${port}`);
});
