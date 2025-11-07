import fs from "node:fs";

const fail = m => { console.error("❌ " + m); process.exit(1); };

let doc;
try { doc = JSON.parse(fs.readFileSync("registry.json","utf8")); }
catch (e) { fail("Unable to read/parse registry.json: " + e.message); }

if (!doc || typeof doc !== "object") fail("registry.json must be an object");
if (!Array.isArray(doc.tokens)) fail("registry.json must contain a 'tokens' array");

const https = /^https:\/\//i;
const nova  = /^nova1[0-9a-z]{10,}$/;
const seen  = new Set();

for (let i=0; i<doc.tokens.length; i++){
  const t = doc.tokens[i];
  const here = `tokens[${i}]`;
  if (!t || typeof t !== "object") fail(`${here} must be an object`);
  if (!t.symbol || typeof t.symbol !== "string") fail(`${here}.symbol is required (string)`);
  if (!t.name || typeof t.name !== "string") fail(`${t.symbol||here}: name is required (string)`);
  if (typeof t.decimals !== "number" || t.decimals % 1 !== 0) fail(`${t.symbol}: decimals must be an integer`);
  if (t.decimals < 0 || t.decimals > 18) fail(`${t.symbol}: decimals out of range (0–18)`);
  if (!t.mint_authority || !nova.test(t.mint_authority)) fail(`${t.symbol}: mint_authority must be nova1…`);
  for (const k of ["logo","uri"]) if (t[k] && (typeof t[k] !== "string" || !https.test(t[k]))) fail(`${t.symbol}: ${k} must be https://`);
  if (seen.has(t.symbol)) fail(`duplicate symbol: ${t.symbol}`);
  seen.add(t.symbol);
}

const sorted = [...doc.tokens].sort((a,b)=>a.symbol.localeCompare(b.symbol,"en",{sensitivity:"base"}));
for (let i=0;i<doc.tokens.length;i++){
  if (doc.tokens[i].symbol !== sorted[i].symbol)
    fail(`tokens must be sorted alphabetically; offender index ${i}: ${doc.tokens[i].symbol}`);
}

console.log(`✅ registry.json valid with ${doc.tokens.length} tokens.`);
