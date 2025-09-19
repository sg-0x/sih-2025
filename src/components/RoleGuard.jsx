import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, onAuthChange } from '../services/AuthService';

function RoleGuard({ role, children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user state
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    
    // Listen for auth changes
    const unsubscribe = onAuthChange((user) => {
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

  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default RoleGuard;

export function AllowRoles({ roles, children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user state
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    
    // Listen for auth changes
    const unsubscribe = onAuthChange((user) => {
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

  if (!user || !roles?.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}




