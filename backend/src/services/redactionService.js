const { GoogleGenerativeAI } = require('@google/generative-ai');

// Fallback logic if API key isn't provided during local testing
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found. Using fallback mock for PII Redaction.');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

const redactPII = async (text) => {
  const genAI = getGenAI();

  if (!genAI) {
    // Mock fallback logic
    return text
      .replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[PERSON_NAME]')
      .replace(/\b\d{10}\b/g, '[PHONE_NUMBER]')
      .replace(/\S+@\S+\.\S+/g, '[EMAIL]');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const prompt = `
      You are an automated PII Redaction Engine for a legal-tech platform.
      Review the following text and anonymize all Personally Identifiable Information (PII).
      Replace names with [PERSON_NAME], phone numbers with [PHONE_NUMBER], addresses with [LOCATION], and emails with [EMAIL].
      Return only the anonymized text, keeping the original meaning intact.

      Original Text:
      "${text}"
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error in AI PII Redaction:', error);
    throw new Error('Failed to anonymize text.');
  }
};

module.exports = { redactPII };
