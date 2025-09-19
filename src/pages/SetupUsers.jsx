import React, { useState } from 'react';
import { createPredefinedUsers } from '../utils/createPredefinedUsers';

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
                  <li>Go to login page and use any of the predefined accounts</li>
                  <li>Teachers will see teacher dashboard, admin will see admin dashboard</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupUsers;
