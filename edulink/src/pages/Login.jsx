import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginWithEmail, getUserProfile } from '../firebaseRTDB'; // Using Realtime DB for consistency

const Login = () => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const { setUser } = useAuth();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Log in via Firebase Auth
      const cred = await loginWithEmail(email, password);
      const uid = cred.user.uid;

      // 2. Fetch the user's profile (Role, Name) from Realtime Database
      const profile = await getUserProfile(uid);

      if (profile) {
        // 3. Set full user context
        setUser({ uid, email, ...profile });
        nav('/');
      } else {
        // Handle case where user exists in Auth but not in Database (rare)
        setError("Profile not found. Contact administrator.");
        setUser({ uid, email }); // Fallback
      }

    } catch (err) {
      console.error(err);
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">EduLink</h1>
          <p className="text-slate-500 mt-2">School Monitoring System</p>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-gray-700">Sign In</h2>
        
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded border border-red-200">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <span className="text-blue-600">Contact School Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Login;