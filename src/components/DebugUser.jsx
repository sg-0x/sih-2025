import React, { useState, useEffect } from 'react';
import { getCurrentUser, onAuthChange } from '../services/AuthService';

function DebugUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
    });
    
    return unsubscribe;
  }, []);

  if (!user) {
    return <div className="alert alert-warning">No user logged in</div>;
  }

  return (
    <div className="alert alert-info">
      <h6>Debug User Info:</h6>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>UID:</strong> {user.uid}</p>
      <p><strong>Institution:</strong> {user.institution}</p>
    </div>
  );
}

export default DebugUser;
