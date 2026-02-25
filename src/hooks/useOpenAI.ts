// src/hooks/useOpenAI.ts
import { useState } from 'react';
import { fetchOpenAIChat } from '../services/openaiService';

export function useOpenAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getChatCompletion = async (messages: any[], model = 'gpt-4') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOpenAIChat(messages, model);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getChatCompletion, loading, error };
}
