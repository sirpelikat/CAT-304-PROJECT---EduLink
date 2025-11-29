import React, { useState, useEffect } from 'react';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue, remove, set } from 'firebase/database';
import { firebaseConfig } from '../firebaseConfig'; 

// Initialize main DB connection
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [generatedCreds, setGeneratedCreds] = useState(null); // To store and show the new password
  
  // Form State (Removed password field)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'parent' });

  // 1. Fetch Users
  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.entries(data).map(([uid, info]) => ({ uid, ...info }));
        setUsers(userList);
      } else {
        setUsers([]);
      }
    });
    return () => unsub();
  }, []);

  // Helper: Generate Random Password
  function generatePassword(length = 8) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  // 2. Add Single User with Random Password
  async function handleAddUser(e) {
    e.preventDefault();
    setLoading(true);
    setStatus('Creating user...');
    setGeneratedCreds(null); // Clear previous results

    // Generate a random password
    const randomPassword = generatePassword(10);

    // Use secondary app to prevent Admin logout
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);

    try {
      // Create in Firebase Auth
      const cred = await createUserWithEmailAndPassword(secondaryAuth, newUser.email, randomPassword);
      
      // Save Profile in Realtime DB
      await set(ref(db, `users/${cred.user.uid}`), {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date().toISOString()
      });

      await signOut(secondaryAuth);
      
      // Show the credentials to the Admin
      setGeneratedCreds({ email: newUser.email, password: randomPassword });
      setStatus(`Success: User ${newUser.name} created.`);
      
      // Reset form
      setNewUser({ name: '', email: '', role: 'parent' }); 
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      await deleteApp(secondaryApp);
      setLoading(false);
    }
  }

  // 3. Delete User Profile
  async function handleDeleteUser(uid) {
    if(!window.confirm("Are you sure? This removes their profile data.")) return;
    try {
      await remove(ref(db, `users/${uid}`));
      setStatus('User profile removed.');
    } catch (err) {
      setStatus(`Error removing user: ${err.message}`);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Admin Management</h1>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* CREATE USER FORM */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Add New User</h2>
          <form onSubmit={handleAddUser} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input 
                type="text" 
                required 
                className="w-full border p-2 rounded"
                value={newUser.name}
                onChange={e => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input 
                type="email" 
                required 
                className="w-full border p-2 rounded"
                value={newUser.email}
                onChange={e => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            {/* Password input removed */}

            <div>
              <label className="block text-sm font-medium">Role</label>
              <select 
                className="w-full border p-2 rounded"
                value={newUser.role}
                onChange={e => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </form>

          {/* DISPLAY GENERATED CREDENTIALS */}
          {generatedCreds && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <p className="font-bold text-green-800 mb-2">User Created Successfully!</p>
              <p className="text-sm text-gray-700">Please copy these details now:</p>
              <div className="mt-2 bg-white p-2 rounded border font-mono text-sm">
                <p><strong>Email:</strong> {generatedCreds.email}</p>
                <p><strong>Password:</strong> {generatedCreds.password}</p>
              </div>
            </div>
          )}
          
          {status && !generatedCreds && <p className="text-sm mt-2 text-gray-600">{status}</p>}
        </div>

        {/* USER LIST */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Existing Users ({users.length})</h2>
          <div className="overflow-y-auto max-h-[400px]">
            {users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <ul className="divide-y">
                {users.map(u => (
                  <li key={u.uid} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold">{u.name || 'No Name'}</p>
                      <p className="text-sm text-gray-600">{u.email}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'teacher' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteUser(u.uid)}
                      className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}