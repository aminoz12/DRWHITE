#!/usr/bin/env node
// Pinterest Shopping helper (API v5): registers the site's product feed
// (/feeds/pinterest.xml) as a catalogue data source and reports how Pinterest
// ingested it.
//
//   node scripts/pinterest-catalog.mjs feeds              list data sources
//   node scripts/pinterest-catalog.mjs create US GB       one feed per market
//   node scripts/pinterest-catalog.mjs ingest <feed_id>   fetch the feed now
//   node scripts/pinterest-catalog.mjs status <feed_id>   latest processing results
//
// Auth, read from .env.local:
//   PINTEREST_APP_ID + PINTEREST_APP_SECRET  app token (client credentials),
//     enough for `feeds` and `create`.
//   PINTEREST_ACCESS_TOKEN  a user token, needed for `ingest` and `status`
//     (Pinterest refuses app tokens there). The test token from
//     developers.pinterest.com → My apps works; it takes precedence when set.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://api.pinterest.com/v5';

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  return Object.fromEntries(
    readFileSync(filePath, 'utf8')
      .replace(/^﻿/, '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const i = line.indexOf('=');
        return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^(['"])(.*)\1$/, '$2')];
      }),
  );
}

const env = { ...parseEnvFile(resolve(root, '.env.local')), ...process.env };

// Node reads NODE_EXTRA_CA_CERTS only at startup, so re-run with it set (as
// run-next.mjs does) when .env.local names a local TLS-inspection root.
const extraCa = env.LOCAL_NODE_EXTRA_CA_CERTS || env.NODE_EXTRA_CA_CERTS;
if (extraCa && !process.env.NODE_EXTRA_CA_CERTS) {
  const run = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: 'inherit',
    env: { ...process.env, NODE_EXTRA_CA_CERTS: resolve(root, extraCa) },
  });
  process.exit(run.status ?? 1);
}

const SITE = (env.NEXT_PUBLIC_SITE_URL || 'https://www.cliniwhite.com').replace(/\/+$/, '');
const MARKETS = {
  US: { currency: 'USD', locale: 'en-US', location: `${SITE}/feeds/pinterest.xml` },
  GB: { currency: 'GBP', locale: 'en-GB', location: `${SITE}/feeds/pinterest.xml?country=GB` },
};

async function token() {
  if (env.PINTEREST_ACCESS_TOKEN) return env.PINTEREST_ACCESS_TOKEN;
  const { PINTEREST_APP_ID: id, PINTEREST_APP_SECRET: secret } = env;
  if (!id || !secret) throw new Error('Set PINTEREST_ACCESS_TOKEN, or PINTEREST_APP_ID and PINTEREST_APP_SECRET, in .env.local');
  const res = await fetch(`${API}/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials', scope: 'catalogs:read,catalogs:write' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Token request failed (${res.status}): ${data.message || JSON.stringify(data)}`);
  return data.access_token;
}

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${data.message || JSON.stringify(data)}`);
  return data;
}

async function listFeeds() {
  const feeds = [];
  let bookmark;
  do {
    const page = await api('GET', `/catalogs/feeds?page_size=100${bookmark ? `&bookmark=${bookmark}` : ''}`);
    feeds.push(...page.items);
    bookmark = page.bookmark;
  } while (bookmark);
  return feeds;
}

/** Non-zero counters of an errors/warnings object, e.g. "price_missing: 2". */
function counts(obj = {}) {
  return Object.entries(obj).filter(([, n]) => n).map(([k, n]) => `${k}: ${n}`).join(', ') || 'none';
}

const commands = {
  async feeds() {
    const feeds = await listFeeds();
    if (!feeds.length) return console.log('No feeds yet. Run: node scripts/pinterest-catalog.mjs create US GB');
    for (const f of feeds) {
      console.log(`${f.id}  ${f.status}  ${f.default_country}/${f.default_currency}  ${f.name}  ${f.location}`);
    }
  },

  async create(...countries) {
    if (!countries.length) countries = ['US'];
    const existing = await listFeeds();
    for (const country of countries.map((c) => c.toUpperCase())) {
      const market = MARKETS[country];
      if (!market) throw new Error(`No market "${country}". Known: ${Object.keys(MARKETS).join(', ')}`);
      const dupe = existing.find((f) => f.location === market.location);
      if (dupe) {
        console.log(`${country}: already registered as feed ${dupe.id}`);
        continue;
      }
      const feed = await api('POST', '/catalogs/feeds', {
        name: `CLINIWHITE ${country}`,
        format: 'XML',
        location: market.location,
        catalog_type: 'RETAIL',
        default_country: country,
        default_locale: market.locale,
        default_currency: market.currency,
      });
      console.log(`${country}: created feed ${feed.id} (${feed.status}). Pinterest ingests it within 24-48 h.`);
    }
  },

  async ingest(feedId) {
    if (!feedId) throw new Error('Usage: ingest <feed_id>');
    const run = await api('POST', `/catalogs/feeds/${feedId}/ingest`);
    console.log(`Ingestion ${run.id}: ${run.status}`);
  },

  async status(feedId) {
    if (!feedId) throw new Error('Usage: status <feed_id>');
    const { items } = await api('GET', `/catalogs/feeds/${feedId}/processing_results?page_size=5`);
    if (!items.length) return console.log('No processing results yet: Pinterest has not fetched this feed.');
    for (const r of items) {
      console.log(`${r.created_at}  ${r.status}  products ${r.product_counts?.ingested ?? 0}/${r.product_counts?.original ?? 0} ingested`);
      console.log(`  errors:   ${counts(r.validation_details?.errors)}; ${counts(r.ingestion_details?.errors)}`);
      console.log(`  warnings: ${counts(r.validation_details?.warnings)}; ${counts(r.ingestion_details?.warnings)}`);
    }
  },
};

const [command, ...args] = process.argv.slice(2);
if (!commands[command]) {
  console.log('Usage: node scripts/pinterest-catalog.mjs <feeds | create [US GB] | ingest <feed_id> | status <feed_id>>');
  process.exit(command ? 1 : 0);
}
commands[command](...args).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
