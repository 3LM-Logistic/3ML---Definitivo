// ─────────────────────────────────────────────────────────
// SERVICE: Qaplà
// Quando USE_MOCK=false, chiama le API REST di Qaplà
// Docs: https://api.qapla.it/docs (richiedere accesso)
// ─────────────────────────────────────────────────────────
const axios = require('axios');
const { mockShipments, mockDeliveryStatus } = require('../mock/data');

const USE_MOCK = process.env.USE_MOCK !== 'false';

const qaplaClient = axios.create({
  baseURL: process.env.QAPLA_API_URL || 'https://api.qapla.it/1.1',
  headers: {
    'x-api-key': process.env.QAPLA_API_KEY,
    'Content-Type': 'application/json',
  },
});

// ── Shipments ─────────────────────────────────────────────
async function getShipments({ from, to }) {
  if (USE_MOCK) {
    let shipments = mockShipments;
    if (from) shipments = shipments.filter(s => s.shipped_at >= from);
    if (to)   shipments = shipments.filter(s => s.shipped_at <= to);
    return shipments;
  }

  // API reale Qaplà — endpoint da confermare con la loro documentazione
  const response = await qaplaClient.post('/getShipments', {
    dateFrom: from,
    dateTo: to,
  });
  return response.data.shipments.map(s => ({
    tracking:       s.trackingNumber,
    order_ref:      s.externalReference,
    courier:        s.courier,
    status:         s.lastEventCode,      // es. "IN_WAREHOUSE", "DELIVERED", "EXCEPTION"
    description:    s.lastEventDescription,
    shipped_at:     s.shippingDate,
    warehouse_days: s.daysInWarehouse || 0,
    cost:           parseFloat(s.shippingCost || 0),
  }));
}

// ── Delivery status summary ───────────────────────────────
async function getDeliveryStatus({ from, to }) {
  if (USE_MOCK) return mockDeliveryStatus;

  const shipments = await getShipments({ from, to });

  const delivered  = shipments.filter(s => s.status === 'DELIVERED').length;
  const in_transit = shipments.filter(s => ['IN_TRANSIT','PICKED_UP','OUT_FOR_DELIVERY'].includes(s.status)).length;
  const returning  = shipments.filter(s => s.status === 'RETURNING').length;
  const returned   = shipments.filter(s => s.status === 'RETURNED').length;

  return { delivered, in_transit, returning, returned, total: shipments.length };
}

// ── Exceptions (giacenze) ─────────────────────────────────
async function getExceptions({ from, to }) {
  if (USE_MOCK) {
    return mockShipments.filter(s =>
      ['IN_WAREHOUSE', 'FAILED_DELIVERY', 'EXCEPTION'].includes(s.status)
    );
  }

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
