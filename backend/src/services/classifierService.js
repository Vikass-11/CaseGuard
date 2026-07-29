const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found. Using fallback mock for Classifier.');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

const classifyThreat = async (text) => {
  const genAI = getGenAI();

  if (!genAI) {
    // Mock fallback logic
    return {
      threatLevel: 'MEDIUM',
      riskScore: 65,
      categories: ['General Complaint', 'Harassment (Mock)']
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Strip markdown code block markers if present
    const cleanJson = responseText.replace(/^```json/m, '').replace(/```$/m, '').trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error in AI Threat Classifier:', error);
    throw new Error('Failed to classify threat.');
  }
};

module.exports = { classifyThreat };
