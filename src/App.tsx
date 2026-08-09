import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '@pages/Login';
import SignUp from '@pages/SignUp';
import Dashboard from '@pages/Dashboard';
import Feed from '@pages/Feed';
import Profile from '@pages/Profile';
import UserProfile from '@pages/UserProfile';
import Notifications from '@pages/Notifications';
import Bookmarks from '@pages/Bookmarks';
import Terms from '@pages/Terms';
import Privacy from '@pages/Privacy';
import Cookies from '@pages/Cookies';

import { AuthProvider } from '@context/AuthContext';
import AppShell from '@components/layout/AppShell';
import ProtectedRoute from '@routes/ProtectedRoute';
import PublicRoute from '@routes/PublicRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* PUBLIC ROUTES — redirect to /app/dashboard if already logged in */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          {/* LEGAL PAGES — public, no auth required */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* PROTECTED APP AREA — redirect to / if not logged in */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="feed" element={<Feed />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="u/:username" element={<UserProfile />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="bookmarks" element={<Bookmarks />} />
                  </Routes>
                </AppShell>
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
