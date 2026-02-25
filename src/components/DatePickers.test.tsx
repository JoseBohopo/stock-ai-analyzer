import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePickers } from './DatePickers';

describe('DatePickers', () => {
  const defaultProps = {
    fromDate: '2024-01-01',
    toDate: '2024-01-31',
    today: '2024-01-31',
    setFromDate: jest.fn(),
    setToDate: jest.fn(),
  };

  it('renders both date inputs', () => {
    render(<DatePickers {...defaultProps} />);
    expect(screen.getByLabelText(/select start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select end date/i)).toBeInTheDocument();
  });

  it('calls setFromDate and setToDate', () => {
    render(<DatePickers {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/select start date/i), { target: { value: '2024-01-02' } });
    expect(defaultProps.setFromDate).toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/select end date/i), { target: { value: '2024-01-30' } });
    expect(defaultProps.setToDate).toHaveBeenCalled();
  });
});
