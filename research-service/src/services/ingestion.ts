import fs from 'fs';
import path from 'path';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import ResearchChunk from '../models/ResearchChunk';
import { generateTitanEmbedding } from './bedrock';

// Helper to extract text (simple read file for txt, real pdf extraction would go here)
async function extractText(filePath: string): Promise<string> {
  const content = fs.readFileSync(filePath, 'utf8');
  return content;
}

export async function ingestCorpus(directoryPath: string) {
  const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.txt')); // Simulating just txt for now
  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 50,
  });

  for (const file of files) {
    const text = await extractText(path.join(directoryPath, file));
    const chunks = await splitter.createDocuments([text]);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateTitanEmbedding(chunk.pageContent);
      
      await ResearchChunk.create({
        sourceDocId: file, // Basic doc id
        chunkText: chunk.pageContent,
        embedding: embedding
      });
    }
  }
}
