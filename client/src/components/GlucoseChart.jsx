import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function GlucoseChart({ readings }) {
  // Sort readings chronologically for the chart
  const sortedReadings = [...readings].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Format data for Recharts
  const chartData = sortedReadings.map(r => ({
    date: r.date.split('T')[0],
    slot: r.slot,
    value: r.value
  }));

  if (chartData.length === 0) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', marginBottom: '32px' }}>
        No chart data available for this period. Add readings to view trends!
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
        Glucose Trend Overview
      </h3>
      <div style={{ width: '100%', height: '280px' }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis domain={[40, 300]} stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }}
            />
            {/* Reference line for normal high limit (140 mg/dL) */}
            <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Target High (140)', fill: '#ef4444', fontSize: 11 }} />
            <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}