import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./hooks/usePolygon', () => ({
  usePolygon: () => ({
    getAggregates: jest.fn(() => Promise.resolve({ results: [{ t: 1700000000000, c: 105 }] })),
    loading: false,
  }),
}));

describe('App integration', () => {
  it('allows adding tickers, picking dates, and shows chart', async () => {
    render(<App />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'AAPL' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    fireEvent.change(screen.getByLabelText(/select start date/i), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText(/select end date/i), { target: { value: '2024-01-31' } });
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }));
    await waitFor(() => {
      expect(screen.getByText(/AAPL - Daily Close Prices/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid ticker', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Must be 1-5 uppercase letters');
  });
});
