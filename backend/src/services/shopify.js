// ─────────────────────────────────────────────────────────
// SERVICE: Shopify
// Quando USE_MOCK=false, chiama la Shopify REST Admin API
// Docs: https://shopify.dev/docs/api/admin-rest
// ─────────────────────────────────────────────────────────
const axios = require('axios');
const { mockOrders, mockPayouts, mockProducts } = require('../mock/data');

const USE_MOCK = process.env.USE_MOCK !== 'false';

// Shopify client configurato
const shopifyClient = axios.create({
  baseURL: `https://${process.env.SHOPIFY_STORE}/admin/api/2024-01`,
  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  },
});

// ── Helpers ───────────────────────────────────────────────
function buildDateFilter(from, to) {
  return `created_at_min=${from}T00:00:00Z&created_at_max=${to}T23:59:59Z`;
}

// ── Orders ────────────────────────────────────────────────
async function getOrders({ from, to, limit = 250 }) {
  if (USE_MOCK) {
    // Filtra per data se specificata
    let orders = mockOrders;
    if (from) orders = orders.filter(o => o.created_at >= from);
    if (to)   orders = orders.filter(o => o.created_at <= to);
    return orders;
  }

  // API reale — gestisce la paginazione automaticamente
  let allOrders = [];
  let url = `/orders.json?status=any&limit=${limit}&${buildDateFilter(from, to)}`;

  while (url) {
    const response = await shopifyClient.get(url);
    allOrders = allOrders.concat(response.data.orders);

    // Shopify usa link-based pagination
    const linkHeader = response.headers['link'];
    const nextMatch = linkHeader?.match(/<([^>]+)>;\s*rel="next"/);
    url = nextMatch ? nextMatch[1].replace(`https://${process.env.SHOPIFY_STORE}/admin/api/2024-01`, '') : null;
  }

  return allOrders;
}

// ── Products ──────────────────────────────────────────────
async function getProducts() {
  if (USE_MOCK) return mockProducts;

  const response = await shopifyClient.get('/products.json?limit=250&fields=id,title,variants');
  return response.data.products.flatMap(p =>
    p.variants.map(v => ({
      id: String(v.id),
      title: p.title,
      sku: v.sku,
      cost: parseFloat(v.cost || 0),
      inventory_quantity: v.inventory_quantity,
      inventory_management: v.inventory_management,
    }))
  );
}

// ── Payouts (Shopify Balance / Payments) ─────────────────
async function getPayouts({ from, to }) {
  if (USE_MOCK) return mockPayouts;

  // Richiede Shopify Payments attivo
  const response = await shopifyClient.get(
    `/shopify_payments/payouts.json?date_min=${from}&date_max=${to}`
  );
  return response.data.payouts.map(p => ({
    payout_date: p.date,
    amount: parseFloat(p.amount),
    status: p.status,
  }));
}

// ── Discounts ─────────────────────────────────────────────
async function getDiscountStats(orders) {
  const withDiscount = orders.filter(o =>
    o.discount_codes?.length > 0 || parseFloat(o.total_discounts || 0) > 0
  );

  const totalDiscount = orders.reduce((s, o) => s + parseFloat(o.total_discounts || 0), 0);
  const aovWith    = withDiscount.length ? withDiscount.reduce((s, o) => s + parseFloat(o.total_price), 0) / withDiscount.length : 0;
  const withoutD   = orders.filter(o => !o.discount_codes?.length && parseFloat(o.total_discounts || 0) === 0);
  const aovWithout = withoutD.length ? withoutD.reduce((s, o) => s + parseFloat(o.total_price), 0) / withoutD.length : 0;

  // Conta i codici usati
  const codeMap = {};
  orders.forEach(o => {
    (o.discount_codes || []).forEach(d => {
      codeMap[d.code] = (codeMap[d.code] || 0) + 1;
    });
  });
  const topCodes = Object.entries(codeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([code, count]) => ({ code, count }));

  return {
    orders_with_discount: withDiscount.length,
    pct_with_discount: orders.length ? ((withDiscount.length / orders.length) * 100).toFixed(1) : 0,
    total_discount: totalDiscount.toFixed(2),
    avg_discount_per_order: withDiscount.length ? (totalDiscount / withDiscount.length).toFixed(2) : 0,
    aov_with_discount: aovWith.toFixed(2),
    aov_without_discount: aovWithout.toFixed(2),
    top_codes: topCodes,
  };
}

module.exports = { getOrders, getProducts, getPayouts, getDiscountStats };
