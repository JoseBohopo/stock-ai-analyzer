import React from 'react';

interface DatePickersProps {
  fromDate: string;
  toDate: string;
  today: string;
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
}

export const DatePickers: React.FC<DatePickersProps> = ({ fromDate, toDate, today, setFromDate, setToDate }) => (
  <section className="form-group date-picker-row">
    <fieldset className="date-picker-fieldset">
      <legend>Date range</legend>
      <div className="date-picker-row">
        <div className="date-picker-col">
          <label htmlFor="from-date">From</label>
          <input
            type="date"
            id="from-date"
            name="from-date"
            className="custom-input"
            value={fromDate}
            max={toDate}
            onChange={e => setFromDate(e.target.value)}
            aria-label="Select start date"
          />
        </div>
        <div className="date-picker-col">
          <label htmlFor="to-date">To</label>
          <input
            type="date"
            id="to-date"
            name="to-date"
            className="custom-input"
            value={toDate}
            min={fromDate}
            max={today}
            onChange={e => setToDate(e.target.value)}
            aria-label="Select end date"
          />
        </div>
      </div>
    </fieldset>
  </section>
);
