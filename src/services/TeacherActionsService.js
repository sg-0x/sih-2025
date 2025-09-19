// Service for handling teacher actions that affect students
class TeacherActionsService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('Teacher Actions API Error:', error);
      throw error;
    }
  }

  // Assign module to classes
  async assignModule(moduleData) {
    try {
      const response = await this.request('/teacher-actions/assign-module', {
        method: 'POST',
        body: JSON.stringify(moduleData)
      });

      // Simulate real-time notification
      this.simulateModuleAssignment(moduleData);

      return response;
    } catch (error) {
      throw new Error('Failed to assign module: ' + error.message);
    }
  }

  // Confirm drill slot
  async confirmDrill(drillData) {
    try {
      const response = await this.request('/teacher-actions/confirm-drill', {
        method: 'POST',
        body: JSON.stringify(drillData)
      });

      // Simulate real-time notification
      this.simulateDrillConfirmation(drillData);

      return response;
    } catch (error) {
      throw new Error('Failed to confirm drill: ' + error.message);
    }
  }

  // Get assigned modules for students
  async getAssignedModules() {
    try {
      const response = await this.request('/teacher-actions/assigned-modules');
      return response.data.modules;
    } catch (error) {
      throw new Error('Failed to fetch assigned modules: ' + error.message);
    }
  }

  // Get confirmed drills for students
  async getConfirmedDrills() {
    try {
      const response = await this.request('/teacher-actions/confirmed-drills');
      return response.data.drills;
    } catch (error) {
      throw new Error('Failed to fetch confirmed drills: ' + error.message);
    }
  }

  // Simulate real-time module assignment notification
  simulateModuleAssignment(moduleData) {
    const event = new CustomEvent('moduleAssigned', {
      detail: {
        type: 'module_assignment',
        title: moduleData.title,
        description: moduleData.description,
        dueDate: moduleData.dueDate,
        estimatedTime: moduleData.estimatedTime,
        targetClasses: moduleData.targetClasses,
        teacherName: moduleData.teacherName,
        assignedAt: new Date().toISOString()
      }
    });
    
    window.dispatchEvent(event);
    
    // Also show browser notification if permission is granted
    if (Notification.permission === 'granted') {
      new Notification(`New Module Assigned: ${moduleData.title}`, {
        body: `Due: ${moduleData.dueDate} • Estimated time: ${moduleData.estimatedTime}`,
        icon: '/favicon.ico',
        tag: 'module-assignment'
      });
    }
  }

  // Simulate real-time drill confirmation notification
  simulateDrillConfirmation(drillData) {
    const event = new CustomEvent('drillConfirmed', {
      detail: {
        type: 'drill_confirmation',
        title: drillData.title,
        description: drillData.description,
        scheduledDate: drillData.scheduledDate,
        scheduledTime: drillData.scheduledTime,
        location: drillData.location,
        drillType: drillData.drillType,
        targetClasses: drillData.targetClasses,
        teacherName: drillData.teacherName,
        confirmedAt: new Date().toISOString()
      }
    });
    
    window.dispatchEvent(event);
    
    // Also show browser notification if permission is granted
    if (Notification.permission === 'granted') {
      new Notification(`Drill Confirmed: ${drillData.title}`, {
        body: `Date: ${drillData.scheduledDate} at ${drillData.scheduledTime} • Location: ${drillData.location}`,
        icon: '/favicon.ico',
        tag: 'drill-confirmation'
      });
    }
  }
}

export default new TeacherActionsService();
