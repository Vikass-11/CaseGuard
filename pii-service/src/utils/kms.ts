import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

// Setup AWS KMS Client
const kmsClient = new KMSClient({ region: process.env.AWS_REGION || 'us-east-1' });
const KMS_KEY_ID = process.env.KMS_KEY_ID || 'alias/CaseGuardPIIKey'; // In prod, use an actual Key ID

export async function encryptText(text: string): Promise<string> {
  // If no KMS key configured, fallback to base64 for local dev if forced
  if (process.env.USE_MOCK_KMS === 'true') {
    return Buffer.from(text).toString('base64');
  }

  const command = new EncryptCommand({
    KeyId: KMS_KEY_ID,
    Plaintext: Buffer.from(text),
  });

  const response = await kmsClient.send(command);
  return Buffer.from(response.CiphertextBlob!).toString('base64');
}

export async function decryptText(encryptedText: string): Promise<string> {
  if (process.env.USE_MOCK_KMS === 'true') {
    return Buffer.from(encryptedText, 'base64').toString('utf-8');
  }

  const command = new DecryptCommand({
    CiphertextBlob: Buffer.from(encryptedText, 'base64'),
  });

  const response = await kmsClient.send(command);
  return Buffer.from(response.Plaintext!).toString('utf-8');
}
