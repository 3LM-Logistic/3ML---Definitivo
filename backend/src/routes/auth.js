const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In produzione questi utenti vengono dal DB PostgreSQL.
// Per ora sono hardcoded — funzionano subito senza DB.
const USERS = [
  {
    id: 1,
    email: 'admin@3mllogistics.io',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    brands: ['MELLOW', 'NAIRE'],
    name: 'Admin',
  },
  {
    id: 2,
    email: 'mellow@cliente.com',
    password: bcrypt.hashSync('mellow123', 10),
    role: 'client',
    brands: ['MELLOW'],
    name: 'Mellow Brand',
  },
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email e password richieste' });

  const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Credenziali non valide' });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, brands: user.brands, name: user.name },
    process.env.JWT_SECRET || 'dev_secret_change_in_production',
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, brands: user.brands, name: user.name },
  });
});

// GET /api/auth/me — verifica token
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token mancante' });
  try {
    const payload = jwt.verify(
      auth.slice(7),
      process.env.JWT_SECRET || 'dev_secret_change_in_production'
    );
    res.json(payload);
  } catch {
    res.status(401).json({ error: 'Token non valido o scaduto' });
  }
});

module.exports = router;
