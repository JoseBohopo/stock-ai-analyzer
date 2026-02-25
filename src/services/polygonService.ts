// src/services/polygonService.ts
// Service for Polygon.io API requests

const POLYGON_API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = 'https://api.polygon.io';

export async function fetchTickerData(ticker: string) {
  if (!POLYGON_API_KEY) throw new Error('Polygon API key is missing');
  const url = `${BASE_URL}/v3/reference/tickers/${ticker}?apiKey=${POLYGON_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch ticker data');
  return response.json();
}

export async function fetchAggregates(ticker: string , from: string, to: string, range?: string) {
  if (!POLYGON_API_KEY) throw new Error('Polygon API key is missing');
  const url = `${BASE_URL}/v2/aggs/ticker/${ticker}/range/${range || '1'}/day/${from}/${to}?apiKey=${POLYGON_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch aggregates');
  return response.json();
}
