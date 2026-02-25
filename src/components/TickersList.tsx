import React from 'react';

interface TickersListProps {
  tickers: string[];
  handleRemoveTicker: (idx: number) => void;
}

export const TickersList: React.FC<TickersListProps> = ({ tickers, handleRemoveTicker }) => (
  tickers.length > 0 ? (
    <section className="tickers-list-row" aria-label="Tickers list">
      <ul className="tickers-list">
        {tickers.map((ticker, idx) => (
          <li key={ticker} className="ticker-pill">
            {ticker}
            <button
              type="button"
              aria-label={`Remove ${ticker}`}
              onClick={() => handleRemoveTicker(idx)}
              className="remove-ticker-btn"
              tabIndex={0}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  ) : null
);
