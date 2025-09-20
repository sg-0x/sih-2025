import React, { useEffect, useMemo, useState } from 'react';

const SCENARIOS = [
  { id: 'drill-eq', title: 'Earthquake Classroom Drill', steps: ['Drop, Cover, Hold', 'Move to assembly point', 'Headcount & report'] },
  { id: 'drill-fire', title: 'Fire Evacuation Drill', steps: ['Raise alarm', 'Use nearest exit', 'Do not use elevators'] },
  { id: 'drill-flood', title: 'Flood Safety Drill', steps: ['Move to higher ground', 'Avoid waterlogged areas', 'Switch off mains'] }
];

function Drills() {
  const [active, setActive] = useState('drill-eq');
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const selected = useMemo(() => SCENARIOS.find((s) => s.id === active), [active]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = () => { setSeconds(0); setRunning(true); };
  const stop = () => { setRunning(false); };

  return (
    <div className="row g-3">
      <div className="col-12 col-md-4">
        <div className="list-group shadow-sm">
          {SCENARIOS.map((s) => (
            <button key={s.id} className={`list-group-item list-group-item-action ${active === s.id ? 'active' : ''}`} onClick={() => setActive(s.id)}>
              {s.title}
            </button>
          ))}
        </div>
        <div className="alert alert-info mt-3 d-flex align-items-start gap-2"><i className="bi bi-vr"></i><span>Use VR/AR assets here for immersive practice.</span></div>
      </div>
      <div className="col-12 col-md-8">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title d-flex align-items-center gap-2"><i className="bi bi-joystick text-success"></i>{selected?.title}</h4>
            <div className="badge bg-secondary">Timer: {Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</div>
            <ol className="mt-3">
              {selected?.steps.map((st, idx) => (
                <li key={idx} className="mb-2">{st}</li>
              ))}
            </ol>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary" onClick={start} disabled={running}><i className="bi bi-play-fill me-1"></i>Start</button>
              <button className="btn btn-outline-secondary" onClick={stop} disabled={!running}><i className="bi bi-stop-circle me-1"></i>Stop</button>
              <button className="btn btn-outline-secondary"><i className="bi bi-clipboard2-check me-1"></i>Record Participation</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Drills;


