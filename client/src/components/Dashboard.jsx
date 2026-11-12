import React, { useState, useEffect } from 'react';
import API from '../services/api';
import GlucoseChart from './GlucoseChart'; // <-- Imported here
import HealthRecommendations from './HealthRecommendations';

const SLOTS = ['Morning (fasting)', 'After breakfast', 'After lunch', 'After dinner'];

export default function Dashboard({ user, onLogout }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [readings, setReadings] = useState([]);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [reports, setReports] = useState({ daily: null, mtd: null, previous_month: null });

  const fetchData = async () => {
    try {
      const readingsRes = await API.get(`/readings?date=${selectedDate}`);
      setReadings(readingsRes.data);

      const dailyRes = await API.get(`/reports?type=daily&date=${selectedDate}`);
      const mtdRes = await API.get(`/reports?type=mtd&date=${selectedDate}`);
      const prevRes = await API.get(`/reports?type=previous_month&date=${selectedDate}`);

      setReports({
        daily: dailyRes.data,
        mtd: mtdRes.data,
        previous_month: prevRes.data,
      });
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleAddReading = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      await API.post('/readings', { date: selectedDate, slot, value });
      setValue('');
      setSuccessMsg('Reading added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add reading.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reading?')) return;
    try {
      await API.delete(`/readings/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete reading.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Top Navbar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🩸</span>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Sweety Dashboard</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>Hello, <strong>{user.name}</strong></span>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              background: '#f1f5f9',
              color: '#ef4444',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 20px' }}>
        
        {/* Controls & Add Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>Record Glucose Reading</h2>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginRight: '8px' }}>Active Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}

          {successMsg && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
              ✅ {successMsg}
            </div>
          )}

          <form onSubmit={handleAddReading} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Time Slot</label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
              >
                {SLOTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Value (mg/dl)</label>
              <input
                type="number"
                placeholder="e.g. 110"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '11px 20px',
                background: '#059669',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              + Add Reading
            </button>
          </form>
        </div>

        {/* Today's Readings List */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
            Readings for {selectedDate} ({readings.length}/4)
          </h2>
          {readings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontStyle: 'italic' }}>
              No readings recorded for this date yet. Add one above!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {readings.map((r) => (
                <div key={r.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}>
                  <div>
                    <span style={{ fontWeight: '600', color: '#1e293b', marginRight: '12px' }}>{r.slot}</span>
                    <span style={{
                      background: r.value > 140 ? '#fef2f2' : '#f0fdf4',
                      color: r.value > 140 ? '#991b1b' : '#166534',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {r.value} mg/dl
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- PLACE CHART HERE (Right above Reports Grid) --- */}
        <GlucoseChart readings={readings} />
        {/* Health Recommendations Banner */}
        <HealthRecommendations average={reports.mtd?.stats?.average || reports.daily?.stats?.average} />

        {/* Reports Grid */}
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Statistical Reports</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <ReportCard title={`Daily Report (${selectedDate})`} report={reports.daily} />
          <ReportCard title={`Month-to-Date (${reports.mtd?.label || 'MTD'})`} report={reports.mtd} />
          <ReportCard title={`Previous Month (${reports.previous_month?.label || 'Prev'})`} report={reports.previous_month} />
        </div>

      </main>
    </div>
  );
}

function ReportCard({ title, report }) {
  if (!report) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
        Loading report...
      </div>
    );
  }

  const stats = report.stats || report;
  const count = stats.count ?? stats.totalReadings ?? 0;
  const average = stats.average ?? stats.avg ?? 0;
  const lowest = stats.lowest ?? stats.min ?? 0;
  const highest = stats.highest ?? stats.max ?? 0;

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
        {title}
      </h3>
      {report.isEmpty ? (
        <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
          {report.message || 'No data available'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <StatBox label="Count" value={count} />
          <StatBox label="Average" value={`${average} mg/dl`} />
          <StatBox label="Lowest" value={`${lowest} mg/dl`} />
          <StatBox label="Highest" value={`${highest} mg/dl`} />
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
      <div style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{value}</div>
    </div>
  );
}