import React, { useState } from 'react';
import { createPredefinedUsers } from '../utils/createPredefinedUsers';
import { fixAllPredefinedUsers } from '../utils/fixUserRole';

function SetupUsers() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateUsers = async () => {
    setLoading(true);
    setMessage('Creating predefined users...');
    
    try {
      await createPredefinedUsers();
      setMessage('✅ Predefined users created successfully!');
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFixRoles = async () => {
    setLoading(true);
    setMessage('Fixing user roles...');
    
    try {
      await fixAllPredefinedUsers();
      setMessage('✅ User roles fixed successfully! Please refresh the page and login again.');
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <i className="bi bi-people-fill text-primary me-2"></i>
                Setup Predefined Users
              </h3>
              
              <div className="alert alert-info">
                <h5>Predefined Accounts:</h5>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Teachers:</h6>
                    <ul className="list-unstyled">
                      <li>teacher1@d-prep.edu / teacher123</li>
                      <li>teacher2@d-prep.edu / teacher123</li>
                      <li>teacher3@d-prep.edu / teacher123</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Admin:</h6>
                    <ul className="list-unstyled">
                      <li>admin@d-prep.edu / admin123</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 flex-wrap">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleCreateUsers}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating Users...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Create Predefined Users
                    </>
                  )}
                </button>

                <button 
                  className="btn btn-warning btn-lg"
                  onClick={handleFixRoles}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Fixing Roles...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-tools me-2"></i>
                      Fix User Roles
                    </>
                  )}
                </button>
              </div>

              {message && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
                  {message}
                </div>
              )}

              <div className="mt-4">
                <h6>Instructions:</h6>
                <ol>
                  <li>Click "Create Predefined Users" button above</li>
                  <li>Wait for the creation to complete</li>
                  <li><strong>If roles are wrong:</strong> Click "Fix User Roles" button</li>
                  <li>Go to login page and use any of the predefined accounts</li>
                  <li>Teachers will see teacher dashboard, admin will see admin dashboard</li>
                </ol>
                <div className="alert alert-warning mt-3">
                  <strong>Note:</strong> If you see "Role: student" in the debug panel, click "Fix User Roles" to correct the roles in Firestore.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupUsers;
