const express = require('express');
const router = express.Router();
const shopify = require('../services/shopify');

router.get('/orders', async (req, res, next) => {
  try { res.json(await shopify.getOrders(req.query)); } catch(e) { next(e); }
});
router.get('/products', async (req, res, next) => {
  try { res.json(await shopify.getProducts()); } catch(e) { next(e); }
});
router.get('/payouts', async (req, res, next) => {
  try {
    const payouts = await shopify.getPayouts(req.query);
    res.json(payouts);
  } catch(e) {
    // Shopify Payments potrebbe non essere abilitato — restituisce array vuoto
    console.warn('Payouts error (Shopify Payments not enabled?):', e.message);
    res.json([]);
  }
});
router.get('/discounts', async (req, res, next) => {
  try {
    const orders = await shopify.getOrders(req.query);
    res.json(await shopify.getDiscountStats(orders));
  } catch(e) { next(e); }
});

module.exports = router;
