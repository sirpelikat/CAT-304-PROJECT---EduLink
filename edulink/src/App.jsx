import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { logout } from './firebaseRTDB.js';

// Page Imports
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import Announcements from './pages/Announcements.jsx';
import Wellbeing from './pages/Wellbeing.jsx';
import Admin from './pages/Admin.jsx';
import Profile from './pages/Profile.jsx';

// --- 1. INTERNAL WELCOME COMPONENT (No separate file needed) ---
function Welcome() {
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight">
          Welcome to <span className="text-blue-600">EduLink</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Connecting Teachers, Parents, and Students for a smarter, more supportive educational journey.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          {user ? (
            <Link 
              to="/dashboard" 
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1"
            >
              Sign In to Portal
            </Link>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
        <FeatureCard 
          icon="📈" 
          title="Academic Insights" 
          desc="Track grades and attendance in real-time to stay on top of student progress."
        />
        <FeatureCard 
          icon="📢" 
          title="Smart Announcements" 
          desc="Never miss an update with targeted notifications for your specific classes."
        />
        <FeatureCard 
          icon="🛡️" 
          title="Well-being First" 
          desc="Proactive monitoring to ensure every student gets the emotional support they need."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition duration-300 text-left">
      <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center text-3xl mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

// --- 2. MAIN APP COMPONENT ---
export default function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-2xl text-blue-600 tracking-tight flex items-center gap-2">
            <img src="./src/assets/edulink_logo.png" alt="EduLink Logo" className="h-8 w-8 object-contain" />
            EduLink
          </Link>
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">Dashboard</Link>
                <Link to="/reports" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">Reports</Link>
                <Link to="/announcements" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">Announcements</Link>
                <Link to="/wellbeing" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">Well-being</Link>
                
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-bold text-purple-600 hover:text-purple-800 transition">Admin</Link>
                )}

                <div className="h-5 w-px bg-slate-200"></div>

                <Link to="/profile" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
                  Profile
                </Link>

                <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-700 transition">
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">Sign in</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Welcome />} />       {/* Uses internal component */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/wellbeing" element={<Wellbeing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}