// ─────────────────────────────────────────────────────────
// Hook: useDashboard
// Gestisce tutti i dati della dashboard con loading/error.
// Il componente dashboard non sa da dove vengono i dati.
// ─────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { analytics, shopify, qapla, metaAds } from '../api/client';

// Range presets
export function getDateRange(preset) {
  const to = new Date();
  const from = new Date();
  const map = { 'Oggi': 0, '7g': 7, '1m': 30, '2m': 60, '3m': 90 };
  from.setDate(from.getDate() - (map[preset] || 7));
  return {
    from: from.toISOString().slice(0, 10),
    to:   to.toISOString().slice(0, 10),
  };
}

export function useDashboard({ preset = '7g', from, to, brand }) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    pl: null,
    trend: [],
    orders: [],
    shipments: [],
    deliveryStatus: null,
    exceptions: [],
    payouts: [],
    products: [],
    discounts: null,
    metaAds: null,
  });

  const dateRange = from && to ? { from, to } : getDateRange(preset);

  const fetchAll = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      // Carica tutto in parallelo per velocità
      const [
        plData,
        ordersData,
        shipmentsData,
        deliveryData,
        exceptionsData,
        payoutsData,
        productsData,
        discountsData,
        adsData,
      ] = await Promise.allSettled([
        analytics.getPL({ ...dateRange, brand }),
        shopify.getOrders(dateRange),
        qapla.getShipments(dateRange),
        qapla.getDeliveryStatus(dateRange),
        qapla.getExceptions(dateRange),
        shopify.getPayouts(dateRange),
        shopify.getProducts(),
        shopify.getDiscounts(dateRange),
        metaAds.getInsights(dateRange),
      ]);

      // Estrae il valore o null se fallito (graceful degradation)
      const get = r => r.status === 'fulfilled' ? r.value : null;

      setState({
        loading: false,
        error: null,
        pl:             get(plData)?.pl || null,
        trend:          get(plData)?.trend || [],
        orders:         get(ordersData) || [],
        shipments:      get(shipmentsData) || [],
        deliveryStatus: get(deliveryData),
        exceptions:     get(exceptionsData) || [],
        payouts:        get(payoutsData) || [],
        products:       get(productsData) || [],
        discounts:      get(discountsData),
        metaAds:        get(adsData),
      });
    } catch (err) {
      setState(s => ({ ...s, loading: false, error: err.message }));
    }
  }, [dateRange.from, dateRange.to, brand]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { ...state, refetch: fetchAll };
}
