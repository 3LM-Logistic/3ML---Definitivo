import { useState } from 'react';
import { auth } from '../api/client';

const BG = '#07080d', SURF = '#0c0e15', CARD = '#111622', BORDER = '#1c2540';
const TEXT = '#e2e8f8', MUTED = '#5d6e92', G = '#00cc7c', R = '#f04848', P = '#9966ef';

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await auth.login(email, password);
      localStorage.setItem('3ml_token', data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Credenziali non valide');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%', background: BG, border: `1px solid ${BORDER}`,
    borderRadius: 8, padding: '12px 14px', fontSize: 14, color: TEXT,
    outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxSizing: 'border-box',
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 16 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>

      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <img src="/logo.png" alt="3ML Logistics" style={{ height: 52, width: "auto", display: "inline-block", marginBottom: 10 }}/>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#5d6e92", letterSpacing: "0.2em", textTransform: "uppercase" }}>Dashboard P&L</div>
        </div>

        {/* Card */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 24 }}>Accedi</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@esempio.com"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>

            {error && (
              <div style={{ background: R + '15', border: `1px solid ${R}30`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: R }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? MUTED : G, color: '#000', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {loading ? 'Accesso in corso...' : 'Accedi →'}
            </button>
          </form>
        </div>

        {/* Demo credentials hint */}
        <div style={{ background: SURF, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 18px', marginTop: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Credenziali demo</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['Admin', 'admin@3mllogistics.io', 'admin123'],
              ['Cliente Mellow', 'mellow@cliente.com', 'mellow123'],
            ].map(([role, em, pw]) => (
              <div
                key={role}
                onClick={() => { setEmail(em); setPassword(pw); }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: role === 'Admin' ? P : G }}>{role}</div>
                  <div style={{ fontSize: 10, color: MUTED, fontFamily: "'JetBrains Mono', monospace" }}>{em}</div>
                </div>
                <div style={{ fontSize: 10, color: MUTED }}>click per compilare</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
