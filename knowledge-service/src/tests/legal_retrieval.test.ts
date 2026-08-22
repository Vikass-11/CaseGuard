import { mockRetrieveLegal, getStaleLegalDocuments } from '../services/retrieval';
import LegalChunk from '../models/LegalChunk';
import ResearchChunk from '../models/ResearchChunk';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.USE_MOCK_BEDROCK = 'true';
  await mongoose.connect(uri);

  // Seed Legal Data (NY)
  await LegalChunk.create({
    sourceDocId: 'ny_shelter_contact',
    chunkText: 'NY Safe Horizon Hotline: 1-800-621-HOPE',
    jurisdiction: 'NY',
    documentType: 'shelter_contact',
    embedding: Array.from({ length: 1024 }, () => Math.random()),
    lastVerifiedAt: new Date() // Fresh
  });

  // Seed Legal Data (CA)
  await LegalChunk.create({
    sourceDocId: 'ca_shelter_contact',
    chunkText: 'CA Domestic Violence Hotline: 1-800-978-3600',
    jurisdiction: 'CA',
    documentType: 'shelter_contact',
    embedding: Array.from({ length: 1024 }, () => Math.random()),
    lastVerifiedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) // 100 days old (Stale)
  });

  // Seed Clinical Data (Should never be returned by legal search)
  await ResearchChunk.create({
    sourceDocId: 'clinical_paper',
    chunkText: 'Clinical research shows that hotline calls correlate with escalation.',
    embedding: Array.from({ length: 1024 }, () => Math.random())
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Legal Retrieval Service', () => {
  it('should filter by jurisdiction strictly', async () => {
    const resultsNY = await mockRetrieveLegal('Hotline', 5, 'NY');
    expect(resultsNY.length).toBe(1);
    expect(resultsNY[0].jurisdiction).toBe('NY');
    expect(resultsNY[0].chunkText).toContain('Safe Horizon');

    const resultsCA = await mockRetrieveLegal('Hotline', 5, 'CA');
    expect(resultsCA.length).toBe(1);
    expect(resultsCA[0].jurisdiction).toBe('CA');
  });

  it('should return stale documents older than 90 days', async () => {
    const staleDocs = await getStaleLegalDocuments();
    expect(staleDocs.length).toBe(1);
    expect(staleDocs[0].jurisdiction).toBe('CA'); // CA doc is 100 days old
  });
});
