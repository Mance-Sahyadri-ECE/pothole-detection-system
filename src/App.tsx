import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PotholeProvider, usePotholes } from './context/PotholeContext';
import { NotificationProvider } from './context/NotificationContext';
import { RobotProvider } from './context/RobotContext';

import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DemoControlBar } from './components/common/DemoControlBar';
import { ToastContainer } from './components/common/ToastContainer';
import { PotholeDetailsModal } from './components/potholes/PotholeDetailsModal';

// Public Portal Pages
import { PublicHomePage } from './pages/PublicHomePage';
import { PublicMapPage } from './pages/PublicMapPage';
import { PublicReportPage } from './pages/PublicReportPage';
import { PublicAboutPage } from './pages/PublicAboutPage';
import { PublicStatusPage } from './pages/PublicStatusPage';
import { LoginPage } from './pages/LoginPage';

// Government Portal Pages
import { DashboardPage } from './pages/DashboardPage';
import { RobotMonitoringPage } from './pages/RobotMonitoringPage';
import { AiDetectionPage } from './pages/AiDetectionPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ComplaintBoxPage } from './pages/ComplaintBoxPage';
import { RepairManagementPage } from './pages/RepairManagementPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { selectedPothole, setSelectedPothole } = usePotholes();

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-900 font-sans">
      {/* Header */}
      <Header
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-56 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto pb-20">
          {children}
        </main>
      </div>

      {/* Global Modals, Toast Alerts, and Technical Simulation Footer */}
      <PotholeDetailsModal
        pothole={selectedPothole}
        onClose={() => setSelectedPothole(null)}
      />
      <ToastContainer />
      <DemoControlBar />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PotholeProvider>
          <NotificationProvider>
            <RobotProvider>
              <AppLayout>
                <Routes>
                  {/* Public Portal Routes */}
                  <Route path="/" element={<PublicHomePage />} />
                  <Route path="/map" element={<PublicMapPage />} />
                  <Route path="/report" element={<PublicReportPage />} />
                  <Route path="/about" element={<PublicAboutPage />} />
                  <Route path="/status" element={<PublicStatusPage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Government Portal Routes */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/government/dashboard" element={<DashboardPage />} />
                  <Route path="/government/map" element={<PublicMapPage />} />
                  <Route path="/robot" element={<RobotMonitoringPage />} />
                  <Route path="/ai-detect" element={<AiDetectionPage />} />
                  <Route path="/ai-detection" element={<AiDetectionPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/complaints" element={<ComplaintBoxPage />} />
                  <Route path="/government/complaints" element={<ComplaintBoxPage />} />
                  <Route path="/repairs" element={<RepairManagementPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </RobotProvider>
          </NotificationProvider>
        </PotholeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
