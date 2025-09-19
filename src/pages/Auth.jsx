import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../services/AuthService';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (mode === 'login') {
        const user = await login(email.trim(), password, role);
        if (user.role === 'admin') navigate('/admin', { replace: true });
        else if (user.role === 'teacher') navigate('/teacher', { replace: true });
        else navigate('/', { replace: true });
      } else {
        if (password !== confirm) throw new Error('Passwords do not match');
        const user = await signup(name.trim(), email.trim(), password, 'student', { institution: institution.trim(), phone: phone.trim() });
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email.trim()) {
      setError('Please enter your email address first');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
    } catch (err) {
      setError(err.message || 'Failed to send password reset email');
    }
  };


  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'radial-gradient(1200px 500px at 10% 10%, #e3f2fd 0%, rgba(227,242,253,0) 70%), radial-gradient(1000px 400px at 90% 20%, #fff3cd 0%, rgba(255,243,205,0) 60%), linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
      <div className="container" style={{ maxWidth: 1040 }}>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-lg-6">
            <div className="p-4 p-md-5 rounded-4 bg-white border shadow h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-shield-fill-exclamation text-danger"></i>
                  <h4 className="mb-0">D-Prep</h4>
                </div>
                <span className="badge bg-primary-subtle text-primary border small">Secure Access</span>
              </div>
              <div className="btn-group mb-3 w-100" role="group">
                <button type="button" className={`btn btn-${mode==='login'?'primary':'outline-primary'}`} onClick={() => setMode('login')}>Login</button>
                <button type="button" className={`btn btn-${mode==='signup'?'primary':'outline-primary'}`} onClick={() => setMode('signup')}>Sign up</button>
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              {success && <div className="alert alert-success py-2">{success}</div>}
              <form className="d-grid gap-3" onSubmit={onSubmit}>
                {mode === 'signup' && (
                  <div>
                    <label className="form-label">Name <span className="text-danger">*</span></label>
                    <input className="form-control" value={name} onChange={(e)=>setName(e.target.value)} required />
                  </div>
                )}
                <div>
                  <label className="form-label">Email <span className="text-danger">*</span></label>
                  <input type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                </div>
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Password <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <input type={showPassword ? 'text' : 'password'} className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                      <button type="button" className="btn btn-outline-secondary" onClick={()=>setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                  {mode === 'signup' && (
                    <div className="col-12 col-md-6">
                      <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                      <input type={showPassword ? 'text' : 'password'} className="form-control" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
                    </div>
                  )}
                </div>
                {mode === 'signup' && (
                  <div className="row g-2">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Institution <span className="text-danger">*</span></label>
                      <input className="form-control" value={institution} onChange={(e)=>setInstitution(e.target.value)} placeholder="College/School" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Phone <span className="text-danger">*</span></label>
                      <input className="form-control" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="10-digit" required />
                    </div>
                  </div>
                )}
                <button className="btn btn-primary" type="submit">{mode==='login' ? 'Login' : 'Create account'}</button>
              </form>
              
              {mode === 'login' && (
                <div className="text-center mt-3">
                  <button 
                    type="button" 
                    className="btn btn-link text-decoration-none p-0"
                    onClick={() => setShowForgotPassword(!showForgotPassword)}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
              
              {showForgotPassword && (
                <div className="mt-3 p-3 border rounded-3 bg-light">
                  <h6 className="mb-2">Reset Password</h6>
                  <p className="small text-muted mb-3">Enter your email address and we'll send you a link to reset your password.</p>
                  <form onSubmit={handleForgotPassword}>
                    <div className="d-flex gap-2">
                      <input 
                        type="email" 
                        className="form-control" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Enter your email"
                        required 
                      />
                      <button type="submit" className="btn btn-outline-primary">
                        Send Reset Link
                      </button>
                    </div>
                  </form>
                  <button 
                    type="button" 
                    className="btn btn-link text-decoration-none p-0 mt-2"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="h-100 p-4 p-md-5 rounded-4 border bg-white shadow">
              <h5 className="mb-2 d-flex align-items-center gap-2"><i className="bi bi-radar text-primary"></i>Disaster-ready campuses</h5>
              <div className="text-muted small mb-3">Interactive education, region-specific alerts, and virtual drills for students and staff.</div>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="rounded-3 p-3 border h-100">
                    <div className="fw-semibold mb-1 d-flex align-items-center gap-2"><i className="bi bi-mortarboard text-primary"></i>Interactive Learning</div>
                    <div className="text-muted small">Videos, quizzes, and badges.</div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="rounded-3 p-3 border h-100">
                    <div className="fw-semibold mb-1 d-flex align-items-center gap-2"><i className="bi bi-joystick text-success"></i>Virtual Drills</div>
                    <div className="text-muted small">Practice safely with simulations.</div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="rounded-3 p-3 border h-100">
                    <div className="fw-semibold mb-1 d-flex align-items-center gap-2"><i className="bi bi-broadcast text-danger"></i>Region Alerts</div>
                    <div className="text-muted small">Stay updated and prepared.</div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="rounded-3 p-3 border h-100">
                    <div className="fw-semibold mb-1 d-flex align-items-center gap-2"><i className="bi bi-trophy text-warning"></i>Gamified</div>
                    <div className="text-muted small">Points, badges, leaderboard.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;


