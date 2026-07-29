const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found. Using fallback mock for Legal Brief Generator.');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

const generateLegalBrief = async (caseData) => {
  const genAI = getGenAI();

  if (!genAI) {
    // Mock fallback logic
    return {
      summary: 'Mock Summary: The complainant reports repeated harassment incidents in the workplace over the last three months.',
      keyFacts: [
        'Incident occurred at TechCorp SF Office.',
        'Multiple instances reported by Jane Smith.',
        'Alleged perpetrator is John Doe (Manager).'
      ],
      timeline: [
        { date: '2023-07-15', event: 'First reported incident of inappropriate remarks.' },
        { date: '2023-09-10', event: 'Escalated hostile behavior during team meeting.' }
      ],
      potentialViolations: ['Title VII Civil Rights Act (Hostile Work Environment)', 'California FEHA Harassment Code']
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const prompt = `
      You are an expert Legal Assistant. Review the following case details and generate a formal, structured legal brief.
      The output must strictly be a JSON object with no additional markdown, markdown code block wrappers, or explanation text.

      {
        "summary": "A concise 2-3 sentence overview of the case.",
        "keyFacts": ["Fact 1", "Fact 2"],
        "timeline": [
          { "date": "YYYY-MM-DD or Unknown", "event": "Description" }
        ],
        "potentialViolations": ["Violation 1", "Violation 2"]
      }

      Case Details:
      Title: ${caseData.title}
      Description (Raw): ${caseData.descriptionRaw}
      Abuse Categories: ${caseData.abuseCategories.join(', ')}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Strip markdown code block markers if present
    const cleanJson = responseText.replace(/^```json/m, '').replace(/```$/m, '').trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error in Legal Brief Generator:', error);
    throw new Error('Failed to generate legal brief.');
  }
};

module.exports = { generateLegalBrief };
