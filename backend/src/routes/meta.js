const express = require('express');
const router = express.Router();
const meta = require('../services/meta');

router.get('/insights', async (req, res, next) => {
  try { res.json(await meta.getAdInsights(req.query)); } catch(e) { next(e); }
});
// Placeholder — dati placeholder finché non si connettono
router.get('/google', async (req, res, next) => {
  try { res.json(await meta.getGoogleAdsInsights(req.query)); } catch(e) { next(e); }
});
router.get('/tiktok', async (req, res, next) => {
  try { res.json(await meta.getTikTokInsights(req.query)); } catch(e) { next(e); }
});

module.exports = router;
