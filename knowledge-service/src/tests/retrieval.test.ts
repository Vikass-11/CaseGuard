import { mockRetrieveResearch } from '../services/retrieval';
import ResearchChunk from '../models/ResearchChunk';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.USE_MOCK_BEDROCK = 'true';
  await mongoose.connect(uri);

  // Seed data
  await ResearchChunk.create({
    sourceDocId: 'glass_et_al_2008',
    chunkText: 'Prior non-fatal strangulation is a significant predictor of future lethality in domestic violence cases.',
    embedding: Array.from({ length: 1024 }, () => Math.random())
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Retrieval Service', () => {
  it('should retrieve relevant chunk for strangulation query (recall@5 test)', async () => {
    const results = await mockRetrieveResearch('strangulation lethality', 5);
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].sourceDocId).toBe('glass_et_al_2008');
    expect(results[0].chunkText).toContain('strangulation');
  });
});
