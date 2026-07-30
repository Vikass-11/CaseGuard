const { getOpenAIClient } = require('../utils/openaiClient');

const generateLegalBrief = async (caseData) => {
  const openai = getOpenAIClient();

  if (!openai) {
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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const responseText = response.choices[0].message.content.trim();
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error in Legal Brief Generator:', error);
    throw new Error('Failed to generate legal brief.');
  }
};

module.exports = { generateLegalBrief };
