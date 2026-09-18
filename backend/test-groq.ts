import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [{ role: 'user', content: 'hello. please return json {"status": "ok"}' }],
      response_format: { type: 'json_object' }
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
}
test();
