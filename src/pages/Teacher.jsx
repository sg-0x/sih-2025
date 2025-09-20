import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeacherDrillAnnouncement from '../components/TeacherDrillAnnouncement';
import DrillAnnouncementService from '../services/DrillAnnouncementService';
import TeacherActionsService from '../services/TeacherActionsService';
import ModuleAssignmentForm from '../components/ModuleAssignmentForm';
import AssignmentForm from '../components/AssignmentForm';
import AssignmentService from '../services/AssignmentService';
import StatisticsService from '../services/StatisticsService';
import { getCurrentUser } from '../services/AuthService';

function Teacher() {
  const [activeTab, setActiveTab] = useState('overview'); // overview | assignments | analytics
  const [isAssigning, setIsAssigning] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [showDrillForm, setShowDrillForm] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    platformStats: null,
    userStats: null,
    loading: false
  });
  const [drillFormData, setDrillFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date
    time: '10:00',
    venue: '',
    drillType: 'Fire Safety',
    description: ''
  });
  
  // Generate classes data based on analytics
  const getClassesData = () => {
    if (!analyticsData.platformStats) {
      return [
        { name: 'B.Sc CS - II', completion: 0, lastDrill: 'No drills', participation: 0 },
        { name: 'B.Com - I', completion: 0, lastDrill: 'No drills', participation: 0 },
        { name: 'B.A. - III', completion: 0, lastDrill: 'No drills', participation: 0 }
      ];
    }
    
    const totalStudents = analyticsData.platformStats.totalStudents || 0;
    const totalModules = analyticsData.platformStats.totalModulesCompleted || 0;
    const totalDrills = analyticsData.platformStats.totalDrillsCompleted || 0;
    const avgPreparedness = analyticsData.platformStats.averagePreparedness || 0;
    
    return [
      { 
        name: 'B.Sc CS - II', 
        completion: Math.min(Math.round((totalModules / Math.max(totalStudents, 1)) * 100), 100), 
        lastDrill: totalDrills > 0 ? 'Fire Evacuation' : 'No drills', 
        participation: Math.min(Math.round((totalDrills / Math.max(totalStudents, 1)) * 100), 100)
      },
      { 
        name: 'B.Com - I', 
        completion: Math.min(Math.round((totalModules / Math.max(totalStudents, 1)) * 0.8 * 100), 100), 
        lastDrill: totalDrills > 0 ? 'Earthquake Drill' : 'No drills', 
        participation: Math.min(Math.round((totalDrills / Math.max(totalStudents, 1)) * 0.9 * 100), 100)
      },
      { 
        name: 'B.A. - III', 
        completion: Math.min(Math.round((totalModules / Math.max(totalStudents, 1)) * 0.7 * 100), 100), 
        lastDrill: totalDrills > 0 ? 'Flood Safety' : 'No drills', 
        participation: Math.min(Math.round((totalDrills / Math.max(totalStudents, 1)) * 0.8 * 100), 100)
      }
    ];
  };
  
  const classes = getClassesData();

  const user = getCurrentUser();

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'assignments') {
      loadAssignments();
    } else if (activeTab === 'analytics') {
      loadAnalyticsData();
    }
  }, [activeTab]);

  // Load assignments
  const loadAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const data = await AssignmentService.getAllAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Load analytics data
  const loadAnalyticsData = async () => {
    try {
      setAnalyticsData(prev => ({ ...prev, loading: true }));
      
      const userId = StatisticsService.getCurrentUserId();
      const [platformStats, userStats] = await Promise.all([
        StatisticsService.getPlatformStatistics(),
        StatisticsService.getUserStatistics(userId)
      ]);
      
      setAnalyticsData({
        platformStats,
        userStats,
        loading: false
      });
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      setAnalyticsData(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle assignment creation
  const handleCreateAssignment = () => {
    setShowAssignmentForm(true);
  };

  // Handle assignment form success
  const handleAssignmentCreated = (assignment) => {
    setAssignments(prev => [assignment, ...prev]);
    setSuccessMessage('Assignment created successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle assignment status update
  const handleUpdateAssignmentStatus = async (assignmentId, newStatus) => {
    try {
      await AssignmentService.updateAssignmentStatus(assignmentId, newStatus);
      setAssignments(prev => 
        prev.map(assignment => 
          assignment._id === assignmentId 
            ? { ...assignment, status: newStatus }
            : assignment
        )
      );
      setSuccessMessage('Assignment status updated!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update assignment status:', error);
    }
  };

  // Communication handlers
  const handleSendDrillAnnouncement = async (announcementData) => {
    try {
      const result = await DrillAnnouncementService.sendDrillAnnouncement(announcementData);
      console.log('Drill announcement sent:', result);
      return result;
    } catch (error) {
      console.error('Error sending drill announcement:', error);
      throw error;
    }
  };

  // Handle module assignment
  const handleAssignModule = () => {
    setShowModuleForm(true);
  };

  // Handle module form success
  const handleModuleFormSuccess = (message) => {
    setSuccessMessage(message);
    setShowModuleForm(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle drill form input changes
  const handleDrillFormChange = (e) => {
    const { name, value } = e.target;
    setDrillFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle drill form submission
  const handleDrillFormSubmit = async (e) => {
    e.preventDefault();
    setIsConfirming(true);
    setSuccessMessage('');
    
    try {
      const drillData = {
        title: `${drillFormData.drillType} Drill - ${drillFormData.venue}`,
        description: drillFormData.description || `Emergency ${drillFormData.drillType.toLowerCase()} drill for all students and staff.`,
        scheduledDate: drillFormData.date,
        scheduledTime: drillFormData.time,
        location: drillFormData.venue,
        drillType: drillFormData.drillType,
        targetClasses: ['B.Sc CS - II', 'B.Com - I', 'B.A. - III'],
        teacherName: user?.name || 'Teacher',
        teacherId: user?.uid,
        institution: user?.institution || 'BML Munjal University'
      };

      await TeacherActionsService.confirmDrill(drillData);
      setSuccessMessage('Drill confirmed successfully! Students will be notified.');
      setShowDrillForm(false);
      
      // Reset form
      setDrillFormData({
        date: '',
        time: '',
        venue: '',
        drillType: 'Fire Safety',
        description: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error confirming drill:', error);
      alert('Error confirming drill: ' + error.message);
    } finally {
      setIsConfirming(false);
    }
  };

  // Handle drill confirmation (legacy function for backward compatibility)
  const handleConfirmDrill = async () => {
    setShowDrillForm(true);
  };

  return (
    <div className="row g-3">
      <div className="col-12 col-xxl-8">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4 className="card-title d-flex align-items-center gap-2 mb-0"><i className="bi bi-person-video3 text-success"></i>Teacher Dashboard</h4>
              <div className="d-flex gap-2">
                <Link className="btn btn-outline-primary btn-sm" to="/learn" aria-label="Assign a learning module to classes"><i className="bi bi-journal-plus me-1"></i>Assign module</Link>
              </div>
            </div>
            <ul className="nav nav-pills small mb-3">
              <li className="nav-item"><button className={`nav-link ${activeTab==='overview'?'active':''}`} onClick={()=>setActiveTab('overview')}>Overview</button></li>
              <li className="nav-item"><button className={`nav-link ${activeTab==='assignments'?'active':''}`} onClick={()=>setActiveTab('assignments')}>Assignments</button></li>
              <li className="nav-item"><button className={`nav-link ${activeTab==='communication'?'active':''}`} onClick={()=>setActiveTab('communication')}>Send Announcement</button></li>
              <li className="nav-item"><button className={`nav-link ${activeTab==='analytics'?'active':''}`} onClick={()=>setActiveTab('analytics')}>Analytics</button></li>
            </ul>

            {/* Success Message */}
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
                <i className="bi bi-check-circle me-2"></i>
                {successMessage}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccessMessage('')}
                ></button>
              </div>
            )}

            {activeTab === 'overview' && (
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="fw-semibold mb-1">Recommended next module</div>
                  <div className="text-muted small mb-2">Flood preparedness • Estimated 25 min</div>
                  <button 
                    className="btn btn-primary btn-sm" 
                    type="button" 
                    onClick={handleAssignModule}
                    aria-label="Assign recommended module to selected classes"
                  >
                    <i className="bi bi-send me-1"></i>Assign to classes
                  </button>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="fw-semibold mb-3">Confirm Drill Slot</div>
                  
                  {!showDrillForm ? (
                    <div>
                      <div className="text-muted small mb-3">Schedule a new drill for your classes</div>
                      <button 
                        className="btn btn-success btn-sm" 
                        type="button" 
                        onClick={handleConfirmDrill}
                        aria-label="Open drill confirmation form"
                      >
                        <i className="bi bi-calendar-plus me-1"></i>Schedule Drill
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleDrillFormSubmit}>
                      <div className="row g-2 mb-3">
                        <div className="col-12">
                          <label className="form-label small fw-semibold">Drill Type</label>
                          <select 
                            name="drillType" 
                            value={drillFormData.drillType} 
                            onChange={handleDrillFormChange}
                            className="form-select form-select-sm"
                            required
                          >
                            <option value="Fire Safety">Fire Safety</option>
                            <option value="Earthquake">Earthquake</option>
                            <option value="Flood">Flood</option>
                            <option value="Cyclone">Cyclone</option>
                            <option value="Landslide">Landslide</option>
                          </select>
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-semibold">Date</label>
                          <input 
                            type="date" 
                            name="date" 
                            value={drillFormData.date} 
                            onChange={handleDrillFormChange}
                            className="form-control form-control-sm"
                            required
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-semibold">Time</label>
                          <input 
                            type="time" 
                            name="time" 
                            value={drillFormData.time} 
                            onChange={handleDrillFormChange}
                            className="form-control form-control-sm"
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label small fw-semibold">Venue</label>
                          <input 
                            type="text" 
                            name="venue" 
                            value={drillFormData.venue} 
                            onChange={handleDrillFormChange}
                            placeholder="e.g., Building A, Main Hall, Playground"
                            className="form-control form-control-sm"
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label small fw-semibold">Description (Optional)</label>
                          <textarea 
                            name="description" 
                            value={drillFormData.description} 
                            onChange={handleDrillFormChange}
                            placeholder="Brief description of the drill..."
                            className="form-control form-control-sm"
                            rows="2"
                          />
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          type="submit" 
                          className="btn btn-success btn-sm" 
                          disabled={isConfirming}
                        >
                          {isConfirming ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                              Confirming...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-calendar-check me-1"></i>Confirm Drill
                            </>
                          )}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary btn-sm" 
                          onClick={() => setShowDrillForm(false)}
                          disabled={isConfirming}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
            )}

            {activeTab === 'assignments' && (
              <div className="border rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="fw-semibold">Assignments</div>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={handleCreateAssignment}
                    aria-label="Create a new assignment"
                  >
                    <i className="bi bi-plus-lg me-1"></i>Create assignment
                  </button>
                </div>
                
                {loadingAssignments ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2">Loading assignments...</p>
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-clipboard-x fs-1"></i>
                    <p className="mt-2">No assignments created yet</p>
                    <button 
                      className="btn btn-outline-primary btn-sm" 
                      onClick={handleCreateAssignment}
                    >
                      Create your first assignment
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Class</th>
                          <th>Due Date</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.map((assignment) => (
                          <tr key={assignment._id}>
                            <td>
                              <div>
                                <div className="fw-medium">{assignment.title}</div>
                                {assignment.description && (
                                  <small className="text-muted">{assignment.description}</small>
                                )}
                              </div>
                            </td>
                            <td>{assignment.classId}</td>
                            <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge ${
                                assignment.status === 'open' 
                                  ? 'bg-warning-subtle text-warning border' 
                                  : assignment.status === 'completed'
                                  ? 'bg-success-subtle text-success border'
                                  : 'bg-secondary-subtle text-secondary border'
                              }`}>
                                {assignment.status}
                              </span>
                            </td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm">
                                <button 
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => handleUpdateAssignmentStatus(
                                    assignment._id, 
                                    assignment.status === 'open' ? 'completed' : 'open'
                                  )}
                                >
                                  {assignment.status === 'open' ? 'Mark Complete' : 'Reopen'}
                                </button>
                                <button className="btn btn-outline-primary btn-sm">
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}


            {activeTab === 'communication' && (
              <div className="border rounded-3 p-3">
                <TeacherDrillAnnouncement 
                  onSendDrillAnnouncement={handleSendDrillAnnouncement}
                />
              </div>
            )}


            {activeTab === 'analytics' && (
              <div className="row g-3">
                {analyticsData.loading ? (
                  <div className="col-12 text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2">Loading analytics data...</p>
                  </div>
                ) : (
                  <>
                    <div className="col-12 col-md-6">
                      <div className="border rounded-3 p-3 h-100">
                        <div className="fw-semibold mb-1">Module Completion</div>
                        <div className="text-muted small">
                          {analyticsData.platformStats ? 
                            `${analyticsData.platformStats.totalModulesCompleted} modules completed` : 
                            'No data available'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="border rounded-3 p-3 h-100">
                        <div className="fw-semibold mb-1">Drill Participation</div>
                        <div className="text-muted small">
                          {analyticsData.platformStats ? 
                            `${analyticsData.platformStats.totalDrillsCompleted} drills completed` : 
                            'No data available'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="border rounded-3 p-3 h-100">
                        <div className="fw-semibold mb-1">Total Students</div>
                        <div className="text-muted small">
                          {analyticsData.platformStats ? 
                            `${analyticsData.platformStats.totalStudents} active students` : 
                            'No data available'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="border rounded-3 p-3 h-100">
                        <div className="fw-semibold mb-1">Your Points</div>
                        <div className="text-muted small">
                          {analyticsData.userStats ? 
                            `${analyticsData.userStats.totalPoints} points earned` : 
                            'No data available'
                          }
                        </div>
                        {analyticsData.userStats && (
                          <div className="text-info small mt-1">
                            Preparedness: {analyticsData.userStats.preparednessScore}%
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-12 col-xxl-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center gap-2"><i className="bi bi-people text-primary"></i>Class Snapshot</h5>
            <div className="d-flex flex-column small gap-2">
              <div className="d-flex justify-content-between">
                <span>Total Students</span>
                <span className="fw-semibold">
                  {analyticsData.platformStats ? analyticsData.platformStats.totalStudents : '0'}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Modules Completed</span>
                <span className="fw-semibold">
                  {analyticsData.platformStats ? analyticsData.platformStats.totalModulesCompleted : '0'}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Drills Completed</span>
                <span className="fw-semibold">
                  {analyticsData.platformStats ? analyticsData.platformStats.totalDrillsCompleted : '0'}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Avg Preparedness</span>
                <span className="fw-semibold">
                  {analyticsData.platformStats ? `${analyticsData.platformStats.averagePreparedness}%` : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center gap-2"><i className="bi bi-clipboard-data text-warning"></i>Your Classes</h5>
            <div className="table-responsive">
              <table className="table align-middle small">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Avg Completion</th>
                    <th>Last Drill</th>
                    <th>Participation</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.name}>
                      <td className="fw-semibold">{c.name}</td>
                      <td>{c.completion}%</td>
                      <td>{c.lastDrill}</td>
                      <td>{c.participation}%</td>
                      <td className="text-end">
                        <button className="btn btn-outline-primary btn-sm me-2" aria-label={`Assign module to ${c.name}`}><i className="bi bi-journal-text me-1"></i>Assign module</button>
                        <button className="btn btn-outline-success btn-sm" aria-label={`Schedule drill for ${c.name}`}><i className="bi bi-flag me-1"></i>Schedule drill</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Module Assignment Form Modal */}
      {showModuleForm && (
        <ModuleAssignmentForm 
          onClose={() => setShowModuleForm(false)}
          onSuccess={handleModuleFormSuccess}
        />
      )}

      {/* Assignment Form Modal */}
      {showAssignmentForm && (
        <AssignmentForm 
          onClose={() => setShowAssignmentForm(false)}
          onAssignmentCreated={handleAssignmentCreated}
        />
      )}
    </div>
  );
}

export default Teacher;


