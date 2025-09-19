import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/AuthService';

function RoleGuard({ role, children }) {
  const user = getCurrentUser();
  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default RoleGuard;

export function AllowRoles({ roles, children }) {
  const user = getCurrentUser();
  if (!user || !roles?.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}




