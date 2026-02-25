import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TickersList } from './TickersList';

describe('TickersList', () => {
  const defaultProps = {
    tickers: ['AAPL', 'TSLA'],
    handleRemoveTicker: jest.fn(),
  };

  it('renders tickers as list items', () => {
    render(<TickersList {...defaultProps} />);
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('TSLA')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('calls handleRemoveTicker when remove button is clicked', () => {
    render(<TickersList {...defaultProps} />);
    fireEvent.click(screen.getAllByRole('button', { name: /remove/i })[0]);
    expect(defaultProps.handleRemoveTicker).toHaveBeenCalled();
  });
});
