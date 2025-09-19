import io from 'socket.io-client';

class RealtimeService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:5000');
      
      this.socket.on('connect', () => {
        console.log('✅ Connected to real-time server');
        this.isConnected = true;
      });
      
      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from real-time server');
        this.isConnected = false;
      });
    }
    return this.socket;
  }

  joinRole(role) {
    if (this.socket) {
      this.socket.emit('join-role', role);
    }
  }

  joinInstitution(institution) {
    if (this.socket) {
      this.socket.emit('join-institution', institution);
    }
  }

  onNewAlert(callback) {
    if (this.socket) {
      this.socket.on('newAlert', callback);
    }
  }

  onNewDrillAnnouncement(callback) {
    if (this.socket) {
      this.socket.on('newDrillAnnouncement', callback);
    }
  }

  onNewEmergencyAlert(callback) {
    if (this.socket) {
      this.socket.on('newEmergencyAlert', callback);
    }
  }

  onNewModuleAssignment(callback) {
    if (this.socket) {
      this.socket.on('moduleAssigned', callback);
    }
  }

  onNewDrillConfirmation(callback) {
    if (this.socket) {
      this.socket.on('drillConfirmed', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export default new RealtimeService();