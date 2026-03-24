const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

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

// Lista brand connessi — in futuro viene dal DB
// Per ora legge dalle variabili d'ambiente
function getConnectedBrands() {
  const brands = [];

  // Brand principale (sempre presente se SHOPIFY_STORE è impostato)
  if (process.env.SHOPIFY_STORE) {
    // Estrae il nome del brand dall'URL dello store
    // es. "try-mellow.myshopify.com" → "MELLOW"
    const storeName = process.env.SHOPIFY_STORE
      .replace('.myshopify.com', '')
      .replace('try-', '')
      .replace(/-/g, ' ')
      .toUpperCase();

    brands.push({
      id: 'brand_1',
      slug: storeName.replace(/\s/g, '_'),
      name: storeName,
      store: process.env.SHOPIFY_STORE,
      connected: true,
      color: '#00cc7c', // verde
    });
  }

  // Se USE_MOCK=true e non c'è store configurato, restituisce brand demo
  if (brands.length === 0 && process.env.USE_MOCK === 'true') {
    brands.push(
      { id: 'brand_1', slug: 'MELLOW', name: 'MELLOW', store: 'demo.myshopify.com', connected: false, color: '#00cc7c' },
      { id: 'brand_2', slug: 'NAIRE',  name: 'NAIRE',  store: null, connected: false, color: '#4488ef' },
    );
  }

  return brands;
}

// GET /api/brands — lista brand connessi per l'utente loggato
router.get('/', authMiddleware, (req, res) => {
  const allBrands = getConnectedBrands();

  // Il cliente vede solo i suoi brand
  const userBrands = req.user.role === 'admin'
    ? allBrands
    : allBrands.filter(b => req.user.brands?.includes(b.slug));

  res.json({ brands: userBrands });
});

// GET /api/brands/:slug — dettaglio singolo brand
router.get('/:slug', authMiddleware, (req, res) => {
  const brands = getConnectedBrands();
  const brand = brands.find(b => b.slug === req.params.slug.toUpperCase());
  if (!brand) return res.status(404).json({ error: 'Brand non trovato' });
  res.json(brand);
});

module.exports = router;
