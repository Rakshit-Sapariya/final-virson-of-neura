#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'references', 'data.json');

if (!fs.existsSync(dataPath)) {
  console.error('data.json not found at ' + dataPath);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('\n======================================================');
console.log('        AWESOME FREE LLM APIS - PROVIDER CATALOG      ');
console.log('======================================================\n');
console.log('Last updated: ' + (data.lastUpdated || 'recent') + '\n');

for (const p of data.providers) {
  console.log(`* ${p.name} (${p.category})`);
  console.log(`   Base URL:    ${p.baseUrl}`);
  console.log(`   Key URL:     ${p.keyUrl || 'See setup guide'}`);
  console.log(`   Total Free Models: ${p.models ? p.models.length : 0}`);
  if (p.models && p.models.length > 0) {
    console.log('   Key Models:');
    p.models.slice(0, 3).forEach(m => {
      console.log(`     - ${m.name.padEnd(35)} (Context: ${m.context || 'N/A'}, MaxOut: ${m.maxOutput || 'N/A'})`);
    });
    if (p.models.length > 3) {
      console.log(`     ...and ${p.models.length - 3} more models`);
    }
  }
  console.log('------------------------------------------------------');
}
