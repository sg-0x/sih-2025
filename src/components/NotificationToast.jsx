import React, { useState, useEffect } from 'react';
import RealtimeService from '../services/RealtimeService';

function NotificationToast() {
  const [notifications, setNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    // Connect to real-time service
    RealtimeService.connect();
    
    // Listen for new alerts
    RealtimeService.onNewAlert((alert) => {
      addNotification({
        id: Date.now(),
        type: 'alert',
        title: `Emergency Alert: ${alert.title}`,
        message: alert.description,
        severity: alert.severity,
        alertType: alert.alertType,
        region: alert.region,
        timestamp: new Date()
      });
    });

    // Listen for drill announcements
    RealtimeService.onNewDrillAnnouncement((announcement) => {
      addNotification({
        id: Date.now(),
        type: 'drill_announcement',
        title: `Drill Announcement: ${announcement.title}`,
        message: announcement.message,
        drillType: announcement.drillType,
        priority: announcement.priority,
        teacherName: announcement.teacherName,
        timestamp: new Date()
      });
    });

    // Listen for emergency alerts
    RealtimeService.onNewEmergencyAlert((alert) => {
      addNotification({
        id: Date.now(),
        type: 'emergency_alert',
        title: `Emergency Alert: ${alert.title}`,
        message: alert.message,
        severity: alert.severity,
        region: alert.region,
        timestamp: new Date()
      });
    });

    return () => {
      RealtimeService.disconnect();
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 10000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        new Notification('Notifications Enabled', {
          body: 'You will now receive real-time alerts and announcements.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const getNotificationIcon = (type, drillType) => {
    if (type === 'emergency_alert') return '��';
    if (type === 'drill_announcement') {
      const icons = {
        fire: '🔥',
        earthquake: '🌍',
        flood: '��',
        evacuation: '🚨'
      };
      return icons[drillType] || '📢';
    }
    return '��';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'success',
      normal: 'warning',
      high: 'danger'
    };
    return colors[priority] || 'warning';
  };

  if (notifications.length === 0) return null;

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`alert alert-${getPriorityColor(notification.priority || 'normal')} alert-dismissible fade show mb-2 shadow`}
          role="alert"
          style={{ minWidth: '300px', maxWidth: '400px' }}
        >
          <div className="d-flex align-items-start gap-2">
            <div className="flex-shrink-0">
              <span style={{ fontSize: '1.2rem' }}>
                {getNotificationIcon(notification.type, notification.drillType)}
              </span>
            </div>
            <div className="flex-grow-1">
              <h6 className="alert-heading mb-1">{notification.title}</h6>
              <p className="mb-1 small">{notification.message}</p>
              <small className="text-muted">
                {notification.teacherName && `From: ${notification.teacherName} • `}
                {notification.timestamp.toLocaleTimeString()}
              </small>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => removeNotification(notification.id)}
            ></button>
          </div>
        </div>
      ))}
      
      {/* Notification Permission Request */}
      {notificationPermission === 'default' && (
        <div className="alert alert-info alert-dismissible fade show mb-2 shadow" style={{ minWidth: '300px' }}>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-bell"></i>
            <div className="flex-grow-1">
              <h6 className="alert-heading mb-1">Enable Notifications</h6>
              <p className="mb-2 small">Get real-time alerts and announcements.</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={requestNotificationPermission}
              >
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationToast;