import fs from 'fs';
import path from 'path';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import LegalChunk from '../models/LegalChunk';
import { generateTitanEmbedding } from './bedrock';

export async function ingestLegalCorpus(directoryPath: string, jurisdiction: string, documentType: string) {
  if (!fs.existsSync(directoryPath)) return;
  const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.txt')); 
  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 50,
  });

  for (const file of files) {
    const text = fs.readFileSync(path.join(directoryPath, file), 'utf8');
    const chunks = await splitter.createDocuments([text]);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateTitanEmbedding(chunk.pageContent);
      
      await LegalChunk.create({
        sourceDocId: file,
        chunkText: chunk.pageContent,
        jurisdiction,
        documentType,
        embedding: embedding,
        lastVerifiedAt: new Date() // Sets to now during ingestion
      });
    }
  }
}
