import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/AuthService';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email.trim(), password);
      // Role-based redirection after successful login
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'teacher') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3 d-flex align-items-center gap-2"><i className="bi bi-box-arrow-in-right text-primary"></i>Login</h4>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={onSubmit} className="d-grid gap-3">
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary" type="submit">Login</button>
            </form>
            <div className="small text-muted mt-3">No account? <Link to="/signup">Sign up</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;




