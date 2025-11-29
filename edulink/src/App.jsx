import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { logout } from './firebase.js';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import Announcements from './pages/Announcements.jsx';
import Wellbeing from './pages/Wellbeing.jsx';
import Admin from './pages/Admin.jsx';

/* ---------------- PROTECTED ROUTES ---------------- */

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ user, children }) {
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

/* ---------------- 404 PAGE ---------------- */

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
      <p className="text-xl mb-4">Page not found</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back to Dashboard
      </Link>
    </div>
  );
}

/* ---------------- APP COMPONENT ---------------- */

export default function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-2xl text-blue-600">
            EduLink
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/" className="text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/reports" className="text-sm font-medium">
                  Reports
                </Link>
                <Link to="/announcements" className="text-sm font-medium">
                  Announcements
                </Link>
                <Link to="/wellbeing" className="text-sm font-medium">
                  Well‑being
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium text-red-600 hover:text-red-800">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute user={user}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute user={user}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wellbeing"
            element={
              <ProtectedRoute user={user}>
                <Wellbeing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute user={user}>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
