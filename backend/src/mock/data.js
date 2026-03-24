// ─────────────────────────────────────────────────────────
// MOCK DATA — sostituiti da API reali quando USE_MOCK=false
// ─────────────────────────────────────────────────────────

const mockOrders = [
  { id: '2485', name: '#2485mellow', created_at: '2026-03-23', total_price: '34.85', payment_gateway: 'cod', financial_status: 'pending', province: 'AP', line_items: [{ product_id: '1', quantity: 1, price: '34.85' }] },
  { id: '2484', name: '#2484mellow', created_at: '2026-03-23', total_price: '64.80', payment_gateway: 'cod', financial_status: 'pending', province: 'MI', line_items: [{ product_id: '2', quantity: 1, price: '64.80' }] },
  { id: '2483', name: '#2483mellow', created_at: '2026-03-23', total_price: '47.90', payment_gateway: 'cod', financial_status: 'pending', province: 'PU', line_items: [{ product_id: '1', quantity: 1, price: '47.90' }] },
  { id: '2482', name: '#2482mellow', created_at: '2026-03-23', total_price: '70.18', payment_gateway: 'cod', financial_status: 'pending', province: 'RO', line_items: [{ product_id: '2', quantity: 1, price: '70.18' }] },
  { id: '2481', name: '#2481mellow', created_at: '2026-03-23', total_price: '64.80', payment_gateway: 'cod', financial_status: 'pending', province: 'TA', line_items: [{ product_id: '1', quantity: 1, price: '64.80' }] },
  { id: '2480', name: '#2480mellow', created_at: '2026-03-23', total_price: '31.91', payment_gateway: 'shopify_payments', financial_status: 'paid', province: 'FI', line_items: [{ product_id: '3', quantity: 1, price: '31.91' }] },
  { id: '2479', name: '#2479mellow', created_at: '2026-03-22', total_price: '31.91', payment_gateway: 'shopify_payments', financial_status: 'paid', province: 'SP', line_items: [{ product_id: '3', quantity: 1, price: '31.91' }] },
  { id: '2478', name: '#2478mellow', created_at: '2026-03-22', total_price: '58.32', payment_gateway: 'cod', financial_status: 'pending', province: 'TV', line_items: [{ product_id: '2', quantity: 1, price: '58.32' }] },
  { id: '2477', name: '#2477mellow', created_at: '2026-03-22', total_price: '49.80', payment_gateway: 'cod', financial_status: 'pending', province: 'RM', line_items: [{ product_id: '1', quantity: 1, price: '49.80' }] },
  { id: '2473', name: '#2473mellow', created_at: '2026-03-21', total_price: '64.80', payment_gateway: 'cod', financial_status: 'pending', province: 'RM', line_items: [{ product_id: '2', quantity: 1, price: '64.80' }] },
  { id: '2472', name: '#2472mellow', created_at: '2026-03-21', total_price: '66.28', payment_gateway: 'cod', financial_status: 'voided', province: 'TV', line_items: [{ product_id: '3', quantity: 1, price: '66.28' }] },
  { id: '2471', name: '#2471mellow', created_at: '2026-03-21', total_price: '47.90', payment_gateway: 'shopify_payments', financial_status: 'paid', province: 'RM', line_items: [{ product_id: '1', quantity: 1, price: '47.90' }] },
];

