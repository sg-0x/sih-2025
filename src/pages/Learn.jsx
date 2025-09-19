import React, { useMemo, useState } from 'react';

const CATEGORIES = [
  { id: 'earthquake', name: 'Earthquake' },
  { id: 'flood', name: 'Flood' },
  { id: 'fire', name: 'Fire' },
  { id: 'cyclone', name: 'Cyclone' },
  { id: 'landslide', name: 'Landslide' }
];

const MODULES = [
  { id: 'eq-basics', category: 'earthquake', title: 'Earthquake Basics', minutes: 5 },
  { id: 'eq-drop-cover-hold', category: 'earthquake', title: 'Drop, Cover, Hold', minutes: 4 },
  { id: 'flood-evac', category: 'flood', title: 'Flood Evacuation Plan', minutes: 6 },
  { id: 'fire-ext', category: 'fire', title: 'Using a Fire Extinguisher', minutes: 5 },
  { id: 'cyclone-prep', category: 'cyclone', title: 'Cyclone Preparedness', minutes: 6 },
  { id: 'landslide-zones', category: 'landslide', title: 'Recognizing Risk Zones', minutes: 5 }
];

function Learn() {
  const [region, setRegion] = useState('IN-HP');
  const [progress, setProgress] = useState({});
  const [category, setCategory] = useState('earthquake');

  const recommended = useMemo(() => {
    // Region-specific prioritization (simplified mapping)
    const priority = {
      'IN-AS': ['flood', 'earthquake'],
      'IN-HP': ['landslide', 'earthquake'],
      'IN-GJ': ['cyclone', 'fire']
    };
    const prefer = priority[region] || ['earthquake', 'fire'];
    return MODULES.filter((m) => prefer.includes(m.category));
  }, [region]);

  const visible = useMemo(() => MODULES.filter((m) => m.category === category), [category]);

  return (
    <div className="row g-3">
      <div className="col-12 col-md-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center gap-2"><i className="bi bi-geo-alt text-primary"></i>Your Region</h5>
            <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="IN-AS">Assam</option>
              <option value="IN-HP">Himachal Pradesh</option>
              <option value="IN-GJ">Gujarat</option>
              <option value="IN-MH">Maharashtra</option>
            </select>
          </div>
        </div>
        <div className="card mt-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center gap-2"><i className="bi bi-stars text-warning"></i>Recommended</h5>
            <ul className="list-group">
              {recommended.map((m) => (
                <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {m.title}
                  <span className="badge bg-primary rounded-pill">{m.minutes}m</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-8">
        <div className="d-flex align-items-center justify-content-between mb-2 p-3 rounded-4 border bg-white shadow-sm">
          <h4 className="mb-0 d-flex align-items-center gap-2"><i className="bi bi-mortarboard text-primary"></i>Modules</h4>
          <select className="form-select w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="row g-3">
          {visible.map((m) => (
            <div key={m.id} className="col-12 col-lg-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{m.title}</h5>
                  <p className="card-text">Interactive lesson with video and a short quiz.</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">{m.minutes} minutes</span>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => setProgress((p) => ({ ...p, [m.id]: Math.min(100, (p[m.id] || 0) + 25) }))}>
                      <i className="bi bi-play-fill me-1"></i>{progress[m.id] >= 100 ? 'Review' : 'Start'}
                    </button>
                  </div>
                  <div className="progress mt-3" role="progressbar" aria-label="module progress" aria-valuenow={progress[m.id] || 0} aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar" style={{ width: `${progress[m.id] || 0}%` }}>{progress[m.id] ? `${progress[m.id]}%` : ''}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Learn;


