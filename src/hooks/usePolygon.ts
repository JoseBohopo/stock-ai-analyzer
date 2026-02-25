// src/hooks/usePolygon.ts
import { useState } from 'react';
import { fetchTickerData, fetchAggregates } from '../services/polygonService';

export function usePolygon() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTickerData = async (ticker: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTickerData(ticker);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAggregates = async (ticker: string, from: string, to: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAggregates(ticker, from, to);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getTickerData, getAggregates, loading, error };
}
