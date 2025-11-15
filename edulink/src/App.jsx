import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { logout } from './firebase.js';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import Announcements from './pages/Announcements.jsx';
import Wellbeing from './pages/Wellbeing.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-xl">
            EduLink
          </Link>
          <nav className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/" className="text-sm">
                  Dashboard
                </Link>
                <Link to="/reports" className="text-sm">
                  Reports
                </Link>
                <Link to="/announcements" className="text-sm">
                  Announcements
                </Link>
                <Link to="/wellbeing" className="text-sm">
                  Well‑being
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/wellbeing" element={<Wellbeing />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}
