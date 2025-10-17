import { ProtectedRoute } from '@/components/auth/protected-route';
import { FaviconManager } from '@/components/ui/favicon-manager';
import { AuthProvider } from '@/contexts/auth-context';
import { AboutPage } from '@/features/about/pages/about-page';
import { AccountPage } from '@/features/auth/pages/account-page';
import { LoginPage } from '@/features/auth/pages/login-page';
import { CompanyPage } from '@/features/company/pages/company-page';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { HomePage } from '@/features/home/pages/home-page';
import { PersonalityPage } from '@/features/personality/pages/personality-page';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <FaviconManager />
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/companies/:id" element={<CompanyPage />} />
            <Route path="/personalities/:id" element={<PersonalityPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
