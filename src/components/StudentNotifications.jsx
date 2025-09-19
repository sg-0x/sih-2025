import React, { useState, useEffect } from 'react';
import TeacherActionsService from '../services/TeacherActionsService';
import RealtimeService from '../services/RealtimeService';

function StudentNotifications() {
  const [assignedModules, setAssignedModules] = useState([]);
  const [confirmedDrills, setConfirmedDrills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Connect to real-time service
    RealtimeService.connect();
    
    // Listen for real-time notifications via Socket.io
    RealtimeService.onNewModuleAssignment((module) => {
      setAssignedModules(prev => [module, ...prev]);
    });

    RealtimeService.onNewDrillConfirmation((drill) => {
      setConfirmedDrills(prev => [drill, ...prev]);
    });

    // Also listen for custom events (fallback)
    const handleModuleAssignment = (event) => {
      const module = event.detail;
      setAssignedModules(prev => [module, ...prev]);
    };

    const handleDrillConfirmation = (event) => {
      const drill = event.detail;
      setConfirmedDrills(prev => [drill, ...prev]);
    };

    window.addEventListener('moduleAssigned', handleModuleAssignment);
    window.addEventListener('drillConfirmed', handleDrillConfirmation);

    return () => {
      RealtimeService.disconnect();
      window.removeEventListener('moduleAssigned', handleModuleAssignment);
      window.removeEventListener('drillConfirmed', handleDrillConfirmation);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [modules, drills] = await Promise.all([
        TeacherActionsService.getAssignedModules(),
        TeacherActionsService.getConfirmedDrills()
      ]);
      setAssignedModules(modules);
      setConfirmedDrills(drills);
    } catch (error) {
      console.error('Error loading student notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {/* Assigned Modules */}
      <div className="col-12 col-md-6">
        <div className="card border-primary">
          <div className="card-header bg-primary text-white">
            <h6 className="card-title mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-journal-text"></i>
              Assigned Modules
            </h6>
          </div>
          <div className="card-body">
            {assignedModules.length === 0 ? (
              <div className="text-center py-3">
                <i className="bi bi-journal-x text-muted" style={{ fontSize: '2rem' }}></i>
                <p className="text-muted mt-2 mb-0">No modules assigned yet</p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {assignedModules.map((module, index) => (
                  <div key={index} className="list-group-item border-0 px-0">
                    <div className="d-flex align-items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-journal-text text-primary"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-semibold">{module.title}</h6>
                        <p className="mb-2 text-muted small">{module.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="small text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            Due: {formatDate(module.dueDate)}
                            <span className="mx-2">•</span>
                            <i className="bi bi-clock me-1"></i>
                            {module.estimatedTime}
                          </div>
                          <span className="badge bg-primary">New</span>
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

      {/* Confirmed Drills */}
      <div className="col-12 col-md-6">
        <div className="card border-success">
          <div className="card-header bg-success text-white">
            <h6 className="card-title mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-flag"></i>
              Confirmed Drills
            </h6>
          </div>
          <div className="card-body">
            {confirmedDrills.length === 0 ? (
              <div className="text-center py-3">
                <i className="bi bi-flag text-muted" style={{ fontSize: '2rem' }}></i>
                <p className="text-muted mt-2 mb-0">No drills confirmed yet</p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {confirmedDrills.map((drill, index) => (
                  <div key={index} className="list-group-item border-0 px-0">
                    <div className="d-flex align-items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-flag text-success"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-semibold">{drill.title}</h6>
                        <p className="mb-2 text-muted small">{drill.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="small text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {formatDate(drill.scheduledDate)}
                            <span className="mx-2">•</span>
                            <i className="bi bi-clock me-1"></i>
                            {formatTime(drill.scheduledTime)}
                            <span className="mx-2">•</span>
                            <i className="bi bi-geo-alt me-1"></i>
                            {drill.location}
                          </div>
                          <span className="badge bg-success">Confirmed</span>
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
  );
}

export default StudentNotifications;
