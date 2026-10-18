# Neura AI Frontend Architecture

This repository contains the official frontend for **Neura AI** — High-Performance Neural Intelligence Platform.

### Core Stack
- **Framework**: TanStack Start (Full-stack React with SSR & client hydration)
- **Styling**: Tailwind CSS v4, Framer Motion & Lucide Icons
- **Routing**: TanStack Router with code-splitting across 5 dedicated modular pages:
  - `/` - Home Landing Page with Hero, Real-Time Latency Benchmark & Live Demos
  - `/features` - Feature Matrix & Neural Architecture
  - `/models` - Multi-Provider Model Hub & Benchmarks
  - `/integrations` - SDKs, API Gateways & Tooling
  - `/pricing` - Commercial Tiers & Enterprise Licensing
- **Authentication**: Supabase Auth (Secure Email + Google OAuth)
- **AI Engine**: Edge routing across OpenAI, OpenRouter, Groq, Google Gemini, and Nemotron LPU
