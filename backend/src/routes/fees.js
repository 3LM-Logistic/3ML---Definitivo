const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// ── Auth middleware ───────────────────────────────────────
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token mancante' });
  try {
    req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'dev_secret_change_in_production');
    next();
  } catch {
    res.status(401).json({ error: 'Token non valido' });
  }
}

// In-memory store (sostituire con DB PostgreSQL quando disponibile)
// Struttura: { [brand]: [ { pct, valid_from, created_at } ] }
const feeStore = {
  MELLOW: [{ pct: 10, valid_from: '2025-01-01', created_at: '2025-01-01T00:00:00Z', note: 'Fee iniziale' }],
  NAIRE:  [{ pct: 10, valid_from: '2025-01-01', created_at: '2025-01-01T00:00:00Z', note: 'Fee iniziale' }],
};

// GET /api/fees/:brand — storico fee del brand
router.get('/:brand', authMiddleware, (req, res) => {
  const brand = req.params.brand.toUpperCase();

  // Il cliente può vedere solo i propri brand
  if (req.user.role !== 'admin' && !req.user.brands.includes(brand)) {
    return res.status(403).json({ error: 'Non autorizzato' });
  }

  const history = feeStore[brand] || [];
  const current = history[history.length - 1] || { pct: 10 };

  res.json({ brand, current_pct: current.pct, history });
});

// POST /api/fees/:brand — imposta nuova fee
router.post('/:brand', authMiddleware, (req, res) => {
  const brand = req.params.brand.toUpperCase();
  const { pct, note } = req.body;

  // Validazione
  if (typeof pct !== 'number' || pct < 0 || pct > 100) {
    return res.status(400).json({ error: 'Percentuale non valida (0-100)' });
  }

  // Il cliente può modificare solo i propri brand
  if (req.user.role !== 'admin' && !req.user.brands.includes(brand)) {
    return res.status(403).json({ error: 'Non autorizzato' });
  }

  if (!feeStore[brand]) feeStore[brand] = [];

  const newFee = {
    pct,
    valid_from: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
    note: note || '',
    set_by: req.user.email,
  };

  feeStore[brand].push(newFee);

  res.json({ success: true, brand, current_pct: pct, history: feeStore[brand] });
});

module.exports = router;
