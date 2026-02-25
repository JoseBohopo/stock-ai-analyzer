import React from 'react';
import './App.css';
import { usePolygon } from './hooks/usePolygon';
import { useOpenAI } from './hooks/useOpenAI';
import { Chart } from './components/Chart';
import { TickerInput } from './components/TickerInput';
import { DatePickers } from './components/DatePickers';
import { TickersList } from './components/TickersList';


function App() {
  const [inputValue, setInputValue] = React.useState('');
  const [tickers, setTickers] = React.useState<string[]>([]);
  const [inputError, setInputError] = React.useState('');
  const [chartsData, setChartsData] = React.useState<{ [ticker: string]: any[] }>({});
  const [fetching, setFetching] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const { getAggregates, loading } = usePolygon();
  const { getChatCompletion, loading: openAILoading, error: openAIError } = useOpenAI();
  const [openAIResult, setOpenAIResult] = React.useState<string | null>(null);

  // Date pickers state
  const today = new Date().toISOString().slice(0, 10);
  const defaultFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [fromDate, setFromDate] = React.useState(defaultFrom);
  const [toDate, setToDate] = React.useState(today);

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
    const removed = tickers[idx];
    setTickers(tickers.filter((_, i) => i !== idx));
    setChartsData(prev => {
      const copy = { ...prev };
      delete copy[removed];
      return copy;
    });
  };

  const isFormValid = tickers.length > 0 && tickers.length <= 3;

  // Fetch data for all tickers
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    setFetching(true);
    setFetchError(null);
    setOpenAIResult(null);
    try {
      const results: { [ticker: string]: any[] } = {};
      for (const ticker of tickers) {
        const res = await getAggregates(ticker, fromDate, toDate);
        if (res?.results) {
          results[ticker] = res.results;
        } else {
          results[ticker] = [];
        }
      }
      setChartsData(results);

      // Prepare a summary for OpenAI
      const summary = Object.entries(results).map(([ticker, data]) => {
        const closes = data.map((d: any) => d.c).filter(Boolean);
        return `${ticker}: [${closes.slice(0, 10).join(', ')}${closes.length > 10 ? ', ...' : ''}]`;
      }).join('\n');
      const messages = [
        { role: 'system', content: 'You are a financial analyst AI. Summarize the following stock close prices and provide a brief insight for each ticker.' },
        { role: 'user', content: summary }
      ];
      const aiResponse = await getChatCompletion(messages);
      setOpenAIResult(aiResponse?.choices?.[0]?.message?.content || 'No insight returned.');
    } catch (err: any) {
      setFetchError(err.message || 'Failed to fetch data');
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="custom-app-container">
      <form className="custom-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="form-title">Stock AI Analyzer</h2>
        <TickerInput
          inputValue={inputValue}
          inputError={inputError}
          tickers={tickers}
          handleInputChange={handleInputChange}
          handleAddTicker={handleAddTicker}
        />
        <DatePickers
          fromDate={fromDate}
          toDate={toDate}
          today={today}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />
        <TickersList
          tickers={tickers}
          handleRemoveTicker={handleRemoveTicker}
        />
        <button
          type="submit"
          className="submit-btn"
          disabled={!isFormValid || fetching || loading}
          aria-label="Analyze tickers"
        >
          {fetching || loading ? 'Loading...' : 'Analyze'}
        </button>
        {fetchError && <div className="error-message error-message-margin">{fetchError}</div>}
      </form>
      {/* Charts Section */}
      <div>
        {Object.entries(chartsData).map(([ticker, data]) => (
          <Chart key={ticker} data={data} ticker={ticker} />
        ))}
      </div>
      {/* OpenAI Insight Section */}
      {(openAILoading || openAIResult || openAIError) && (
        <section className="openai-insight-section">
          <h3>AI Insights</h3>
          {openAILoading && <div>Loading AI analysis...</div>}
          {openAIError && <div className="error-message">{openAIError}</div>}
          {openAIResult && <div className="openai-insight-box">{openAIResult}</div>}
        </section>
      )}
    </div>
  );
}

export default App;
