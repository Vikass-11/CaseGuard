const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { authenticate } = require('../middlewares/auth');

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found. Using fallback mock for Legal Assistant Bot.');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

const SYSTEM_PROMPT = `You are a compassionate, professional Legal Intake Assistant at CaseGuard, a legal-tech platform 
for victims of abuse, harassment, and legal violations. Your role is to help complainants structure their statements 
clearly and gather all important details for their legal case.

Guidelines:
- Be empathetic and trauma-informed. Never be dismissive.
- Ask one focused question at a time to help gather: what happened, when it happened, who was involved, any witnesses, and any existing evidence.
- Help users articulate their experiences in legally relevant language.
- If the user seems distressed, acknowledge their feelings before proceeding.
- Do NOT provide specific legal advice or definitive legal conclusions.
- Keep responses concise and easy to understand.`;

// POST /api/assistant/chat
router.post('/chat', authenticate, async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  const genAI = getGenAI();

  if (!genAI) {
    // Mock fallback response
    const mockResponses = [
      "I understand this is difficult. Could you tell me when the first incident occurred?",
      "Thank you for sharing that. Were there any witnesses present during this incident?",
      "I'm here to help. Do you have any documentation like emails, messages, or photos related to this case?",
      "That's important information. Can you describe what happened in as much detail as you feel comfortable sharing?"
    ];
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    return res.json({ reply: randomResponse });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Build conversation history for multi-turn chat
    const chatHistory = (history || []).map(turn => ({
      role: turn.role,
      parts: [{ text: turn.content }]
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am ready to assist complainants with empathy and legal precision.' }] },
        ...chatHistory
      ]
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('[LegalAssistantBot] Error:', error);
    res.status(500).json({ message: 'Failed to get a response from the assistant.' });
  }
});

module.exports = router;
