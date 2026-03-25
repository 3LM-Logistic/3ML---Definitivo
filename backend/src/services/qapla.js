// ─────────────────────────────────────────────────────────
// SERVICE: Qaplà
// Docs: https://api.qapla.dev/1.3/en/
// Endpoint: GET con apiKey come query param
// ─────────────────────────────────────────────────────────
const axios = require('axios');
const { mockShipments, mockDeliveryStatus } = require('../mock/data');

const USE_MOCK = process.env.USE_MOCK !== 'false';
const API_KEY  = process.env.QAPLA_API_KEY;
const BASE_URL = process.env.QAPLA_API_URL || 'https://api.qapla.it/1.2';

// ── Shipments ─────────────────────────────────────────────
async function getShipments({ from, to }) {
  if (USE_MOCK || !API_KEY) {
    let shipments = mockShipments;
    if (from) shipments = shipments.filter(s => s.shipped_at >= from);
    if (to)   shipments = shipments.filter(s => s.shipped_at <= to);
    return shipments;
  }

  try {
    // Qaplà API 1.2: GET getShipments con dateFrom/dateTo
    const response = await axios.get(`${BASE_URL}/getShipments/`, {
      params: {
        apiKey: API_KEY,
        dateFrom: from ? `${from} 00:00:00` : undefined,
        dateTo:   to   ? `${to} 23:59:59`   : undefined,
      },
      timeout: 10000,
    });

    const data = response.data?.getShipments;
    if (!data || data.result === 'KO') {
      console.warn('Qaplà getShipments error:', data?.error);
      return [];
    }

    const shipments = data.shipments || [];
    return shipments.map(s => ({
      tracking:       s.trackingNumber,
      order_ref:      s.reference,
      courier:        s.courier,
      status:         mapQaplaStatus(s.qaplaStatus),
      description:    s.courierStatus || s.lastEvent || '',
      shipped_at:     s.shippingDate?.slice(0, 10),
      warehouse_days: calculateWarehouseDays(s),
      cost:           parseFloat(s.cost || 0),
      order_total:    parseFloat(s.amount || 0),
    }));
  } catch (err) {
    console.error('Qaplà API error:', err.message);
    return [];
  }
}

// Mappa gli stati Qaplà nei nostri stati interni
function mapQaplaStatus(qaplaStatus) {
  const map = {
    1: 'IN_TRANSIT',
    2: 'IN_TRANSIT',
    3: 'IN_TRANSIT',
    4: 'DELIVERED',
    5: 'EXCEPTION',       // Eccezione
    6: 'FAILED_DELIVERY', // Tentativo fallito
    7: 'IN_WAREHOUSE',    // In giacenza
    8: 'RETURNING',
    9: 'RETURNED',
    10: 'EXCEPTION',
  };
  return map[qaplaStatus] || 'IN_TRANSIT';
}

// Calcola giorni in giacenza (approssimazione)
function calculateWarehouseDays(shipment) {
  if (!shipment.lastEventDate) return 0;
  const lastEvent = new Date(shipment.lastEventDate);
  const now = new Date();
  return Math.floor((now - lastEvent) / (1000 * 60 * 60 * 24));
}

// ── Delivery status summary ───────────────────────────────
async function getDeliveryStatus({ from, to }) {
  if (USE_MOCK || !API_KEY) return mockDeliveryStatus;

  const shipments = await getShipments({ from, to });

  const delivered  = shipments.filter(s => s.status === 'DELIVERED').length;
  const in_transit = shipments.filter(s => ['IN_TRANSIT'].includes(s.status)).length;
  const returning  = shipments.filter(s => s.status === 'RETURNING').length;
  const returned   = shipments.filter(s => s.status === 'RETURNED').length;

  const revenue_in_transit = shipments
    .filter(s => s.status === 'IN_TRANSIT')
    .reduce((sum, s) => sum + (s.order_total || 0), 0);

  const revenue_at_risk = shipments
    .filter(s => s.status === 'RETURNING')
    .reduce((sum, s) => sum + (s.order_total || 0), 0);

  const revenue_lost = shipments
    .filter(s => s.status === 'RETURNED')
    .reduce((sum, s) => sum + (s.order_total || 0), 0);

  return {
    delivered,
    in_transit,
    returning,
    returned,
    total: shipments.length,
    revenue_in_transit: +revenue_in_transit.toFixed(2),
    revenue_at_risk:    +revenue_at_risk.toFixed(2),
    revenue_lost:       +revenue_lost.toFixed(2),
  };
}

// ── Exceptions (giacenze) ─────────────────────────────────
async function getExceptions({ from, to }) {
  const shipments = await getShipments({ from, to });
  return shipments.filter(s =>
    ['IN_WAREHOUSE', 'FAILED_DELIVERY', 'EXCEPTION'].includes(s.status)
  );
}

// ── Shipping costs ────────────────────────────────────────
async function getShippingCosts({ from, to }) {
  const shipments = await getShipments({ from, to });
  return shipments.reduce((sum, s) => sum + (s.cost || 0), 0);
}

module.exports = { getShipments, getDeliveryStatus, getExceptions, getShippingCosts };
