import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ProgressRing from '../components/ProgressRing';
import RealTimeCommunication from '../components/RealTimeCommunication';
import AlertCreationForm from '../components/AlertCreationForm';
import StatisticsService from '../services/StatisticsService';
import { useEffect, useState } from 'react';

// Generate completion data based on platform statistics
const generateCompletionData = (platformStats) => {
  const currentMonth = new Date().getMonth();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Get the last 6 months
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    last6Months.push(months[monthIndex]);
  }
  
  // Calculate completion percentages based on actual data
  const totalStudents = platformStats.totalStudents || 1;
  const totalModules = platformStats.totalModulesCompleted || 0;
  const totalDrills = platformStats.totalDrillsCompleted || 0;
  const avgPreparedness = platformStats.averagePreparedness || 0;
  
  // Generate realistic progression
  const baseCompletion = Math.min(Math.round((totalModules / totalStudents) * 100), 100);
  const baseDrillRate = Math.min(Math.round((totalDrills / totalStudents) * 100), 100);
  
  return last6Months.map((month, index) => {
    const progress = (index + 1) / 6; // 0.17, 0.33, 0.5, 0.67, 0.83, 1.0
    const completion = Math.min(Math.round(baseCompletion * progress), 100);
    return { month, completion };
  });
};

function Admin() {
  const [chartStyles, setChartStyles] = useState({ line: getComputedStyle(document.documentElement).getPropertyValue('--chart-line').trim() || '#0d6efd', grid: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || '#e9ecef' });
  const [platformStats, setPlatformStats] = useState({
    totalStudents: 0,
    totalModulesCompleted: 0,
    totalDrillsCompleted: 0,
    averagePreparedness: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const update = () => {
      const cs = getComputedStyle(document.documentElement);
      setChartStyles({ line: cs.getPropertyValue('--chart-line').trim(), grid: cs.getPropertyValue('--chart-grid').trim() });
    };
    window.addEventListener('themechange', update);
    return () => window.removeEventListener('themechange', update);
  }, []);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const platformData = await StatisticsService.getPlatformStatistics();
      setPlatformStats(platformData);
    } catch (error) {
      console.error('Failed to load platform statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Communication handlers
  const handleSendDrillAnnouncement = async (message) => {
    console.log('Sending drill announcement:', message);
    // TODO: Implement API call to send drill announcement
    // This will be connected to the backend real-time features
  };

  const handleSendEmergencyAlert = async (message) => {
    console.log('Sending emergency alert:', message);
    // TODO: Implement API call to send emergency alert
    // This will be connected to the backend real-time features
  };

  const handleSaveAlert = async (alertData) => {
    console.log('Saving alert:', alertData);
    // TODO: Implement API call to save alert
    // This will be connected to the backend real-time features
    
    // Simulate real-time alert notification
    const event = new CustomEvent('emergencyAlert', {
      detail: {
        type: 'emergency_alert',
        title: alertData.title,
        message: alertData.description,
        severity: alertData.severity,
        alertType: alertData.alertType,
        region: alertData.region,
        createdAt: alertData.createdAt
      }
    });
    
    window.dispatchEvent(event);
  };

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="alert alert-info d-flex align-items-center gap-2 py-2" role="status" aria-live="polite">
          <i className="bi bi-info-circle" aria-hidden="true"></i>
          <div className="small">Institute dashboard: track preparedness, drills, modules, and compliance. Configure alerts for your region.</div>
        </div>
      </div>
      <div className="col-12 col-xl-8">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h4 className="card-title d-flex align-items-center gap-2"><i className="bi bi-graph-up text-success"></i>Preparedness Completion Over Time</h4>
            <div style={{ height: 300 }}>
              {loading ? (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="text-muted mt-2">Loading chart data...</div>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateCompletionData(platformStats)}>
                    <Line type="monotone" dataKey="completion" stroke={chartStyles.line || '#0d6efd'} strokeWidth={3} />
                    <CartesianGrid stroke={chartStyles.grid || '#e9ecef'} strokeDasharray="5 5" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v) => `${v}%`} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h4 className="card-title d-flex align-items-center gap-2"><i className="bi bi-speedometer2 text-primary"></i>Snapshot</h4>
            <div className="d-flex justify-content-around py-2">
              {loading ? (
                <>
                  <div className="text-center">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="small text-muted mt-2">Loading...</div>
                  </div>
                  <div className="text-center">
                    <div className="spinner-border spinner-border-sm text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="small text-muted mt-2">Loading...</div>
                  </div>
                  <div className="text-center">
                    <div className="spinner-border spinner-border-sm text-warning" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="small text-muted mt-2">Loading...</div>
                  </div>
                </>
              ) : (
                <>
                  <ProgressRing value={platformStats.averagePreparedness || 0} label="Preparedness" color="#0d6efd" />
                  <ProgressRing 
                    value={platformStats.totalStudents > 0 ? Math.min(Math.round((platformStats.totalModulesCompleted / platformStats.totalStudents) * 100), 100) : 0} 
                    label="Module Avg" 
                    color="#198754" 
                  />
                  <ProgressRing 
                    value={platformStats.totalStudents > 0 ? Math.min(Math.round((platformStats.totalDrillsCompleted / platformStats.totalStudents) * 100), 100) : 0} 
                    label="Drill Rate" 
                    color="#ffc107" 
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <AlertCreationForm 
          onSaveAlert={handleSaveAlert}
          onCancel={() => console.log('Alert creation cancelled')}
        />
      </div>
      <div className="col-12">
        <RealTimeCommunication 
          userRole="admin"
          onSendDrillAnnouncement={handleSendDrillAnnouncement}
          onSendEmergencyAlert={handleSendEmergencyAlert}
        />
      </div>
    </div>
  );
}

export default Admin;


