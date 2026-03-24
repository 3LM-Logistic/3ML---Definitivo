// ─────────────────────────────────────────────────────────
// Frontend API client
// Tutte le chiamate al backend passano da qui.
// In questo modo se cambiano le API, modifichi solo questo file.
// ─────────────────────────────────────────────────────────

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// ── Auth token ────────────────────────────────────────────
function getToken() {
  return localStorage.getItem('3ml_token');
}

// ── Base fetch con auth ───────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API error');
  }
  return res.json();
}

// ── Helpers per query params ──────────────────────────────
function qs(params) {
  return '?' + new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
  ).toString();
}

// ══════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════
export const auth = {
  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => apiFetch('/auth/me'),
  logout: () => localStorage.removeItem('3ml_token'),
};

// ══════════════════════════════════════════════════════════
// ANALYTICS (P&L calcolato — endpoint principale)
// ══════════════════════════════════════════════════════════
export const analytics = {
  // P&L completo: GET /api/analytics/pl?from=...&to=...
  getPL: ({ from, to, brand }) =>
    apiFetch(`/analytics/pl${qs({ from, to, brand })}`),

  // Overview multi-brand
  getOverview: ({ from, to }) =>
    apiFetch(`/analytics/overview${qs({ from, to })}`),
};

// ══════════════════════════════════════════════════════════
// SHOPIFY
// ══════════════════════════════════════════════════════════
export const shopify = {
  // Ordini: GET /api/shopify/orders?from=...&to=...
  getOrders: ({ from, to }) =>
    apiFetch(`/shopify/orders${qs({ from, to })}`),

  // Prodotti + costi
  getProducts: () =>
    apiFetch('/shopify/products'),

  // Payout Shopify Payments
  getPayouts: ({ from, to }) =>
    apiFetch(`/shopify/payouts${qs({ from, to })}`),

  // Stats sconti e coupon
  getDiscounts: ({ from, to }) =>
    apiFetch(`/shopify/discounts${qs({ from, to })}`),
};

// ══════════════════════════════════════════════════════════
// QAPLÀ (logistica)
// ══════════════════════════════════════════════════════════
export const qapla = {
  // Lista spedizioni
  getShipments: ({ from, to }) =>
    apiFetch(`/qapla/shipments${qs({ from, to })}`),

  // Stato consegne (consegnati, in transito, rientri...)
  getDeliveryStatus: ({ from, to }) =>
    apiFetch(`/qapla/status${qs({ from, to })}`),

  // Giacenze & eccezioni
  getExceptions: ({ from, to }) =>
    apiFetch(`/qapla/exceptions${qs({ from, to })}`),
};

// ══════════════════════════════════════════════════════════
// META ADS
// ══════════════════════════════════════════════════════════
export const metaAds = {
  // Spend + ROAS + campagne
  getInsights: ({ from, to }) =>
    apiFetch(`/meta/insights${qs({ from, to })}`),
};

// ══════════════════════════════════════════════════════════
// FUTURE: Google Ads & TikTok (già pronti lato backend)
// ══════════════════════════════════════════════════════════
export const googleAds = {
  getInsights: ({ from, to }) =>
    apiFetch(`/meta/google${qs({ from, to })}`),
};

export const tiktokAds = {
  getInsights: ({ from, to }) =>
    apiFetch(`/meta/tiktok${qs({ from, to })}`),
};
