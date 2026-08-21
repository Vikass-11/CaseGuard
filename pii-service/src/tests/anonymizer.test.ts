import { anonymizeText } from '../services/anonymizer';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.USE_MOCK_COMPREHEND = 'true';
  process.env.USE_MOCK_KMS = 'true';
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Anonymizer Service', () => {
  const mockCaseId = new mongoose.Types.ObjectId().toHexString();

  it('should redact exact matches with stable tokens', async () => {
    // The mock comprehend redacts "John Doe"
    const text = 'John Doe went to the store. Then John Doe came back.';
    const result = await anonymizeText(text, mockCaseId);

    // It should replace both instances of John Doe with [PERSON_1]
    expect(result.anonymizedText).toContain('[PERSON_1] went to the store. Then [PERSON_1] came back.');
    expect(result.anonymizedText).not.toContain('John Doe');
  });

  it('should fallback to regex and redact ID_NUMBER', async () => {
    const text = 'My SSN is 123-45-6789.';
    const result = await anonymizeText(text, mockCaseId);

    expect(result.anonymizedText).toContain('My SSN is [ID_NUMBER_1].');
    expect(result.anonymizedText).not.toContain('123-45-6789');
  });
});
