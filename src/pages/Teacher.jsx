import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TeacherDrillAnnouncement from '../components/TeacherDrillAnnouncement';
import DrillAnnouncementService from '../services/DrillAnnouncementService';
import TeacherActionsService from '../services/TeacherActionsService';
import ModuleAssignmentForm from '../components/ModuleAssignmentForm';
import { getCurrentUser } from '../services/AuthService';

function Teacher() {
  const [activeTab, setActiveTab] = useState('overview'); // overview | assignments | drills | analytics
  const [isAssigning, setIsAssigning] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showModuleForm, setShowModuleForm] = useState(false);
  
  const classes = [
    { name: 'B.Sc CS - II', completion: 72, lastDrill: 'Fire Evacuation', participation: 84 },
    { name: 'B.Com - I', completion: 58, lastDrill: 'Earthquake Drop-Cover-Hold', participation: 76 },
    { name: 'B.A. - III', completion: 64, lastDrill: 'Flood Safety Briefing', participation: 69 }
  ];

  const user = getCurrentUser();

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

  // Handle drill confirmation
  const handleConfirmDrill = async () => {
    setIsConfirming(true);
    setSuccessMessage('');
    
    try {
      const drillData = {
        title: 'Fire Safety Drill - Building A',
        description: 'Emergency fire evacuation drill for all students and staff.',
        scheduledDate: '2024-09-27', // Friday
        scheduledTime: '10:30',
        location: 'Building A',
        drillType: 'Fire Safety',
        targetClasses: ['B.Sc CS - II', 'B.Com - I', 'B.A. - III'],
        teacherName: user?.name || 'Teacher',
        teacherId: user?.uid,
        institution: user?.institution || 'BML Munjal University'
      };

      await TeacherActionsService.confirmDrill(drillData);
      setSuccessMessage('Drill confirmed successfully! Students will be notified.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error confirming drill:', error);
      alert('Error confirming drill: ' + error.message);
    } finally {
      setIsConfirming(false);
    }
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
                <Link className="btn btn-outline-success btn-sm" to="/drills" aria-label="Schedule a safety drill"><i className="bi bi-flag me-1"></i>Schedule drill</Link>
              </div>
            </div>
            <ul className="nav nav-pills small mb-3">
              <li className="nav-item"><button className={`nav-link ${activeTab==='overview'?'active':''}`} onClick={()=>setActiveTab('overview')}>Overview</button></li>
              <li className="nav-item"><button className={`nav-link ${activeTab==='assignments'?'active':''}`} onClick={()=>setActiveTab('assignments')}>Assignments</button></li>
              <li className="nav-item"><button className={`nav-link ${activeTab==='drills'?'active':''}`} onClick={()=>setActiveTab('drills')}>Drills</button></li>
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
                  <div className="fw-semibold mb-1">Upcoming drill slot</div>
                  <div className="text-muted small mb-2">Friday • 10:30 AM • Building A</div>
                  <button 
                    className="btn btn-success btn-sm" 
                    type="button" 
                    onClick={handleConfirmDrill}
                    disabled={isConfirming}
                    aria-label="Confirm scheduled drill slot"
                  >
                    {isConfirming ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                        Confirming...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calendar-check me-1"></i>Confirm drill
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            )}

            {activeTab === 'assignments' && (
              <div className="border rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-semibold">Assignments</div>
                  <button className="btn btn-primary btn-sm" aria-label="Create a new assignment"><i className="bi bi-plus-lg me-1"></i>Create assignment</button>
                </div>
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead><tr><th>Module</th><th>Class</th><th>Due date</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
                    <tbody>
                      <tr><td>Earthquake Safety</td><td>B.Sc CS - II</td><td>Sep 25</td><td><span className="badge bg-warning-subtle text-warning border">Open</span></td><td className="text-end"><button className="btn btn-outline-secondary btn-sm">Manage</button></td></tr>
                      <tr><td>Fire Safety</td><td>B.Com - I</td><td>Sep 20</td><td><span className="badge bg-success-subtle text-success border">Completed</span></td><td className="text-end"><button className="btn btn-outline-secondary btn-sm">Review</button></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'drills' && (
              <div className="border rounded-3 p-3">
                <div className="fw-semibold mb-2">Drill Scheduler</div>
                <div className="row g-2">
                  <div className="col-12 col-md-4"><label className="form-label small">Type</label><select className="form-select form-select-sm"><option>Fire</option><option>Earthquake</option><option>Flood</option></select></div>
                  <div className="col-12 col-md-4"><label className="form-label small">Date</label><input type="date" className="form-control form-control-sm" /></div>
                  <div className="col-12 col-md-4"><label className="form-label small">Class</label><select className="form-select form-select-sm"><option>B.Sc CS - II</option><option>B.Com - I</option><option>B.A. - III</option></select></div>
                </div>
                <button className="btn btn-success btn-sm mt-2"><i className="bi bi-flag me-1"></i>Schedule Drill</button>
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
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-3 h-100">
                    <div className="fw-semibold mb-1">Module Completion</div>
                    <div className="text-muted small">Last 30 days • trend improving</div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-3 h-100">
                    <div className="fw-semibold mb-1">Drill Participation</div>
                    <div className="text-muted small">Avg 78% • target 85%</div>
                  </div>
                </div>
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
              <div className="d-flex justify-content-between"><span>Avg completion</span><span className="fw-semibold">64%</span></div>
              <div className="d-flex justify-content-between"><span>Last drill participation</span><span className="fw-semibold">78%</span></div>
              <div className="d-flex justify-content-between"><span>At-risk students</span><span className="fw-semibold text-danger">5</span></div>
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
    </div>
  );
}

export default Teacher;


