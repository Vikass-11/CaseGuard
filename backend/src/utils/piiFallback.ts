/**
 * Safe local fallback PII redaction utility.
 * Used when the primary microservice (AWS Comprehend / Presidio) is unreachable
 * to prevent raw personal data from leaking into LLM prompts or audit logs.
 */
export function redactPiiFallback(text: string): string {
  if (!text) return text;

  let redacted = text;

  // 1. Social Security / National ID numbers (e.g., 000-00-0000)
  redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[ID_NUMBER]');

  // 2. Email addresses
  redacted = redacted.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[EMAIL_ADDRESS]');

  // 3. Phone numbers (various formats)
  redacted = redacted.replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[PHONE_NUMBER]');

  // 4. Street Addresses (e.g., 123 Main Street, 456 Elm Ave)
  redacted = redacted.replace(/\b\d{1,5}\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Way|Court|Ct|Circle|Cir))\b/gi, '[LOCATION_ADDRESS]');

  // 5. Formal name titles (Mr. John Doe, Dr. Jane Smith)
  redacted = redacted.replace(/\b(?:Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g, '[PERSON]');

  return redacted;
}
