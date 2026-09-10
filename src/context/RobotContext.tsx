import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RobotStatus } from '../types';
import * as api from '../services/api';
import { subscribeToPotholeUpdates } from '../services/eventBus';

interface RobotContextType {
  robotStatus: RobotStatus | null;
  autoPatrol: boolean;
  patrolInterval: number; // in seconds
  setAutoPatrol: (enabled: boolean) => void;
  setPatrolInterval: (seconds: number) => void;
  updateTelemetry: (updates: Partial<RobotStatus>) => Promise<void>;
  refreshRobot: () => Promise<void>;
}

const RobotContext = createContext<RobotContextType | undefined>(undefined);

export const RobotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [robotStatus, setRobotStatus] = useState<RobotStatus | null>(null);
  const [autoPatrol, setAutoPatrol] = useState<boolean>(false);
  const [patrolInterval, setPatrolInterval] = useState<number>(12);

  const loadRobot = useCallback(async () => {
    try {
      const data = await api.getRobotStatus();
      setRobotStatus(data);
    } catch (err) {
      console.error('Error fetching robot status:', err);
    }
  }, []);

  useEffect(() => {
    loadRobot();

    const unsubscribe = subscribeToPotholeUpdates(event => {
      if (event.type === 'ROBOT_STATUS_CHANGED' || event.type === 'DEMO_RESET') {
        loadRobot();
      }
    });

    return () => unsubscribe();
  }, [loadRobot]);

  // Automated Patrol Loop
  useEffect(() => {
    if (!autoPatrol) return;

    const intervalId = setInterval(async () => {
      try {
        await api.simulateRobotDetection();
      } catch (err) {
        console.error('Auto patrol simulation error:', err);
      }
    }, patrolInterval * 1000);

    return () => clearInterval(intervalId);
  }, [autoPatrol, patrolInterval]);

  const updateTelemetry = async (updates: Partial<RobotStatus>) => {
    const fresh = await api.updateRobotStatus(updates);
    setRobotStatus(fresh);
  };

  return (
    <RobotContext.Provider
      value={{
        robotStatus,
        autoPatrol,
        patrolInterval,
        setAutoPatrol,
        setPatrolInterval,
        updateTelemetry,
        refreshRobot: loadRobot
      }}
    >
      {children}
    </RobotContext.Provider>
  );
};

export const useRobot = () => {
  const context = useContext(RobotContext);
  if (!context) {
    throw new Error('useRobot must be used within a RobotProvider');
  }
  return context;
};
