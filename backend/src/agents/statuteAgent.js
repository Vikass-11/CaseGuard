const { getOpenAIClient } = require('../utils/openaiClient');

class StatuteMappingAgent {
  constructor() {
    this.name = 'StatuteMappingAgent';
  }

  async mapStatutes(caseData) {
    const openai = getOpenAIClient();

    if (!openai) {
      // Mock fallback logic
      return [
        {
          code: 'Title VII of the Civil Rights Act of 1964',
          description: 'Prohibits employment discrimination based on race, color, religion, sex and national origin.',
          relevance: 'High relevance due to workplace harassment allegations.'
        },
        {
          code: 'California FEHA',
          description: 'Fair Employment and Housing Act prohibiting harassment and discrimination.',
          relevance: 'Applicable based on location (San Francisco).'
        }
      ];
    }

    try {
      const prompt = `
        You are a specialized Legal Statute & Precedent Mapping Agent.
        Analyze the provided case facts and map them to specific legal statutes (e.g., IT Act, IPC sections, or relevant legal codes).
        Return an array of JSON objects strictly in this format, with no markdown code blocks:

        [
          {
            "code": "Legal Code/Section Name",
            "description": "Brief description of the statute.",
            "relevance": "Why this is relevant to the case."
          }
        ]

        Case Title: ${caseData.title}
        Case Facts: ${caseData.descriptionRaw}
        Abuse Categories: ${caseData.abuseCategories.join(', ')}
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });

      const responseText = response.choices[0].message.content.trim();
      
      // Strip markdown code block markers if present
      const cleanJson = responseText.replace(/^```json/m, '').replace(/```$/m, '').trim();
      
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('[StatuteMappingAgent] Error mapping statutes:', error);
      throw new Error('Failed to map statutes.');
    }
  }
}

module.exports = new StatuteMappingAgent();
