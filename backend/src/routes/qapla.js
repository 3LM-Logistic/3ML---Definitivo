const express = require('express');
const router = express.Router();
const qapla = require('../services/qapla');

router.get('/shipments', async (req, res, next) => {
  try { res.json(await qapla.getShipments(req.query)); } catch(e) { next(e); }
});
router.get('/status', async (req, res, next) => {
  try { res.json(await qapla.getDeliveryStatus(req.query)); } catch(e) { next(e); }
});
router.get('/exceptions', async (req, res, next) => {
  try { res.json(await qapla.getExceptions(req.query)); } catch(e) { next(e); }
});

module.exports = router;
