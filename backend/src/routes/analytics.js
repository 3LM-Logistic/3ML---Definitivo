const express = require('express');
const router = express.Router();
const { calculatePL, buildDailyTrend } = require('../services/analytics');
const shopify = require('../services/shopify');
const qapla   = require('../services/qapla');
const metaSvc = require('../services/meta');

// GET /api/analytics/pl?from=2026-03-17&to=2026-03-24
router.get('/pl', async (req, res, next) => {
  try {
    const { from, to } = req.query;

    // Carica tutto in parallelo — se una fonte fallisce, usa valori vuoti
    const [ordersRes, shipmentsRes, adsRes] = await Promise.allSettled([
      shopify.getOrders({ from, to }),
      qapla.getShipments({ from, to }),
      metaSvc.getAdInsights({ from, to }),
    ]);

    const orders    = ordersRes.status === 'fulfilled' ? ordersRes.value : [];
    const shipments = shipmentsRes.status === 'fulfilled' ? shipmentsRes.value : [];
    const adInsights = adsRes.status === 'fulfilled' ? adsRes.value : { spend: 0, roas: 0, cpa: 0 };

    const pl    = calculatePL({ orders, shipments, adSpend: { meta: adInsights.spend || 0 } });
    const trend = buildDailyTrend(orders);

    res.json({ pl, trend, meta: adInsights });
  } catch(e) { next(e); }
});

// GET /api/analytics/overview
router.get('/overview', async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const [ordersRes, shipmentsRes, adsRes] = await Promise.allSettled([
      shopify.getOrders({ from, to }),
      qapla.getShipments({ from, to }),
      metaSvc.getAdInsights({ from, to }),
    ]);

    const orders    = ordersRes.status === 'fulfilled' ? ordersRes.value : [];
    const shipments = shipmentsRes.status === 'fulfilled' ? shipmentsRes.value : [];
    const adInsights = adsRes.status === 'fulfilled' ? adsRes.value : { spend: 0 };

    const pl = calculatePL({ orders, shipments, adSpend: { meta: adInsights.spend || 0 } });
    res.json({ pl, orders_count: orders.length });
  } catch(e) { next(e); }
});

module.exports = router;
