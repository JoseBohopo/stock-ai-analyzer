import React from 'react';
import { render, screen } from '@testing-library/react';
import { Chart } from './Chart';

describe('Chart', () => {
  const mockData = [
    { t: 1700000000000, o: 100, h: 110, l: 90, c: 105, v: 1000 },
    { t: 1700000000001, o: 106, h: 115, l: 100, c: 110, v: 1200 },
  ];

  it('renders chart title and bars', () => {
    render(<Chart data={mockData} ticker="AAPL" />);
    expect(screen.getByText(/AAPL - Daily Close Prices/i)).toBeInTheDocument();
    expect(screen.getAllByTitle(/Close:/)).toHaveLength(2);
  });

  it('shows no data message if empty', () => {
    render(<Chart data={[]} ticker="AAPL" />);
    expect(screen.getByText(/No data to display/i)).toBeInTheDocument();
  });
});
