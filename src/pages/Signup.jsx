import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/AuthService';

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      signup(name.trim(), email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3 d-flex align-items-center gap-2"><i className="bi bi-person-plus text-primary"></i>Sign up</h4>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={onSubmit} className="d-grid gap-3">
              <div>
                <label className="form-label">Name</label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary" type="submit">Create account</button>
            </form>
            <div className="small text-muted mt-3">Have an account? <Link to="/login">Login</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;