const mockShipments = [
  { tracking: '61837296', order_ref: '2434mellow', courier: 'GLS-ITA', status: 'IN_WAREHOUSE', description: 'Spedizione in giacenza presso la sede GLS', shipped_at: '2026-03-18', warehouse_days: 4, cost: 4.00 },
  { tracking: '61837297', order_ref: '2435mellow', courier: 'GLS-ITA', status: 'FAILED_DELIVERY', description: 'Spedizione non in consegna — destinatario assente', shipped_at: '2026-03-18', warehouse_days: 4, cost: 4.00 },
  { tracking: '61838700', order_ref: '2440mellow', courier: 'GLS-ITA', status: 'IN_WAREHOUSE', description: 'Spedizione in giacenza presso la sede GLS', shipped_at: '2026-03-18', warehouse_days: 4, cost: 4.00 },
  { tracking: '61838701', order_ref: '2441mellow', courier: 'GLS-ITA', status: 'EXCEPTION', description: 'La spedizione è stata rifiutata dal destinatario', shipped_at: '2026-03-18', warehouse_days: 4, cost: 4.00 },
  { tracking: '61842698', order_ref: '2444mellow', courier: 'GLS-ITA', status: 'FAILED_DELIVERY', description: 'Destinatario assente al primo passaggio', shipped_at: '2026-03-18', warehouse_days: 4, cost: 4.00 },
  { tracking: '10808000', order_ref: '2453mellow', courier: 'BRT',     status: 'FAILED_DELIVERY', description: 'Destinatario assente: lasciato avviso', shipped_at: '2026-03-19', warehouse_days: 3, cost: 3.50 },
  { tracking: '61850079', order_ref: '2452mellow', courier: 'GLS-ITA', status: 'FAILED_DELIVERY', description: 'Spedizione non in consegna', shipped_at: '2026-03-19', warehouse_days: 3, cost: 3.50 },
  { tracking: '61852295', order_ref: '2460mellow', courier: 'GLS-ITA', status: 'FAILED_DELIVERY', description: 'Destinatario assente al primo passaggio', shipped_at: '2026-03-20', warehouse_days: 2, cost: null },
];

const mockDeliveryStatus = {
  delivered: 8,
  in_transit: 29,
  returning: 0,
  returned: 0,
  total: 37,
  revenue_in_transit: 1415.20,
  revenue_at_risk: 0,
  revenue_lost: 0,
};

const mockMetaAds = {
  spend: 1147.60,
  impressions: 84200,
  clicks: 3100,
  purchases: 34,
  roas: 1.82,
  cpa: 33.75,
  campaigns: [
    { id: 'c1', name: 'Mellow — Prospecting', spend: 680.00, purchases: 21, roas: 1.95 },
    { id: 'c2', name: 'Mellow — Retargeting', spend: 310.00, purchases: 10, roas: 1.74 },
    { id: 'c3', name: 'Mellow — LTV',         spend: 157.60, purchases: 3,  roas: 1.22 },
  ],
};

const mockPayouts = [
  { payout_date: '2026-03-24', amount: 663.40, status: 'in_transit' },
  { payout_date: '2026-03-17', amount: 44.94,  status: 'paid' },
  { payout_date: '2026-03-16', amount: 46.84,  status: 'paid' },
  { payout_date: '2026-03-13', amount: 102.95, status: 'paid' },
  { payout_date: '2026-03-12', amount: 202.14, status: 'paid' },
  { payout_date: '2026-03-11', amount: 115.55, status: 'paid' },
  { payout_date: '2026-03-10', amount: 46.84,  status: 'paid' },
  { payout_date: '2026-03-09', amount: 93.68,  status: 'paid' },
  { payout_date: '2026-03-06', amount: 108.42, status: 'paid' },
  { payout_date: '2026-03-05', amount: 311.42, status: 'paid' },
];

const mockProducts = [
  { id: '1', title: 'Mellow® Dolori Articolari – Supergelée alla Vaniglia', sku: '', cost: 5.50 },
  { id: '2', title: 'Mellow® Capelli e Unghie Forti – Supergelée all\'Uva Rossa', sku: '', cost: 5.50 },
  { id: '3', title: 'Mellow® Energia Profonda – Supergelée ai Frutti di Bosco', sku: '', cost: 5.50 },
  { id: '4', title: 'Mellow® Neuropatia – Supergelée ai Frutti di Bosco', sku: '', cost: 5.50 },
  { id: '5', title: 'Ebook - Come rinforzare le difese', sku: '', cost: 0.00 },
  { id: '6', title: 'Mellow® Lipo Fianchi – Supergelée agli Agrumi', sku: '', cost: 5.50 },
  { id: '7', title: 'Mellow® Sonno Profondo – Supergelée alle More', sku: '', cost: 5.50 },
  { id: '8', title: 'Mellow® Detox Fegato – Supergelée alla Mela Verde', sku: '', cost: 5.50 },
];

module.exports = {
  mockOrders,
  mockShipments,
  mockDeliveryStatus,
  mockMetaAds,
  mockPayouts,
  mockProducts,
};
