import { ComprehendClient, DetectPiiEntitiesCommand } from '@aws-sdk/client-comprehend';
import { encryptText } from '../utils/kms';
import PiiMap from '../models/PiiMap';
import PiiReviewItem from '../models/PiiReviewItem';
import mongoose from 'mongoose';

const comprehend = new ComprehendClient({ region: process.env.AWS_REGION || 'us-east-1' });
const CONFIDENCE_THRESHOLD = 0.85;

export async function anonymizeText(text: string, caseId: string) {
  // 1. Detect PII using AWS Comprehend
  // (In a real implementation we would chunk here if > 100KB, for now keeping it simple)
  let piiEntities: any[] = [];
  
  if (process.env.USE_MOCK_COMPREHEND === 'true') {
    // Mock for local dev without AWS credentials
    const matches = text.matchAll(/John Doe|Jane Smith/gi);
    for (const match of matches) {
      if (match.index !== undefined) {
        piiEntities.push({
          Type: 'PERSON',
          Score: 0.99,
          BeginOffset: match.index,
          EndOffset: match.index + match[0].length
        });
      }
    }
  } else {
    const command = new DetectPiiEntitiesCommand({
      Text: text,
      LanguageCode: 'en'
    });
    const res = await comprehend.send(command);
    piiEntities = res.Entities || [];
  }

  // 2. Secondary Pass (Deterministic Regex for specific items)
  const regexPatterns = [
    { type: 'ID_NUMBER', regex: /\b\d{3}-\d{2}-\d{4}\b/g } // Example: SSN
  ];
  
  for (const pattern of regexPatterns) {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      piiEntities.push({
        Type: pattern.type,
        Score: 1.0,
        BeginOffset: match.index,
        EndOffset: match.index + match[0].length
      });
    }
  }

  // Sort descending by offset so replacement doesn't shift later indices
  piiEntities.sort((a, b) => b.BeginOffset - a.BeginOffset);

  // De-duplicate exact overlapping bounds
  const uniqueEntities = piiEntities.filter((entity, index, self) =>
    index === self.findIndex((t) => (
      t.BeginOffset === entity.BeginOffset && t.EndOffset === entity.EndOffset
    ))
  );

  let anonymizedText = text;
  const tokenCounters: Record<string, number> = {};
  const tokenMap = new Map<string, string>(); // Maps exact string -> Token

  // Process Entities
  for (const entity of uniqueEntities) {
    const spanText = text.substring(entity.BeginOffset, entity.EndOffset);

    // If exact string has been seen before, reuse token (v1 scope exact-match rule)
    let token = tokenMap.get(spanText);
    
    if (!token) {
      // Create new token
      if (!tokenCounters[entity.Type]) tokenCounters[entity.Type] = 1;
      else tokenCounters[entity.Type]++;

      token = `[${entity.Type}_${tokenCounters[entity.Type]}]`;
      tokenMap.set(spanText, token);

      if (entity.Score < CONFIDENCE_THRESHOLD) {
        // Send to review queue, but still redact for now
        token = `[REVIEW_PENDING_${entity.Type}]`;
        const encryptedSpan = await encryptText(spanText);
        await PiiReviewItem.create({
          caseId: new mongoose.Types.ObjectId(caseId),
          spanOffsetStart: entity.BeginOffset,
          spanOffsetEnd: entity.EndOffset,
          encryptedSpanText: encryptedSpan,
          detectedType: entity.Type,
          confidence: entity.Score
        });
      } else {
        // Store in PiiMap
        const encryptedValue = await encryptText(spanText);
        await PiiMap.create({
          caseId: new mongoose.Types.ObjectId(caseId),
          token,
          encryptedOriginalValue: encryptedValue,
          entityType: entity.Type
        });
      }
    }

    // Replace in text
    anonymizedText = anonymizedText.substring(0, entity.BeginOffset) + token + anonymizedText.substring(entity.EndOffset);
  }

  return {
    originalText: text,
    anonymizedText,
    entitiesDetected: uniqueEntities.length
  };
}
