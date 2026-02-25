// src/services/openaiService.ts
// Service for OpenAI API requests

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function fetchOpenAIChat(messages: any[], model = 'gpt-4') {
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key is missing');
  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });
  if (!response.ok) throw new Error('Failed to fetch OpenAI response');
  return response.json();
}
