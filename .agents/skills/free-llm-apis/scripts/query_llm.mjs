#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env.free-llms'),
    path.join(process.env.USERPROFILE || '', '.gemini', 'config', 'plugins', 'free-llm-apis', '.env')
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

const PROVIDERS = {
  groq: {
    name: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    defaultModel: 'llama-3.3-70b-versatile',
    envKey: 'GROQ_API_KEY',
    authHeader: (k) => ({ 'Authorization': `Bearer ${k}` })
  },
  gemini: {
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    defaultModel: 'gemini-2.5-flash',
    envKey: 'GEMINI_API_KEY',
    authHeader: (k) => ({ 'Authorization': `Bearer ${k}` })
  },
  openrouter: {
    name: 'OpenRouter Free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
    envKey: 'OPENROUTER_API_KEY',
    authHeader: (k) => ({ 'Authorization': `Bearer ${k}`, 'HTTP-Referer': 'https://antigravity.google.com', 'X-Title': 'Antigravity Free LLMs' })
  },
  mistral: {
    name: 'Mistral AI',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    defaultModel: 'mistral-small-latest',
    envKey: 'MISTRAL_API_KEY',
    authHeader: (k) => ({ 'Authorization': `Bearer ${k}` })
  },
  cerebras: {
    name: 'Cerebras',
    endpoint: 'https://api.cerebras.ai/v1/chat/completions',
    defaultModel: 'llama-3.3-70b',
    envKey: 'CEREBRAS_API_KEY',
    authHeader: (k) => ({ 'Authorization': `Bearer ${k}` })
  },
  github: {
    name: 'GitHub Models',
    endpoint: 'https://models.inference.ai.azure.com/chat/completions',
    defaultModel: 'gpt-4o-mini',
    envKey: 'GITHUB_TOKEN',
    authHeader: (k) => ({ 'Authorization': `Bearer ${k}` })
  },
  nvidia: {
    name: 'NVIDIA NIM',
    endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
    defaultModel: 'meta/llama-3.3-70b-instruct',
    envKey: 'NVIDIA_API_KEY',
    authHeader: (k) => ({ 'Authorization': `Bearer ${k}` })
  },
  llm7: {
    name: 'LLM7.io (Free / No Key Required)',
    endpoint: 'https://api.llm7.io/v1/chat/completions',
    defaultModel: 'mistral-Nemo-Instruct-2407',
    envKey: 'LLM7_API_KEY',
    authHeader: (k) => (k ? { 'Authorization': `Bearer ${k}` } : {})
  },
  nemotron: {
    name: 'NVIDIA Nemotron 3 Ultra 550B (Free)',
    endpoint: 'https://api.kilo.ai/api/gateway/chat/completions',
    defaultModel: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    envKey: 'NEMOTRON_API_KEY',
    authHeader: (k) => (k ? { 'Authorization': `Bearer ${k}` } : {})
  }
};

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    provider: 'groq',
    model: null,
    prompt: 'Hello! Please confirm you are working and mention your model name.',
    apiKey: null,
    list: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--provider' || arg === '-p') {
      options.provider = args[++i]?.toLowerCase();
    } else if (arg === '--model' || arg === '-m') {
      options.model = args[++i];
    } else if (arg === '--prompt') {
      options.prompt = args[++i];
    } else if (arg === '--key' || arg === '-k') {
      options.apiKey = args[++i];
    } else if (arg === '--list' || arg === '-l') {
      options.list = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Free LLM APIs - Unified Query Tool
Usage:
  node query_llm.mjs [options]

Options:
  --provider, -p   Provider: groq, gemini, openrouter, mistral, cerebras, github, nvidia, llm7, nemotron (default: groq)
  --model, -m      Model name (defaults to provider primary free model)
  --prompt         Prompt to send to the model (default: ping greeting)
  --key, -k        API key (or set via environment variable: GROQ_API_KEY, GEMINI_API_KEY, etc.)
  --list, -l       List all supported providers and their default models
  --help, -h       Show this help message
`);
      process.exit(0);
    }
  }
  return options;
}

async function main() {
  const options = parseArgs();

  if (options.list) {
    console.log('\n=== Supported Free LLM Providers ===\n');
    for (const [key, p] of Object.entries(PROVIDERS)) {
      const hasKey = !!(process.env[p.envKey] || (key === 'llm7') || (key === 'nemotron'));
      console.log(`  * ${p.name.padEnd(35)} [${key}]`);
      console.log(`    Default Model: ${p.defaultModel}`);
      console.log(`    Env Variable:  ${p.envKey} (${hasKey ? 'SET OK (Free Access)' : 'NOT SET'})`);
      console.log(`    Endpoint:      ${p.endpoint}\n`);
    }
    return;
  }

  const pConfig = PROVIDERS[options.provider];
  if (!pConfig) {
    console.error(`[ERROR] Unknown provider: ${options.provider}`);
    console.error(`Valid providers: ${Object.keys(PROVIDERS).join(', ')}`);
    process.exit(1);
  }

  const apiKey = options.apiKey || process.env[pConfig.envKey] || '';
  if (!apiKey && options.provider !== 'llm7' && options.provider !== 'nemotron') {
    console.error(`[ERROR] API key missing for provider: ${pConfig.name}`);
    console.error(`Please set the environment variable ${pConfig.envKey} or pass --key <YOUR_KEY>`);
    process.exit(1);
  }

  const model = options.model || pConfig.defaultModel;
  console.log(`Connecting to ${pConfig.name} (model: ${model})...`);

  const payload = {
    model: model,
    messages: [
      { role: 'user', content: options.prompt }
    ],
    max_tokens: 250,
    temperature: 0.7
  };

  let currentModel = model;
  let attempts = 0;
  const maxAttempts = 3;
  while (attempts < maxAttempts) {
    attempts++;
    try {
      const startTime = Date.now();
      payload.model = currentModel;
      const res = await fetch(pConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...pConfig.authHeader(apiKey)
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000)
      });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      if (!res.ok) {
        const errBody = await res.text();
        if (attempts < maxAttempts && res.status >= 500) {
          if (options.provider === 'nemotron' && currentModel.includes('550b')) {
            console.log('Nemotron 550B cluster overloaded. Auto-routing to Nemotron 3 Super 120B...');
            currentModel = 'nvidia/nemotron-3-super-120b-a12b:free';
          }
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        console.error(`[HTTP ${res.status} Error] (took ${elapsed}s)`);
        console.error(errBody);
        process.exit(1);
      }

      const data = await res.json();
      if (data.error) {
        if (attempts < maxAttempts) {
          if (options.provider === 'nemotron' && currentModel.includes('550b')) {
            console.log('Nemotron 550B cluster busy. Auto-routing to Nemotron 3 Super 120B...');
            currentModel = 'nvidia/nemotron-3-super-120b-a12b:free';
          }
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        console.error(`[API Error]`, data.error.message || data.error);
        process.exit(1);
      }

      const reply = data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2);
      console.log(`\n--- Response from ${currentModel} (took ${elapsed}s) ---`);
      console.log(reply.trim());
      console.log('-----------------------------------------------------\n');
      return;
    } catch (err) {
      if (attempts < maxAttempts) {
        if (options.provider === 'nemotron' && currentModel.includes('550b')) {
          console.log('Request timed out. Retrying with Nemotron 3 Super 120B...');
          currentModel = 'nvidia/nemotron-3-super-120b-a12b:free';
        }
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      console.error('[Network Error]:', err.message);
      process.exit(1);
    }
  }
}

main();
