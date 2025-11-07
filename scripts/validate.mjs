// scripts/validate.mjs
import fs from "node:fs";

const fail = (msg) => { console.error("❌ " + msg); process.exit(1); };

let doc;
try {
  doc = JSON.parse(fs.readFileSync("registry.json", "utf8"));
} catch (e) {
  fail("Unable to read/parse registry.json: " + e.message);
}

if (!doc || typeof doc !== "object") fail("registry.json must be a JSON object");
if (!Array.isArray(doc.tokens)) fail("registry.json must contain a 'tokens' array");

const https = /^https:\/\//i;
const novaAddr = /^nova1[0-9a-z]{10,}$/;   // adjust if your format changes
const seen = new Set();

for (let i = 0; i < doc.tokens.length; i++) {
  const t = doc.tokens[i];
  const here = `tokens[${i}]`;

  // Required + types
  if (!t || typeof t !== "object") fail(`${here} must be an object`);
  if (!t.symbol || typeof t.symbol !== "string") fail(`${here}.symbol is required (string)`);
  if (!t.name || typeof t.name !== "string") fail(`${t.symbol || here}: name is required (string)`);
  if (typeof t.decimals !== "number" || t.decimals % 1 !== 0) fail(`${t.symbol}: decimals must be an integer`);
  if (t.decimals < 0 || t.decimals > 18) fail(`${t.symbol}: decimals out of range (0–18)`);
  if (!t.mint_authority || typeof t.mint_authority !== "string") fail(`${t.symbol}: mint_authority is required`);
  if (!novaAddr.test(t.mint_authority)) fail(`${t.symbol}: mint_authority must be nova1…`);

  // Optional URLs must be https
  for (const key of ["logo", "uri"]) {
    if (t[key] && (!/^string$/.test(typeof t[key]) || !https.test(t[key]))) {
      fail(`${t.symbol}: ${key} must be an https:// URL`);
    }
  }

  // Unique symbol
  if (seen.has(t.symbol)) fail(`duplicate symbol: ${t.symbol}`);
  seen.add(t.symbol);

  // Optional: forbid unknown extra top-level keys (tighten as you like)
  const allowed = new Set(["symbol","name","decimals","mint_authority","logo","uri","extensions","chain"]);
  for (const k of Object.keys(t)) {
    if (!allowed.has(k)) fail(`${t.symbol}: unknown field '${k}'`);
  }
}

// Alphabetical by symbol (case-insensitive)
const sorted = [...doc.tokens].sort((a,b)=>a.symbol.localeCompare(b.symbol, "en", {sensitivity:"base"}));
for (let i = 0; i < doc.tokens.length; i++) {
  if (doc.tokens[i].symbol !== sorted[i].symbol) {
    fail(`tokens must be sorted alphabetically by symbol (offender at index ${i}: ${doc.tokens[i].symbol})`);
  }
}

console.log(`✅ registry.json valid with ${doc.tokens.length} tokens.`);
