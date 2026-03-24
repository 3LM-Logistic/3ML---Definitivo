import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { auth } from './api/client';

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // Controlla se c'è già un token valido al caricamento
  useEffect(() => {
    const token = localStorage.getItem('3ml_token');
    if (!token) { setChecking(false); return; }
    auth.me()
      .then(u => setUser(u))
      .catch(() => localStorage.removeItem('3ml_token'))
      .finally(() => setChecking(false));
  }, []);

  function handleLogin(userData) { setUser(userData); }
  function handleLogout() { auth.logout(); setUser(null); }

  if (checking) {
    return (
      <div style={{ background: '#07080d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5d6e92', fontFamily: 'sans-serif', fontSize: 13 }}>
        Caricamento...
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;
  return <Dashboard user={user} onLogout={handleLogout} />;
}
