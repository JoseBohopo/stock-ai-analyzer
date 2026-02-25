import React from 'react';

interface TickerInputProps {
  inputValue: string;
  inputError: string;
  tickers: string[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddTicker: (e: React.SyntheticEvent | React.MouseEvent) => void;
}

export const TickerInput: React.FC<TickerInputProps> = ({ inputValue, inputError, tickers, handleInputChange, handleAddTicker }) => (
  <section className="form-group">
    <fieldset className="ticker-fieldset">
      <legend>Stock ticker</legend>
      <div className="ticker-input-row">
        <input
          type="text"
          id="ticker-input"
          name="ticker-input"
          value={inputValue}
          onChange={handleInputChange}
          className={`custom-input${inputError ? ' input-error' : ''}`}
          placeholder="E.g. AAPL"
          maxLength={8}
          autoFocus
          aria-invalid={!!inputError}
          aria-describedby={inputError ? 'ticker-input-error' : undefined}
          onKeyDown={e => {
            if (e.key === 'Enter') handleAddTicker(e);
          }}
          disabled={tickers.length >= 3}
        />
        <button
          type="button"
          className="submit-btn"
          style={{ minWidth: 90 }}
          onClick={handleAddTicker}
          disabled={!inputValue || !!inputError || tickers.length >= 3}
          aria-label="Add ticker"
        >
          Add
        </button>
      </div>
      {inputError && (
        <span className="error-message" id="ticker-input-error" role="alert">{inputError}</span>
      )}
    </fieldset>
  </section>
);
