import React, { useState, useEffect } from 'react';
import TeacherActionsService from '../services/TeacherActionsService';
import RealtimeService from '../services/RealtimeService';

function StudentModulesDisplay() {
  const [assignedModules, setAssignedModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showAllModules, setShowAllModules] = useState(false);

  useEffect(() => {
    loadModules();
    
    // Connect to real-time service
    RealtimeService.connect();
    
    // Listen for new module assignments
    RealtimeService.onNewModuleAssignment((module) => {
      setAssignedModules(prev => [module, ...prev]);
    });

    // Also listen for custom events (fallback)
    const handleModuleAssignment = (event) => {
      const module = event.detail;
      setAssignedModules(prev => [module, ...prev]);
    };

    window.addEventListener('moduleAssigned', handleModuleAssignment);

    return () => {
      RealtimeService.disconnect();
      window.removeEventListener('moduleAssigned', handleModuleAssignment);
    };
  }, []);

  const loadModules = async () => {
    try {
      setLoading(true);
      const modules = await TeacherActionsService.getAssignedModules();
      console.log('Loaded modules:', modules);
      setAssignedModules(modules);
    } catch (error) {
      console.error('Error loading modules:', error);
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('video')) {
      return 'bi-camera-video text-primary';
    } else if (fileType.includes('pdf')) {
      return 'bi-file-pdf text-danger';
    }
    return 'bi-file-earmark text-secondary';
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const isDueSoon = (dueDate) => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return new Date(dueDate) <= threeDaysFromNow && new Date(dueDate) > new Date();
  };

  const handleFileClick = (file, fileType) => {
    if (!file || !file.url) {
      alert('File URL not available');
      return;
    }
    
    console.log(`Opening ${fileType} file:`, file.url);
    
    // Test if the URL is accessible
    fetch(file.url, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          window.open(file.url, '_blank');
        } else {
          alert(`File not accessible. Status: ${response.status}`);
        }
      })
      .catch(error => {
        console.error('Error accessing file:', error);
        alert('Error accessing file. Please try again.');
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading modules...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {/* Header */}
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-journal-text text-primary"></i>
            Modules Assigned by Teachers
          </h5>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={loadModules}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Modules List */}
      {assignedModules.length === 0 ? (
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <i className="bi bi-journal-x text-muted" style={{ fontSize: '3rem' }}></i>
              <h5 className="mt-3 text-muted">No modules assigned yet</h5>
              <p className="text-muted">Your teachers will assign modules with videos and PDFs here.</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {(showAllModules ? assignedModules : assignedModules.slice(0, 2)).map((module, index) => (
          <div key={module._id || index} className="col-12 col-lg-6">
            <div className={`card h-100 ${isOverdue(module.dueDate) ? 'border-danger' : isDueSoon(module.dueDate) ? 'border-warning' : 'border-primary'}`}>
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-start">
                  <h6 className="card-title mb-0 fw-semibold">{module.title}</h6>
                  <div className="d-flex gap-1">
                    {isOverdue(module.dueDate) ? (
                      <span className="badge bg-danger">Overdue</span>
                    ) : isDueSoon(module.dueDate) ? (
                      <span className="badge bg-warning">Due Soon</span>
                    ) : (
                      <span className="badge bg-success">Active</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <p className="card-text text-muted small mb-3">{module.description}</p>
                
                {/* Module Details */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <small className="text-muted d-block">Due Date</small>
                    <span className="fw-semibold">{formatDate(module.dueDate)}</span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Estimated Time</small>
                    <span className="fw-semibold">{module.estimatedTime}</span>
                  </div>
                </div>

                {/* Files Section */}
                {(module.files?.video || module.files?.pdf) && (
                  <div className="mb-3">
                    <h6 className="small fw-semibold text-muted mb-2">Attached Files</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {module.files.video && (
                        <div className="d-flex align-items-center gap-2 p-2 bg-primary-subtle rounded">
                          <i className={`bi ${getFileIcon(module.files.video.type)}`}></i>
                          <div>
                            <div className="small fw-semibold">{module.files.video.originalName}</div>
                            <div className="small text-muted">{formatFileSize(module.files.video.size)}</div>
                          </div>
                        </div>
                      )}
                      {module.files.pdf && (
                        <div className="d-flex align-items-center gap-2 p-2 bg-danger-subtle rounded">
                          <i className={`bi ${getFileIcon(module.files.pdf.type)}`}></i>
                          <div>
                            <div className="small fw-semibold">{module.files.pdf.originalName}</div>
                            <div className="small text-muted">{formatFileSize(module.files.pdf.size)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Teacher Info */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="small text-muted">
                    <i className="bi bi-person me-1"></i>
                    Assigned by {module.teacherName}
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedModule(module)}
                  >
                    <i className="bi bi-eye me-1"></i>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))}
          {assignedModules.length > 2 && (
            <div className="col-12 text-center mt-3">
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowAllModules(!showAllModules)}
              >
                {showAllModules ? (
                  <>
                    <i className="bi bi-chevron-up me-1"></i>
                    Show Less
                  </>
                ) : (
                  <>
                    <i className="bi bi-chevron-down me-1"></i>
                    Show More ({assignedModules.length - 2} more)
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Module Detail Modal */}
      {selectedModule && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  <i className="bi bi-journal-text text-primary"></i>
                  {selectedModule.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedModule(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <h6>Description</h6>
                    <p>{selectedModule.description}</p>
                  </div>
                  
                  <div className="col-md-6">
                    <h6>Due Date</h6>
                    <p className="mb-0">{formatDate(selectedModule.dueDate)}</p>
                  </div>
                  
                  <div className="col-md-6">
                    <h6>Estimated Time</h6>
                    <p className="mb-0">{selectedModule.estimatedTime}</p>
                  </div>

                  <div className="col-md-6">
                    <h6>Assigned by</h6>
                    <p className="mb-0">{selectedModule.teacherName}</p>
                  </div>

                  <div className="col-md-6">
                    <h6>Target Classes</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedModule.targetClasses.map((className, index) => (
                        <span key={index} className="badge bg-primary">{className}</span>
                      ))}
                    </div>
                  </div>

                  {/* Files Section */}
                  {(selectedModule.files?.video || selectedModule.files?.pdf) && (
                    <div className="col-12">
                      <h6>Attached Files</h6>
                      <div className="row g-3">
                        {selectedModule.files.video && (
                          <div className="col-md-6">
                            <div className="card border-primary">
                              <div className="card-body">
                                <div className="d-flex align-items-center gap-3">
                                  <i className="bi bi-camera-video text-primary" style={{ fontSize: '2rem' }}></i>
                                  <div className="flex-grow-1">
                                    <h6 className="card-title mb-1">{selectedModule.files.video.originalName}</h6>
                                    <p className="card-text small text-muted mb-2">
                                      {formatFileSize(selectedModule.files.video.size)}
                                    </p>
                                    <button 
                                      className="btn btn-primary btn-sm"
                                      onClick={() => handleFileClick(selectedModule.files.video, 'video')}
                                    >
                                      <i className="bi bi-play-circle me-1"></i>
                                      Watch Video
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedModule.files.pdf && (
                          <div className="col-md-6">
                            <div className="card border-danger">
                              <div className="card-body">
                                <div className="d-flex align-items-center gap-3">
                                  <i className="bi bi-file-pdf text-danger" style={{ fontSize: '2rem' }}></i>
                                  <div className="flex-grow-1">
                                    <h6 className="card-title mb-1">{selectedModule.files.pdf.originalName}</h6>
                                    <p className="card-text small text-muted mb-2">
                                      {formatFileSize(selectedModule.files.pdf.size)}
                                    </p>
                                    <button 
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleFileClick(selectedModule.files.pdf, 'pdf')}
                                    >
                                      <i className="bi bi-download me-1"></i>
                                      Download PDF
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedModule(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentModulesDisplay;
