# 🪙 NovaChain Token Registry

A community-maintained registry of all verified **TokenX-v1** assets on the NovaChain blockchain, developed by **NovaLabs**.

This repository contains a single [`registry.json`](./registry.json) file listing **every token** on NovaChain Mainnet and Testnet. Wallets, explorers, and DEX frontends can use this file to display token names, logos, and metadata consistently.

---

## 📘 Structure

```bash
token-registry/
├─ registry.json          ← single file containing all tokens
├─ registry.schema.json   ← validation schema
├─ images/                ← optional logos (PNG/SVG)
├─ scripts/               ← validation + formatting tools
└─ .github/workflows/     ← automated CI checks
```

---

## ⚙️ Schema Overview

Each entry in `registry.json` looks like this:

```json
{
  "symbol": "LOG",
  "name": "LOG Coin",
  "decimals": 9,
  "mint_authority": "nova1xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "logo": "https://raw.githubusercontent.com/novalabs/token-registry/main/images/LOG.png",
  "uri": "https://docs.novachain.org/tokens/LOG",
  "extensions": {
    "description": "Governance/backing token for NovaChain.",
    "website": "https://novachain.org",
    "twitter": "https://x.com/novachain"
  }
}
```

---

## 🧱 Registry Fields

| Field | Type | Description |
|-------|------|-------------|
| `symbol` | string | Unique ticker (A-Z, 0-9, `_`, max 16 chars). |
| `name` | string | Full token name. |
| `decimals` | integer | Decimal precision (0–18). |
| `mint_authority` | string | NovaChain address that created or controls the token. |
| `logo` | string (URL) | Optional PNG/SVG logo. |
| `uri` | string (URL) | Optional external metadata or docs link. |
| `extensions` | object | Optional social or descriptive fields (`website`, `twitter`, `discord`, `description`). |

---

## 🧩 Validation Rules

- Each token **symbol must be unique**.  
- `mint_authority` must be a valid `nova1...` address.  
- URLs must be valid `https://` links.  
- `decimals`, `symbol`, and `mint_authority` **cannot be changed after approval**.  

Automated validation runs on every pull request using [`registry.schema.json`](./registry.schema.json).

---

## 🔄 How to Submit a Token

1. **Fork** this repository.  
2. **Edit [`registry.json`](./registry.json):**  
   Add your token object inside the `"tokens"` array (keep alphabetical order by `symbol`).  
3. **(Optional)** Add a logo to `/images/` and reference its URL.  
4. **Commit and open a Pull Request.**  
5. CI will automatically check schema and duplicates.  
6. Maintainers verify your token on-chain before merging.

### Example PR snippet

```json
{
  "symbol": "NOVA",
  "name": "Nova Coin",
  "decimals": 9,
  "mint_authority": "nova1abcd1234...",
  "logo": "https://raw.githubusercontent.com/novalabs/token-registry/main/images/NOVA.png"
}
```

---

## 🌐 How Wallets / Apps Use It

Wallets and explorers can fetch the live registry at:

```bash
https://raw.githubusercontent.com/novalabs/token-registry/main/registry.json
```

or via GitHub Pages (if enabled):

```bash
https://novalabs.github.io/token-registry/registry.json
```

### Example client snippet

```ts
async function loadRegistry() {
  const res = await fetch("https://novalabs.github.io/token-registry/registry.json", { cache: "no-cache" });
  const { tokens } = await res.json();
  const map = {};
  for (const t of tokens) map[t.symbol] = t;
  return map;
}
```

---

## 🛡️ Governance & Safety

- All PRs require review from NovaLabs maintainers.  
- CI checks ensure schema validity and alphabetical ordering.  
- **Immutability:** `decimals` and `mint_authority` cannot be modified after approval.  
- **Logo policy:** under 200 KB, safe for all audiences, PNG/SVG preferred.  
- **Mainnet vs Testnet:** tokens for test environments must set `"chain": "nova-testnet"`.  

---

## 🧰 Developer Tools

Run locally:

```bash
npm install ajv ajv-formats
node scripts/validate.mjs
node scripts/format.mjs
```

---

## 📜 License

© 2025 **NovaLabs**

This token registry (`registry.json`, schema, and related scripts) is provided under the **Nova Public Registry License (NPRL-1.0)** —  
permitting open contributions of token metadata while maintaining the **proprietary and closed-source** status of NovaChain’s core blockchain software.

---

> ⚡ Maintained by **NovaLabs**, developers of the NovaChain blockchain.
