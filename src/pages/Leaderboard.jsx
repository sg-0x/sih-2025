import React, { useState, useEffect } from 'react';
import PointsService from '../services/PointsService';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userPoints, setUserPoints] = useState({ totalPoints: 0, videosWatched: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
    loadUserPoints();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await PointsService.getLeaderboard(50); // Show up to 50 users
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPoints = async () => {
    try {
      const userId = PointsService.getCurrentUserId();
      const data = await PointsService.getUserPoints(userId);
      setUserPoints(data);
    } catch (error) {
      console.error('Failed to load user points:', error);
    }
  };

  const getRankIcon = (index) => {
    return '';
  };

  const getRankClass = (index) => {
    if (index === 0) return 'bg-primary text-white border-0 shadow-sm';
    if (index === 1) return 'bg-light border-0 shadow-sm';
    if (index === 2) return 'bg-light border-0 shadow-sm';
    return 'border-0';
  };

  return (
    <div className="container-fluid">
      <div className="row g-4">
        {/* User Stats */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h2 className="card-title d-flex align-items-center justify-content-center gap-2">
                <i className="bi bi-trophy text-warning"></i>
                Your Progress
              </h2>
              <div className="row g-3 mt-3">
                <div className="col-md-6">
                  <div className="p-3 bg-primary-subtle rounded">
                    <h3 className="text-primary mb-1">{userPoints.totalPoints}</h3>
                    <p className="text-muted mb-0">Total Points</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-success-subtle rounded">
                    <h3 className="text-success mb-1">{userPoints.videosWatched}</h3>
                    <p className="text-muted mb-0">Videos Watched</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-trophy-fill"></i>
                Leaderboard
              </h4>
              <button 
                className="btn btn-light btn-sm"
                onClick={() => { setLoading(true); loadLeaderboard(); }}
                disabled={loading}
              >
                <i className={`bi bi-arrow-clockwise ${loading ? 'spinner-border spinner-border-sm' : ''}`}></i>
                Refresh
              </button>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-2">Loading leaderboard...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-trophy text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted mt-2">No users found. Please check your database connection.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {leaderboard.map((user, index) => (
                    <div key={user.userId} className="col-12">
                      <div className={`card ${getRankClass(index)}`}>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                              <div className="fs-3 fw-bold">
                                {getRankIcon(index)}
                              </div>
                              <div>
                                <h5 className="mb-1 fw-semibold">
                                  {user.userId === 'demo-user' ? 'You' : user.userId}
                                  {user.userId === 'demo-user' && <span className="badge bg-primary ms-2">You</span>}
                                </h5>
                                <small className="text-muted">
                                  {user.videosWatched} video{user.videosWatched !== 1 ? 's' : ''} watched
                                </small>
                              </div>
                            </div>
                            <div className="text-end">
                              <div className="fs-4 fw-bold">{user.totalPoints}</div>
                              <small className="text-muted">points</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Leaderboard;