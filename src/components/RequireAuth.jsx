import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, onAuthChange } from '../services/AuthService';

function RequireAuth({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Set initial user state
    const currentUser = getCurrentUser();
    console.log('RequireAuth - Initial user:', currentUser); // Debug log
    setUser(currentUser);
    setLoading(false);
    
    // Listen for auth changes
    const unsubscribe = onAuthChange((user) => {
      console.log('RequireAuth - Auth changed:', user); // Debug log
      setUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  if (loading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

export default RequireAuth;




