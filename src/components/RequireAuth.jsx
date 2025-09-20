import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, onAuthChange, isAuthInitialized } from '../services/AuthService';

function RequireAuth({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    let timeoutId;
    
    // Check if auth is already initialized
    if (isAuthInitialized()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setAuthInitialized(true);
      setLoading(false);
    }
    
    // Listen for auth changes
    const unsubscribe = onAuthChange((user) => {
      console.log('RequireAuth - Auth changed:', user); // Debug log
      setUser(user);
      setAuthInitialized(true);
      setLoading(false);
    });
    
    // Set a timeout to ensure we don't wait forever
    timeoutId = setTimeout(() => {
      if (!authInitialized) {
        console.log('RequireAuth - Auth initialization timeout');
        setAuthInitialized(true);
        setLoading(false);
      }
    }, 3000); // 3 second timeout
    
    // Cleanup
    return () => {
      unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [authInitialized]);
  
  // Show loading spinner while auth is initializing
  if (loading || !authInitialized) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Initializing authentication...</p>
      </div>
    </div>;
  }
  
  // Only redirect to login if auth is initialized and no user
  if (!user) {
    console.log('RequireAuth - No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

export default RequireAuth;




