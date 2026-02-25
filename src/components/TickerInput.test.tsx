import { render, screen, fireEvent } from '@testing-library/react';
import { TickerInput } from './TickerInput';
import App from '../App';

describe('TickerInput', () => {
  const makeProps = (overrides = {}) => ({
    inputValue: '',
    inputError: '',
    tickers: [],
    handleInputChange: jest.fn(),
    handleAddTicker: jest.fn(),
    ...overrides,
  });

  it('renders input and button', () => {
    const props = makeProps();
    render(<TickerInput {...props} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('shows error message', () => {
    const props = makeProps({ inputError: 'Ticker is required.' });
    render(<TickerInput {...props} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Ticker is required.');
  });

  it('calls handleInputChange and handleAddTicker', () => {
    const handleInputChange = jest.fn();
    const handleAddTicker = jest.fn();
    const props = makeProps({ handleInputChange, handleAddTicker, inputValue: 'AAPL' });
    render(<TickerInput {...props} />);
    const input = screen.getByPlaceholderText(/aapl/i);
    fireEvent.change(input, { target: { value: 'MSFT' } });
    expect(handleInputChange).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(handleAddTicker).toHaveBeenCalled();
  });

  it('disables input and button when max tickers reached', () => {
    const props = makeProps({ tickers: ['A', 'B', 'C'], inputValue: 'AAPL' });
    render(<TickerInput {...props} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('disables button when input is empty', () => {
    const props = makeProps({ inputValue: '' });
    render(<TickerInput {...props} />);
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('disables button when there is an input error', () => {
    const props = makeProps({ inputValue: 'AAPL', inputError: 'Invalid' });
    render(<TickerInput {...props} />);
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('sets aria-invalid and aria-describedby on error', () => {
    const props = makeProps({ inputError: 'Required' });
    render(<TickerInput {...props} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'ticker-input-error');
  });

  it('calls handleAddTicker on Enter key', () => {
    const props = makeProps({ inputValue: 'AAPL' });
    render(<TickerInput {...props} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(props.handleAddTicker).toHaveBeenCalled();
  });
});