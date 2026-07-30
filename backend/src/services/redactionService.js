const { getOpenAIClient } = require('../utils/openaiClient');

const redactPII = async (text) => {
  const openai = getOpenAIClient();

  if (!openai) {
    // Mock fallback logic
    return text
      .replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[PERSON_NAME]')
      .replace(/\b\d{10}\b/g, '[PHONE_NUMBER]')
      .replace(/\S+@\S+\.\S+/g, '[EMAIL]');
  }

  try {
    const prompt = `
      You are an automated PII Redaction Engine for a legal-tech platform.
      Review the following text and anonymize all Personally Identifiable Information (PII).
      Replace names with [PERSON_NAME], phone numbers with [PHONE_NUMBER], addresses with [LOCATION], and emails with [EMAIL].
      Return only the anonymized text, keeping the original meaning intact.

      Original Text:
      "${text}"
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in AI PII Redaction:', error);
    throw new Error('Failed to anonymize text.');
  }
};

module.exports = { redactPII };
