import React from 'react';
import './App.css';


function App() {
  const [inputValue, setInputValue] = React.useState('');
  const [tickers, setTickers] = React.useState<string[]>([]);
  const [inputError, setInputError] = React.useState('');

  const validateTicker = (value: string) => {
    if (!value) return 'Ticker is required.';
    if (!/^[A-Z]{1,5}$/.test(value.trim())) return 'Must be 1-5 uppercase letters (e.g. AAPL, TSLA).';
    if (tickers.includes(value.trim())) return 'This ticker has already been added.';
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.toUpperCase());
    setInputError('');
  };

  const handleAddTicker = (e: React.SyntheticEvent | React.MouseEvent) => {
    e.preventDefault();
    const value = inputValue.trim().toUpperCase();
    const error = validateTicker(value);
    if (error) {
      setInputError(error);
      return;
    }
    if (tickers.length >= 3) {
      setInputError('You can only add up to 3 tickers.');
      return;
    }
    setTickers([...tickers, value]);
    setInputValue('');
    setInputError('');
  };

  const handleRemoveTicker = (idx: number) => {
    setTickers(tickers.filter((_, i) => i !== idx));
  };

  const isFormValid = tickers.length > 0 && tickers.length <= 3;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    const apiKey = process.env.REACT_APP_API_KEY;
    alert(`Tickers submitted: ${tickers.join(', ')}\nAPI Key: ${apiKey}`);
  };

  return (
    <div className="custom-app-container">
      <form className="custom-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="form-title">Stock AI Analyzer</h2>
        <div className="form-group">
          <label htmlFor="ticker-input">Stock ticker</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
            >
              Add
            </button>
          </div>
          {inputError && (
            <span className="error-message">{inputError}</span>
          )}
        </div>
        {tickers.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tickers.map((ticker, idx) => (
                <div key={ticker} style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: 8, padding: '0.4rem 0.8rem', border: '1.2px solid #c3cfe2', fontWeight: 600, fontSize: '1.05rem', color: '#1a2540' }}>
                  {ticker}
                  <button
                    type="button"
                    aria-label={`Remove ${ticker}`}
                    onClick={() => handleRemoveTicker(idx)}
                    style={{ marginLeft: 8, background: 'none', border: 'none', color: '#e74c3c', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          type="submit"
          className="submit-btn"
          disabled={!isFormValid}
        >
          Analyze
        </button>
      </form>
    </div>
  );
}

export default App;
