import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GovernmentNotification } from '../types';
import * as api from '../services/api';
import { subscribeToPotholeUpdates } from '../services/eventBus';

export interface ToastItem {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'SUCCESS' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  potholeId?: string;
}

interface NotificationContextType {
  notifications: GovernmentNotification[];
  unreadCount: number;
  toasts: ToastItem[];
  markAsViewed: (id: string) => Promise<void>;
  markAllAsViewed: () => Promise<void>;
  updateNotification: (id: string, updates: Partial<GovernmentNotification>) => Promise<void>;
  addToast: (toast: Omit<ToastItem, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<GovernmentNotification[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  const addToast = useCallback((toast: Omit<ToastItem, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = {
      ...toast,
      id,
      timestamp: new Date().toISOString()
    };
    setToasts(prev => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    loadNotifications();

    const unsubscribe = subscribeToPotholeUpdates(event => {
      if (event.type === 'GOVERNMENT_NOTIFICATION') {
        const notif = event.payload as GovernmentNotification;
        loadNotifications();

        // Trigger toast
        addToast({
          type: notif.priority === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
          title: notif.title,
          message: `${notif.location} • Priority: ${notif.priority}`,
          potholeId: notif.potholeId
        });
      } else if (event.type === 'POTHOLE_REPAIRED') {
        loadNotifications();
        addToast({
          type: 'SUCCESS',
          title: 'POTHOLE REPAIRED & CERTIFIED',
          message: `${event.payload.id} at ${event.payload.location} marked as resolved.`,
          potholeId: event.payload.id
        });
      } else if (event.type === 'DEMO_RESET') {
        loadNotifications();
      }
    });

    return () => unsubscribe();
  }, [loadNotifications, addToast]);

  const unreadCount = notifications.filter(n => !n.viewed).length;

  const markAsViewed = async (id: string) => {
    await api.updateNotificationStatus(id, { viewed: true });
    await loadNotifications();
  };

  const markAllAsViewed = async () => {
    for (const notif of notifications.filter(n => !n.viewed)) {
      await api.updateNotificationStatus(notif.id, { viewed: true });
    }
    await loadNotifications();
  };

  const updateNotification = async (id: string, updates: Partial<GovernmentNotification>) => {
    await api.updateNotificationStatus(id, updates);
    await loadNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        markAsViewed,
        markAllAsViewed,
        updateNotification,
        addToast,
        removeToast,
        refreshNotifications: loadNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
