import React from 'react';

const LEADERS = [
  { name: 'Aarav', points: 420 },
  { name: 'Isha', points: 390 },
  { name: 'Kabir', points: 360 },
  { name: 'Meera', points: 340 }
];

function Leaderboard() {
  return (
    <div>
      <h4 className="mb-3 d-flex align-items-center gap-2"><i className="bi bi-trophy text-warning"></i>Leaderboard</h4>
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Student</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {LEADERS.map((l, idx) => (
            <tr key={l.name}>
              <td>{idx + 1}</td>
              <td>{l.name}</td>
              <td><span className="badge bg-primary"><i className="bi bi-lightning-charge me-1"></i>{l.points}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="alert alert-secondary d-flex align-items-start gap-2"><i className="bi bi-stars"></i><span>Gamify modules with badges and XP to boost engagement.</span></div>
    </div>
  );
}

export default Leaderboard;


