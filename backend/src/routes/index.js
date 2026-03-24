// ── routes/qapla.js ───────────────────────────────────────
const express = require('express');
const qRouter = express.Router();
const qapla = require('../services/qapla');

qRouter.get('/shipments',   async (req, res, next) => {
  try { res.json(await qapla.getShipments(req.query)); } catch(e) { next(e); }
});
qRouter.get('/status',      async (req, res, next) => {
  try { res.json(await qapla.getDeliveryStatus(req.query)); } catch(e) { next(e); }
});
qRouter.get('/exceptions',  async (req, res, next) => {
  try { res.json(await qapla.getExceptions(req.query)); } catch(e) { next(e); }
});

module.exports = { qaplaRouter: qRouter };


// ── routes/meta.js ────────────────────────────────────────
const mRouter = express.Router();
const meta = require('../services/meta');

mRouter.get('/insights', async (req, res, next) => {
  try { res.json(await meta.getAdInsights(req.query)); } catch(e) { next(e); }
});
// Placeholder per Google e TikTok — già pronti per i dati
mRouter.get('/google',   async (req, res, next) => {
  try { res.json(await meta.getGoogleAdsInsights(req.query)); } catch(e) { next(e); }
});
mRouter.get('/tiktok',   async (req, res, next) => {
  try { res.json(await meta.getTikTokInsights(req.query)); } catch(e) { next(e); }
});

module.exports = { metaRouter: mRouter };


// ── routes/analytics.js ───────────────────────────────────
const aRouter = express.Router();
const { calculatePL, buildDailyTrend } = require('../services/analytics');
const shopify = require('../services/shopify');
const qapla   = require('../services/qapla');
const metaSvc = require('../services/meta');

// GET /api/analytics/pl?from=2026-03-17&to=2026-03-24&brand=MELLOW
aRouter.get('/pl', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const [orders, shipments, adInsights] = await Promise.all([
      shopify.getOrders({ from, to }),
      qapla.getShipments({ from, to }),
      metaSvc.getAdInsights({ from, to }),
    ]);

    const pl = calculatePL({
      orders,
      shipments,
      adSpend: { meta: adInsights.spend, google: 0, tiktok: 0 },
      agencyFeePct: 0.10,
    });

    const trend = buildDailyTrend(orders, adInsights);

    res.json({ pl, trend, meta: adInsights });
  } catch(e) { next(e); }
});

// GET /api/analytics/overview — summary multi-brand
aRouter.get('/overview', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const [orders, shipments, adInsights] = await Promise.all([
      shopify.getOrders({ from, to }),
      qapla.getShipments({ from, to }),
      metaSvc.getAdInsights({ from, to }),
    ]);
    const pl = calculatePL({
      orders, shipments,
      adSpend: { meta: adInsights.spend },
    });
    res.json({ pl, orders_count: orders.length });
  } catch(e) { next(e); }
});

module.exports = { analyticsRouter: aRouter };


// ── routes/auth.js ────────────────────────────────────────
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Utenti demo hardcoded (in produzione vengono dal DB)
const DEMO_USERS = [
  { id: 1, email: 'admin@3mllogistics.io', password: bcrypt.hashSync('admin123', 10), role: 'admin', brands: ['MELLOW','NAIRE'] },
  { id: 2, email: 'mellow@cliente.com',  password: bcrypt.hashSync('mellow123', 10), role: 'client', brands: ['MELLOW'] },
];

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = DEMO_USERS.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, brands: user.brands },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, brands: user.brands } });
});

authRouter.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const user = jwt.verify(auth.replace('Bearer ', ''), process.env.JWT_SECRET);
    res.json(user);
  } catch { res.status(401).json({ error: 'Token non valido' }); }
});

module.exports = authRouter;
