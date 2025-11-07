import fs from "fs";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const registryPath = "registry.json";
const schema = JSON.parse(fs.readFileSync("registry.schema.json", "utf8"));
const doc = JSON.parse(fs.readFileSync(registryPath, "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

if (!validate(doc)) {
  console.error("❌ schema errors:", validate.errors);
  process.exit(1);
}

// uniqueness: symbol
const seen = new Set();
for (const t of doc.tokens) {
  if (seen.has(t.symbol)) {
    console.error(`❌ duplicate symbol: ${t.symbol}`);
    process.exit(1);
  }
  seen.add(t.symbol);
}

console.log(`✅ registry.json valid with ${doc.tokens.length} tokens.`);
