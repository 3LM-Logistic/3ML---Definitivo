require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 200 }));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/shopify',    require('./routes/shopify'));
app.use('/api/qapla',      require('./routes/qapla'));
app.use('/api/meta',       require('./routes/meta'));
app.use('/api/analytics',  require('./routes/analytics'));
// Futuro:
// app.use('/api/google',  require('./routes/google'));
// app.use('/api/tiktok',  require('./routes/tiktok'));

// ── Health check ─────────────────────────────────────────
app.get('/health', (req, res) => res.json({
  status: 'ok',
  mock: process.env.USE_MOCK === 'true',
  timestamp: new Date().toISOString(),
}));

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ 3ML Logistics backend running on port ${PORT}`);
  console.log(`   Mock mode: ${process.env.USE_MOCK === 'true' ? '🟡 ON' : '🟢 OFF'}`);
});
