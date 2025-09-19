import React, { useMemo, useState } from 'react';

const SAMPLE_ALERTS = [
  { id: 1, region: 'IN-AS', type: 'Flood Watch', severity: 'High', message: 'Heavy rain forecast; rivers rising.', time: '2025-09-15T09:00:00Z' },
  { id: 2, region: 'IN-HP', type: 'Landslide Risk', severity: 'Medium', message: 'Slope instability near school zones.', time: '2025-09-15T07:00:00Z' },
  { id: 3, region: 'IN-GJ', type: 'Cyclone Advisory', severity: 'High', message: 'Cyclone forming over Arabian Sea.', time: '2025-09-14T22:00:00Z' }
];

function Alerts() {
  const [region, setRegion] = useState('IN-HP');
  const [severity, setSeverity] = useState('all');
  const [subscribed, setSubscribed] = useState(false);
  const items = useMemo(() => {
    const base = SAMPLE_ALERTS.filter((a) => a.region === region);
    if (severity === 'all') return base;
    return base.filter((a) => a.severity === severity);
  }, [region, severity]);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap p-3 rounded-4 border bg-white shadow-sm">
        <h4 className="mb-0 d-flex align-items-center gap-2"><i className="bi bi-broadcast text-danger"></i>Region-Specific Alerts</h4>
        <div className="d-flex gap-2">
          <select className="form-select w-auto" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="IN-AS">Assam</option>
            <option value="IN-HP">Himachal Pradesh</option>
            <option value="IN-GJ">Gujarat</option>
            <option value="IN-MH">Maharashtra</option>
          </select>
          <select className="form-select w-auto" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="all">All severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
          <button className={`btn btn-${subscribed ? 'success' : 'outline-success'}`} onClick={() => setSubscribed((s) => !s)}>
            <i className={`bi ${subscribed ? 'bi-bell-fill' : 'bi-bell' } me-1`}></i>{subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>
      </div>
      <div className="list-group">
        {items.map((a) => (
          <div key={a.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center shadow-sm">
            <div>
              <div className="fw-semibold d-flex align-items-center gap-2">
                <i className={`bi ${a.severity === 'High' ? 'bi-exclamation-triangle-fill text-danger' : 'bi-exclamation-triangle text-warning'}`}></i>
                <span>{a.type}</span>
                <span className={`badge bg-${a.severity === 'High' ? 'danger' : 'warning'} ms-1`}>{a.severity}</span>
              </div>
              <div className="small text-muted">{new Date(a.time).toLocaleString()}</div>
              <div>{a.message}</div>
            </div>
            <button className="btn btn-outline-primary btn-sm"><i className="bi bi-journal-text me-1"></i>View Guidance</button>
          </div>
        ))}
        {!items.length && <div className="alert alert-success">No active alerts for your region.</div>}
      </div>
    </div>
  );
}

export default Alerts;


