// src/components/Chart.tsx
import React from 'react';
// Styles are now in App.css
interface ChartProps {
  data: { t: number; o: number; h: number; l: number; c: number; v: number }[];
  ticker: string;
}

export const Chart: React.FC<ChartProps> = ({ data, ticker }) => {
  if (!data || data.length === 0) return <div>No data to display.</div>;
  const maxClose = Math.max(...data.map(x => x.c));
  return (
    <div className="chart-container">
      <h3 className="chart-title">{ticker} - Daily Close Prices</h3>
      <div className="chart-bars">
        {data.map((d) => (
          <div
            key={d.t}
            className="chart-bar"
            style={{ height: Math.max(10, (d.c / maxClose) * 160) }}
            title={`Close: ${d.c}\nDate: ${new Date(d.t).toLocaleDateString()}`}
          ></div>
        ))}
      </div>
      <div className="chart-dates">
        {new Date(data[0].t).toLocaleDateString()} - {new Date(data.at(-1)!.t).toLocaleDateString()}
      </div>
    </div>
  );
};
