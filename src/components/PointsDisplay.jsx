import React, { useState, useEffect } from 'react';
import PointsService from '../services/PointsService';

function PointsDisplay() {
  const [userPoints, setUserPoints] = useState({ totalPoints: 0, videosWatched: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserPoints();
    
    // Refresh points every 30 seconds
    const interval = setInterval(loadUserPoints, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUserPoints = async () => {
    try {
      const userId = PointsService.getCurrentUserId();
      const data = await PointsService.getUserPoints(userId);
      setUserPoints(data);
    } catch (error) {
      console.error('Failed to load user points:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted">
        <i className="bi bi-lightning-charge"></i>
        <span className="small">Loading...</span>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <i className="bi bi-lightning-charge text-warning"></i>
      <span className="fw-semibold text-primary">{userPoints.totalPoints}</span>
      <span className="text-muted small">pts</span>
    </div>
  );
}

export default PointsDisplay;
