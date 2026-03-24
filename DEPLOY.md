# 🚀 Guida Deploy su Railway

## Prerequisiti
- Account Railway: https://railway.app
- Repository GitHub già creato e pushato

---

## Step 1 — Crea il progetto su Railway

1. Vai su railway.app → **New Project**
2. Scegli **Deploy from GitHub repo**
3. Seleziona il tuo repository `3ml-logistics`

---

## Step 2 — Configura il Backend

1. Railway crea automaticamente un servizio — cliccaci sopra
2. Vai su **Settings → Root Directory** → imposta `backend`
3. Vai su **Variables** e aggiungi:

```
NODE_ENV=production
USE_MOCK=true
JWT_SECRET=<genera con: openssl rand -hex 32>
FRONTEND_URL=https://<url-frontend>.up.railway.app
```
*(Le altre variabili le aggiungi dopo quando hai le API key)*

4. Vai su **Settings → Networking** → **Generate Domain**
   Annota l'URL, ti serve per il frontend (es: `3ml-backend.up.railway.app`)

---

## Step 3 — Aggiungi PostgreSQL

1. Nel progetto Railway → **New** → **Database** → **PostgreSQL**
2. Railway imposta automaticamente `DATABASE_URL` nel backend ✅
3. Per creare le tabelle, vai su **backend service → Deploy → Run Command**:
   ```
   node src/db/migrate.js
   ```

---

## Step 4 — Configura il Frontend

1. Nel progetto → **New** → **GitHub Repo** (stessa repo)
2. Vai su **Settings → Root Directory** → imposta `frontend`
3. Vai su **Variables** e aggiungi:
   ```
   REACT_APP_API_URL=https://3ml-backend.up.railway.app/api
   ```
4. **Generate Domain** anche per il frontend

---

## Step 5 — Aggiorna CORS backend

Torna sul backend → Variables → aggiorna:
```
FRONTEND_URL=https://<url-frontend>.up.railway.app
```
→ Railway fa il redeploy automatico

---

## Step 6 — Verifica che tutto funzioni

Apri `https://<url-backend>.up.railway.app/health`

Risposta attesa:
```json
{
  "status": "ok",
  "mock": true,
  "timestamp": "2026-03-24T..."
}
```

Poi apri il frontend e prova il login con:
- `admin@3mllogistics.io` / `admin123`
- `mellow@cliente.com` / `mellow123`

---

## Quando sei pronto ad attivare le API reali

1. Su Railway → backend → Variables:
   ```
   USE_MOCK=false
   SHOPIFY_STORE=il-tuo-store.myshopify.com
   SHOPIFY_ACCESS_TOKEN=shpat_xxx
   QAPLA_API_KEY=xxx
   META_ACCESS_TOKEN=EAAxxxx
   META_AD_ACCOUNT_ID=act_xxxxx
   ```
2. Railway fa il redeploy — i dati reali compaiono immediatamente

---

## Workflow sviluppo

```bash
# Sviluppo locale
cd backend && npm run dev    # porta 4000
cd frontend && npm start     # porta 3000

# Push su main → Railway deploya automaticamente
git add .
git commit -m "feat: ..."
git push origin main
```
