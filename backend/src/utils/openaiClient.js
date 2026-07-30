const { OpenAI } = require('openai');

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OPENAI_API_KEY not found. Using fallback mock for AI services.');
    return null;
  }
  
  const config = { apiKey };
  
  if (process.env.OPENAI_BASE_URL) {
    config.baseURL = process.env.OPENAI_BASE_URL;
  }
  
  return new OpenAI(config);
};

module.exports = { getOpenAIClient };
