// ─────────────────────────────────────────────────────────
// SERVICE: Meta Ads (Facebook / Instagram)
// Quando USE_MOCK=false, chiama la Meta Marketing API
// Docs: https://developers.facebook.com/docs/marketing-api
// ─────────────────────────────────────────────────────────
const axios = require('axios');
const { mockMetaAds } = require('../mock/data');

const USE_MOCK = process.env.USE_MOCK !== 'false';
const META_API_VERSION = 'v19.0';

const metaClient = axios.create({
  baseURL: `https://graph.facebook.com/${META_API_VERSION}`,
});

function metaParams(extra = {}) {
  return { access_token: process.env.META_ACCESS_TOKEN, ...extra };
}

// ── Ad spend + performance ────────────────────────────────
async function getAdInsights({ from, to }) {
  if (USE_MOCK) return mockMetaAds;

  const accountId = process.env.META_AD_ACCOUNT_ID; // es. "act_123456789"

  // Livello account: totale spend nel periodo
  const accountRes = await metaClient.get(`/${accountId}/insights`, {
    params: metaParams({
      time_range: JSON.stringify({ since: from, until: to }),
      fields: 'spend,impressions,clicks,actions,action_values',
      level: 'account',
    }),
  });

  const d = accountRes.data.data[0] || {};
  const purchases = (d.actions || []).find(a => a.action_type === 'purchase');
  const purchaseValue = (d.action_values || []).find(a => a.action_type === 'purchase');
  const spend = parseFloat(d.spend || 0);
  const purchaseCount = parseInt(purchases?.value || 0);
  const revenue = parseFloat(purchaseValue?.value || 0);

  // Livello campagna: dettaglio per campagna
  const campRes = await metaClient.get(`/${accountId}/insights`, {
    params: metaParams({
      time_range: JSON.stringify({ since: from, until: to }),
      fields: 'campaign_name,spend,actions,action_values',
      level: 'campaign',
    }),
  });

  const campaigns = (campRes.data.data || []).map(c => {
    const p = (c.actions || []).find(a => a.action_type === 'purchase');
    const pv = (c.action_values || []).find(a => a.action_type === 'purchase');
    const s = parseFloat(c.spend || 0);
    const pVal = parseFloat(pv?.value || 0);
    return {
      id: c.campaign_id,
      name: c.campaign_name,
      spend: s,
      purchases: parseInt(p?.value || 0),
      roas: s > 0 ? (pVal / s).toFixed(2) : 0,
    };
  });

  return {
    spend,
    impressions: parseInt(d.impressions || 0),
    clicks: parseInt(d.clicks || 0),
    purchases: purchaseCount,
    roas: spend > 0 ? (revenue / spend).toFixed(2) : 0,
    cpa: purchaseCount > 0 ? (spend / purchaseCount).toFixed(2) : 0,
    campaigns,
  };
}

// ── Future: Google Ads placeholder ───────────────────────
async function getGoogleAdsInsights({ from, to }) {
  // TODO: implementare quando si ha il GOOGLE_ADS_DEVELOPER_TOKEN
  return { spend: 0, impressions: 0, clicks: 0, roas: 0, status: 'not_configured' };
}

// ── Future: TikTok Ads placeholder ───────────────────────
async function getTikTokInsights({ from, to }) {
  // TODO: implementare quando si ha il TIKTOK_ACCESS_TOKEN
  return { spend: 0, impressions: 0, clicks: 0, roas: 0, status: 'not_configured' };
}

module.exports = { getAdInsights, getGoogleAdsInsights, getTikTokInsights };
