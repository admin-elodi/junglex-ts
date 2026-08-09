import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '@pages/Login';
import SignUp from '@/pages/SignUp';
import Dashboard from '@pages/Dashboard';

import { AuthProvider } from '@context/AuthContext';
import AppShell from '@components/layout/AppShell';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* PROTECTED APP AREA */}
          <Route
            path="/app/*"
            element={
              <AppShell>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                </Routes>
              </AppShell>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;