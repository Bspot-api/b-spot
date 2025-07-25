import { ProtectedRoute } from '@/components/auth/protected-route';
import { AuthProvider } from '@/contexts/auth-context';
import { Dashboard } from '@/pages/dashboard';
import { HelloWorldPage } from '@/pages/hello-world';
import { LoginPage } from '@/pages/login';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HelloWorldPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
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
