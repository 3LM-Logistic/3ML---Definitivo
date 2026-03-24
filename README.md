# 3ML Logistics Dashboard

Dashboard P&L in tempo reale per e-commerce COD.

## Stack
- **Frontend**: React + Recharts (Vercel / Railway)
- **Backend**: Node.js + Express (Railway)
- **Database**: PostgreSQL (Railway)
- **Integrazioni**: Shopify · Qaplà · Meta Ads · Google Ads · TikTok Ads

## Struttura
```
3ml-logistics/
├── frontend/     ← React app
├── backend/      ← Node.js + Express API
└── README.md
```

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # compila le variabili
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## Deploy su Railway
1. Crea progetto su railway.app
2. Aggiungi servizio GitHub → punta a /backend
3. Aggiungi servizio GitHub → punta a /frontend
4. Aggiungi PostgreSQL plugin
5. Imposta le variabili d'ambiente (vedi .env.example)
6. Push su main → deploy automatico

## Integrazioni

| Servizio     | Stato     | Variabile ENV              |
|-------------|-----------|----------------------------|
| Shopify     | 🟡 Mock   | SHOPIFY_TOKEN, SHOPIFY_STORE |
| Qaplà       | 🟡 Mock   | QAPLA_API_KEY               |
| Meta Ads    | 🟡 Mock   | META_ACCESS_TOKEN, META_AD_ACCOUNT_ID |
| Google Ads  | ⏳ Futuro | GOOGLE_ADS_DEVELOPER_TOKEN  |
| TikTok Ads  | ⏳ Futuro | TIKTOK_ACCESS_TOKEN         |

Per attivare le API reali: imposta `USE_MOCK=false` in .env
