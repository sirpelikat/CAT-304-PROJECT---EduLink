import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginWithEmail, registerWithEmail } from '../firebase'; // adjust path as needed

const Login = () => {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('parent');

  const nav = useNavigate();
  const { setUser } = useAuth();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'register') {
        const profile = { role };
        const cred = await registerWithEmail(email, password, profile);
        setUser({ uid: cred.user.uid, email, ...profile });
      } else {
        const cred = await loginWithEmail(email, password);
        setUser({ uid: cred.user.uid, email });
      }
      nav('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">
        {mode === 'login' ? 'Sign In' : 'Register'}
      </h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === 'register' && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button className="flex-1 bg-sky-600 text-white py-2 rounded">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="px-3 py-2 border rounded"
          >
            {mode === 'login' ? 'Register' : 'Back to login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;