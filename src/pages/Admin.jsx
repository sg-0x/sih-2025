import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ProgressRing from '../components/ProgressRing';
import { useEffect, useState } from 'react';

const COMPLETION = [
  { month: 'Apr', completion: 22 },
  { month: 'May', completion: 38 },
  { month: 'Jun', completion: 55 },
  { month: 'Jul', completion: 68 },
  { month: 'Aug', completion: 74 },
  { month: 'Sep', completion: 81 }
];

function Admin() {
  const [chartStyles, setChartStyles] = useState({ line: getComputedStyle(document.documentElement).getPropertyValue('--chart-line').trim() || '#0d6efd', grid: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || '#e9ecef' });

  useEffect(() => {
    const update = () => {
      const cs = getComputedStyle(document.documentElement);
      setChartStyles({ line: cs.getPropertyValue('--chart-line').trim(), grid: cs.getPropertyValue('--chart-grid').trim() });
    };
    window.addEventListener('themechange', update);
    return () => window.removeEventListener('themechange', update);
  }, []);

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="alert alert-info d-flex align-items-center gap-2 py-2" role="status" aria-live="polite">
          <i className="bi bi-info-circle" aria-hidden="true"></i>
          <div className="small">Institute dashboard: track preparedness, drills, modules, and compliance. Configure alerts for your region.</div>
        </div>
      </div>
      <div className="col-12 col-xl-8">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h4 className="card-title d-flex align-items-center gap-2"><i className="bi bi-graph-up text-success"></i>Preparedness Completion Over Time</h4>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={COMPLETION}>
                  <Line type="monotone" dataKey="completion" stroke={chartStyles.line || '#0d6efd'} strokeWidth={3} />
                  <CartesianGrid stroke={chartStyles.grid || '#e9ecef'} strokeDasharray="5 5" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => `${v}%`} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h4 className="card-title d-flex align-items-center gap-2"><i className="bi bi-speedometer2 text-primary"></i>Snapshot</h4>
            <div className="d-flex justify-content-around py-2">
              <ProgressRing value={81} label="Preparedness" color="#0d6efd" />
              <ProgressRing value={64} label="Module Avg" color="#198754" />
              <ProgressRing value={42} label="Drill Rate" color="#ffc107" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-6">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center gap-2"><i className="bi bi-broadcast text-danger"></i>Alerts configuration</h5>
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <label className="form-label small">Region</label>
                <select className="form-select form-select-sm">
                  <option>Himachal Pradesh</option>
                  <option>Assam</option>
                  <option>Bihar</option>
                  <option>Uttarakhand</option>
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small">Severity threshold</label>
                <select className="form-select form-select-sm">
                  <option>All</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <button className="btn btn-outline-primary btn-sm mt-2" aria-label="Save alert configuration"><i className="bi bi-save me-1"></i>Save preferences</button>
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-6">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center gap-2"><i className="bi bi-clipboard-check text-warning"></i>Compliance overview</h5>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'NDMA', value: 76 }, { name: 'Fire', value: 62 }, { name: 'First Aid', value: 55 }]}>
                  <CartesianGrid stroke={chartStyles.grid || '#e9ecef'} strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill={chartStyles.line || '#0d6efd'} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;


