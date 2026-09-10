import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Pothole, PotholeStatus, SeverityLevel } from '../types';
import * as api from '../services/api';
import { subscribeToPotholeUpdates } from '../services/eventBus';

interface PotholeContextType {
  potholes: Pothole[];
  loading: boolean;
  selectedPothole: Pothole | null;
  setSelectedPothole: (p: Pothole | null) => void;
  // Stats
  stats: {
    total: number;
    critical: number;
    pending: number;
    inProgress: number;
    repaired: number;
  };
  // Actions
  refreshPotholes: () => Promise<void>;
  registerPothole: (data: Partial<Pothole>) => Promise<Pothole>;
  updateRepair: (id: string, newStatus: PotholeStatus, note?: string, engineer?: string, repairImage?: string) => Promise<Pothole>;
  simulateDetection: (severity?: SeverityLevel) => Promise<Pothole>;
  simulateCriticalEmergency: () => Promise<Pothole>;
  resetAllData: () => void;
}

const PotholeContext = createContext<PotholeContextType | undefined>(undefined);

export const PotholeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPothole, setSelectedPothole] = useState<Pothole | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data = await api.getPotholes();
      setPotholes(data);
    } catch (err) {
      console.error('Error fetching potholes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Subscribe to live simulated updates
    const unsubscribe = subscribeToPotholeUpdates(event => {
      if (
        event.type === 'NEW_POTHOLE' ||
        event.type === 'POTHOLE_UPDATED' ||
        event.type === 'POTHOLE_REPAIRED' ||
        event.type === 'DEMO_RESET'
      ) {
        loadData();
      }
    });

    return () => unsubscribe();
  }, [loadData]);

  // Keep selectedPothole synchronized with list updates
  useEffect(() => {
    if (selectedPothole) {
      const fresh = potholes.find(p => p.id === selectedPothole.id);
      if (fresh) {
        setSelectedPothole(fresh);
      }
    }
  }, [potholes]);

  const stats = useMemo(() => {
    const total = potholes.length;
    const critical = potholes.filter(p => p.priority === 'CRITICAL' && p.status !== 'REPAIRED').length;
    const pending = potholes.filter(p => p.status === 'PENDING' || p.status === 'INSPECTION' || p.status === 'ASSIGNED').length;
    const inProgress = potholes.filter(p => p.status === 'REPAIR IN PROGRESS').length;
    const repaired = potholes.filter(p => p.status === 'REPAIRED').length;

    return { total, critical, pending, inProgress, repaired };
  }, [potholes]);

  const registerPothole = async (data: Partial<Pothole>): Promise<Pothole> => {
    const created = await api.createPothole(data);
    await loadData();
    return created;
  };

  const updateRepair = async (
    id: string,
    newStatus: PotholeStatus,
    note?: string,
    engineer?: string,
    repairImage?: string
  ) => {
    const updated = await api.updateRepairStatus(id, newStatus, note, engineer, repairImage);
    await loadData();
    return updated;
  };

  const simulateDetection = async (severity?: SeverityLevel) => {
    const created = await api.simulateRobotDetection(severity);
    await loadData();
    return created;
  };

  const simulateCriticalEmergency = async () => {
    const created = await api.simulateRobotDetection('SEVERE');
    await loadData();
    return created;
  };

  const resetAllData = () => {
    api.resetDemoData();
    loadData();
    setSelectedPothole(null);
  };

  return (
    <PotholeContext.Provider
      value={{
        potholes,
        loading,
        selectedPothole,
        setSelectedPothole,
        stats,
        refreshPotholes: loadData,
        registerPothole,
        updateRepair,
        simulateDetection,
        simulateCriticalEmergency,
        resetAllData
      }}
    >
      {children}
    </PotholeContext.Provider>
  );
};

export const usePotholes = () => {
  const context = useContext(PotholeContext);
  if (!context) {
    throw new Error('usePotholes must be used within a PotholeProvider');
  }
  return context;
};
