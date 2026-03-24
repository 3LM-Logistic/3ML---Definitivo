// Esegui con: node src/db/migrate.js
// Crea le tabelle base per quando si passa dal mock al DB reale.
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  console.log('🗄️  Avvio migrazione database...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Utenti ────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        email       VARCHAR(255) UNIQUE NOT NULL,
        password    VARCHAR(255) NOT NULL,
        name        VARCHAR(255),
        role        VARCHAR(50) DEFAULT 'client',
        brands      TEXT[] DEFAULT '{}',
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    // ── Brand (ogni cliente può avere più brand) ──────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS brands (
        id          SERIAL PRIMARY KEY,
        slug        VARCHAR(100) UNIQUE NOT NULL,
        name        VARCHAR(255) NOT NULL,
        shopify_store       VARCHAR(255),
        shopify_access_token TEXT,
        qapla_api_key        TEXT,
        meta_ad_account_id   VARCHAR(100),
        agency_fee_pct       DECIMAL(5,2) DEFAULT 10.00,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    // ── Spese manuali ─────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id          SERIAL PRIMARY KEY,
        brand_slug  VARCHAR(100) REFERENCES brands(slug),
        category    VARCHAR(50) NOT NULL, -- 'personali' | 'ricorrenti' | 'una_tantum'
        description VARCHAR(255) NOT NULL,
        amount      DECIMAL(10,2) NOT NULL,
        date        DATE NOT NULL,
        recurring   BOOLEAN DEFAULT FALSE,
        notes       TEXT,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    // ── Cache API (evita chiamate ripetute) ───────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS api_cache (
        id          SERIAL PRIMARY KEY,
        cache_key   VARCHAR(500) UNIQUE NOT NULL,
        data        JSONB NOT NULL,
        expires_at  TIMESTAMP NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    // ── Costi prodotto override ───────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_costs (
        id          SERIAL PRIMARY KEY,
        brand_slug  VARCHAR(100) REFERENCES brands(slug),
        product_id  VARCHAR(100) NOT NULL,
        sku         VARCHAR(100),
        cost        DECIMAL(10,2) NOT NULL,
        valid_from  DATE NOT NULL,
        notes       TEXT,
        UNIQUE(brand_slug, product_id, valid_from)
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Migrazione completata con successo!');
    console.log('   Tabelle create: users, brands, expenses, api_cache, product_costs');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Errore migrazione:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
