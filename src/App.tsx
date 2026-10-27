import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';

// Public Pages
import { HomePage } from './pages/HomePage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminSkills } from './pages/admin/AdminSkills';
import { AdminExperience } from './pages/admin/AdminExperience';
import { AdminEducation } from './pages/admin/AdminEducation';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminMedia } from './pages/admin/AdminMedia';

export function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio */}
            <Route path="/" element={<HomePage />} />

            {/* Admin Portal Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="education" element={<AdminEducation />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="media" element={<AdminMedia />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;
