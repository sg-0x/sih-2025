import React from 'react';

const CONTACTS = [
  { label: 'NDMA Helpline', phone: '011-26701700' },
  { label: 'Police', phone: '100' },
  { label: 'Ambulance', phone: '108' },
  { label: 'Fire', phone: '101' }
];

function Emergency() {
  return (
    <div className="row g-3">
      <div className="col-12 col-lg-6">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h4 className="card-title d-flex align-items-center gap-2"><i className="bi bi-telephone text-danger"></i>Emergency Contacts</h4>
            <ul className="list-group mt-3">
              {CONTACTS.map((c) => (
                <li key={c.label} className="list-group-item d-flex justify-content-between align-items-center">
                  {c.label}
                  <a className="btn btn-outline-danger btn-sm" href={`tel:${c.phone}`}>{c.phone}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-6">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h4 className="card-title d-flex align-items-center gap-2"><i className="bi bi-megaphone text-primary"></i>Real-time Communication</h4>
            <p className="text-muted">Enable broadcast messaging to students, parents, and staff during incidents.</p>
            <div className="d-flex gap-2">
              <button className="btn btn-warning"><i className="bi bi-bell me-1"></i>Send Drill Announcement</button>
              <button className="btn btn-danger"><i className="bi bi-exclamation-octagon me-1"></i>Send Emergency Alert</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Emergency;


