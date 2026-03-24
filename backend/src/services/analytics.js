// ─────────────────────────────────────────────────────────
// SERVICE: Analytics — calcolo P&L
// Tutta la logica di business è qui, indipendente dalla fonte
// ─────────────────────────────────────────────────────────

/**
 * Calcola il P&L completo a partire dai dati grezzi
 * delle varie integrazioni.
 */
function calculatePL({ orders, shipments, adSpend, agencyFeePct = 0.10 }) {
  // ── Revenue ───────────────────────────────────────────
  const grossRevenue    = orders.reduce((s, o) => s + parseFloat(o.total_price || 0), 0);
  const totalDiscounts  = orders.reduce((s, o) => s + parseFloat(o.total_discounts || 0), 0);
  const returns         = orders.reduce((s, o) => s + parseFloat(o.total_refunds || 0), 0);
  const netRevenue      = grossRevenue - totalDiscounts - returns;

  // ── Order breakdown ───────────────────────────────────
  const codOrders  = orders.filter(o => o.payment_gateway === 'cod');
  const cardOrders = orders.filter(o => o.payment_gateway !== 'cod');

  // ── COGS (costo prodotto) ────────────────────────────
  // Somma cost × quantity per ogni line_item
  const productCost = orders.reduce((sum, o) => {
    return sum + (o.line_items || []).reduce((s, item) => {
      return s + (parseFloat(item.cost || 0) * (item.quantity || 1));
    }, 0);
  }, 0);

  // ── Shipping cost (da Qaplà) ─────────────────────────
  const shippingCost = shipments.reduce((s, sh) => s + (sh.cost || 0), 0);

  // ── Return shipping ───────────────────────────────────
  const returnShipCost = shipments
    .filter(s => ['RETURNING','RETURNED'].includes(s.status))
    .reduce((s, sh) => s + (sh.cost || 0), 0);

  // ── Warehouse costs (giacenze) ────────────────────────
  // 2gg gratis, poi €3.50 apertura + €0.50/gg
  const warehouseCost = shipments
    .filter(s => ['IN_WAREHOUSE','FAILED_DELIVERY','EXCEPTION'].includes(s.status))
    .reduce((sum, s) => {
      const extraDays = Math.max(0, (s.warehouse_days || 0) - 2);
      if (extraDays === 0) return sum;
      return sum + 3.50 + (extraDays * 0.50);
    }, 0);

  // ── Gross Margin ─────────────────────────────────────
  const grossMargin = netRevenue - productCost - shippingCost - returnShipCost;
  const grossMarginPct = netRevenue > 0 ? ((grossMargin / netRevenue) * 100) : 0;

  // ── Ads ───────────────────────────────────────────────
  const metaSpend     = adSpend.meta || 0;
  const googleSpend   = adSpend.google || 0;
  const tiktokSpend   = adSpend.tiktok || 0;
  const totalAdSpend  = metaSpend + googleSpend + tiktokSpend;
  const agencyFee     = totalAdSpend * agencyFeePct;
  const totalAdsCost  = totalAdSpend + agencyFee;

  // ── ROAS ──────────────────────────────────────────────
  const roas = totalAdSpend > 0 ? (netRevenue / totalAdSpend) : 0;
  const cpa  = orders.length > 0 ? (totalAdSpend / orders.length) : 0;

  // ── Net Profit ────────────────────────────────────────
  const netProfit    = grossMargin - totalAdsCost;
  const netProfitPct = netRevenue > 0 ? ((netProfit / netRevenue) * 100) : 0;

  // ── AOV ───────────────────────────────────────────────
  const aov = orders.length > 0 ? (grossRevenue / orders.length) : 0;

  // ── Liquidazione logistica ────────────────────────────
  // Quanto la logistica deve rimettere: COD incassati - costi spedizione - rientri
  const codDelivered    = shipments.filter(s => s.status === 'DELIVERED' && s.payment_gateway === 'cod');
  const codCollected    = codDelivered.reduce((s, sh) => s + (sh.order_total || 0), 0);
  const netFromLogistic = codCollected - shippingCost - returnShipCost;

  return {
    // Revenue
    gross_revenue:      +grossRevenue.toFixed(2),
    total_discounts:    +totalDiscounts.toFixed(2),
    returns:            +returns.toFixed(2),
    net_revenue:        +netRevenue.toFixed(2),
    // Orders
    total_orders:       orders.length,
    cod_orders:         codOrders.length,
    card_orders:        cardOrders.length,
    cod_pct:            orders.length > 0 ? +((codOrders.length / orders.length * 100).toFixed(1)) : 0,
    // Costs
    product_cost:       +productCost.toFixed(2),
    shipping_cost:      +shippingCost.toFixed(2),
    return_ship_cost:   +returnShipCost.toFixed(2),
    warehouse_cost:     +warehouseCost.toFixed(2),
    // Margin
    gross_margin:       +grossMargin.toFixed(2),
    gross_margin_pct:   +grossMarginPct.toFixed(1),
    // Ads
    meta_spend:         +metaSpend.toFixed(2),
    google_spend:       +googleSpend.toFixed(2),
    tiktok_spend:       +tiktokSpend.toFixed(2),
    total_ad_spend:     +totalAdSpend.toFixed(2),
    agency_fee:         +agencyFee.toFixed(2),
    agency_fee_pct:     agencyFeePct,
    total_ads_cost:     +totalAdsCost.toFixed(2),
    // Performance
    roas:               +roas.toFixed(2),
    cpa:                +cpa.toFixed(2),
    aov:                +aov.toFixed(2),
    // Net
    net_profit:         +netProfit.toFixed(2),
    net_profit_pct:     +netProfitPct.toFixed(1),
    // Liquidazione
    cod_collected:      +codCollected.toFixed(2),
    net_from_logistic:  +netFromLogistic.toFixed(2),
  };
}

/**
 * Raggruppa gli ordini per giorno per i grafici trend
 */
function buildDailyTrend(orders, adInsights) {
  const byDay = {};
  orders.forEach(o => {
    const day = o.created_at.slice(0, 10);
    if (!byDay[day]) byDay[day] = { date: day, revenue: 0, orders: 0, cod: 0, card: 0 };
    byDay[day].revenue += parseFloat(o.total_price || 0);
    byDay[day].orders++;
    if (o.payment_gateway === 'cod') byDay[day].cod++;
    else byDay[day].card++;
  });
  return Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date));
}

module.exports = { calculatePL, buildDailyTrend };
