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

import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Portal Pages
import { PublicHomePage } from './pages/PublicHomePage';
import { PublicMapPage } from './pages/PublicMapPage';
import { PublicReportPage } from './pages/PublicReportPage';
import { PublicAboutPage } from './pages/PublicAboutPage';
import { PublicStatusPage } from './pages/PublicStatusPage';
import { PublicTransparencyPage } from './pages/PublicTransparencyPage';
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
import { EngineerPortalPage } from './pages/EngineerPortalPage';

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
                  <Route path="/public-status" element={<PublicTransparencyPage />} />
                  <Route path="/about" element={<PublicAboutPage />} />
                  <Route path="/status" element={<PublicStatusPage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Government Portal Routes (Protected) */}
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/government/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/government/map" element={<ProtectedRoute><PublicMapPage /></ProtectedRoute>} />
                  <Route path="/robot" element={<ProtectedRoute><RobotMonitoringPage /></ProtectedRoute>} />
                  <Route path="/ai-detect" element={<ProtectedRoute><AiDetectionPage /></ProtectedRoute>} />
                  <Route path="/ai-detection" element={<ProtectedRoute><AiDetectionPage /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                  <Route path="/complaints" element={<ProtectedRoute><ComplaintBoxPage /></ProtectedRoute>} />
                  <Route path="/government/complaints" element={<ProtectedRoute><ComplaintBoxPage /></ProtectedRoute>} />
                  <Route path="/repairs" element={<ProtectedRoute><RepairManagementPage /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                  <Route path="/engineer-portal" element={<ProtectedRoute><EngineerPortalPage /></ProtectedRoute>} />

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
