const { getOpenAIClient } = require('../utils/openaiClient');

const classifyThreat = async (text) => {
  const openai = getOpenAIClient();

  if (!openai) {
    // Mock fallback logic
    return {
      threatLevel: 'MEDIUM',
      riskScore: 65,
      categories: ['General Complaint', 'Harassment (Mock)']
    };
  }

  try {
    const prompt = `
      You are a legal threat classifier. Review the following complaint text.
      Evaluate the threat level and risk score, and categorize the type of abuse.
      
      Respond strictly with a JSON object in the following format (no markdown formatting, no code blocks):
      {
        "threatLevel": "HIGH" | "MEDIUM" | "LOW",
        "riskScore": Number between 0 and 100,
        "categories": ["Category1", "Category2"]
      }

      Complaint Text:
      "${text}"
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const responseText = response.choices[0].message.content.trim();
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error in AI Threat Classifier:', error);
    throw new Error('Failed to classify threat.');
  }
};

module.exports = { classifyThreat };
